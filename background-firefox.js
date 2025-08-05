// Firefox-compatible background script using webRequest API
// This version uses Manifest V2 webRequest instead of V3 declarativeNetRequest

const preSelectedDomains = [
    "elbitsystems.com", "iai.co.il", "rafael.co.il", "nsogroup.com", "cellebrite.com", 
    "verint.com", "checkpoint.com", "cyberark.com", "claroty.com", "armis.com", 
    "radware.com", "nice.com", "lockheedmartin.com", "boeing.com", "rtx.com", 
    "northropgrumman.com", "generaldynamics.com", "l3harris.com", "textron.com", 
    "google.com", "amazon.com", "microsoft.com", "palantir.com", "ibm.com", 
    "intel.com", "caterpillar.com", "blackrock.com", "vanguard.com", "jpmorgan.com", 
    "wiz.io"
];

let blockedDomains = [];
let whitelistedDomains = [];

// Initialize blocked domains
function initializeBlockedDomains() {
    chrome.storage.local.get(["blockedDomains", "whitelistedDomains"], (data) => {
        blockedDomains = data.blockedDomains || [...preSelectedDomains];
        whitelistedDomains = data.whitelistedDomains || [];
        
        // Save initial domains if not exists
        if (!data.blockedDomains) {
            chrome.storage.local.set({ 
                blockedDomains, 
                whitelistedDomains 
            });
        }
    });
}

// Check if domain should be blocked
function shouldBlockDomain(url) {
    try {
        const hostname = new URL(url).hostname.replace(/^www\./, '');
        
        // Don't block if whitelisted
        if (whitelistedDomains.some(domain => hostname.includes(domain))) {
            return false;
        }
        
        // Block if in blocked domains list
        return blockedDomains.some(domain => hostname.includes(domain));
    } catch (error) {
        return false;
    }
}

// Firefox webRequest blocking
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (shouldBlockDomain(details.url)) {
            const domain = new URL(details.url).hostname;
            const blockedUrl = chrome.runtime.getURL(`blocked.html?domain=${encodeURIComponent(domain)}`);
            return { redirectUrl: blockedUrl };
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.blockedDomains) {
        blockedDomains = changes.blockedDomains.newValue || [];
    }
    if (changes.whitelistedDomains) {
        whitelistedDomains = changes.whitelistedDomains.newValue || [];
    }
});

// Message handling for alternatives
const ethicalAlternatives = {
    "google.com": { name: "DuckDuckGo", url: "https://duckduckgo.com", description: "Privacy-focused search engine" },
    "amazon.com": { name: "Local Businesses", url: "https://www.google.com/maps", description: "Support local businesses" },
    "microsoft.com": { name: "LibreOffice", url: "https://www.libreoffice.org", description: "Free office suite" },
    "facebook.com": { name: "Mastodon", url: "https://joinmastodon.org", description: "Decentralized social network" },
    "default": { name: "Ethical Alternatives", url: "https://ethical.net", description: "Find ethical alternatives" }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAlternative') {
        const domain = request.domain.replace(/^www\./, '');
        const alternative = ethicalAlternatives[domain] || ethicalAlternatives.default;
        sendResponse({ alternative });
    }
    return true;
});

// Initialize when extension starts
chrome.runtime.onStartup.addListener(initializeBlockedDomains);
chrome.runtime.onInstalled.addListener(initializeBlockedDomains);

// Initialize immediately
initializeBlockedDomains();

console.log("Firefox background script loaded - domains:", blockedDomains.length);