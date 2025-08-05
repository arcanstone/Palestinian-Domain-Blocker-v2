
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
        if (!data.blockedDomains) {
            // Get count from background script
            chrome.runtime.sendMessage({action: 'getBlockedDomains'}, (response) => {
                const count = response && response.domains ? response.domains.length : 0;
                document.getElementById('blocked-count').textContent = count;
            });
        } else {
            document.getElementById('blocked-count').textContent = data.blockedDomains.length;
        }
    });
}
function loadDomainLists() {
    chrome.storage.local.get(['blockedDomains'], (data) => {
        // If no custom domains stored, the background script should have initialized them
        // But if popup loads before background script, we need to handle this
        if (!data.blockedDomains) {
            // Force initialization by sending message to background script
            chrome.runtime.sendMessage({action: 'getBlockedDomains'}, (response) => {
                if (response && response.domains) {
                    displayDomains('blocked', response.domains);
                } else {
                    displayDomains('blocked', []);
                }
            });
        } else {
            displayDomains('blocked', data.blockedDomains);
        }
    });
}
function displayDomains(type, domains) {
    const listElement = document.getElementById(`${type}-list`);
    while (listElement.firstChild) {
        listElement.removeChild(listElement.firstChild);
    }
    if (domains.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = `No ${type} domains`;
        listElement.appendChild(emptyState);
        return;
    }
    domains.forEach(domain => {
        const domainItem = document.createElement('div');
        domainItem.className = 'domain-item';
        const domainName = document.createElement('span');
        domainName.className = 'domain-name';
        domainName.textContent = domain;
        const domainActions = document.createElement('div');
        domainActions.className = 'domain-actions';
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-remove';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => removeDomain(type, domain));
        domainActions.appendChild(removeBtn);
        domainItem.appendChild(domainName);
        domainItem.appendChild(domainActions);
        listElement.appendChild(domainItem);
    });
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