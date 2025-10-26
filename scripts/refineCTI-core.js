/*
 * refineCTI Core Functions
 * Pure JavaScript implementation of IOC extraction and defang/fang operations
 */

/* exported RefineCTI */
var RefineCTI = (function() {
    'use strict';

    // ==================== DEFANG/FANG Functions ====================

    /**
     * Defang (militarize) an IOC to make it safe to share
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

    // ==================== IOC EXTRACTION Functions ====================

    /**
     * Extract URLs from text
     */
    function extractURLs(text, defangResult) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var urls = [];

        // Pattern for normal URLs
        var urlPattern = /\b(?:https?|ftp):\/\/[^\s<>"{}|\\^`[\]]+/gi;

        // Pattern for defanged URLs
        var defangedPattern = /\b(?:h[xX]{1,2}ps?|h\[x{1,2}\]xps?|fxp):\/\/[^\s<>"{}|\\^`]+/gi;
        var defangedPattern2 = /\b(?:https?|ftp)\[:?\]\/\/[^\s<>"{}|\\^`]+/gi;

        // Extract normal URLs
        var matches = text.match(urlPattern);
        if (matches) {
            urls = urls.concat(matches);
        }

        // Extract defanged URLs and fang them
        matches = text.match(defangedPattern);
        if (matches) {
            matches.forEach(function(match) {
                urls.push(fang(match));
            });
        }

        matches = text.match(defangedPattern2);
        if (matches) {
            matches.forEach(function(match) {
                urls.push(fang(match));
            });
        }

        // Remove duplicates
        urls = urls.filter(function(item, pos, self) {
            return self.indexOf(item) === pos;
        });

        // Apply defang if requested
        if (defangResult) {
            urls = urls.map(function(url) {
                return defang(url);
            });
        }

        return urls.map(function(s) { return s.trim(); }).join(', ').trim();
    }

    /**
     * Extract domain names from text
     */
    function extractDomains(text, defangResult) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var domains = [];

        // Pattern for domains (including defanged)
        var domainPattern = /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.|\[\.\]))+[a-zA-Z]{2,}\b/g;

        var matches = text.match(domainPattern);
        if (matches) {
            matches.forEach(function(match) {
                var domain = fang(match);
                // Basic validation
                if (domain.indexOf('.') !== -1 && /\.[a-z]{2,}$/i.test(domain)) {
                    domains.push(domain);
                }
            });
        }

        // Remove duplicates
        domains = domains.filter(function(item, pos, self) {
            return self.indexOf(item) === pos;
        });

        // Apply defang if requested
        if (defangResult) {
            domains = domains.map(function(d) {
                return defang(d);
            });
        }

        return domains.map(function(s) { return s.trim(); }).join(', ').trim();
    }

    /**
     * Extract IPv4 addresses from text
     */
    function extractIPs(text, defangResult) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var ips = [];

        // Pattern for normal IPv4
        var ipPattern = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;

        // Pattern for defanged IPv4
        var defangedPattern = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\[?\.\]?){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;

        // Extract normal IPs
        var matches = text.match(ipPattern);
        if (matches) {
            ips = ips.concat(matches);
        }

        // Extract defanged IPs
        matches = text.match(defangedPattern);
        if (matches) {
            matches.forEach(function(match) {
                var ip = fang(match);
                if (ips.indexOf(ip) === -1) {
                    ips.push(ip);
                }
            });
        }

        // Remove duplicates
        ips = ips.filter(function(item, pos, self) {
            return self.indexOf(item) === pos;
        });

        // Apply defang if requested
        if (defangResult) {
            ips = ips.map(function(ip) {
                return defang(ip);
            });
        }

        return ips.map(function(s) { return s.trim(); }).join(', ').trim();
    }

    /**
     * Extract email addresses from text
     */
    function extractEmails(text, defangResult) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var emails = [];

        // Pattern for normal emails
        var emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

        // Pattern for defanged emails
        var defangedPattern = /\b[A-Za-z0-9._%+-]+\[@\][A-Za-z0-9.[\]-]+[?.\]?[A-Za-z]{2,}\b/g;

        // Extract normal emails
        var matches = text.match(emailPattern);
        if (matches) {
            emails = emails.concat(matches);
        }

        // Extract defanged emails
        matches = text.match(defangedPattern);
        if (matches) {
            matches.forEach(function(match) {
                var email = fang(match);
                if (emails.indexOf(email) === -1) {
                    emails.push(email);
                }
            });
        }

        // Remove duplicates
        emails = emails.filter(function(item, pos, self) {
            return self.indexOf(item) === pos;
        });

        // Apply defang if requested
        if (defangResult) {
            emails = emails.map(function(e) {
                return defang(e);
            });
        }

        return emails.map(function(s) { return s.trim(); }).join(', ').trim();
    }

    /**
     * Extract all IOCs from text
     */
    function extractAllIOCs(text, defangResult) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var allIocs = [];
        var urls = [];
        var domains = [];
        var ips = [];
        var emails = [];

        // Extract URLs first
        var urlResult = extractURLs(text, false);
        if (urlResult) {
            urls = urlResult.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            allIocs = allIocs.concat(urls);
        }

        // Extract IPs
        var ipResult = extractIPs(text, false);
        if (ipResult) {
            ips = ipResult.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            allIocs = allIocs.concat(ips);
        }

        // Extract emails first (before domains to filter out email domains)
        var emailResult = extractEmails(text, false);
        if (emailResult) {
            emails = emailResult.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            allIocs = allIocs.concat(emails);
        }

        // Extract domains, but exclude those already in URLs or emails
        var domainResult = extractDomains(text, false);
        if (domainResult) {
            domains = domainResult.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            // Filter out domains that are already part of extracted URLs or emails
            domains = domains.filter(function(domain) {
                var found = false;
                // Check if domain is in any URL
                for (var i = 0; i < urls.length; i++) {
                    if (urls[i].indexOf(domain) !== -1) {
                        found = true;
                        break;
                    }
                }
                // Check if domain is in any email
                if (!found) {
                    for (var j = 0; j < emails.length; j++) {
                        if (emails[j].indexOf(domain) !== -1) {
                            found = true;
                            break;
                        }
                    }
                }
                return !found;
            });
            allIocs = allIocs.concat(domains);
        }

        // Remove duplicates
        allIocs = allIocs.filter(function(item, pos, self) {
            return self.indexOf(item) === pos;
        });

        // Apply defang if requested
        if (defangResult) {
            allIocs = allIocs.map(function(ioc) {
                return defang(ioc);
            });
        }

        return allIocs.join(', ').trim();
    }

    // Export public API
    return {
        defang: defang,
        fang: fang,
        extractURLs: extractURLs,
        extractDomains: extractDomains,
        extractIPs: extractIPs,
        extractEmails: extractEmails,
        extractAllIOCs: extractAllIOCs
    };
})();
