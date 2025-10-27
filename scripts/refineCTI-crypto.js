/*
 * refineCTI Crypto Module
 * Functions for extracting cryptocurrency addresses from text
 */

/* exported RefineCTICrypto */
var RefineCTICrypto = (function() {
    'use strict';

    /**
     * Extract Bitcoin addresses
     * Supports Legacy (P2PKH), SegWit (P2SH), Native SegWit (Bech32), and Taproot formats
     */
    function extractBTC(text) {
        if (!text || typeof text !== 'string') {return '';}

        var addresses = [];
        var patterns = [
            // Legacy P2PKH (starts with 1)
            /\b[1][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g,
            // P2SH SegWit (starts with 3)
            /\b[3][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g,
            // Native SegWit Bech32 (starts with bc1q)
            /\bbc1q[ac-hj-np-z02-9]{38,58}\b/gi,
            // Taproot (starts with bc1p)
            /\bbc1p[ac-hj-np-z02-9]{38,58}\b/gi
        ];

        for (var i = 0; i < patterns.length; i++) {
            var matches = text.match(patterns[i]);
            if (matches) {
                for (var j = 0; j < matches.length; j++) {
                    var addr = matches[j];
                    // Avoid duplicates
                    if (addresses.indexOf(addr) === -1) {
                        addresses.push(addr);
                    }
                }
            }
        }

        return addresses.join(', ');
    }

    /**
     * Extract Ethereum addresses
     * Standard 0x + 40 hex characters
     */
    function extractETH(text) {
        if (!text || typeof text !== 'string') {return '';}

        var addresses = [];
        // Ethereum address: 0x followed by 40 hexadecimal characters
        var pattern = /\b0x[a-fA-F0-9]{40}\b/g;
        var matches = text.match(pattern);

        if (matches) {
            for (var i = 0; i < matches.length; i++) {
                var addr = matches[i];
                // Avoid duplicates
                if (addresses.indexOf(addr) === -1) {
                    addresses.push(addr);
                }
            }
        }

        return addresses.join(', ');
    }

    /**
     * Extract Monero addresses
     * Standard (95 chars starting with 4), Integrated (106 chars starting with 4),
     * SubAddress (95 chars starting with 8)
     */
    function extractXMR(text) {
        if (!text || typeof text !== 'string') {return '';}

        var addresses = [];
        var patterns = [
            // Standard address (starts with 4, 95 chars)
            /\b4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}\b/g,
            // Integrated address (starts with 4, 106 chars)
            /\b4[0-9AB][1-9A-HJ-NP-Za-km-z]{104}\b/g,
            // SubAddress (starts with 8, 95 chars)
            /\b8[0-9AB][1-9A-HJ-NP-Za-km-z]{93}\b/g
        ];

        for (var i = 0; i < patterns.length; i++) {
            var matches = text.match(patterns[i]);
            if (matches) {
                for (var j = 0; j < matches.length; j++) {
                    var addr = matches[j];
                    // Avoid duplicates
                    if (addresses.indexOf(addr) === -1) {
                        addresses.push(addr);
                    }
                }
            }
        }

        return addresses.join(', ');
    }

    /**
     * Extract Solana addresses
     * Base58 encoded, 32-44 characters
     */
    function extractSOL(text) {
        if (!text || typeof text !== 'string') {return '';}

        var addresses = [];
        // Solana address: Base58 string, typically 32-44 characters
        // Avoid common false positives by requiring reasonable length
        var pattern = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/g;
        var matches = text.match(pattern);

        if (matches) {
            for (var i = 0; i < matches.length; i++) {
                var addr = matches[i];
                // Additional validation: should not be all numbers or match BTC patterns
                if (!/^[0-9]+$/.test(addr) &&
                    !/^[13]/.test(addr) &&
                    !/^bc1/i.test(addr) &&
                    addresses.indexOf(addr) === -1) {
                    addresses.push(addr);
                }
            }
        }

        return addresses.join(', ');
    }

    /**
     * Extract all cryptocurrency addresses
     * Returns BTC, ETH, XMR, and SOL addresses
     */
    function extractAllCrypto(text) {
        if (!text || typeof text !== 'string') {return '';}

        var allAddresses = [];

        // Extract each type
        var btc = extractBTC(text);
        var eth = extractETH(text);
        var xmr = extractXMR(text);
        var sol = extractSOL(text);

        // Combine all addresses
        if (btc) {
            var btcAddrs = btc.split(', ');
            for (var i = 0; i < btcAddrs.length; i++) {
                if (btcAddrs[i] && allAddresses.indexOf(btcAddrs[i]) === -1) {
                    allAddresses.push(btcAddrs[i]);
                }
            }
        }

        if (eth) {
            var ethAddrs = eth.split(', ');
            for (var j = 0; j < ethAddrs.length; j++) {
                if (ethAddrs[j] && allAddresses.indexOf(ethAddrs[j]) === -1) {
                    allAddresses.push(ethAddrs[j]);
                }
            }
        }

        if (xmr) {
            var xmrAddrs = xmr.split(', ');
            for (var k = 0; k < xmrAddrs.length; k++) {
                if (xmrAddrs[k] && allAddresses.indexOf(xmrAddrs[k]) === -1) {
                    allAddresses.push(xmrAddrs[k]);
                }
            }
        }

        if (sol) {
            var solAddrs = sol.split(', ');
            for (var l = 0; l < solAddrs.length; l++) {
                if (solAddrs[l] && allAddresses.indexOf(solAddrs[l]) === -1) {
                    allAddresses.push(solAddrs[l]);
                }
            }
        }

        return allAddresses.join(', ');
    }

    // Public API
    return {
        extractBTC: extractBTC,
        extractETH: extractETH,
        extractXMR: extractXMR,
        extractSOL: extractSOL,
        extractAllCrypto: extractAllCrypto
    };
})();
