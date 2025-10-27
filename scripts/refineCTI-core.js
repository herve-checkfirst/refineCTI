/*
 * refineCTI Core Functions
 * Defang/Fang operations for IOCs
 *
 * Note: IOC extraction functions have been moved to refineCTI-IOC.js
 *       Crypto extraction functions are in refineCTI-crypto.js
 */

/* exported RefineCTI */
var RefineCTI = (function() {
    'use strict';

    // ==================== DEFANG/FANG Functions ====================

    /**
     * Defang (militarize) an IOC to make it safe to share
     * Converts active IOCs to inactive format to prevent accidental clicks/execution
     *
     * Examples:
     *   http://evil.com → hxxp://evil[.]com
     *   192.168.1.1 → 192[.]168[.]1[.]1
     *   user@evil.com → user[@]evil[.]com
     */
    function defang(ioc) {
        if (!ioc || typeof ioc !== 'string') {
            return ioc;
        }

        var defanged = ioc;

        // Defang HTTP/HTTPS
        defanged = defanged.replace(/https?:\/\//gi, function(match) {
            return match.toLowerCase().replace('http', 'hxxp').replace('s://', '://');
        });

        // Defang FTP
        defanged = defanged.replace(/ftp:\/\//gi, 'fxp://');

        // Defang dots in domains and IPs
        defanged = defanged.replace(/(\w)\.(\w)/g, '$1[.]$2');

        // Defang @ in emails
        defanged = defanged.replace(/@/g, '[@]');

        // Defang :// in protocols
        defanged = defanged.replace(/:\/\//g, '[:]//');

        return defanged;
    }

    /**
     * Fang (demilitarize) an IOC to restore it to usable form
     * Converts defanged IOCs back to active format
     *
     * Examples:
     *   hxxp://evil[.]com → http://evil.com
     *   192[.]168[.]1[.]1 → 192.168.1.1
     *   user[@]evil[.]com → user@evil.com
     */
    function fang(ioc) {
        if (!ioc || typeof ioc !== 'string') {
            return ioc;
        }

        var fanged = ioc;

        // Fang hxxp/hxxps back to http/https
        fanged = fanged.replace(/hxxps?/gi, 'http');
        fanged = fanged.replace(/h\[x{1,2}\]xp/gi, 'http');

        // Fang fxp back to ftp
        fanged = fanged.replace(/fxp/gi, 'ftp');

        // Fang [.] back to .
        fanged = fanged.replace(/\[\.\]/g, '.');
        fanged = fanged.replace(/\[\. \]/g, '.');

        // Fang [@] back to @
        fanged = fanged.replace(/\[@\]/g, '@');
        fanged = fanged.replace(/\[ @\]/g, '@');

        // Fang [:] back to :
        fanged = fanged.replace(/\[:\]/g, ':');

        return fanged;
    }

    // Export public API
    return {
        defang: defang,
        fang: fang
    };
})();
