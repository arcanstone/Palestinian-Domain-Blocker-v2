
document.addEventListener('DOMContentLoaded', function() {
    loadDomainCounts();
    loadDomainLists();
    setupEventListeners();
});
function setupEventListeners() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
    document.getElementById('add-blocked').addEventListener('click', addBlockedDomain);
    document.getElementById('domain-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addBlockedDomain();
    });
    document.getElementById('blocked-search').addEventListener('input', (e) => {
        filterDomains('blocked', e.target.value);
    });
    document.getElementById('allowed-search').addEventListener('input', (e) => {
        filterDomains('allowed', e.target.value);
    });
}
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}
function loadDomainCounts() {
    chrome.storage.local.get(['blockedDomains', 'whitelistedDomains'], (data) => {
        const blockedCount = (data.blockedDomains || []).length;
        const allowedCount = (data.whitelistedDomains || []).length;
        document.getElementById('blocked-count').textContent = blockedCount;
        document.getElementById('whitelisted-count').textContent = allowedCount;
    });
}
function loadDomainLists() {
    chrome.storage.local.get(['blockedDomains', 'whitelistedDomains'], (data) => {
        const blockedDomains = data.blockedDomains || [];
        const allowedDomains = data.whitelistedDomains || [];
        displayDomains('blocked', blockedDomains);
        displayDomains('allowed', allowedDomains);
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
            switchTab('blocked');
        });
    });
}
function removeDomain(type, domain) {
    const storageKey = type === 'blocked' ? 'blockedDomains' : 'whitelistedDomains';
    chrome.storage.local.get([storageKey], (data) => {
        const domains = data[storageKey] || [];
        const updatedDomains = domains.filter(d => d !== domain);
        chrome.storage.local.set({ [storageKey]: updatedDomains }, () => {
            loadDomainCounts();
            loadDomainLists();
        });
    });
}
function filterDomains(type, searchTerm) {
    const storageKey = type === 'blocked' ? 'blockedDomains' : 'whitelistedDomains';
    chrome.storage.local.get([storageKey], (data) => {
        const allDomains = data[storageKey] || [];
        const filteredDomains = allDomains.filter(domain => 
            domain.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayDomains(type, filteredDomains);
    });
}