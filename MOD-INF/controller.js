/*
 * refineCTI Extension for OpenRefine
 *
 * This extension provides Cyber Threat Intelligence (CTI) functions for OpenRefine:
 * - Extract IOCs (URLs, domains, IPv4, IPv6, emails) from text
 * - Extract cryptocurrency addresses (BTC, ETH, XMR, SOL)
 * - Extract social media identifiers (Telegram, Bluesky, Handles)
 * - Extract cryptographic hashes (MD5, SHA1, SHA256, SHA512, MurmurHash)
 * - Defang/Fang (militarize/demilitarize) IOCs
 *
 * Module structure:
 * - refineCTI-core.js: Defang/Fang operations
 * - refineCTI-IOC.js: IOC extraction (URLs, domains, IPs, emails)
 * - refineCTI-crypto.js: Cryptocurrency address extraction
 * - refineCTI-social.js: Social media identifier extraction
 * - refineCTI-hash.js: Cryptographic hash extraction
 * - refineCTI-menu.js: Menu integration and UI
 *
 * Copyright (C) 2025
 * License: MIT
 */

/*
 * Function invoked to initialize the extension.
 */
/* exported init */
function init() {
    /*
     * Client-side Resources
     */
    var ClientSideResourceManager = Packages.com.google.refine.ClientSideResourceManager;

    // Script files to inject into /project page
    // Order matters: core must load first, then IOC/crypto/social/hash, then menu
    ClientSideResourceManager.addPaths(
        'project/scripts',
        module,
        [
            'scripts/refineCTI-core.js',
            'scripts/refineCTI-IOC.js',
            'scripts/refineCTI-crypto.js',
            'scripts/refineCTI-social.js',
            'scripts/refineCTI-hash.js',
            'scripts/refineCTI-menu.js'
        ]
    );

    // Style files to inject into /project page
    ClientSideResourceManager.addPaths(
        'project/styles',
        module,
        [
            'styles/refineCTI.css'
        ]
    );
}
