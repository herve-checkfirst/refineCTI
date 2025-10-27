/*
 * refineCTI Social Media Module
 * Functions for extracting social media identifiers and handles
 * Supports: Telegram, Bluesky, Generic Handles
 */

/* exported RefineCTISocial */
var RefineCTISocial = (function() {
    'use strict';

    // ==================== TELEGRAM EXTRACTION ====================

    /**
     * Extract Telegram post URLs
     * Format: https://t.me/username/123456
     * Captures channel/group username and post ID
     */
    function extractTelegramPosts(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var posts = [];

        // Pattern for Telegram post URLs: https://t.me/username/postid
        // Post ID is a number (can be 1 to millions)
        var pattern = /https?:\/\/t\.me\/([a-zA-Z0-9_]+)\/(\d+)/g;

        var matches = text.match(pattern);
        if (matches) {
            matches.forEach(function(match) {
                if (posts.indexOf(match) === -1) {
                    posts.push(match);
                }
            });
        }

        return posts.join(', ');
    }

    /**
     * Extract Telegram usernames/channels
     * Format: https://t.me/username
     * Returns only the username, without post ID
     */
    function extractTelegramUsernames(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var usernames = [];

        // Pattern for Telegram URLs with or without post ID
        var patternWithPost = /https?:\/\/t\.me\/([a-zA-Z0-9_]+)\/\d+/g;
        var patternWithoutPost = /https?:\/\/t\.me\/([a-zA-Z0-9_]+)(?:\/|$|\s)/g;

        // Extract usernames from URLs with post IDs
        var matchesWithPost = text.match(patternWithPost);
        if (matchesWithPost) {
            matchesWithPost.forEach(function(match) {
                var username = match.match(/t\.me\/([a-zA-Z0-9_]+)/)[1];
                if (usernames.indexOf(username) === -1) {
                    usernames.push(username);
                }
            });
        }

        // Extract usernames from URLs without post IDs
        var matchesWithoutPost = text.match(patternWithoutPost);
        if (matchesWithoutPost) {
            matchesWithoutPost.forEach(function(match) {
                var username = match.match(/t\.me\/([a-zA-Z0-9_]+)/)[1];
                if (usernames.indexOf(username) === -1) {
                    usernames.push(username);
                }
            });
        }

        return usernames.join(', ');
    }

    // ==================== BLUESKY EXTRACTION ====================

    /**
     * Extract Bluesky handles
     * Supports:
     * - Standard: @user.bsky.social
     * - Custom domain: @user.domain.tld
     * - Mastodon bridge: @victory.imastodon.net.ap.brid.gy
     *
     * Bluesky handles can have:
     * - Standard .bsky.social suffix
     * - Custom domains (any TLD)
     * - Bridge handles ending with .brid.gy
     */
    function extractBlueskyHandles(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var handles = [];

        // Pattern for Bluesky handles
        // Matches @username.domain.tld with various formats
        // Including bridges like @user.domain.ap.brid.gy
        var patterns = [
            // Standard Bluesky: @user.bsky.social
            /@([a-zA-Z0-9_-]+\.bsky\.social)/g,
            // Custom domain: @user.domain.tld (at least 2 parts after @)
            /@([a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z]{2,})/g,
            // Bridge handles: @user.domain.ap.brid.gy or similar
            /@([a-zA-Z0-9_.-]+\.brid\.gy)/g
        ];

        patterns.forEach(function(pattern) {
            var matches = text.match(pattern);
            if (matches) {
                matches.forEach(function(match) {
                    // Remove the @ prefix for storage
                    var handle = match.substring(1);
                    // Avoid duplicates
                    if (handles.indexOf(handle) === -1) {
                        handles.push(handle);
                    }
                });
            }
        });

        return handles.join(', ');
    }

    // ==================== GENERIC HANDLES EXTRACTION ====================

    /**
     * Extract all social media handles starting with @
     * Generic pattern that captures @username format
     *
     * Matches:
     * - Twitter/X: @username
     * - Instagram: @username
     * - Bluesky: @user.bsky.social
     * - Mastodon: @user@instance.social
     * - Any other @handle format
     */
    function extractAllHandles(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var handles = [];

        // Pattern for handles starting with @
        // Captures username (alphanumeric, underscore, hyphen, dots)
        // Can include domains for Bluesky/Mastodon
        var patterns = [
            // Complex handles with domains: @user.domain.tld or @user@domain.tld
            /@([a-zA-Z0-9_.-]+(?:@|\.)[a-zA-Z0-9_.-]+\.[a-zA-Z]{2,})/g,
            // Simple handles: @username
            /@([a-zA-Z0-9_-]{1,})/g
        ];

        patterns.forEach(function(pattern) {
            var matches = text.match(pattern);
            if (matches) {
                matches.forEach(function(match) {
                    // Keep the @ prefix for handles
                    var handle = match;

                    // Basic validation: must have at least 1 char after @
                    if (handle.length > 1) {
                        // Avoid duplicates
                        if (handles.indexOf(handle) === -1) {
                            handles.push(handle);
                        }
                    }
                });
            }
        });

        // Remove duplicates (in case complex and simple patterns overlap)
        handles = handles.filter(function(item, pos, self) {
            return self.indexOf(item) === pos;
        });

        return handles.join(', ');
    }

    // ==================== EXTRACT ALL SOCIAL MEDIA ====================

    /**
     * Extract all social media identifiers
     * Returns Telegram posts, Telegram usernames, Bluesky handles, and all handles
     */
    function extractAllSocial(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        var allSocial = [];

        // Extract Telegram posts
        var telegramPosts = extractTelegramPosts(text);
        if (telegramPosts) {
            var posts = telegramPosts.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            allSocial = allSocial.concat(posts);
        }

        // Extract Telegram usernames (avoid duplicates from posts)
        var telegramUsers = extractTelegramUsernames(text);
        if (telegramUsers) {
            var users = telegramUsers.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            // Add username URLs that aren't already captured in posts
            users.forEach(function(username) {
                var usernameUrl = 'https://t.me/' + username;
                var isDuplicate = false;
                for (var i = 0; i < allSocial.length; i++) {
                    if (allSocial[i].indexOf(usernameUrl) === 0) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    allSocial.push(usernameUrl);
                }
            });
        }

        // Extract Bluesky handles
        var bluesky = extractBlueskyHandles(text);
        if (bluesky) {
            var bskyHandles = bluesky.split(', ').map(function(s) { return '@' + s.trim(); }).filter(function(s) { return s; });
            allSocial = allSocial.concat(bskyHandles);
        }

        // Extract all other handles (filter out already captured ones)
        var allHandles = extractAllHandles(text);
        if (allHandles) {
            var handles = allHandles.split(', ').map(function(s) { return s.trim(); }).filter(function(s) { return s; });
            handles.forEach(function(handle) {
                // Check if not already in the list
                var found = false;
                for (var j = 0; j < allSocial.length; j++) {
                    if (allSocial[j].indexOf(handle) !== -1 || handle.indexOf(allSocial[j]) !== -1) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    allSocial.push(handle);
                }
            });
        }

        // Remove duplicates
        allSocial = allSocial.filter(function(item, pos, self) {
            return self.indexOf(item) === pos;
        });

        return allSocial.join(', ');
    }

    // Public API
    return {
        extractTelegramPosts: extractTelegramPosts,
        extractTelegramUsernames: extractTelegramUsernames,
        extractBlueskyHandles: extractBlueskyHandles,
        extractAllHandles: extractAllHandles,
        extractAllSocial: extractAllSocial
    };
})();
