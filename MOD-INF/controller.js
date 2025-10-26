/*
 * refineCTI Extension for OpenRefine
 *
 * This extension provides Cyber Threat Intelligence (CTI) functions for OpenRefine:
 * - Extract IOCs (URLs, domains, IPs, emails) from text
 * - Defang/Fang (militarize/demilitarize) IOCs
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
    ClientSideResourceManager.addPaths(
        'project/scripts',
        module,
        [
            'scripts/refineCTI-core.js',
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
