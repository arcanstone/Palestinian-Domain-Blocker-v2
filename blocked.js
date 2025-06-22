document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced blocked page loaded');
    
    // Get the blocked domain from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const blockedDomain = urlParams.get('domain') || extractDomainFromReferrer() || extractDomainFromCurrentUrl();
    
    console.log('Blocked domain detected:', blockedDomain);
    console.log('URL params:', urlParams.toString());
    console.log('Referrer:', document.referrer);
    
    if (blockedDomain) {
        // Show domain info
        const domainInfoEl = document.getElementById('blocked-domain-info');
        if (domainInfoEl) {
            domainInfoEl.textContent = `Blocked domain: ${blockedDomain}`;
        }
        
        // Load and show alternative recommendation
        console.log('Loading alternative for:', blockedDomain);
        loadAlternativeRecommendation(blockedDomain);
        
        // Update impact stats when a site is blocked
        updateImpactOnBlock(blockedDomain);
    } else {
        console.log('No blocked domain detected - showing fallback alternative');
        // Show a generic alternative if no domain is detected
        const fallbackAlternative = {
            name: "Ethical Alternatives Directory",
            url: "https://ethical.net",
            description: "Find ethical alternatives to mainstream services"
        };
        showAlternative(fallbackAlternative);
    }
    
    // Load and display personal impact stats
    loadPersonalImpactStats();
    
    // Track this block event
    trackBlockEvent(blockedDomain);
});

function extractDomainFromReferrer() {
    try {
        const referrer = document.referrer;
        if (referrer) {
            const url = new URL(referrer);
            return url.hostname;
        }
    } catch (e) {
        console.log('Could not extract domain from referrer');
    }
    return null;
}

function extractDomainFromCurrentUrl() {
    try {
        // Try to get domain from current URL if it's a blocked domain redirect
        const currentUrl = window.location.href;
        if (currentUrl.includes('blocked.html')) {
            // Look for any domain patterns in the URL or referrer
            const referrer = document.referrer;
            if (referrer) {
                const url = new URL(referrer);
                return url.hostname;
            }
        }
    } catch (e) {
        console.log('Could not extract domain from current URL');
    }
    return null;
}

function loadAlternativeRecommendation(domain) {
    if (!domain) return;
    
    // Get alternative from background script
    chrome.runtime.sendMessage({
        action: 'getAlternative',
        domain: domain
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.log('Error getting alternative:', chrome.runtime.lastError);
            // Fallback to local alternative detection
            const alternative = getLocalAlternative(domain);
            if (alternative) {
                showAlternative(alternative);
            }
            return;
        }
        
        if (response && response.alternative) {
            showAlternative(response.alternative);
        } else {
            // Fallback to local alternative detection
            const alternative = getLocalAlternative(domain);
            if (alternative) {
                showAlternative(alternative);
            }
        }
    });
}

// Fallback alternative detection (subset of the main database)
function getLocalAlternative(domain) {
    const normalizedDomain = domain.replace(/^www\./, '');
    
    const localAlternatives = {
        "google.com": {
            name: "DuckDuckGo",
            url: "https://duckduckgo.com",
            description: "Privacy-focused search engine that doesn't track users"
        },
        "facebook.com": {
            name: "Mastodon",
            url: "https://joinmastodon.org",
            description: "Decentralized social network"
        },
        "meta.com": {
            name: "Mastodon",
            url: "https://joinmastodon.org",
            description: "Decentralized social network"
        },
        "twitter.com": {
            name: "Mastodon",
            url: "https://joinmastodon.org",
            description: "Decentralized microblogging platform"
        },
        "x.com": {
            name: "Mastodon",
            url: "https://joinmastodon.org",
            description: "Decentralized microblogging platform"
        },
        "amazon.com": {
            name: "Local Businesses",
            url: "https://www.google.com/maps",
            description: "Support local businesses in your area"
        },
        "netflix.com": {
            name: "Local Libraries",
            url: "https://www.worldcat.org",
            description: "Borrow movies and shows from your local library"
        }
    };
    
    return localAlternatives[normalizedDomain] || {
        name: "Ethical Alternatives",
        url: "https://ethical.net",
        description: "Find ethical alternatives to mainstream services"
    };
}

function showAlternative(alternative) {
    const alternativeSection = document.getElementById('alternative-section');
    const alternativeName = document.getElementById('alternative-name');
    const alternativeDescription = document.getElementById('alternative-description');
    const alternativeLink = document.getElementById('alternative-link');
    
    if (alternativeSection && alternativeName && alternativeDescription && alternativeLink) {
        alternativeName.textContent = alternative.name;
        alternativeDescription.textContent = alternative.description;
        alternativeLink.href = alternative.url;
        alternativeSection.style.display = 'block';
        
        // Add click tracking
        alternativeLink.addEventListener('click', () => {
            trackAlternativeClick(alternative.name);
        });
        
        // Add auto-redirect option for certain alternatives
        if (shouldAutoRedirect(alternative)) {
            addAutoRedirectOption(alternative);
        }
    }
}

function shouldAutoRedirect(alternative) {
    // Auto-redirect for direct replacements (not for "Local Businesses" type alternatives)
    const autoRedirectAlternatives = [
        'DuckDuckGo', 'ProtonMail', 'Mastodon', 'Signal', 'LibreOffice', 
        'PeerTube', 'Pixelfed', 'Matrix', 'Lemmy', 'Bandcamp', 'Wise (TransferWise)'
    ];
    return autoRedirectAlternatives.includes(alternative.name);
}

function addAutoRedirectOption(alternative) {
    const alternativeSection = document.getElementById('alternative-section');
    if (!alternativeSection) return;
    
    // Add auto-redirect countdown
    const redirectInfo = document.createElement('div');
    redirectInfo.style.cssText = `
        margin-top: 15px;
        padding: 10px;
        background: rgba(76, 175, 80, 0.2);
        border-radius: 8px;
        text-align: center;
        font-size: 14px;
    `;
    
    let countdown = 10;
    redirectInfo.innerHTML = `
        <p>🚀 Auto-redirecting to <strong>${alternative.name}</strong> in <span id="redirect-countdown">${countdown}</span> seconds</p>
        <button id="redirect-now" style="margin: 5px; padding: 8px 16px; background: var(--accent-green); color: white; border: none; border-radius: 6px; cursor: pointer;">Go Now</button>
        <button id="cancel-redirect" style="margin: 5px; padding: 8px 16px; background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 6px; cursor: pointer;">Cancel</button>
    `;
    
    alternativeSection.appendChild(redirectInfo);

// Countdown timer
const timer = setInterval(() => {
        countdown--;
        const countdownEl = document.getElementById('redirect-countdown');
        if (countdownEl) countdownEl.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            trackAlternativeClick(alternative.name);
            window.location.href = alternative.url;
        }
    }, 1000);
    
    // Manual redirect button
    const redirectNowBtn = document.getElementById('redirect-now');
    if (redirectNowBtn) {
        redirectNowBtn.addEventListener('click', () => {
            clearInterval(timer);
            trackAlternativeClick(alternative.name);
            window.location.href = alternative.url;
        });
    }
    
    // Cancel redirect button
    const cancelBtn = document.getElementById('cancel-redirect');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
        clearInterval(timer);
            redirectInfo.remove();
        });
    }
}

function loadPersonalImpactStats() {
    chrome.storage.local.get(['personalImpact'], (data) => {
        if (chrome.runtime.lastError) {
            console.log('Error loading impact stats:', chrome.runtime.lastError);
            return;
        }
        
        const impact = data.personalImpact || {
            sitesBlocked: 0,
            estimatedRevenueDenied: 0,
            daysSinceStarted: new Date().toISOString()
        };
        
        updateImpactDisplay(impact);
    });
}

function updateImpactDisplay(impact) {
    const sitesBlockedEl = document.getElementById('sites-blocked');
    const revenueDeniedEl = document.getElementById('revenue-denied');
    const daysActiveEl = document.getElementById('days-active');
    
    if (sitesBlockedEl) {
        sitesBlockedEl.textContent = impact.sitesBlocked || 0;
    }
    
    if (revenueDeniedEl) {
        const revenue = (impact.estimatedRevenueDenied || 0).toFixed(2);
        revenueDeniedEl.textContent = `$${revenue}`;
    }
    
    if (daysActiveEl && impact.daysSinceStarted) {
        const startDate = new Date(impact.daysSinceStarted);
        const today = new Date();
        const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        daysActiveEl.textContent = daysDiff;
    }
}

function updateImpactOnBlock(domain) {
    if (!domain) return;
    
    // Send message to background script to update impact stats
    chrome.runtime.sendMessage({
        action: 'updateImpact',
        domain: domain
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.log('Error updating impact:', chrome.runtime.lastError);
        } else {
            console.log('Impact updated for domain:', domain);
        }
    });
}

function trackBlockEvent(domain) {
    if (!domain) return;
    
    // Track this block event for statistics
    chrome.storage.local.get(['blockEvents'], (data) => {
        if (chrome.runtime.lastError) {
            console.log('Error tracking block event:', chrome.runtime.lastError);
            return;
        }
        
        const events = data.blockEvents || [];
        events.push({
            domain: domain,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        
        // Keep only last 1000 events to prevent storage bloat
        if (events.length > 1000) {
            events.splice(0, events.length - 1000);
        }
        
        chrome.storage.local.set({ blockEvents: events }, () => {
            if (chrome.runtime.lastError) {
                console.log('Error saving block events:', chrome.runtime.lastError);
            }
        });
    });
}

function trackAlternativeClick(alternativeName) {
    // Track when users click on alternative recommendations
    chrome.storage.local.get(['alternativeClicks'], (data) => {
        if (chrome.runtime.lastError) {
            console.log('Error tracking alternative click:', chrome.runtime.lastError);
            return;
        }
        
        const clicks = data.alternativeClicks || {};
        clicks[alternativeName] = (clicks[alternativeName] || 0) + 1;
        
        chrome.storage.local.set({ alternativeClicks: clicks }, () => {
            if (chrome.runtime.lastError) {
                console.log('Error saving alternative clicks:', chrome.runtime.lastError);
            } else {
                console.log(`Alternative click tracked: ${alternativeName}`);
            }
        });
    });
}

// Add click tracking for quick action buttons
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn')) {
        const actionType = e.target.className.includes('btn-donate') ? 'donate' :
                          e.target.className.includes('btn-petition') ? 'petition' :
                          e.target.className.includes('btn-contact') ? 'contact' :
                          e.target.className.includes('btn-share') ? 'share' : 'other';
        
        trackQuickAction(actionType, e.target.textContent.trim());
    }
});

function trackQuickAction(type, text) {
    chrome.storage.local.get(['quickActionClicks'], (data) => {
        if (chrome.runtime.lastError) return;
        
        const actions = data.quickActionClicks || {};
        const key = `${type}_${text}`;
        actions[key] = (actions[key] || 0) + 1;
        
        chrome.storage.local.set({ quickActionClicks: actions }, () => {
            if (!chrome.runtime.lastError) {
                console.log(`Quick action tracked: ${type} - ${text}`);
            }
        });
    });
}

// Keyboard shortcuts for quick actions
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
            case 'd':
                e.preventDefault();
                // Focus on first donate button
                const donateBtn = document.querySelector('.btn-donate');
                if (donateBtn) donateBtn.click();
                break;
            case 'p':
                e.preventDefault();
                // Focus on first petition button
                const petitionBtn = document.querySelector('.btn-petition');
                if (petitionBtn) petitionBtn.click();
                break;
            case 's':
                e.preventDefault();
                // Focus on first share button
                const shareBtn = document.querySelector('.btn-share');
                if (shareBtn) shareBtn.click();
                break;
        }
    }
});

// Add visual feedback for keyboard shortcuts
const keyboardHint = document.createElement('div');
keyboardHint.innerHTML = '⌨️ Shortcuts: <strong>Ctrl+D</strong> Donate | <strong>Ctrl+P</strong> Petition | <strong>Ctrl+S</strong> Share';
keyboardHint.style.fontSize = '11px';
keyboardHint.style.opacity = '0.6';
keyboardHint.style.marginTop = '15px';
keyboardHint.style.textAlign = 'center';
keyboardHint.style.color = 'rgba(255, 255, 255, 0.7)';

const footerInfo = document.querySelector('.footer-info');
if (footerInfo) {
    footerInfo.appendChild(keyboardHint);
} 