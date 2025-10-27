/*
 * refineCTI IOC Extraction Module
 * Functions for extracting Indicators of Compromise (IOCs) from text
 * Supports: URLs, Domains, IPv4, IPv6, Emails
 */

/* exported RefineCTIIOC */
/* global RefineCTI */
var RefineCTIIOC = (function() {
    'use strict';

    // Note: defang/fang functions are in RefineCTI module

    // ==================== URL EXTRACTION ====================

    /**
     * Extract URLs from text
     * Supports HTTP, HTTPS, FTP (normal and defanged)
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
                urls.push(RefineCTI.fang(match));
            });
        }

        matches = text.match(defangedPattern2);
        if (matches) {
            matches.forEach(function(match) {
                urls.push(RefineCTI.fang(match));
            });
        }

        // Remove duplicates
        urls = urls.filter(function(item, pos, self) {
            return self.indexOf(item) === pos;
        });

        // Apply defang if requested
        if (defangResult) {
            urls = urls.map(function(url) {
                return RefineCTI.defang(url);
            });
        }

        return urls.map(function(s) { return s.trim(); }).join(', ').trim();
    }

    // ==================== DOMAIN EXTRACTION ====================

    /**
     * Extract domain names from text
     * Supports normal and defanged domains
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
                var domain = RefineCTI.fang(match);
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
                return RefineCTI.defang(d);
            });
        }

        return domains.map(function(s) { return s.trim(); }).join(', ').trim();
    }

    // ==================== IP EXTRACTION ====================

    /**
     * Extract IPv4 addresses from text
     * Supports normal and defanged IPv4
     */
    function extractIPv4(text, defangResult) {
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
                var ip = RefineCTI.fang(match);
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
                return RefineCTI.defang(ip);
            });
        }

        return ips.map(function(s) { return s.trim(); }).join(', ').trim();
    }

    /**
     * Defang IPv6 address - replace : with [:]
     */
    function defangIPv6(ipv6) {
        if (!ipv6 || typeof ipv6 !== 'string') {
            return ipv6;
        }
        return ipv6.replace(/:/g, '[:]');
    }

    /**
     * Fang IPv6 address - restore [:] to :
     */
    function fangIPv6(ipv6) {
        if (!ipv6 || typeof ipv6 !== 'string') {
            return ipv6;
        }
        return ipv6.replace(/\[:\]/g, ':');
    }

    /**
     * Extract IPv6 addresses from text
     * Supports full, compressed, and defanged IPv6 formats
     */
    function extractIPv6(text, defangResult) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var ips = [];

        // Pattern for normal IPv6 (full and compressed)
        // Matches various IPv6 formats including ::1, 2001:db8::1, fe80::, etc.
        var ipv6Patterns = [
            // Full IPv6 (8 groups of 4 hex digits)
            /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g,
            // Compressed IPv6 with ::
            /\b(?:[0-9a-fA-F]{1,4}:){1,7}:\b/g,
            /\b:(?::[0-9a-fA-F]{1,4}){1,7}\b/g,
            /\b(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}\b/g,
            /\b(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}\b/g,
            /\b(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}\b/g,
            /\b(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}\b/g,
            /\b(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}\b/g,
            /\b[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}\b/g,
            // Special cases
            /\b::(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}\b/g,
            /\b[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}\b/g,
            // Loopback and unspecified
            /\b::1\b/g,
            /\b::\b/g
        ];

        // Extract normal IPv6
        ipv6Patterns.forEach(function(pattern) {
            var matches = text.match(pattern);
            if (matches) {
                matches.forEach(function(match) {
                    // Basic validation: should have at least one colon
                    if (match.indexOf(':') !== -1 && ips.indexOf(match) === -1) {
                        ips.push(match);
                    }
                });
            }
        });

        // Pattern for defanged IPv6 (with [:] instead of :)
        var defangedPatterns = [
            /\b(?:[0-9a-fA-F]{1,4}\[:\]){7}[0-9a-fA-F]{1,4}\b/g,
            /\b(?:[0-9a-fA-F]{1,4}\[:\]){1,7}\[:\]\b/g,
            /\b\[:\](?:\[:\][0-9a-fA-F]{1,4}){1,7}\b/g,
            /\b(?:[0-9a-fA-F]{1,4}\[:\]){1,6}\[:\][0-9a-fA-F]{1,4}\b/g,
            // Simplified pattern for any defanged IPv6
            /\b[0-9a-fA-F]{0,4}(?:\[:\][0-9a-fA-F]{0,4}){2,7}\b/g
        ];

        // Extract defanged IPv6 and fang them
        defangedPatterns.forEach(function(pattern) {
            var matches = text.match(pattern);
            if (matches) {
                matches.forEach(function(match) {
                    var fanged = fangIPv6(match);
                    // Basic validation and avoid duplicates
                    if (fanged.indexOf(':') !== -1 && ips.indexOf(fanged) === -1) {
                        ips.push(fanged);
                    }
                });
            }
        });

        // Remove duplicates
        ips = ips.filter(function(item, pos, self) {
            return self.indexOf(item) === pos;
        });

        // Apply defang if requested
        if (defangResult) {
            ips = ips.map(function(ip) {
                return defangIPv6(ip);
            });
        }

        return ips.map(function(s) { return s.trim(); }).join(', ').trim();
    }

    /**
     * Extract all IP addresses (IPv4 and IPv6) from text
     */
    function extractIPs(text, defangResult) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var allIps = [];

        // Extract IPv4
        var ipv4Result = extractIPv4(text, false);
        if (ipv4Result) {
            var ipv4s = ipv4Result.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            allIps = allIps.concat(ipv4s);
        }

        // Extract IPv6
        var ipv6Result = extractIPv6(text, false);
        if (ipv6Result) {
            var ipv6s = ipv6Result.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            allIps = allIps.concat(ipv6s);
        }

        // Remove duplicates
        allIps = allIps.filter(function(item, pos, self) {
            return self.indexOf(item) === pos;
        });

        // Apply defang if requested
        if (defangResult) {
            allIps = allIps.map(function(ip) {
                // Check if IPv6 (contains :) or IPv4
                if (ip.indexOf(':') !== -1) {
                    return defangIPv6(ip);
                } else {
                    return RefineCTI.defang(ip);
                }
            });
        }

        return allIps.map(function(s) { return s.trim(); }).join(', ').trim();
    }

    // ==================== EMAIL EXTRACTION ====================

    /**
     * Extract email addresses from text
     * Supports normal and defanged emails
     */
    function extractEmails(text, defangResult) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var emails = [];

        // Pattern for normal emails
        var emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

        // Pattern for defanged emails
        var defangedPattern = /\b[A-Za-z0-9._%+-]+\[@\][A-Za-z0-9.[\]-]+\.?\[?\.\]?[A-Za-z]{2,}\b/g;

        // Extract normal emails
        var matches = text.match(emailPattern);
        if (matches) {
            emails = emails.concat(matches);
        }

        // Extract defanged emails
        matches = text.match(defangedPattern);
        if (matches) {
            matches.forEach(function(match) {
                var email = RefineCTI.fang(match);
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
                return RefineCTI.defang(e);
            });
        }

        return emails.map(function(s) { return s.trim(); }).join(', ').trim();
    }

    // ==================== EXTRACT ALL IOCs ====================

    /**
     * Extract all IOCs from text
     * Returns URLs, IPs (IPv4+IPv6), Emails, then Domains (filtered)
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

        // Extract IPs (IPv4 + IPv6)
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
                // Check if IPv6 (contains multiple :)
                var colonCount = (ioc.match(/:/g) || []).length;
                if (colonCount > 1) {
                    return defangIPv6(ioc);
                } else {
                    return RefineCTI.defang(ioc);
                }
            });
        }

        return allIocs.join(', ').trim();
    }

    // Public API
    return {
        extractURLs: extractURLs,
        extractDomains: extractDomains,
        extractIPv4: extractIPv4,
        extractIPv6: extractIPv6,
        extractIPs: extractIPs,
        extractEmails: extractEmails,
        extractAllIOCs: extractAllIOCs
    };
})();
