/*
 * refineCTI Hash Module
 * Functions for extracting cryptographic hashes from text
 * Supports: MD5, SHA1, SHA256, SHA512, MurmurHash
 */

/* exported RefineCTIHash */
var RefineCTIHash = (function() {
    'use strict';

    // ==================== MD5 EXTRACTION ====================

    /**
     * Extract MD5 hashes
     * Format: 32 hexadecimal characters
     * Example: d41d8cd98f00b204e9800998ecf8427e
     */
    function extractMD5(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var hashes = [];

        // Pattern for MD5: 32 hex characters
        var pattern = /\b[a-fA-F0-9]{32}\b/g;

        var matches = text.match(pattern);
        if (matches) {
            matches.forEach(function(match) {
                // Avoid duplicates
                if (hashes.indexOf(match) === -1) {
                    hashes.push(match);
                }
            });
        }

        return hashes.join(', ');
    }

    // ==================== SHA1 EXTRACTION ====================

    /**
     * Extract SHA1 hashes
     * Format: 40 hexadecimal characters
     * Example: 356a192b7913b04c54574d18c28d46e6395428ab
     */
    function extractSHA1(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var hashes = [];

        // Pattern for SHA1: 40 hex characters
        var pattern = /\b[a-fA-F0-9]{40}\b/g;

        var matches = text.match(pattern);
        if (matches) {
            matches.forEach(function(match) {
                // Avoid duplicates
                if (hashes.indexOf(match) === -1) {
                    hashes.push(match);
                }
            });
        }

        return hashes.join(', ');
    }

    // ==================== SHA256 EXTRACTION ====================

    /**
     * Extract SHA256 hashes
     * Format: 64 hexadecimal characters
     * Example: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
     */
    function extractSHA256(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var hashes = [];

        // Pattern for SHA256: 64 hex characters
        var pattern = /\b[a-fA-F0-9]{64}\b/g;

        var matches = text.match(pattern);
        if (matches) {
            matches.forEach(function(match) {
                // Avoid duplicates
                if (hashes.indexOf(match) === -1) {
                    hashes.push(match);
                }
            });
        }

        return hashes.join(', ');
    }

    // ==================== SHA512 EXTRACTION ====================

    /**
     * Extract SHA512 hashes
     * Format: 128 hexadecimal characters
     * Example: cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e
     */
    function extractSHA512(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var hashes = [];

        // Pattern for SHA512: 128 hex characters
        var pattern = /\b[a-fA-F0-9]{128}\b/g;

        var matches = text.match(pattern);
        if (matches) {
            matches.forEach(function(match) {
                // Avoid duplicates
                if (hashes.indexOf(match) === -1) {
                    hashes.push(match);
                }
            });
        }

        return hashes.join(', ');
    }

    // ==================== MURMURHASH EXTRACTION ====================

    /**
     * Extract MurmurHash3 hashes
     * Format: 8 hexadecimal characters (32-bit version, most common)
     * Example: 12abc34d
     *
     * Note: MurmurHash can also be 16 or 32 hex chars for 64-bit and 128-bit versions
     * This function extracts the common 32-bit (8 hex chars) version
     */
    function extractMurmurHash(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var hashes = [];

        // Pattern for MurmurHash3 32-bit: 8 hex characters
        // More restrictive to avoid false positives
        // Often seen in formats like: murmur3:12abc34d or hash:12abc34d
        var patterns = [
            // With prefix (more reliable)
            /\b(?:murmur|mmh3|murmurhash)[:\s]+([a-fA-F0-9]{8})\b/gi,
            // Standalone 8 hex chars (less reliable, more false positives)
            /\b[a-fA-F0-9]{8}\b/g
        ];

        // Try with prefix first
        var matches = text.match(patterns[0]);
        if (matches) {
            matches.forEach(function(match) {
                var hash = match.replace(/.*[:\s]+/, '');
                if (hashes.indexOf(hash) === -1) {
                    hashes.push(hash);
                }
            });
        }

        // If no prefixed matches, try standalone (but be cautious)
        if (hashes.length === 0) {
            matches = text.match(patterns[1]);
            if (matches) {
                matches.forEach(function(match) {
                    // Additional validation: avoid common false positives
                    // Skip if it looks like a date (YYYYMMDD) or version number
                    if (!/^[12][0-9]{7}$/.test(match) && hashes.indexOf(match) === -1) {
                        hashes.push(match);
                    }
                });
            }
        }

        return hashes.join(', ');
    }

    // ==================== EXTRACT ALL HASHES ====================

    /**
     * Extract all hash types
     * Returns MD5, SHA1, SHA256, SHA512, and MurmurHash
     * Automatically categorizes by length to avoid duplicates
     */
    function extractAllHashes(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var allHashes = [];
        var seenHashes = {}; // Track hashes by length to avoid duplicates

        // Extract SHA512 first (128 chars) - most specific
        var sha512 = extractSHA512(text);
        if (sha512) {
            var sha512Hashes = sha512.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            sha512Hashes.forEach(function(hash) {
                if (!seenHashes[hash]) {
                    seenHashes[hash] = true;
                    allHashes.push(hash);
                }
            });
        }

        // Extract SHA256 (64 chars)
        var sha256 = extractSHA256(text);
        if (sha256) {
            var sha256Hashes = sha256.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            sha256Hashes.forEach(function(hash) {
                if (!seenHashes[hash]) {
                    seenHashes[hash] = true;
                    allHashes.push(hash);
                }
            });
        }

        // Extract SHA1 (40 chars)
        var sha1 = extractSHA1(text);
        if (sha1) {
            var sha1Hashes = sha1.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            sha1Hashes.forEach(function(hash) {
                if (!seenHashes[hash]) {
                    seenHashes[hash] = true;
                    allHashes.push(hash);
                }
            });
        }

        // Extract MD5 (32 chars)
        var md5 = extractMD5(text);
        if (md5) {
            var md5Hashes = md5.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            md5Hashes.forEach(function(hash) {
                if (!seenHashes[hash]) {
                    seenHashes[hash] = true;
                    allHashes.push(hash);
                }
            });
        }

        // Extract MurmurHash (8 chars) - last as most prone to false positives
        var murmur = extractMurmurHash(text);
        if (murmur) {
            var murmurHashes = murmur.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            murmurHashes.forEach(function(hash) {
                if (!seenHashes[hash]) {
                    seenHashes[hash] = true;
                    allHashes.push(hash);
                }
            });
        }

        return allHashes.join(', ');
    }

    // Public API
    return {
        extractMD5: extractMD5,
        extractSHA1: extractSHA1,
        extractSHA256: extractSHA256,
        extractSHA512: extractSHA512,
        extractMurmurHash: extractMurmurHash,
        extractAllHashes: extractAllHashes
    };
})();
