document.addEventListener('DOMContentLoaded', function() {
    // Tab handling
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tab.dataset.tab}-content`).classList.add('active');
        });
    });

    // Function to show toast message with different types
    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Function to check if a domain is valid
    function isValidDomain(domain) {
        // More comprehensive domain validation
        const domainPattern = /^(?!-)(?!.*--)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z]{2,})+$/;
        const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        
        // Check for valid domain or IP
        if (!domainPattern.test(domain) && !ipPattern.test(domain)) {
            return false;
        }
        
        // Additional checks
        if (domain.length > 253) return false;
        if (domain.startsWith('.') || domain.endsWith('.')) return false;
        
        return true;
    }

    // Function to normalize domain (remove protocol, www, trailing slash)
    function normalizeDomain(domain) {
        return domain
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .replace(/\/$/, '')
            .toLowerCase();
    }

    // Function to create domain item element with better error handling
    function createDomainItem(domain, isWhitelist = false) {
        const item = document.createElement('div');
        item.className = 'domain-item';
        
        const text = document.createElement('span');
        text.className = 'domain-text';
        text.textContent = domain;
        
        const actions = document.createElement('div');
        actions.className = 'action-buttons';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'icon-button edit-button';
        editBtn.textContent = 'Edit';
        editBtn.title = 'Edit domain';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'icon-button delete-button';
        deleteBtn.textContent = 'Delete';
        deleteBtn.title = 'Delete domain';
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        item.appendChild(text);
        item.appendChild(actions);

        // Edit functionality with better validation
        editBtn.addEventListener('click', () => {
            const newDomain = prompt('Edit domain:', domain);
            if (!newDomain || newDomain === domain) return;
            
            const normalizedDomain = normalizeDomain(newDomain);
            
            if (!isValidDomain(normalizedDomain)) {
                showToast('Please enter a valid domain.', 'error');
                return;
            }
            
                const storageKey = isWhitelist ? 'whitelistedDomains' : 'blockedDomains';
            
            try {
                chrome.storage.local.get(storageKey, (data) => {
                    if (chrome.runtime.lastError) {
                        showToast('Error accessing storage.', 'error');
                        return;
                    }
                    
                    const domains = data[storageKey] || [];
                    
                    if (domains.includes(normalizedDomain)) {
                        showToast('This domain already exists in the list.', 'warning');
                        return;
                    }
                    
                    const index = domains.indexOf(domain);
                    if (index !== -1) {
                        domains[index] = normalizedDomain;
                        chrome.storage.local.set({ [storageKey]: domains }, () => {
                            if (chrome.runtime.lastError) {
                                showToast('Error updating domain.', 'error');
                            } else {
                            displayDomains(isWhitelist);
                                showToast('Domain updated successfully!', 'success');
                            }
                        });
                    }
                });
            } catch (error) {
                console.error('Error editing domain:', error);
                showToast('An error occurred while editing the domain.', 'error');
            }
        });

        // Delete functionality with confirmation
        deleteBtn.addEventListener('click', () => {
            if (!confirm(`Are you sure you want to remove ${domain}?`)) return;
            
                const storageKey = isWhitelist ? 'whitelistedDomains' : 'blockedDomains';
            
            try {
                chrome.storage.local.get(storageKey, (data) => {
                    if (chrome.runtime.lastError) {
                        showToast('Error accessing storage.', 'error');
                        return;
                    }
                    
                    const domains = data[storageKey] || [];
                    const index = domains.indexOf(domain);
                    if (index !== -1) {
                        domains.splice(index, 1);
                        chrome.storage.local.set({ [storageKey]: domains }, () => {
                            if (chrome.runtime.lastError) {
                                showToast('Error removing domain.', 'error');
                            } else {
                            displayDomains(isWhitelist);
                                showToast('Domain removed successfully!', 'success');
                            }
                        });
                    }
                });
            } catch (error) {
                console.error('Error deleting domain:', error);
                showToast('An error occurred while deleting the domain.', 'error');
            }
        });

        return item;
    }

    // Function to display domains with search functionality
    function displayDomains(isWhitelist = false, searchTerm = '') {
        const storageKey = isWhitelist ? 'whitelistedDomains' : 'blockedDomains';
        const containerId = isWhitelist ? 'whitelist' : 'domain-list';
        
        try {
        chrome.storage.local.get(storageKey, (data) => {
                if (chrome.runtime.lastError) {
                    showToast('Error loading domains.', 'error');
                    return;
                }
                
                let domains = data[storageKey] || [];
            const container = document.getElementById(containerId);
            container.innerHTML = '';
                
                // Filter domains based on search term
                if (searchTerm) {
                    domains = domains.filter(domain => 
                        domain.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }
            
            if (domains.length === 0) {
                const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'empty-message';
                    emptyMessage.textContent = searchTerm 
                        ? `No ${isWhitelist ? 'whitelisted' : 'blocked'} domains match "${searchTerm}"`
                        : `No ${isWhitelist ? 'whitelisted' : 'blocked'} domains yet`;
                container.appendChild(emptyMessage);
                return;
            }

                // Sort domains alphabetically
                domains.sort().forEach(domain => {
                container.appendChild(createDomainItem(domain, isWhitelist));
                });
                
                // Update domain count
                updateDomainCount(isWhitelist, domains.length);
            });
        } catch (error) {
            console.error('Error displaying domains:', error);
            showToast('An error occurred while loading domains.', 'error');
        }
    }

    // Function to update domain count display
    function updateDomainCount(isWhitelist, count) {
        const countElement = document.getElementById(
            isWhitelist ? 'whitelisted-count-display' : 'blocked-count-display'
        );
        if (countElement) {
            countElement.textContent = `(${count})`;
        }
    }

    // Add domain handlers with improved validation
    document.getElementById("blockButton").addEventListener("click", () => {
        const domainInput = document.getElementById("domain-input");
        let domain = domainInput.value.trim();
        
        if (!domain) {
            showToast('Please enter a domain.', 'warning');
            return;
        }
        
        domain = normalizeDomain(domain);
        
        if (!isValidDomain(domain)) {
            showToast('Please enter a valid domain.', 'error');
            return;
        }

        try {
            chrome.storage.local.get(["blockedDomains", "whitelistedDomains"], (data) => {
                if (chrome.runtime.lastError) {
                    showToast('Error accessing storage.', 'error');
                    return;
                }
                
                const blockedDomains = data.blockedDomains || [];
                const whitelistedDomains = data.whitelistedDomains || [];
                
                if (blockedDomains.includes(domain)) {
                    showToast('This domain is already blocked.', 'warning');
                return;
            }

                // If domain is whitelisted, ask user if they want to remove it from whitelist
                if (whitelistedDomains.includes(domain)) {
                    if (confirm(`${domain} is currently whitelisted. Remove from whitelist and block it?`)) {
                        const updatedWhitelist = whitelistedDomains.filter(d => d !== domain);
                        blockedDomains.push(domain);
                        
                        chrome.storage.local.set({ 
                            blockedDomains, 
                            whitelistedDomains: updatedWhitelist 
                        }, () => {
                            if (chrome.runtime.lastError) {
                                showToast('Error updating domains.', 'error');
                            } else {
                                displayDomains(false);
                                displayDomains(true);
                                domainInput.value = '';
                                showToast('Domain moved from whitelist to blocklist!', 'success');
                            }
                        });
                    }
                    return;
                }

                blockedDomains.push(domain);
                chrome.storage.local.set({ blockedDomains }, () => {
                    if (chrome.runtime.lastError) {
                        showToast('Error blocking domain.', 'error');
                    } else {
                displayDomains(false);
                domainInput.value = '';
                        showToast('Domain blocked successfully!', 'success');
                    }
                });
            });
        } catch (error) {
            console.error('Error blocking domain:', error);
            showToast('An error occurred while blocking the domain.', 'error');
        }
    });

    document.getElementById("add-whitelist-btn").addEventListener("click", () => {
        const whitelistInput = document.getElementById("whitelist-input");
        let domain = whitelistInput.value.trim();
        
        if (!domain) {
            showToast('Please enter a domain.', 'warning');
            return;
        }
        
        domain = normalizeDomain(domain);
        
        if (!isValidDomain(domain)) {
            showToast('Please enter a valid domain.', 'error');
            return;
        }

        try {
            chrome.storage.local.get(["whitelistedDomains", "blockedDomains"], (data) => {
                if (chrome.runtime.lastError) {
                    showToast('Error accessing storage.', 'error');
                    return;
                }
                
                const whitelistedDomains = data.whitelistedDomains || [];
                const blockedDomains = data.blockedDomains || [];
                
                if (whitelistedDomains.includes(domain)) {
                    showToast('This domain is already whitelisted.', 'warning');
                return;
            }

                // If domain is blocked, ask user if they want to remove it from blocklist
                if (blockedDomains.includes(domain)) {
                    if (confirm(`${domain} is currently blocked. Remove from blocklist and whitelist it?`)) {
                        const updatedBlocklist = blockedDomains.filter(d => d !== domain);
                        whitelistedDomains.push(domain);
                        
                        chrome.storage.local.set({ 
                            whitelistedDomains, 
                            blockedDomains: updatedBlocklist 
                        }, () => {
                            if (chrome.runtime.lastError) {
                                showToast('Error updating domains.', 'error');
                            } else {
                                displayDomains(true);
                                displayDomains(false);
                                whitelistInput.value = '';
                                showToast('Domain moved from blocklist to whitelist!', 'success');
                            }
                        });
                    }
                    return;
                }

                whitelistedDomains.push(domain);
                chrome.storage.local.set({ whitelistedDomains }, () => {
                    if (chrome.runtime.lastError) {
                        showToast('Error whitelisting domain.', 'error');
                    } else {
                displayDomains(true);
                whitelistInput.value = '';
                        showToast('Domain whitelisted successfully!', 'success');
                    }
                });
            });
        } catch (error) {
            console.error('Error whitelisting domain:', error);
            showToast('An error occurred while whitelisting the domain.', 'error');
        }
    });

    // Enter key support for inputs
    document.getElementById("domain-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            document.getElementById("blockButton").click();
        }
    });

    document.getElementById("whitelist-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            document.getElementById("add-whitelist-btn").click();
        }
    });

    // Search functionality
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            const isWhitelist = e.target.id === 'whitelist-search';
            displayDomains(isWhitelist, searchTerm);
        });
    });

    // Bulk operations functionality
    function exportDomains(isWhitelist = false) {
        const storageKey = isWhitelist ? 'whitelistedDomains' : 'blockedDomains';
        
        try {
            chrome.storage.local.get(storageKey, (data) => {
                if (chrome.runtime.lastError) {
                    showToast('Error exporting domains.', 'error');
                    return;
                }
                
                const domains = data[storageKey] || [];
                if (domains.length === 0) {
                    showToast(`No ${isWhitelist ? 'whitelisted' : 'blocked'} domains to export.`, 'warning');
                    return;
                }
                
                const dataStr = domains.join('\n');
                const dataBlob = new Blob([dataStr], {type: 'text/plain'});
                
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${isWhitelist ? 'whitelisted' : 'blocked'}_domains.txt`;
                link.click();
                
                URL.revokeObjectURL(url);
                showToast(`${domains.length} domains exported successfully!`, 'success');
            });
        } catch (error) {
            console.error('Error exporting domains:', error);
            showToast('An error occurred while exporting domains.', 'error');
        }
    }

    function importDomains(isWhitelist = false) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    const domains = content.split('\n')
                        .map(domain => normalizeDomain(domain.trim()))
                        .filter(domain => domain && isValidDomain(domain));
                    
                    if (domains.length === 0) {
                        showToast('No valid domains found in the file.', 'warning');
                        return;
                    }
                    
                    const storageKey = isWhitelist ? 'whitelistedDomains' : 'blockedDomains';
                    
                    chrome.storage.local.get(storageKey, (data) => {
                        if (chrome.runtime.lastError) {
                            showToast('Error importing domains.', 'error');
                            return;
                        }
                        
                        const existingDomains = data[storageKey] || [];
                        const newDomains = domains.filter(domain => !existingDomains.includes(domain));
                        
                        if (newDomains.length === 0) {
                            showToast('All domains in the file already exist.', 'warning');
                            return;
                        }
                        
                        const updatedDomains = [...existingDomains, ...newDomains];
                        
                        chrome.storage.local.set({ [storageKey]: updatedDomains }, () => {
                            if (chrome.runtime.lastError) {
                                showToast('Error saving imported domains.', 'error');
                            } else {
                                displayDomains(isWhitelist);
                                showToast(`${newDomains.length} new domains imported successfully!`, 'success');
                            }
                        });
                    });
                } catch (error) {
                    console.error('Error processing import file:', error);
                    showToast('Error processing the import file.', 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    // Clear all functionality
    function clearAllDomains(isWhitelist = false) {
        const type = isWhitelist ? 'whitelisted' : 'blocked';
        
        if (!confirm(`Are you sure you want to clear ALL ${type} domains? This action cannot be undone.`)) {
            return;
        }
        
        const storageKey = isWhitelist ? 'whitelistedDomains' : 'blockedDomains';
        
        try {
            chrome.storage.local.set({ [storageKey]: [] }, () => {
                if (chrome.runtime.lastError) {
                    showToast(`Error clearing ${type} domains.`, 'error');
                } else {
                    displayDomains(isWhitelist);
                    showToast(`All ${type} domains cleared successfully!`, 'success');
                }
            });
        } catch (error) {
            console.error(`Error clearing ${type} domains:`, error);
            showToast(`An error occurred while clearing ${type} domains.`, 'error');
        }
    }

    // Bug report functionality with better implementation
    const bugReport = document.querySelector('.bug-report');
    const bugModal = document.getElementById('bug-modal');
    const modalClose = document.querySelector('.modal-close');
    const bugDescription = document.getElementById('bug-description');
    const charCount = document.getElementById('char-count');
    const submitBug = document.getElementById('submit-bug');

    if (bugReport && bugModal) {
    bugReport.addEventListener('click', () => {
        bugModal.classList.add('active');
    });

        if (modalClose) {
    modalClose.addEventListener('click', () => {
        bugModal.classList.remove('active');
                if (bugDescription) bugDescription.value = '';
                if (charCount) charCount.textContent = '0';
    });
        }

        if (bugDescription && charCount) {
    bugDescription.addEventListener('input', () => {
        charCount.textContent = bugDescription.value.length;
    });
        }

        if (submitBug && bugDescription) {
    submitBug.addEventListener('click', () => {
        const description = bugDescription.value.trim();
        if (description.length < 10) {
                    showToast('Please provide more details about the bug.', 'warning');
            return;
        }

                try {
                    // Create comprehensive bug report
                    const bugReportData = {
            description,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
                        version: chrome.runtime.getManifest().version,
                        url: window.location.href,
                        platform: navigator.platform,
                        language: navigator.language
                    };

                    // Store bug report locally for now (can be sent to endpoint later)
                    chrome.storage.local.get('bugReports', (data) => {
                        const existingReports = data.bugReports || [];
                        existingReports.push(bugReportData);
                        
                        chrome.storage.local.set({ bugReports: existingReports }, () => {
                            console.log('Bug Report Stored:', bugReportData);
                            showToast('Bug report submitted successfully!', 'success');
        
        bugModal.classList.remove('active');
        bugDescription.value = '';
                            if (charCount) charCount.textContent = '0';
                        });
                    });
                } catch (error) {
                    console.error('Error submitting bug report:', error);
                    showToast('Error submitting bug report.', 'error');
                }
            });
        }
    }

    // Statistics functionality
    function updateStatistics() {
        try {
            chrome.storage.local.get(['blockedDomains', 'whitelistedDomains', 'blockCount'], (data) => {
                const blockedCount = (data.blockedDomains || []).length;
                const whitelistedCount = (data.whitelistedDomains || []).length;
                const totalBlocks = data.blockCount || 0;
                
                // Update UI elements if they exist
                const blockedCountEl = document.getElementById('blocked-count');
                const whitelistedCountEl = document.getElementById('whitelisted-count');
                const totalBlocksEl = document.getElementById('total-blocks');
                
                if (blockedCountEl) blockedCountEl.textContent = blockedCount;
                if (whitelistedCountEl) whitelistedCountEl.textContent = whitelistedCount;
                if (totalBlocksEl) totalBlocksEl.textContent = totalBlocks;
            });
        } catch (error) {
            console.error('Error updating statistics:', error);
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+E or Cmd+E to export blocked domains
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportDomains(false);
        }
        
        // Ctrl+I or Cmd+I to import blocked domains
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            importDomains(false);
        }
        
        // Escape to close modals
        if (e.key === 'Escape' && bugModal && bugModal.classList.contains('active')) {
            bugModal.classList.remove('active');
        }
    });

    // Add event listeners for bulk operations if buttons exist
    const exportBlockedBtn = document.getElementById('export-blocked');
    const importBlockedBtn = document.getElementById('import-blocked');
    const clearBlockedBtn = document.getElementById('clear-blocked');
    const exportWhitelistBtn = document.getElementById('export-whitelist');
    const importWhitelistBtn = document.getElementById('import-whitelist');
    const clearWhitelistBtn = document.getElementById('clear-whitelist');

    if (exportBlockedBtn) exportBlockedBtn.addEventListener('click', () => exportDomains(false));
    if (importBlockedBtn) importBlockedBtn.addEventListener('click', () => importDomains(false));
    if (clearBlockedBtn) clearBlockedBtn.addEventListener('click', () => clearAllDomains(false));
    if (exportWhitelistBtn) exportWhitelistBtn.addEventListener('click', () => exportDomains(true));
    if (importWhitelistBtn) importWhitelistBtn.addEventListener('click', () => importDomains(true));
    if (clearWhitelistBtn) clearWhitelistBtn.addEventListener('click', () => clearAllDomains(true));

    // Initial display and statistics update
    displayDomains(false);
    displayDomains(true);
    updateStatistics();
    
    // Initialize categorization and submission features
    setupCategories();
    setupSubmissions();
    setupImpactTab();
    
    // Update statistics periodically
    setInterval(updateStatistics, 5000);
});

// Categories functionality
function setupCategories() {
    loadCategories();
    
    // Category search functionality
    const categorySearch = document.getElementById('category-search');
    if (categorySearch) {
        categorySearch.addEventListener('input', (e) => {
            filterCategories(e.target.value);
        });
    }
}

function loadCategories() {
    // Load blocked domains to categorize them
    chrome.storage.local.get(['blockedDomains'], (data) => {
        const blockedDomains = data.blockedDomains || [];
        categorizeBlockedDomains(blockedDomains);
    });
}

function categorizeBlockedDomains(domains) {
    const categories = {
        'israeli_cybersecurity': [],
        'israeli_fintech': [],
        'israeli_productivity': [],
        'advocacy_big_tech': [],
        'advocacy_social': [],
        'contractor_defense': [],
        'settlement_hospitality': [],
        'settlement_food': [],
        'investment_vc': [],
        'other': []
    };
    
    // Simple categorization logic (would be enhanced with full mapping)
    domains.forEach(domain => {
        const normalizedDomain = domain.replace(/^www\./, '');
        
        if (['checkpoint.com', 'cyberark.com', 'paloaltonetworks.com', 'wiz.io', 'armis.com', 'imperva.com', 'radware.com'].includes(normalizedDomain)) {
            categories.israeli_cybersecurity.push(domain);
        } else if (['rapyd.net', 'fireblocks.com', 'forter.com'].includes(normalizedDomain)) {
            categories.israeli_fintech.push(domain);
        } else if (['wix.com', 'monday.com', 'fiverr.com', 'zoominfo.com'].includes(normalizedDomain)) {
            categories.israeli_productivity.push(domain);
        } else if (['google.com', 'facebook.com', 'amazon.com', 'microsoft.com', 'apple.com', 'meta.com'].includes(normalizedDomain)) {
            categories.advocacy_big_tech.push(domain);
        } else if (['x.com', 'twitter.com', 'reddit.com', 'discord.com', 'tiktok.com'].includes(normalizedDomain)) {
            categories.advocacy_social.push(domain);
        } else if (['marriott.com', 'hilton.com', 'hyatt.com', 'ihg.com', 'accor.com'].includes(normalizedDomain)) {
            categories.settlement_hospitality.push(domain);
        } else if (['lockheedmartin.com', 'boeing.com', 'raytheon.com', 'northropgrumman.com'].includes(normalizedDomain)) {
            categories.contractor_defense.push(domain);
        } else if (['nestle.com', 'unilever.com', 'pepsico.com', 'cocacola.com'].includes(normalizedDomain)) {
            categories.settlement_food.push(domain);
        } else if (['sequoiacap.com', 'a16z.com', 'kleinerperkins.com'].includes(normalizedDomain)) {
            categories.investment_vc.push(domain);
        } else {
            categories.other.push(domain);
        }
    });
    
    displayCategorizedDomains(categories);
}

function displayCategorizedDomains(categories) {
    const container = document.getElementById('categories-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    const categoryLabels = {
        'israeli_cybersecurity': '🔒 Israeli Cybersecurity',
        'israeli_fintech': '🏦 Israeli Fintech & Payments',
        'israeli_productivity': '📊 Israeli Productivity Tools',
        'advocacy_big_tech': '🏢 Big Tech with Pro-Israeli Leadership',
        'advocacy_social': '📱 Social Media with Pro-Israeli Policies',
        'contractor_defense': '⚔️ Defense Contractors',
        'settlement_hospitality': '🏨 Hotels in Illegal Settlements',
        'settlement_food': '🍔 Food Companies with Settlement Operations',
        'investment_vc': '💰 Venture Capital with Israeli Portfolios',
        'other': '❓ Other Companies'
    };
    
    Object.entries(categories).forEach(([categoryKey, domains]) => {
        if (domains.length === 0) return;
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        
        const header = document.createElement('div');
        header.className = 'category-header';
        
        const name = document.createElement('div');
        name.className = 'category-name';
        name.textContent = categoryLabels[categoryKey] || categoryKey;
        
        const count = document.createElement('div');
        count.className = 'category-count';
        count.textContent = domains.length;
        
        const expandBtn = document.createElement('button');
        expandBtn.className = 'expand-btn';
        expandBtn.textContent = '▼ Show';
        
        header.appendChild(name);
        header.appendChild(count);
        
        const domainsContainer = document.createElement('div');
        domainsContainer.className = 'category-domains';
        
        domains.forEach(domain => {
            const domainItem = document.createElement('div');
            domainItem.className = 'category-domain';
            domainItem.textContent = domain;
            domainsContainer.appendChild(domainItem);
        });
        
        expandBtn.addEventListener('click', () => {
            const isExpanded = domainsContainer.classList.contains('expanded');
            domainsContainer.classList.toggle('expanded');
            expandBtn.textContent = isExpanded ? '▼ Show' : '▲ Hide';
        });
        
        categoryItem.appendChild(header);
        categoryItem.appendChild(expandBtn);
        categoryItem.appendChild(domainsContainer);
        container.appendChild(categoryItem);
    });
    
    // Update categories count
    const categoriesCount = document.getElementById('categories-count');
    if (categoriesCount) {
        categoriesCount.textContent = Object.keys(categories).filter(key => categories[key].length > 0).length;
    }
}

function filterCategories(searchTerm) {
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        const categoryName = item.querySelector('.category-name').textContent.toLowerCase();
        const domains = Array.from(item.querySelectorAll('.category-domain')).map(d => d.textContent.toLowerCase());
        
        const matchesSearch = categoryName.includes(searchTerm.toLowerCase()) ||
                            domains.some(domain => domain.includes(searchTerm.toLowerCase()));
        
        item.style.display = matchesSearch ? 'block' : 'none';
    });
}

// Submissions functionality
function setupSubmissions() {
    const submitBtn = document.getElementById('submit-domain-btn');
    const evidenceTextarea = document.getElementById('submit-evidence');
    const charCount = document.getElementById('evidence-char-count');
    
    if (evidenceTextarea && charCount) {
        evidenceTextarea.addEventListener('input', () => {
            charCount.textContent = evidenceTextarea.value.length;
        });
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', handleDomainSubmission);
    }
    
    loadUserSubmissions();
}

function handleDomainSubmission() {
    const domainInput = document.getElementById('submit-domain');
    const categorySelect = document.getElementById('submit-category');
    const evidenceTextarea = document.getElementById('submit-evidence');
    const nameInput = document.getElementById('submit-name');
    
    if (!domainInput || !categorySelect || !evidenceTextarea) return;
    
    const domain = normalizeDomain(domainInput.value.trim());
    const category = categorySelect.value;
    const evidence = evidenceTextarea.value.trim();
    const submittedBy = nameInput ? nameInput.value.trim() || 'Anonymous' : 'Anonymous';
    
    if (!domain) {
        showToast('Please enter a domain.', 'error');
        return;
    }
    
    if (!isValidDomain(domain)) {
        showToast('Please enter a valid domain.', 'error');
        return;
    }
    
    if (!category) {
        showToast('Please select a category.', 'error');
        return;
    }
    
    if (!evidence) {
        showToast('Please provide evidence for this submission.', 'error');
        return;
    }
    
    // Create submission object
    const submission = {
        domain: domain,
        category: category,
        evidence: evidence,
        submitted_by: submittedBy,
        date: new Date().toISOString(),
        status: 'pending',
        id: Date.now() + Math.random()
    };
    
    // Save to local storage
    chrome.storage.local.get(['userSubmissions'], (data) => {
        const submissions = data.userSubmissions || { pending: [], approved: [], rejected: [] };
        submissions.pending.push(submission);
        
        chrome.storage.local.set({ userSubmissions: submissions }, () => {
            if (chrome.runtime.lastError) {
                showToast('Error saving submission.', 'error');
            } else {
                showToast('Domain submitted for review!', 'success');
                
                // Clear form
                domainInput.value = '';
                categorySelect.value = '';
                evidenceTextarea.value = '';
                if (nameInput) nameInput.value = '';
                if (document.getElementById('evidence-char-count')) {
                    document.getElementById('evidence-char-count').textContent = '0';
                }
                
                // Refresh submissions display
                loadUserSubmissions();
            }
        });
    });
}

function loadUserSubmissions() {
    chrome.storage.local.get(['userSubmissions'], (data) => {
        const submissions = data.userSubmissions || { pending: [], approved: [], rejected: [] };
        
        // Update counts
        const pendingCount = document.getElementById('pending-count');
        const approvedCount = document.getElementById('approved-count');
        
        if (pendingCount) pendingCount.textContent = submissions.pending.length;
        if (approvedCount) approvedCount.textContent = submissions.approved.length;
        
        // Display submissions
        displayUserSubmissions(submissions);
    });
}

function displayUserSubmissions(submissions) {
    const container = document.getElementById('user-submissions');
    if (!container) return;
    
    container.innerHTML = '';
    
    const allSubmissions = [
        ...submissions.pending.map(s => ({...s, status: 'pending'})),
        ...submissions.approved.map(s => ({...s, status: 'approved'})),
        ...submissions.rejected.map(s => ({...s, status: 'rejected'}))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (allSubmissions.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No submissions yet. Submit a domain above!';
        container.appendChild(emptyMessage);
        return;
    }
    
    allSubmissions.forEach(submission => {
        const item = document.createElement('div');
        item.className = 'submission-item';
        
        const header = document.createElement('div');
        header.className = 'submission-header';
        
        const domain = document.createElement('div');
        domain.className = 'submission-domain';
        domain.textContent = submission.domain;
        
        const status = document.createElement('div');
        status.className = `submission-status ${submission.status}`;
        status.textContent = submission.status.toUpperCase();
        
        header.appendChild(domain);
        header.appendChild(status);
        
        const meta = document.createElement('div');
        meta.className = 'submission-meta';
        meta.textContent = `Submitted: ${new Date(submission.date).toLocaleDateString()} by ${submission.submitted_by}`;
        
        const evidence = document.createElement('div');
        evidence.className = 'submission-evidence';
        evidence.textContent = submission.evidence.substring(0, 100) + (submission.evidence.length > 100 ? '...' : '');
        
        item.appendChild(header);
        item.appendChild(meta);
        item.appendChild(evidence);
        
        container.appendChild(item);
    });
}

// Helper functions already defined above
function normalizeDomain(domain) {
    return domain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
        .toLowerCase();
}

function isValidDomain(domain) {
    const domainPattern = /^(?!-)(?!.*--)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z]{2,})+$/;
    const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    if (!domainPattern.test(domain) && !ipPattern.test(domain)) {
        return false;
    }
    
    if (domain.length > 253) return false;
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    
    return true;
}

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Impact Tab Functions
function setupImpactTab() {
    // Set up click tracking for quick action links
    const actionLinks = document.querySelectorAll('.action-link');
    actionLinks.forEach(link => {
        link.addEventListener('click', () => {
            trackQuickActionClick(link.textContent.trim(), link.href);
        });
    });
    
    // Load impact data when tab is clicked
    const impactTab = document.querySelector('[data-tab="impact"]');
    if (impactTab) {
        impactTab.addEventListener('click', () => {
            setTimeout(loadImpactTab, 100); // Small delay to ensure tab content is visible
        });
    }
}

function loadImpactTab() {
    loadPersonalImpactStats();
    loadAlternativeStats();
    loadQuickActionStats();
}

function loadPersonalImpactStats() {
    chrome.storage.local.get(['personalImpact', 'blockEvents'], (data) => {
        if (chrome.runtime.lastError) {
            console.error('Error loading impact stats:', chrome.runtime.lastError);
            return;
        }
        
        const impact = data.personalImpact || {
            sitesBlocked: 0,
            estimatedRevenueDenied: 0,
            daysSinceStarted: new Date().toISOString()
        };
        
        const blockEvents = data.blockEvents || [];
        
        // Update main stats
        const sitesBlockedEl = document.getElementById('impact-sites-blocked');
        const revenueDeniedEl = document.getElementById('impact-revenue-denied');
        const daysActiveEl = document.getElementById('impact-days-active');
        
        if (sitesBlockedEl) sitesBlockedEl.textContent = impact.sitesBlocked || 0;
        if (revenueDeniedEl) revenueDeniedEl.textContent = `$${(impact.estimatedRevenueDenied || 0).toFixed(2)}`;
        
        // Calculate days active
        if (impact.daysSinceStarted && daysActiveEl) {
            const startDate = new Date(impact.daysSinceStarted);
            const today = new Date();
            const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
            daysActiveEl.textContent = daysDiff;
            
            // Calculate average daily blocks
            const avgDaily = daysDiff > 0 ? (blockEvents.length / daysDiff).toFixed(1) : '0';
            const avgDailyEl = document.getElementById('avg-blocks-daily');
            if (avgDailyEl) avgDailyEl.textContent = avgDaily;
        }
        
        // Update detailed metrics
        const totalBlocksEl = document.getElementById('total-blocks-impact');
        if (totalBlocksEl) totalBlocksEl.textContent = blockEvents.length;
    });
}

function loadAlternativeStats() {
    chrome.storage.local.get(['alternativeClicks'], (data) => {
        if (chrome.runtime.lastError) {
            console.error('Error loading alternative stats:', chrome.runtime.lastError);
            return;
        }
        
        const clicks = data.alternativeClicks || {};
        const totalAlternatives = Object.keys(clicks).length;
        
        const alternativesUsedEl = document.getElementById('alternatives-used');
        if (alternativesUsedEl) alternativesUsedEl.textContent = totalAlternatives;
        
        // Find most used alternative
        let mostUsed = '-';
        let maxClicks = 0;
        for (const [alternative, count] of Object.entries(clicks)) {
            if (count > maxClicks) {
                maxClicks = count;
                mostUsed = alternative;
            }
        }
        
        const mostUsedEl = document.getElementById('most-used-alternative');
        if (mostUsedEl) mostUsedEl.textContent = mostUsed;
    });
}

function loadQuickActionStats() {
    chrome.storage.local.get(['quickActionClicks'], (data) => {
        if (chrome.runtime.lastError) {
            console.error('Error loading quick action stats:', chrome.runtime.lastError);
            return;
        }
        
        const actions = data.quickActionClicks || {};
        const totalActions = Object.values(actions).reduce((sum, count) => sum + count, 0);
        
        // Count donation clicks specifically
        const donationClicks = Object.entries(actions)
            .filter(([key]) => key.includes('donate') || key.includes('Relief Fund') || key.includes('Medical Aid') || key.includes('UNRWA'))
            .reduce((sum, [, count]) => sum + count, 0);
        
        const actionsTakenEl = document.getElementById('actions-taken');
        const donationsClickedEl = document.getElementById('donations-clicked');
        
        if (actionsTakenEl) actionsTakenEl.textContent = totalActions;
        if (donationsClickedEl) donationsClickedEl.textContent = donationClicks;
    });
}

function trackQuickActionClick(text, url) {
    chrome.storage.local.get(['quickActionClicks'], (data) => {
        if (chrome.runtime.lastError) return;
        
        const actions = data.quickActionClicks || {};
        const key = `popup_${text}`;
        actions[key] = (actions[key] || 0) + 1;
        
        chrome.storage.local.set({ quickActionClicks: actions }, () => {
            if (!chrome.runtime.lastError) {
                console.log(`Quick action tracked: ${text}`);
                // Refresh stats if we're on the impact tab
                const impactTab = document.querySelector('[data-tab="impact"]');
                if (impactTab && impactTab.classList.contains('active')) {
                    loadQuickActionStats();
                }
            }
        });
    });
}
