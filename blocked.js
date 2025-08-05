document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const blockedDomain = urlParams.get('domain') || extractDomainFromReferrer() || extractDomainFromCurrentUrl() || 'unknown domain';
    const domainEl = document.getElementById('blocked-domain');
    const titleEl = document.getElementById('main-title');
    if (domainEl && titleEl) {
        titleEl.textContent = `${blockedDomain} blocked`;
        domainEl.textContent = blockedDomain;
        document.title = `${blockedDomain} - Site Blocked`;
    }
    loadAlternativeRecommendation(blockedDomain);
    updateImpactOnBlock(blockedDomain);
    loadPersonalImpactStats();
    trackBlockEvent(blockedDomain);
    if (typeof initDinosaurGame === 'function') {
        initDinosaurGame();
    }
});
function extractDomainFromReferrer() {
    try {
        const referrer = document.referrer;
        if (referrer) {
            const url = new URL(referrer);
            return url.hostname;
        }
    } catch (e) {
    }
    return null;
}
function extractDomainFromCurrentUrl() {
    try {
        const currentUrl = window.location.href;
        if (currentUrl.includes('blocked.html')) {
            const referrer = document.referrer;
            if (referrer) {
                const url = new URL(referrer);
                return url.hostname;
            }
        }
    } catch (e) {
    }
    return null;
}
function loadAlternativeRecommendation(domain) {
    if (!domain) return;
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        try {
            chrome.runtime.sendMessage({
                action: 'getAlternative',
                domain: domain
            }, (response) => {
                if (chrome.runtime.lastError) {
                    showLocalAlternative(domain);
                    return;
                }
                if (response && response.alternative) {
                    showAlternative(response.alternative);
                } else {
                    showLocalAlternative(domain);
                }
            });
        } catch (error) {
            showLocalAlternative(domain);
        }
    } else {
        showLocalAlternative(domain);
    }
}
function showLocalAlternative(domain) {
    const alternative = getLocalAlternative(domain);
    if (alternative) {
        showAlternative(alternative);
    }
}
function getLocalAlternative(domain) {
    const normalizedDomain = domain.replace(/^www\./, '').toLowerCase();
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
        },
        "blackrock.com": {
            name: "Credit Unions",
            url: "https://www.ncua.gov/consumers/consumer-assistance-resources/find-credit-union",
            description: "Find local credit unions that support community investment"
        },
        "vanguard.com": {
            name: "ESG Investment Platforms",
            url: "https://www.ethicalmarkets.com",
            description: "Explore ethical and sustainable investment options"
        },
        "jpmorgan.com": {
            name: "Community Banks",
            url: "https://www.icba.org/bank-locator",
            description: "Support local community banks"
        },
        "lockheedmartin.com": {
            name: "Peace Organizations",
            url: "https://www.peacedirectory.org",
            description: "Directory of peace and anti-war organizations"
        },
        "boeing.com": {
            name: "Sustainable Transport",
            url: "https://www.itdp.org",
            description: "Institute for Transportation and Development Policy"
        },
        "microsoft.com": {
            name: "Open Source Alternatives",
            url: "https://www.libreoffice.org",
            description: "Free and open source office suite"
        },
        "intel.com": {
            name: "Tech Ethics Resources",
            url: "https://www.eff.org",
            description: "Electronic Frontier Foundation - digital rights advocacy"
        },
        "caterpillar.com": {
            name: "Ethical Construction",
            url: "https://www.greenbuilding.com",
            description: "Sustainable construction and green building resources"
        }
    };
    let foundAlternative = localAlternatives[normalizedDomain];
    if (!foundAlternative) {
        for (const [key, value] of Object.entries(localAlternatives)) {
            if (normalizedDomain.includes(key.replace('.com', '')) || key.includes(normalizedDomain.replace('.com', ''))) {
                foundAlternative = value;
                break;
            }
        }
    }
    return foundAlternative || {
        name: "Ethical Alternatives",
        url: "https://ethical.net",
        description: "Find ethical alternatives to mainstream services"
    };
}
function showAlternative(alternative) {
    const alternativeSection = document.getElementById('alternative-section');
    const alternativeDescription = document.getElementById('alternative-description');
    const alternativeLink = document.getElementById('alternative-link');
    if (alternativeSection && alternativeDescription && alternativeLink) {
        alternativeLink.textContent = alternative.name;
        alternativeLink.href = alternative.url;
        alternativeDescription.textContent = alternative.description;
        alternativeSection.style.display = 'block';
        alternativeLink.addEventListener('click', () => {
            trackAlternativeClick(alternative.name);
        });
    }
}
function loadPersonalImpactStats() {
    chrome.storage.local.get(['personalImpact'], (data) => {
        if (chrome.runtime.lastError) {
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
    chrome.runtime.sendMessage({
        action: 'updateImpact',
        domain: domain
    }, (response) => {
        if (chrome.runtime.lastError) {
        } else {
        }
    });
}
function trackBlockEvent(domain) {
    if (!domain) return;
    chrome.storage.local.get(['blockEvents'], (data) => {
        if (chrome.runtime.lastError) {
            return;
        }
        const events = data.blockEvents || [];
        events.push({
            domain: domain,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        if (events.length > 1000) {
            events.splice(0, events.length - 1000);
        }
        chrome.storage.local.set({ blockEvents: events }, () => {
            if (chrome.runtime.lastError) {
            }
        });
    });
}
function trackAlternativeClick(alternativeName) {
    chrome.storage.local.get(['alternativeClicks'], (data) => {
        if (chrome.runtime.lastError) {
            return;
        }
        const clicks = data.alternativeClicks || {};
        clicks[alternativeName] = (clicks[alternativeName] || 0) + 1;
        chrome.storage.local.set({ alternativeClicks: clicks }, () => {
            if (chrome.runtime.lastError) {
            } else {
            }
        });
    });
}
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
            }
        });
    });
}
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
            case 'd':
                e.preventDefault();
                const donateBtn = document.querySelector('.btn-donate');
                if (donateBtn) donateBtn.click();
                break;
            case 'p':
                e.preventDefault();
                const petitionBtn = document.querySelector('.btn-petition');
                if (petitionBtn) petitionBtn.click();
                break;
            case 's':
                e.preventDefault();
                const shareBtn = document.querySelector('.btn-share');
                if (shareBtn) shareBtn.click();
                break;
        }
    }
});
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