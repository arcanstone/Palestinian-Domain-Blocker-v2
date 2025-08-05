
const preSelectedDomains = [
    "elbitsystems.com", // Elbit Systems - 17% revenue from Israeli MoD, primary IDF equipment supplier
    "iai.co.il", // Israel Aerospace Industries - State-owned, direct IDF supplier  
    "rafael.co.il", // Rafael Advanced Defense Systems - $5.2B MoD contract (2025), Iron Dome
    "nsogroup.com", // NSO Group - Licensed by Israeli MoD, Pegasus spyware
    "cellebrite.com", // Cellebrite - Unit 8200 recruitment, mobile forensics for military
    "verint.com", // Verint - Licensed by Israeli MoD for surveillance exports
    "checkpoint.com", // Check Point - Provides cybersecurity to Israeli military
    "cyberark.com", // CyberArk - Privileged access management for Israeli defense sector
    "claroty.com", // Claroty - Israeli industrial cybersecurity, military applications
    "armis.com", // Armis - Israeli IoT security, military/government clients
    "radware.com", // Radware - Israeli security, some military applications
    "nice.com", // NICE - Israeli customer analytics, some government contracts
    "lockheedmartin.com", // $6B+ Industrial Participation agreements, F-35 program
    "boeing.com", // F-15 fighter jets, Apache helicopters to Israeli Air Force
    "rtx.com", // Raytheon - Iron Dome components, F-16 missiles
    "northropgrumman.com", // $8.9M cannon contract (Dec 2024), Sa'ar 5 warships
    "generaldynamics.com", // Sole US producer of MK-80 bombs used by Israel
    "l3harris.com", // Military communications, surveillance systems
    "textron.com", // Military vehicles, aircraft systems
    "google.com", // $1.2B Project Nimbus, direct Israeli MoD consulting (2024)
    "amazon.com", // Co-partner in $1.2B Project Nimbus contract
    "microsoft.com", // $133M Israeli MoD contract (2021), S500 priority client
    "palantir.com", // Strategic partnership with Israeli MoD (Jan 2024)
    "ibm.com", // 25-year contract as main IT provider for IDF logistics (2020)
    "intel.com", // Largest private employer in Israel, $25B chip plant investment
    "caterpillar.com", // D9 bulldozers to IDF under US Foreign Military Sales
    "blackrock.com", // Major shareholder (7-8%) in defense contractors
    "vanguard.com", // Largest institutional investor (9-10%) in defense contractors
    "jpmorgan.com", // Underwriter of Israeli war bonds, Tel Aviv office
    "wiz.io" // Wiz - Israeli cloud security, some military applications
];
const domainCategories = {
    "israeli_fintech": "Israeli Fintech & Payments",
    "israeli_productivity": "Israeli Productivity & Business Tools", 
    "israeli_cybersecurity": "Israeli Cybersecurity (Major Export)",
    "israeli_cloud": "Israeli Cloud & Infrastructure",
    "israeli_ai": "Israeli AI & Analytics",
    "israeli_hardware": "Israeli Semiconductors & Hardware",
    "israeli_telecom": "Israeli Telecommunications & Networking",
    "israeli_enterprise": "Israeli Enterprise Software & Services",
    "israeli_mobility": "Israeli Navigation & Mobility",
    "israeli_misc": "Other Israeli Technology Companies",
    "advocacy_big_tech": "Big Tech with Pro-Israeli Leadership",
    "advocacy_social": "Social Media with Pro-Israeli Policies",
    "advocacy_enterprise": "Enterprise Software with Pro-Israeli Leadership",
    "advocacy_consumer": "Consumer Services with Pro-Israeli Leadership",
    "contractor_defense": "Defense Contractors with Israeli Military Contracts",
    "contractor_tech": "Technology Companies with Israeli Government Contracts",
    "contractor_consulting": "Consulting Firms Serving Israeli Government",
    "contractor_financial": "Financial Services Supporting Israeli Government",
    "contractor_telecom": "Telecommunications with Israeli Government Contracts",
    "settlement_hospitality": "Hotels Operating in Illegal Settlements",
    "settlement_realestate": "Real Estate Companies in Settlement Areas",
    "settlement_retail": "Retail Companies with Settlement Supply Chains",
    "settlement_food": "Food Companies with Settlement Operations",
    "settlement_construction": "Construction/Materials for Settlement Building",
    "investment_vc": "Venture Capital Firms with Major Israeli Portfolios",
    "investment_israeli": "Israeli Investment Firms & Funds",
    "support_energy": "Energy Companies with Israeli Partnerships",
    "support_pharma": "Pharmaceutical Companies with Israeli Military Contracts",
    "support_logistics": "Logistics Companies with Israeli Government Contracts"
};
function getDomainCategory(domain) {
    const normalizedDomain = domain.replace(/^www\./, '');
    if (['checkpoint.com', 'cyberark.com', 'paloaltonetworks.com', 'wiz.io', 'armis.com'].includes(normalizedDomain)) {
        return 'israeli_cybersecurity';
    }
    if (['google.com', 'facebook.com', 'amazon.com', 'microsoft.com', 'apple.com'].includes(normalizedDomain)) {
        return 'advocacy_big_tech';
    }
    if (['lockheedmartin.com', 'boeing.com', 'raytheon.com'].includes(normalizedDomain)) {
        return 'contractor_defense';
    }
    if (['marriott.com', 'hilton.com', 'hyatt.com'].includes(normalizedDomain)) {
        return 'settlement_hospitality';
    }
    return 'israeli_misc';
}
const domainEvidence = {
};
const userSubmissions = {
    pending: [],
    approved: [],
    rejected: []
};
function submitDomainForReview(domain, category, evidence, submittedBy) {
    const submission = {
        domain: domain,
        category: category,
        evidence: evidence,
        submitted_by: submittedBy,
        date: new Date().toISOString(),
        status: 'pending',
        id: Date.now() + Math.random()
    };
    userSubmissions.pending.push(submission);
    chrome.storage.local.set({ userSubmissions: userSubmissions });
    return submission.id;
}
function verifySubmission(submissionId, approved, moderatorNotes) {
    const submission = userSubmissions.pending.find(s => s.id === submissionId);
    if (!submission) return false;
    userSubmissions.pending = userSubmissions.pending.filter(s => s.id !== submissionId);
    submission.status = approved ? 'approved' : 'rejected';
    submission.moderator_notes = moderatorNotes;
    submission.verified_date = new Date().toISOString();
    if (approved) {
        userSubmissions.approved.push(submission);
        addDomainToBlocklist(submission.domain, submission.category, submission.evidence);
    } else {
        userSubmissions.rejected.push(submission);
    }
    chrome.storage.local.set({ userSubmissions: userSubmissions });
    return true;
}
function addDomainToBlocklist(domain, category, evidence) {
    chrome.storage.local.get(['blockedDomains'], (data) => {
        let blockedDomains = data.blockedDomains || [];
        if (!blockedDomains.includes(domain)) {
            blockedDomains.push(domain);
            domainEvidence[domain] = {
                category: category,
                evidence: evidence,
                date_added: new Date().toISOString(),
                verified: true
            };
            chrome.storage.local.set({ 
                blockedDomains: blockedDomains,
                domainEvidence: domainEvidence
            });
        }
    });
}
function scheduleRegularUpdates() {
    setInterval(() => {
        updateDomainListFromCrowdsource();
    }, 24 * 60 * 60 * 1000);
}
function updateDomainListFromCrowdsource() {
}
const ethicalAlternatives = {
    "google.com": {
        name: "DuckDuckGo",
        url: "https://duckduckgo.com",
        description: "Privacy-focused search engine that doesn't track users"
    },
    "youtube.com": {
        name: "PeerTube",
        url: "https://joinpeertube.org",
        description: "Decentralized video platform"
    },
    "gmail.com": {
        name: "ProtonMail",
        url: "https://protonmail.com",
        description: "Encrypted email service from Switzerland"
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
    "instagram.com": {
        name: "Pixelfed",
        url: "https://pixelfed.org",
        description: "Decentralized photo sharing platform"
    },
    "whatsapp.com": {
        name: "Signal",
        url: "https://signal.org",
        description: "Privacy-focused messaging app"
    },
    "amazon.com": {
        name: "Local Businesses",
        url: "https://www.google.com/maps",
        description: "Support local businesses in your area"
    },
    "microsoft.com": {
        name: "LibreOffice",
        url: "https://www.libreoffice.org",
        description: "Free and open-source office suite"
    },
    "apple.com": {
        name: "Fairphone",
        url: "https://www.fairphone.com",
        description: "Ethical smartphone manufacturer"
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
    "reddit.com": {
        name: "Lemmy",
        url: "https://join-lemmy.org",
        description: "Decentralized link aggregator and discussion platform"
    },
    "discord.com": {
        name: "Matrix",
        url: "https://matrix.org",
        description: "Decentralized chat platform"
    },
    "tiktok.com": {
        name: "PeerTube",
        url: "https://joinpeertube.org",
        description: "Decentralized video platform"
    },
    "netflix.com": {
        name: "Local Libraries",
        url: "https://www.worldcat.org",
        description: "Borrow movies and shows from your local library"
    },
    "spotify.com": {
        name: "Bandcamp",
        url: "https://bandcamp.com",
        description: "Platform that supports artists directly"
    },
    "airbnb.com": {
        name: "Local Hotels",
        url: "https://www.booking.com",
        description: "Support local hospitality businesses"
    },
    "uber.com": {
        name: "Local Taxi Companies",
        url: "https://www.google.com/maps",
        description: "Support local transportation services"
    },
    "paypal.com": {
        name: "Wise (TransferWise)",
        url: "https://wise.com",
        description: "International money transfers"
    },
    "starbucks.com": {
        name: "Local Coffee Shops",
        url: "https://www.google.com/maps",
        description: "Support independent coffee shops in your area"
    },
    "mcdonalds.com": {
        name: "Local Restaurants",
        url: "https://www.google.com/maps",
        description: "Support local restaurants and food businesses"
    },
    "cocacola.com": {
        name: "Local Beverage Brands",
        url: "https://www.google.com/maps",
        description: "Support local and ethical beverage companies"
    },
    "pepsico.com": {
        name: "Local Beverage Brands",
        url: "https://www.google.com/maps",
        description: "Support local and ethical beverage companies"
    },
    "marriott.com": {
        name: "Independent Hotels",
        url: "https://www.booking.com",
        description: "Support independent and local hotels"
    },
    "hilton.com": {
        name: "Independent Hotels",
        url: "https://www.booking.com",
        description: "Support independent and local hotels"
    },
    "hyatt.com": {
        name: "Independent Hotels",
        url: "https://www.booking.com",
        description: "Support independent and local hotels"
    },
    "walmart.com": {
        name: "Local Stores",
        url: "https://www.google.com/maps",
        description: "Support local businesses and farmers markets"
    },
    "target.com": {
        name: "Local Stores",
        url: "https://www.google.com/maps",
        description: "Support local businesses and co-ops"
    },
    "default": {
        name: "Ethical Alternatives",
        url: "https://ethical.net",
        description: "Find ethical alternatives to mainstream services"
    }
};
let personalImpact = {
    sitesBlocked: 0,
    estimatedRevenueDenied: 0,
    daysSinceStarted: null,
    campaignsJoined: 0,
    lastBlockedSite: null,
    blockingStreak: 0
};
const quickActions = {
    donate: [
        {
            name: "Palestine Children's Relief Fund",
            url: "https://www.pcrf.net/donate",
            description: "Medical relief for Palestinian children"
        },
        {
            name: "Medical Aid for Palestinians",
            url: "https://www.map.org.uk/donate",
            description: "Healthcare support for Palestinians"
        },
        {
            name: "UNRWA",
            url: "https://donate.unrwa.org",
            description: "UN agency supporting Palestinian refugees"
        }
    ],
    petition: [
        {
            name: "Free Palestine Petitions",
            url: "https://www.change.org/search?q=free%20palestine",
            description: "Sign active petitions for Palestinian rights"
        },
        {
            name: "BDS Movement",
            url: "https://bdsmovement.net/get-involved",
            description: "Join BDS campaigns and actions"
        }
    ],
    contact: [
        {
            name: "Contact Congress (US)",
            url: "https://www.congress.gov/members/find-your-member",
            description: "Contact your representatives about Palestine"
        },
        {
            name: "Contact Parliament (UK)",
            url: "https://www.parliament.uk/get-involved/contact-your-mp/",
            description: "Contact your MP about Palestine"
        }
    ],
    share: [
        {
            name: "Share on Twitter",
            url: "https://twitter.com/intent/tweet?text=I'm%20using%20the%20Israeli%20Domain%20Blocker%20to%20support%20Palestine%20🇵🇸%20%23FreePalestine%20%23BDS",
            description: "Share your support on Twitter"
        },
        {
            name: "Share on Facebook",
            url: "https://www.facebook.com/sharer/sharer.php?u=https://github.com/your-extension",
            description: "Share on Facebook"
        }
    ]
};
function initializeImpactTracking() {
    chrome.storage.local.get(['personalImpact'], (data) => {
        if (data.personalImpact) {
            personalImpact = { ...personalImpact, ...data.personalImpact };
        } else {
            personalImpact.daysSinceStarted = new Date().toISOString();
            chrome.storage.local.set({ personalImpact });
        }
    });
}
function updateImpactStats(domain) {
    personalImpact.sitesBlocked++;
    personalImpact.lastBlockedSite = domain;
    personalImpact.blockingStreak++;
    const avgRevenuePerVisit = 0.50; // Conservative estimate
    personalImpact.estimatedRevenueDenied += avgRevenuePerVisit;
    chrome.storage.local.set({ personalImpact });
}
function getAlternative(domain) {
    const normalizedDomain = domain.replace(/^www\./, '');
    return ethicalAlternatives[normalizedDomain] || ethicalAlternatives.default;
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        switch (request.action) {
            case 'getAlternative':
                const alternative = getAlternative(request.domain);
                sendResponse({ alternative });
                break;
            case 'updateImpact':
                updateImpactStats(request.domain);
                sendResponse({ success: true });
                break;
            case 'getQuickActions':
                sendResponse({ quickActions });
                break;
            case 'getPersonalImpact':
                chrome.storage.local.get(['personalImpact'], (data) => {
                    sendResponse({ impact: data.personalImpact || {} });
                });
                return true; // Async response
            default:
                sendResponse({ error: 'Unknown action' });
        }
    } catch (error) {
        sendResponse({ error: error.message });
    }
});
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['userSubmissions', 'domainEvidence'], (data) => {
        if (data.userSubmissions) {
            Object.assign(userSubmissions, data.userSubmissions);
        }
        if (data.domainEvidence) {
            Object.assign(domainEvidence, data.domainEvidence);
        }
    });
    initializeImpactTracking();
    scheduleRegularUpdates();
});
function initializeBlockedDomains() {
    chrome.storage.local.get(["blockedDomains", "whitelistedDomains"], (data) => {
        let blockedDomains = data.blockedDomains || [];
        let whitelistedDomains = data.whitelistedDomains || [];
        let domainsAdded = false;
        preSelectedDomains.forEach((domain) => {
            if (!blockedDomains.includes(domain)) {
                blockedDomains.push(domain);
                domainsAdded = true;
            }
        });
        if (domainsAdded || blockedDomains.length === 0) {
            chrome.storage.local.set({ 
                blockedDomains, 
                whitelistedDomains 
            }, () => {
                updateBlockingRules(blockedDomains, whitelistedDomains);
            });
        } else {
            updateBlockingRules(blockedDomains, whitelistedDomains);
        }
    });
}
chrome.runtime.onInstalled.addListener(() => {
    initializeBlockedDomains();
});
chrome.runtime.onStartup.addListener(() => {
    initializeBlockedDomains();
});
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.blockedDomains || changes.whitelistedDomains) {
        const updatedBlockedDomains = changes.blockedDomains?.newValue || [];
        const updatedWhitelistedDomains = changes.whitelistedDomains?.newValue || [];
        chrome.storage.local.get(["blockedDomains", "whitelistedDomains"], (data) => {
            const blockedDomains = changes.blockedDomains?.newValue || data.blockedDomains || [];
            const whitelistedDomains = changes.whitelistedDomains?.newValue || data.whitelistedDomains || [];
            updateBlockingRules(blockedDomains, whitelistedDomains);
        });
    }
});
function updateBlockingRules(blockedDomains, whitelistedDomains = []) {
    try {
        const effectiveBlockedDomains = blockedDomains.filter(domain => 
            !whitelistedDomains.includes(domain)
        );
        const rules = effectiveBlockedDomains.map((domain, index) => ({
        id: index + 1,
        priority: 1,
        action: { type: "redirect", redirect: { extensionPath: `/blocked.html?domain=${encodeURIComponent(domain)}` } },
        condition: { urlFilter: `*://*.${domain}/*`, resourceTypes: ["main_frame"] }
    }));
        chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
            const existingIds = existingRules.map(rule => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules,
                removeRuleIds: existingIds
    }, () => {
                if (chrome.runtime.lastError) {
                } else {
        chrome.declarativeNetRequest.getDynamicRules((currentRules) => {
                    });
                }
            });
        });
    } catch (error) {
    }
}
const extendedGoogleServices = [
    'youtube.com', 'gmail.com', 'googledrive.com', 'googlecloud.com',
    'googlemaps.com', 'googletranslate.com', 'googlecalendar.com', 
    'googlephotos.com', 'googlekeep.com', 'googlenews.com', 
    'googleplay.com', 'googlemeet.com', 'googledocs.com',
    'googlesheets.com', 'googleslides.com', 'googleforms.com'
];
function initializeExtendedGoogleBlocking() {
    chrome.storage.local.get(['blockAllGoogle', 'googleBlockingInitialized'], (data) => {
        if (data.googleBlockingInitialized) return;
        if (data.blockAllGoogle !== false) {
            chrome.storage.local.get(['blockedDomains'], (domainData) => {
                let blockedDomains = domainData.blockedDomains || [];
                let domainsAdded = false;
                extendedGoogleServices.forEach(domain => {
                    if (!blockedDomains.includes(domain)) {
                        blockedDomains.push(domain);
                        domainsAdded = true;
                    }
                });
                if (domainsAdded) {
                    chrome.storage.local.set({ 
                        blockedDomains,
                        googleBlockingInitialized: true,
                        blockAllGoogle: true
                    }, () => {
                        updateBlockingRules(blockedDomains, []);
                    });
                }
            });
        } else {
            chrome.storage.local.set({ googleBlockingInitialized: true });
        }
    });
}
initializeExtendedGoogleBlocking();
initializeBlockedDomains();