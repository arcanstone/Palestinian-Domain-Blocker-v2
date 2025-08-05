
document.addEventListener('DOMContentLoaded', function() {
    loadDomainCounts();
    loadDomainLists();
    setupEventListeners();
});
function setupEventListeners() {
    document.getElementById('add-blocked').addEventListener('click', addBlockedDomain);
    document.getElementById('domain-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addBlockedDomain();
    });
    document.getElementById('blocked-search').addEventListener('input', (e) => {
        filterDomains('blocked', e.target.value);
    });
}
function loadDomainCounts() {
    chrome.storage.local.get(['blockedDomains'], (data) => {
        const blockedCount = (data.blockedDomains || []).length;
        document.getElementById('blocked-count').textContent = blockedCount;
    });
}
function loadDomainLists() {
    chrome.storage.local.get(['blockedDomains'], (data) => {
        const blockedDomains = data.blockedDomains || [];
        displayDomains('blocked', blockedDomains);
    });
}
function displayDomains(type, domains) {
    const listElement = document.getElementById(`${type}-list`);
    if (domains.length === 0) {
        listElement.innerHTML = `<div class="empty-state">No ${type} domains</div>`;
        return;
    }
    listElement.innerHTML = domains.map(domain => `
        <div class="domain-item">
            <span class="domain-name">${domain}</span>
            <div class="domain-actions">
                <button class="btn btn-remove" onclick="removeDomain('${type}', '${domain}')">
                    Remove
                </button>
            </div>
        </div>
    `).join('');
}
function addBlockedDomain() {
    const input = document.getElementById('domain-input');
    const domain = input.value.trim().toLowerCase();
    if (!domain) return;
    if (!domain.includes('.') || domain.includes(' ')) {
        alert('Please enter a valid domain (e.g., example.com)');
        return;
    }
    chrome.storage.local.get(['blockedDomains'], (data) => {
        const blockedDomains = data.blockedDomains || [];
        if (blockedDomains.includes(domain)) {
            alert('Domain is already blocked');
            return;
        }
        blockedDomains.push(domain);
        chrome.storage.local.set({ blockedDomains }, () => {
            input.value = '';
            loadDomainCounts();
            loadDomainLists();
        });
    });
}
function removeDomain(type, domain) {
    chrome.storage.local.get(['blockedDomains'], (data) => {
        const domains = data.blockedDomains || [];
        const updatedDomains = domains.filter(d => d !== domain);
        chrome.storage.local.set({ blockedDomains: updatedDomains }, () => {
            loadDomainCounts();
            loadDomainLists();
        });
    });
}
function filterDomains(type, searchTerm) {
    chrome.storage.local.get(['blockedDomains'], (data) => {
        const allDomains = data.blockedDomains || [];
        const filteredDomains = allDomains.filter(domain => 
            domain.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayDomains('blocked', filteredDomains);
    });
}