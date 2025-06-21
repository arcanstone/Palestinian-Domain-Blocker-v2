const preSelectedDomains = [
    // === ISRAELI-FOUNDED COMPANIES ===
    
    // Fintech & Payments
    "rapyd.net", // Rapyd - Israeli payment processing platform
    "fireblocks.com", // Fireblocks - Israeli crypto custody platform
    "forter.com", // Forter - Israeli e-commerce fraud prevention
    
    // Productivity & Business Tools  
    "timeclock365.com", // Israeli time tracking software
    "syncpal.co", // Israeli file synchronization
    "laufer.group", // Israeli business consulting
    "bizo.com", // Israeli B2B marketing platform
    "cardscan.com", // Israeli business card scanning
    "leadspace.com", // Israeli B2B lead generation
    "opster.com", // Israeli Elasticsearch consulting
    "wix.com", // Wix - Israeli website builder giant
    "zoominfo.com", // ZoomInfo - Israeli-founded B2B database
    
    // Cybersecurity (Israel's Largest Tech Export)
    "checkpoint.com", // Check Point - Israeli cybersecurity pioneer
    "cyberark.com", // CyberArk - Israeli privileged access management
    "cybereason.com", // Cybereason - Israeli endpoint detection
    "paloaltonetworks.com", // Palo Alto Networks - Israeli-founded security
    "imperva.com", // Imperva - Israeli data security platform
    "radware.com", // Radware - Israeli application delivery & security
    "armis.com", // Armis - Israeli IoT security platform
    "wiz.io", // Wiz - Israeli cloud security unicorn
    "wing.security", // Wing Security - Israeli SaaS security
    "salt.security", // Salt Security - Israeli API security
    "noname.security", // Noname Security - Israeli API security
    "morphisec.com", // Morphisec - Israeli endpoint security
    "argus-sec.com", // Argus Cyber Security - Israeli automotive security
    "astrixsecurity.com", // Astrix Security - Israeli SaaS security
    "axis-security.com", // Axis Security - Israeli zero trust network
    "claroty.com", // Claroty - Israeli industrial cybersecurity
    "cyberbit.com", // Cyberbit - Israeli cybersecurity training
    "cycognito.com", // CyCognito - Israeli attack surface management
    "cypago.com", // Cypago - Israeli GRC automation
    "digsecurity.com", // Dig Security - Israeli data security
    "entitle.co", // Entitle - Israeli cloud permissions management
    "hubsecurity.com", // Hub Security - Israeli cybersecurity
    "hunters.ai", // Hunters.ai - Israeli SOC platform
    "indeni.com", // Indeni - Israeli network security monitoring
    "infinipoint.com", // Infinipoint - Israeli device security
    "intsights.com", // IntSights - Israeli threat intelligence
    "lacoon.com", // Lacoon - Israeli mobile security (acquired by Check Point)
    "nso-group.com", // NSO Group - Israeli spyware company
    "perimeterx.com", // PerimeterX - Israeli bot protection
    "secdo.com", // Secdo - Israeli incident response (acquired by Palo Alto)
    "silverfort.com", // Silverfort - Israeli identity security
    "votiro.com", // Votiro - Israeli content disarm & reconstruction
    
    // Cloud & Infrastructure
    "cloudendure.com", // CloudEndure - Israeli disaster recovery (acquired by AWS)
    "cloudinary.com", // Cloudinary - Israeli media management platform
    "ctera.com", // CTERA - Israeli cloud storage gateway
    "infinidat.com", // Infinidat - Israeli enterprise storage
    "xensource.com", // XenSource - Israeli virtualization (acquired by Citrix)
    "xiv.com", // XIV - Israeli storage systems (acquired by IBM)
    
    // AI & Analytics
    "explorium.ai", // Explorium - Israeli external data platform
    "hyperwise.com", // Hyperwise - Israeli AI optimization
    "namogoo.com", // Namogoo - Israeli customer journey hijacking prevention
    "rosh-intelligent.com", // Rosh Intelligent Systems - Israeli AI
    
    // Semiconductors & Hardware
    "ezchip.com", // EZchip - Israeli network processors (acquired by Mellanox)
    "primesense.com", // PrimeSense - Israeli 3D sensing (acquired by Apple)
    "solaredge.com", // SolarEdge - Israeli solar power optimization
    "audiocodes.com", // AudioCodes - Israeli VoIP technology
    "gilat.com", // Gilat Satellite Networks - Israeli satellite communications
    
    // Telecommunications & Networking
    "commscope.com", // CommScope - has significant Israeli operations
    "crosswise.com", // Crosswise - Israeli audience platform
    "ivix.com", // IVIX - Israeli network optimization
    "viber.com", // Viber - Israeli messaging app (acquired by Rakuten)
    "icq.com", // ICQ - Israeli instant messaging (originally Israeli-founded)
    
    // Enterprise Software & Services
    "nice.com", // NICE - Israeli customer experience analytics
    "verint.com", // Verint - Israeli customer engagement platform
    "overops.com", // OverOps - Israeli application reliability
    "onavo.com", // Onavo - Israeli mobile analytics (acquired by Facebook)
    
    // Investment & Business
    "ilventures.com", // Israeli venture capital
    "gideononline.com", // Israeli business services
    "levltech.com", // Israeli technology consulting
    "yonatanlabs.com", // Israeli development labs
    
    // Navigation & Mobility
    "waze.com", // Waze - Israeli navigation app (acquired by Google)
    
    // Miscellaneous Israeli Tech
    "adallom.com", // Adallom - Israeli cloud security (acquired by Microsoft)
    "alphimax.com", // Israeli technology company
    "altnext.com", // Israeli alternative investment platform
    "bzigo.com", // Israeli smart home pest control
    "ctslabs.com", // CTS Labs - Israeli security research
    "fstbm.com", // Israeli technology services
    "godaddy.com", // Note: US company but significant Israeli development centers
    "ibt.com.ro", // Israeli business technology services
    
    // === PRO-ISRAELI ADVOCACY COMPANIES ===
    // Companies where leadership publicly supports Israeli government/military
    
    // Meta/Facebook - Mark Zuckerberg & Sheryl Sandberg pro-Israeli statements
    "facebook.com",
    "meta.com", 
    "instagram.com",
    "whatsapp.com",
    "threads.net",
    
    // Google/Alphabet - Sundar Pichai, significant Israeli operations, Project Nimbus
    "google.com",
    "youtube.com",
    "gmail.com",
    "googledrive.com",
    "googlecloud.com",
    "android.com",
    "chrome.com",
    
    // Amazon - Jeff Bezos statements, AWS Israeli government contracts
    "amazon.com",
    "aws.amazon.com",
    "prime.amazon.com",
    "audible.com",
    "twitch.tv",
    "imdb.com",
    "zappos.com",
    "wholefoods.com",
    
    // Microsoft - Satya Nadella statements, Azure Israeli contracts
    "microsoft.com",
    "outlook.com",
    "office.com",
    "teams.microsoft.com",
    "azure.microsoft.com",
    "xbox.com",
    "linkedin.com",
    "github.com",
    "skype.com",
    
    // Apple - Tim Cook statements, Israeli R&D centers
    "apple.com",
    "icloud.com",
    "itunes.com",
    "appstore.com",
    
    // Oracle - Larry Ellison pro-Israeli statements
    "oracle.com",
    
    // Salesforce - Marc Benioff statements
    "salesforce.com",
    "slack.com",
    "tableau.com",
    
    // Intel - Major Israeli operations, CEO statements
    "intel.com",
    
    // NVIDIA - Jensen Huang statements, Israeli partnerships
    "nvidia.com",
    
    // Palantir - Peter Thiel, explicit Israeli government contracts
    "palantir.com",
    
    // Airbnb - Brian Chesky statements on Israeli settlements
    "airbnb.com",
    
    // Uber - Dara Khosrowshahi statements
    "uber.com",
    "ubereats.com",
    
    // Netflix - Reed Hastings statements
    "netflix.com",
    
    // PayPal - Dan Schulman statements
    "paypal.com",
    
    // Stripe - Patrick Collison statements
    "stripe.com",
    
    // Zoom - Eric Yuan statements, Israeli security partnerships
    "zoom.us",
    
    // Shopify - Tobias Lütke statements
    "shopify.com",
    
    // Discord - Jason Citron statements
    "discord.com",
    
    // Spotify - Daniel Ek statements
    "spotify.com",
    
    // TikTok/ByteDance - Despite Chinese ownership, pro-Israeli content policies
    "tiktok.com",
    
    // X/Twitter - Elon Musk statements
    "x.com",
    "twitter.com",
    
    // Reddit - Steve Huffman statements
    "reddit.com",
    
    // Snapchat - Evan Spiegel statements
    "snapchat.com",
    
    // Adobe - Shantanu Narayen statements
    "adobe.com",
    
    // Cisco - Chuck Robbins statements, Israeli partnerships
    "cisco.com",
    "webex.com",
    
    // IBM - Arvind Krishna statements
    "ibm.com",
    
    // HP - Enrique Lores statements
    "hp.com",
    "hpe.com",
    
    // Dell - Michael Dell statements
    "dell.com",
    
    // VMware - Raghu Raghuram statements
    "vmware.com",
    
    // ServiceNow - Bill McDermott statements
    "servicenow.com",
    
    // Workday - Aneel Bhusri statements
    "workday.com",
    
    // Atlassian - Mike Cannon-Brookes statements
    "atlassian.com",
    "jira.com",
    "confluence.com",
    "trello.com",
    
    // Twilio - Jeff Lawson statements
    "twilio.com",
    "sendgrid.com",
    
    // Datadog - Olivier Pomel statements
    "datadog.com",
    
    // Cloudflare - Matthew Prince statements
    "cloudflare.com",
    
    // MongoDB - Dev Ittycheria statements
    "mongodb.com",
    
    // Elastic - Shay Banon (Israeli founder)
    "elastic.co",
    
    // JetBrains - Maxim Shafirov statements
    "jetbrains.com",
    
    // Unity - John Riccitiello statements
    "unity.com",
    
    // Autodesk - Andrew Anagnost statements
    "autodesk.com",
    
    // Intuit - Sasan Goodarzi statements
    "intuit.com",
    "quickbooks.com",
    "turbotax.com",
    "mailchimp.com",
    
    // DocuSign - Dan Springer statements
    "docusign.com",
    
    // Okta - Todd McKinnon statements
    "okta.com",
    
    // CrowdStrike - George Kurtz statements
    "crowdstrike.com",
    
    // Palo Alto Networks - Nikesh Arora statements (already in Israeli list but confirmed advocacy)
    // "paloaltonetworks.com", // Already listed above
    
    // Fortinet - Ken Xie statements
    "fortinet.com",
    
    // SentinelOne - Tomer Weingarten (Israeli founder)
    "sentinelone.com",
    
    // Check Point Software - Gil Shwed (Israeli founder, already listed)
    // "checkpoint.com", // Already listed above
    
    // === ISRAELI GOVERNMENT CONTRACTORS ===
    // Companies with significant Israeli government/military contracts
    
    // Defense Contractors with Israeli Military Contracts
    "lockheedmartin.com", // Lockheed Martin - F-35 joint program, Iron Dome components
    "boeing.com", // Boeing - Military aircraft sales, defense partnerships
    "raytheon.com", // Raytheon - Missile defense systems, Iron Dome cooperation
    "northropgrumman.com", // Northrop Grumman - Defense electronics, UAV partnerships
    "generaldynamics.com", // General Dynamics - Military vehicles, communications
    "bae.co.uk", // BAE Systems - Defense electronics, joint ventures
    "thalesgroup.com", // Thales - Defense electronics, radar systems
    "leonardo.com", // Leonardo - Defense systems, joint ventures
    "elbit.co.il", // Elbit Systems - Israeli defense contractor (already Israeli)
    "iai.co.il", // Israel Aerospace Industries (already Israeli)
    
    // Technology Companies with Israeli Military/Government Contracts
    "caterpillar.com", // Caterpillar - Equipment used in settlements, military operations
    "motorolasolutions.com", // Motorola Solutions - Communications for Israeli military
    "ge.com", // General Electric - Aviation, power systems for Israeli military
    "honeywell.com", // Honeywell - Aerospace systems, defense electronics
    "l3harris.com", // L3Harris - Military communications, surveillance systems
    "textron.com", // Textron - Military vehicles, aircraft systems
    
    // Consulting & Professional Services
    "mckinsey.com", // McKinsey - Strategic consulting for Israeli government
    "deloitte.com", // Deloitte - Government consulting, defense sector work
    "pwc.com", // PwC - Government advisory, defense consulting
    "ey.com", // Ernst & Young - Government consulting
    "kpmg.com", // KPMG - Government advisory services
    "accenture.com", // Accenture - Government IT services, defense consulting
    
    // Financial Services Supporting Israeli Bonds/Investments
    "blackrock.com", // BlackRock - Major Israeli government bond investments
    "vanguard.com", // Vanguard - Israeli government bond funds
    "fidelity.com", // Fidelity - Israeli investment funds
    "statestreet.com", // State Street - Israeli government securities
    "jpmorganchase.com", // JPMorgan Chase - Israeli government bond underwriting
    "goldmansachs.com", // Goldman Sachs - Israeli government financial services
    "morganstanley.com", // Morgan Stanley - Israeli investment banking
    "bankofamerica.com", // Bank of America - Israeli government banking
    "citigroup.com", // Citigroup - Israeli government financial services
    "wellsfargo.com", // Wells Fargo - Israeli investment services
    
    // Telecommunications with Israeli Government Contracts
    "verizon.com", // Verizon - Israeli government communications contracts
    "att.com", // AT&T - Israeli government telecommunications
    "tmobile.com", // T-Mobile - Israeli partnerships
    "sprint.com", // Sprint - Israeli technology partnerships
    
    // === MAJOR ISRAELI INVESTORS & SUPPORTERS ===
    // Companies with major investments in Israeli economy or explicit support
    
    // Venture Capital & Investment Firms
    "sequoiacap.com", // Sequoia Capital - Major Israeli startup investments
    "a16z.com", // Andreessen Horowitz - Significant Israeli portfolio
    "kleinerperkins.com", // Kleiner Perkins - Israeli startup investments
    "accel.com", // Accel Partners - Israeli venture investments
    "gv.com", // Google Ventures - Israeli startup investments
    "intel.capital", // Intel Capital - Major Israeli tech investments
    "qualcomm.ventures", // Qualcomm Ventures - Israeli semiconductor investments
    "cvs.com", // CVS - Israeli healthcare tech investments
    
    // Real Estate & Construction Companies Operating in Settlements
    "remax.com", // RE/MAX - Operations in Israeli settlements
    "century21.com", // Century 21 - Settlement real estate operations
    "marriott.com", // Marriott - Hotels in settlements and Jerusalem
    "hilton.com", // Hilton - Hotels in settlements
    "hyatt.com", // Hyatt - Hotels in occupied territories
    "ihg.com", // InterContinental Hotels - Settlement operations
    "accor.com", // Accor Hotels - Settlement properties
    
    // Transportation & Logistics
    "fedex.com", // FedEx - Israeli military logistics contracts
    "ups.com", // UPS - Israeli government delivery contracts
    "dhl.com", // DHL - Israeli military/government logistics
    
    // Energy & Utilities
    "chevron.com", // Chevron - Israeli energy partnerships
    "exxonmobil.com", // ExxonMobil - Israeli energy exploration
    "shell.com", // Shell - Israeli energy operations
    "bp.com", // BP - Israeli energy partnerships
    "totalenergies.com", // TotalEnergies - Israeli gas field partnerships
    
    // Pharmaceutical Companies with Israeli Military Medical Contracts
    "pfizer.com", // Pfizer - Israeli military medical contracts
    "jnj.com", // Johnson & Johnson - Israeli military healthcare
    "merck.com", // Merck - Israeli government pharmaceutical contracts
    "abbvie.com", // AbbVie - Israeli military medical supplies
    "roche.com", // Roche - Israeli government healthcare contracts
    
    // Food & Agriculture Companies Supporting Settlement Agriculture
    "nestle.com", // Nestlé - Settlement agriculture partnerships
    "unilever.com", // Unilever - Settlement factory operations
    "pepsico.com", // PepsiCo - Israeli military/settlement operations
    "cocacola.com", // Coca-Cola - Settlement bottling operations
    "danone.com", // Danone - Israeli settlement operations
    "generalmills.com", // General Mills - Israeli agricultural partnerships
    
    // Retail Companies with Settlement Operations
    "walmart.com", // Walmart - Israeli settlement supply chains
    "target.com", // Target - Israeli partnership operations
    "costco.com", // Costco - Israeli government contracts
    "homedepot.com", // Home Depot - Settlement construction supplies
    "lowes.com", // Lowe's - Settlement building materials
    
    // === ISRAELI INVESTMENT FIRMS & FUNDS ===
    // VCs and investment firms primarily funding Israeli startups
    
    "pitango.com", // Pitango Venture Capital - Leading Israeli VC
    "jerusalemvc.com", // Jerusalem Venture Partners - Israeli VC
    "glenrockisrael.com", // Glenrock Israel - Israeli investment fund
    "gemini.com", // Gemini Israel Funds - Israeli investment
    "carmelventures.com", // Carmel Ventures - Israeli VC
    "violagroup.com", // Viola Group - Major Israeli VC
    "alephvc.com", // Aleph VC - Israeli venture capital
    "bessemer.com", // Bessemer Venture Partners - Major Israeli investments
    "insight.com", // Insight Partners - Significant Israeli portfolio
    "battery.com", // Battery Ventures - Israeli startup investments
];

// Domain categorization system for transparency and user education
const domainCategories = {
    // Israeli-founded companies
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
    
    // Pro-Israeli advocacy
    "advocacy_big_tech": "Big Tech with Pro-Israeli Leadership",
    "advocacy_social": "Social Media with Pro-Israeli Policies",
    "advocacy_enterprise": "Enterprise Software with Pro-Israeli Leadership",
    "advocacy_consumer": "Consumer Services with Pro-Israeli Leadership",
    
    // Government contractors
    "contractor_defense": "Defense Contractors with Israeli Military Contracts",
    "contractor_tech": "Technology Companies with Israeli Government Contracts",
    "contractor_consulting": "Consulting Firms Serving Israeli Government",
    "contractor_financial": "Financial Services Supporting Israeli Government",
    "contractor_telecom": "Telecommunications with Israeli Government Contracts",
    
    // Settlement operations
    "settlement_hospitality": "Hotels Operating in Illegal Settlements",
    "settlement_realestate": "Real Estate Companies in Settlement Areas",
    "settlement_retail": "Retail Companies with Settlement Supply Chains",
    "settlement_food": "Food Companies with Settlement Operations",
    "settlement_construction": "Construction/Materials for Settlement Building",
    
    // Investment & support
    "investment_vc": "Venture Capital Firms with Major Israeli Portfolios",
    "investment_israeli": "Israeli Investment Firms & Funds",
    "support_energy": "Energy Companies with Israeli Partnerships",
    "support_pharma": "Pharmaceutical Companies with Israeli Military Contracts",
    "support_logistics": "Logistics Companies with Israeli Government Contracts"
};

// Function to get domain category
function getDomainCategory(domain) {
    // Simple mapping - in a real implementation, this would be more sophisticated
    const normalizedDomain = domain.replace(/^www\./, '');
    
    // Israeli cybersecurity companies
    if (['checkpoint.com', 'cyberark.com', 'paloaltonetworks.com', 'wiz.io', 'armis.com'].includes(normalizedDomain)) {
        return 'israeli_cybersecurity';
    }
    
    // Big tech advocacy
    if (['google.com', 'facebook.com', 'amazon.com', 'microsoft.com', 'apple.com'].includes(normalizedDomain)) {
        return 'advocacy_big_tech';
    }
    
    // Defense contractors
    if (['lockheedmartin.com', 'boeing.com', 'raytheon.com'].includes(normalizedDomain)) {
        return 'contractor_defense';
    }
    
    // Settlement hotels
    if (['marriott.com', 'hilton.com', 'hyatt.com'].includes(normalizedDomain)) {
        return 'settlement_hospitality';
    }
    
    // Default fallback
    return 'israeli_misc';
}

// Evidence and research tracking system
const domainEvidence = {
    // User submission system will populate this
    // Format: domain -> { category, evidence_links, date_added, verified }
};

// User submission queue for new domains
const userSubmissions = {
    // Format: { domain, category, evidence, submitted_by, date, status }
    pending: [],
    approved: [],
    rejected: []
};

// Crowdsourced research system
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
    
    // Store in local storage for persistence
    chrome.storage.local.set({ userSubmissions: userSubmissions });
    
    console.log('New domain submission:', submission);
    return submission.id;
}

// Verification process for user submissions
function verifySubmission(submissionId, approved, moderatorNotes) {
    const submission = userSubmissions.pending.find(s => s.id === submissionId);
    if (!submission) return false;
    
    // Remove from pending
    userSubmissions.pending = userSubmissions.pending.filter(s => s.id !== submissionId);
    
    // Add to appropriate list
    submission.status = approved ? 'approved' : 'rejected';
    submission.moderator_notes = moderatorNotes;
    submission.verified_date = new Date().toISOString();
    
    if (approved) {
        userSubmissions.approved.push(submission);
        // Add to main domain list if approved
        addDomainToBlocklist(submission.domain, submission.category, submission.evidence);
    } else {
        userSubmissions.rejected.push(submission);
    }
    
    // Update storage
    chrome.storage.local.set({ userSubmissions: userSubmissions });
    
    return true;
}

// Function to add verified domain to blocklist
function addDomainToBlocklist(domain, category, evidence) {
    chrome.storage.local.get(['blockedDomains'], (data) => {
        let blockedDomains = data.blockedDomains || [];
        
        if (!blockedDomains.includes(domain)) {
            blockedDomains.push(domain);
            
            // Add evidence tracking
            domainEvidence[domain] = {
                category: category,
                evidence: evidence,
                date_added: new Date().toISOString(),
                verified: true
            };
            
            // Update storage
            chrome.storage.local.set({ 
                blockedDomains: blockedDomains,
                domainEvidence: domainEvidence
            });
            
            console.log(`Added verified domain: ${domain}`);
        }
    });
}

// Regular update system for crowdsourced research
function scheduleRegularUpdates() {
    // Check for updates every 24 hours
    setInterval(() => {
        console.log('Checking for domain list updates...');
        // In a real implementation, this would sync with a server
        updateDomainListFromCrowdsource();
    }, 24 * 60 * 60 * 1000);
}

function updateDomainListFromCrowdsource() {
    // Placeholder for crowdsourced updates
    // Would fetch from a community-maintained database
    console.log('Fetching community updates...');
}

// Alternative recommendations for blocked sites
const ethicalAlternatives = {
    // Big Tech Alternatives
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
    
    // Social Media Alternatives
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
    
    // Streaming & Entertainment
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
    
    // E-commerce & Services
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
    
    // Food & Beverages
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
    
    // Hotels & Travel
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
    
    // Shopping
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
    
    // Default fallback
    "default": {
        name: "Ethical Alternatives",
        url: "https://ethical.net",
        description: "Find ethical alternatives to mainstream services"
    }
};

// Personal impact tracking
let personalImpact = {
    sitesBlocked: 0,
    estimatedRevenueDenied: 0,
    daysSinceStarted: null,
    campaignsJoined: 0,
    lastBlockedSite: null,
    blockingStreak: 0
};

// Quick action links for Palestinian solidarity
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

// Initialize impact tracking
function initializeImpactTracking() {
    chrome.storage.local.get(['personalImpact'], (data) => {
        if (data.personalImpact) {
            personalImpact = { ...personalImpact, ...data.personalImpact };
        } else {
            // First time user - set start date
            personalImpact.daysSinceStarted = new Date().toISOString();
            chrome.storage.local.set({ personalImpact });
        }
    });
}

// Update impact when a site is blocked
function updateImpactStats(domain) {
    personalImpact.sitesBlocked++;
    personalImpact.lastBlockedSite = domain;
    personalImpact.blockingStreak++;
    
    // Estimate revenue denied (rough calculation)
    const avgRevenuePerVisit = 0.50; // Conservative estimate
    personalImpact.estimatedRevenueDenied += avgRevenuePerVisit;
    
    // Save updated stats
    chrome.storage.local.set({ personalImpact });
    
    console.log(`Impact updated: ${domain} blocked. Total sites blocked: ${personalImpact.sitesBlocked}`);
}

// Get alternative recommendation for a domain
function getAlternative(domain) {
    const normalizedDomain = domain.replace(/^www\./, '');
    return ethicalAlternatives[normalizedDomain] || ethicalAlternatives.default;
}

// Message handler for blocked page communication
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
        console.error('Error handling message:', error);
        sendResponse({ error: error.message });
    }
});

// Initialize the crowdsourcing system
chrome.runtime.onInstalled.addListener(() => {
    // Load existing submissions from storage
    chrome.storage.local.get(['userSubmissions', 'domainEvidence'], (data) => {
        if (data.userSubmissions) {
            Object.assign(userSubmissions, data.userSubmissions);
        }
        if (data.domainEvidence) {
            Object.assign(domainEvidence, data.domainEvidence);
        }
    });
    
    // Initialize impact tracking
    initializeImpactTracking();
    
    // Start regular update checks
    scheduleRegularUpdates();
});

// On installation, set up the pre-selected domains
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed or updated.");

    chrome.storage.local.get(["blockedDomains", "whitelistedDomains"], (data) => {
        let blockedDomains = data.blockedDomains || [];
        let whitelistedDomains = data.whitelistedDomains || [];
        console.log("Existing blocked domains:", blockedDomains);
        console.log("Existing whitelisted domains:", whitelistedDomains);

        // Add pre-selected domains only if they aren't already in storage
        preSelectedDomains.forEach((domain) => {
            if (!blockedDomains.includes(domain)) {
                blockedDomains.push(domain);
                console.log(`Added ${domain} to blocked domains.`);
            }
        });

        chrome.storage.local.set({ 
            blockedDomains, 
            whitelistedDomains 
        }, () => {
            console.log("Blocked domains updated in storage:", blockedDomains);
            console.log("Whitelisted domains in storage:", whitelistedDomains);
            updateBlockingRules(blockedDomains, whitelistedDomains);
        });
    });
});

// Listen for storage changes (e.g., block/unblock)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.blockedDomains || changes.whitelistedDomains) {
        const updatedBlockedDomains = changes.blockedDomains?.newValue || [];
        const updatedWhitelistedDomains = changes.whitelistedDomains?.newValue || [];
        
        // Get current values if only one changed
        chrome.storage.local.get(["blockedDomains", "whitelistedDomains"], (data) => {
            const blockedDomains = changes.blockedDomains?.newValue || data.blockedDomains || [];
            const whitelistedDomains = changes.whitelistedDomains?.newValue || data.whitelistedDomains || [];
            
            console.log("Storage changed, new blocked domains:", blockedDomains);
            console.log("Storage changed, new whitelisted domains:", whitelistedDomains);
            updateBlockingRules(blockedDomains, whitelistedDomains);
        });
    }
});

// Function to update dynamic rules based on the blocked domains and whitelist
function updateBlockingRules(blockedDomains, whitelistedDomains = []) {
    console.log("Updating blocking rules for domains:", blockedDomains);
    console.log("Whitelist:", whitelistedDomains);

    try {
        // Filter out whitelisted domains from blocked domains
        const effectiveBlockedDomains = blockedDomains.filter(domain => 
            !whitelistedDomains.includes(domain)
        );

        console.log("Effective blocked domains after whitelist filter:", effectiveBlockedDomains);

        const rules = effectiveBlockedDomains.map((domain, index) => ({
        id: index + 1,
        priority: 1,
        action: { type: "redirect", redirect: { extensionPath: `/blocked.html?domain=${encodeURIComponent(domain)}` } },
        condition: { urlFilter: `*://*.${domain}/*`, resourceTypes: ["main_frame"] }
    }));

    console.log("New rules to add:", rules);

        // Get existing rules first, then clear and apply new ones
        chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
            const existingIds = existingRules.map(rule => rule.id);
            console.log("Existing rule IDs to remove:", existingIds);

    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules,
                removeRuleIds: existingIds
    }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error updating dynamic rules:", chrome.runtime.lastError);
                } else {
        console.log("Dynamic rules updated successfully.");
        
                    // Verify the current rules
        chrome.declarativeNetRequest.getDynamicRules((currentRules) => {
                        console.log("Current dynamic rules after update:", currentRules);
                    });
                }
            });
        });
    } catch (error) {
        console.error("Error in updateBlockingRules:", error);
    }
}

// Initial loading of the blocking rules from storage
chrome.storage.local.get(["blockedDomains", "whitelistedDomains"], (data) => {
    try {
    const blockedDomains = data.blockedDomains || [];
        const whitelistedDomains = data.whitelistedDomains || [];
    console.log("Loaded blocked domains on startup:", blockedDomains);
        console.log("Loaded whitelisted domains on startup:", whitelistedDomains);
        updateBlockingRules(blockedDomains, whitelistedDomains);
    } catch (error) {
        console.error("Error loading initial blocking rules:", error);
    }
});

// Error handling for extension errors
chrome.runtime.onStartup.addListener(() => {
    console.log("Extension startup - reloading rules");
    chrome.storage.local.get(["blockedDomains", "whitelistedDomains"], (data) => {
        const blockedDomains = data.blockedDomains || [];
        const whitelistedDomains = data.whitelistedDomains || [];
        updateBlockingRules(blockedDomains, whitelistedDomains);
    });
});
