// Simple popup functionality without activism features
document.addEventListener('DOMContentLoaded', function() {
    loadDomainCounts();
    loadDomainLists();
    setupEventListeners();
});

function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });

    // Add domain functionality
    document.getElementById('add-blocked').addEventListener('click', addBlockedDomain);
    document.getElementById('domain-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addBlockedDomain();
    });

    // Search functionality
    document.getElementById('blocked-search').addEventListener('input', (e) => {
        filterDomains('blocked', e.target.value);
    });
    document.getElementById('allowed-search').addEventListener('input', (e) => {
        filterDomains('allowed', e.target.value);
    });
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
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
    
    // Clear existing content
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
    
    // Basic domain validation
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