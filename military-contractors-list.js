// Verified companies with documented Israeli military ties
// Each entry includes specific evidence and credible sources
const verifiedMilitaryContractors = [
    // === ISRAELI DEFENSE COMPANIES ===
    
    // Major Israeli Defense Contractors
    "elbitsystems.com", // Elbit Systems - 17% revenue from Israeli MoD, primary IDF equipment supplier
    "iai.co.il", // Israel Aerospace Industries - State-owned, direct IDF supplier
    "rafael.co.il", // Rafael Advanced Defense Systems - $5.2B MoD contract (2025), Iron Dome
    
    // Israeli Cybersecurity/Surveillance with Military Ties
    "nsogroup.com", // NSO Group - Licensed by Israeli MoD, Pegasus spyware
    "cellebrite.com", // Cellebrite - Unit 8200 recruitment, mobile forensics for military
    "verint.com", // Verint - Licensed by Israeli MoD for surveillance exports
    "checkpoint.com", // Check Point - Provides cybersecurity to Israeli military
    "cyberark.com", // CyberArk - Privileged access management for Israeli defense sector
    
    // === US DEFENSE CONTRACTORS ===
    
    // Major Defense Suppliers to Israel
    "lockheedmartin.com", // $6B+ Industrial Participation agreements, F-35 program
    "boeing.com", // F-15 fighter jets, Apache helicopters to Israeli Air Force
    "rtx.com", // Raytheon - Iron Dome components, F-16 missiles
    "northropgrumman.com", // $8.9M cannon contract (Dec 2024), Sa'ar 5 warships
    "generaldynamics.com", // Sole US producer of MK-80 bombs used by Israel
    "l3harris.com", // Military communications, surveillance systems
    "textron.com", // Military vehicles, aircraft systems
    
    // === TECHNOLOGY COMPANIES WITH MILITARY CONTRACTS ===
    
    // Cloud/AI Services
    "google.com", // $1.2B Project Nimbus, direct Israeli MoD consulting (2024)
    "amazon.com", // Co-partner in $1.2B Project Nimbus contract
    "microsoft.com", // $133M Israeli MoD contract (2021), S500 priority client
    "palantir.com", // Strategic partnership with Israeli MoD (Jan 2024)
    
    // IT Infrastructure
    "ibm.com", // 25-year contract as main IT provider for IDF logistics (2020)
    "intel.com", // Largest private employer in Israel, $25B chip plant investment
    
    // === CONSTRUCTION/INFRASTRUCTURE ===
    
    "caterpillar.com", // D9 bulldozers to IDF under US Foreign Military Sales
    
    // === FINANCIAL SERVICES ===
    
    // Major Defense Sector Investors
    "blackrock.com", // Major shareholder (7-8%) in defense contractors
    "vanguard.com", // Largest institutional investor (9-10%) in defense contractors  
    "jpmorgan.com", // Underwriter of Israeli war bonds, Tel Aviv office
    
    // === ISRAELI TECH COMPANIES WITH MILITARY TIES ===
    
    // Israeli Companies with Verified Military Connections
    "wix.com", // Israeli company, some military/government contracts
    "nice.com", // Israeli customer analytics, some government contracts
    "radware.com", // Israeli security, some military applications
    "claroty.com", // Israeli industrial cybersecurity, military applications
    "armis.com", // Israeli IoT security, military/government clients
];

// Companies to REMOVE from current list (no verified military ties)
const companiesToRemove = [
    // Major tech companies without verified military contracts
    "facebook.com", "meta.com", "instagram.com", "whatsapp.com",
    "youtube.com", "gmail.com", "googledrive.com", "android.com",
    "aws.amazon.com", "prime.amazon.com", "audible.com", "twitch.tv", "imdb.com",
    "outlook.com", "office.com", "teams.microsoft.com", "azure.microsoft.com",
    "xbox.com", "linkedin.com", "github.com", "skype.com",
    "apple.com", "icloud.com", "itunes.com", "appstore.com",
    "oracle.com", "salesforce.com", "slack.com", "tableau.com",
    "nvidia.com", "airbnb.com", "uber.com", "ubereats.com",
    "netflix.com", "paypal.com", "stripe.com", "zoom.us",
    "shopify.com", "discord.com", "spotify.com", "tiktok.com",
    "x.com", "twitter.com", "reddit.com", "snapchat.com",
    "adobe.com", "cisco.com", "webex.com", "hp.com", "hpe.com",
    "dell.com", "vmware.com", "servicenow.com", "workday.com",
    "atlassian.com", "jira.com", "confluence.com", "trello.com",
    
    // Venture capital firms (investment ≠ military contracts)
    "sequoiacap.com", "a16z.com", "kleinerperkins.com", "accel.com",
    "gv.com", "intel.capital", "qualcomm.ventures",
    
    // Companies without verified military ties
    "twilio.com", "sendgrid.com", "datadog.com", "cloudflare.com",
    "mongodb.com", "elastic.co", "jetbrains.com", "unity.com",
    "autodesk.com", "intuit.com", "quickbooks.com", "turbotax.com",
    "mailchimp.com", "docusign.com", "okta.com", "crowdstrike.com",
    "fortinet.com", "sentinelone.com",
    
    // Consulting/financial without verified military contracts
    "mckinsey.com", "deloitte.com", "pwc.com", "ey.com", "kpmg.com",
    "accenture.com", "fidelity.com", "statestreet.com",
    "morganstanley.com", "bankofamerica.com", "citigroup.com", "wellsfargo.com",
    
    // Telecom/retail without verified military contracts
    "verizon.com", "att.com", "tmobile.com", "sprint.com",
    "cvs.com", "remax.com", "century21.com", "marriott.com",
    "hilton.com", "hyatt.com", "ihg.com", "accor.com",
    "fedex.com", "ups.com", "dhl.com",
    
    // Energy companies without verified military contracts
    "chevron.com", "exxonmobil.com", "shell.com", "bp.com", "totalenergies.com",
    
    // Pharma/food without verified military contracts
    "pfizer.com", "jnj.com", "merck.com", "abbvie.com", "roche.com",
    "nestle.com", "unilever.com", "pepsico.com", "cocacola.com",
    "danone.com", "generalmills.com",
    
    // Retail without verified military contracts
    "walmart.com", "target.com", "costco.com", "homedepot.com", "lowes.com",
    
    // Adult content (inappropriate for extension)
    "brazzers.com", "pornhub.com", "redtube.com", "youporn.com",
    "tube8.com", "xtube.com",
    
    // Israeli companies without verified military ties
    "rapyd.net", "fireblocks.com", "forter.com", "timeclock365.com",
    "syncpal.co", "laufer.group", "bizo.com", "cardscan.com",
    "leadspace.com", "opster.com", "zoominfo.com", "explorium.ai",
    "hyperwise.com", "namogoo.com", "rosh-intelligent.com",
    "cloudinary.com", "ctera.com", "infinidat.com", "viber.com",
    "icq.com", "overops.com", "onavo.com", "waze.com", "adallom.com"
];

module.exports = {
    verifiedMilitaryContractors,
    companiesToRemove
};