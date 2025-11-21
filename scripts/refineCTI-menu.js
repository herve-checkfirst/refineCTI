/*
 * refineCTI Menu Integration
 * Adds menu items to OpenRefine for CTI operations
 */

/* global RefineCTI */
/* global RefineCTIIOC */
/* global RefineCTICrypto */
/* global RefineCTISocial */
/* global RefineCTIHash */
(function() {
    // Add menu items when column header is available
    DataTableColumnHeaderUI.extendMenu(function(column, columnHeaderUI, menu) {
        // Add separator before our menu items
        MenuSystem.appendTo(menu, '', [
            {},
            {
                id: 'refineCTI',
                label: 'CTI Operations',
                submenu: [
                    {
                        id: 'refineCTI/network',
                        label: 'Domains/IPs/Emails',
                        submenu: [
                            {
                                id: 'refineCTI/extract-urls',
                                label: 'Extract URLs → New column',
                                click: function() {
                                    performExtraction(column, 'extractURLs', false, 'urls', 'RefineCTIIOC');
                                }
                            },
                            {
                                id: 'refineCTI/extract-urls-defanged',
                                label: 'Extract URLs (defanged) → New column',
                                click: function() {
                                    performExtraction(column, 'extractURLs', true, 'urls_defanged', 'RefineCTIIOC');
                                }
                            },
                            {},
                            {
                                id: 'refineCTI/extract-domains',
                                label: 'Extract Domains → New column',
                                click: function() {
                                    performExtraction(column, 'extractDomains', false, 'domains', 'RefineCTIIOC');
                                }
                            },
                            {
                                id: 'refineCTI/extract-domains-defanged',
                                label: 'Extract Domains (defanged) → New column',
                                click: function() {
                                    performExtraction(column, 'extractDomains', true, 'domains_defanged', 'RefineCTIIOC');
                                }
                            },
                            {},
                            {
                                id: 'refineCTI/extract-ips',
                                label: 'Extract IP Addresses (IPv4 + IPv6) → New column',
                                click: function() {
                                    performExtraction(column, 'extractIPs', false, 'ips', 'RefineCTIIOC');
                                }
                            },
                            {
                                id: 'refineCTI/extract-ips-defanged',
                                label: 'Extract IP Addresses (defanged) → New column',
                                click: function() {
                                    performExtraction(column, 'extractIPs', true, 'ips_defanged', 'RefineCTIIOC');
                                }
                            },
                            {},
                            {
                                id: 'refineCTI/extract-emails',
                                label: 'Extract Emails → New column',
                                click: function() {
                                    performExtraction(column, 'extractEmails', false, 'emails', 'RefineCTIIOC');
                                }
                            },
                            {
                                id: 'refineCTI/extract-emails-defanged',
                                label: 'Extract Emails (defanged) → New column',
                                click: function() {
                                    performExtraction(column, 'extractEmails', true, 'emails_defanged', 'RefineCTIIOC');
                                }
                            },
                            {},
                            {
                                id: 'refineCTI/extract-all',
                                label: 'Extract All IOCs → New column',
                                click: function() {
                                    performExtraction(column, 'extractAllIOCs', false, 'all_iocs', 'RefineCTIIOC');
                                }
                            },
                            {
                                id: 'refineCTI/extract-all-defanged',
                                label: 'Extract All IOCs (defanged) → New column',
                                click: function() {
                                    performExtraction(column, 'extractAllIOCs', true, 'all_iocs_defanged', 'RefineCTIIOC');
                                }
                            },
                            {},
                            {
                                id: 'refineCTI/defang',
                                label: 'Defang (Militarize) IOCs',
                                click: function() {
                                    performDefangFang(column, 'defang');
                                }
                            },
                            {
                                id: 'refineCTI/fang',
                                label: 'Fang (Demilitarize) IOCs',
                                click: function() {
                                    performDefangFang(column, 'fang');
                                }
                            }
                        ]
                    },
                    {},
                    {
                        id: 'refineCTI/crypto',
                        label: 'Crypto Addresses',
                        submenu: [
                            {
                                id: 'refineCTI/extract-btc',
                                label: 'Extract Bitcoin (BTC) → New column',
                                click: function() {
                                    performExtraction(column, 'extractBTC', false, 'btc_addresses', 'RefineCTICrypto');
                                }
                            },
                            {
                                id: 'refineCTI/extract-eth',
                                label: 'Extract Ethereum (ETH) → New column',
                                click: function() {
                                    performExtraction(column, 'extractETH', false, 'eth_addresses', 'RefineCTICrypto');
                                }
                            },
                            {
                                id: 'refineCTI/extract-xmr',
                                label: 'Extract Monero (XMR) → New column',
                                click: function() {
                                    performExtraction(column, 'extractXMR', false, 'xmr_addresses', 'RefineCTICrypto');
                                }
                            },
                            {
                                id: 'refineCTI/extract-sol',
                                label: 'Extract Solana (SOL) → New column',
                                click: function() {
                                    performExtraction(column, 'extractSOL', false, 'sol_addresses', 'RefineCTICrypto');
                                }
                            },
                            {},
                            {
                                id: 'refineCTI/extract-all-crypto',
                                label: 'Extract All Crypto Addresses → New column',
                                click: function() {
                                    performExtraction(column, 'extractAllCrypto', false, 'crypto_addresses', 'RefineCTICrypto');
                                }
                            }
                        ]
                    },
                    {},
                    {
                        id: 'refineCTI/social',
                        label: 'Social Media',
                        submenu: [
                            {
                                id: 'refineCTI/social-telegram',
                                label: 'Telegram',
                                submenu: [
                                    {
                                        id: 'refineCTI/extract-telegram-posts',
                                        label: 'Extract Telegram Post URLs → New column',
                                        click: function() {
                                            performExtraction(column, 'extractTelegramPosts', false, 'telegram_posts', 'RefineCTISocial');
                                        }
                                    },
                                    {
                                        id: 'refineCTI/extract-telegram-usernames',
                                        label: 'Extract Telegram Usernames → New column',
                                        click: function() {
                                            performExtraction(column, 'extractTelegramUsernames', false, 'telegram_usernames', 'RefineCTISocial');
                                        }
                                    }
                                ]
                            },
                            {},
                            {
                                id: 'refineCTI/extract-bluesky',
                                label: 'Extract Bluesky Handles → New column',
                                click: function() {
                                    performExtraction(column, 'extractBlueskyHandles', false, 'bluesky_handles', 'RefineCTISocial');
                                }
                            },
                            {},
                            {
                                id: 'refineCTI/extract-handles',
                                label: 'Extract All Handles (@) → New column',
                                click: function() {
                                    performExtraction(column, 'extractAllHandles', false, 'social_handles', 'RefineCTISocial');
                                }
                            },
                            {},
                            {
                                id: 'refineCTI/extract-all-social',
                                label: 'Extract All Social Media → New column',
                                click: function() {
                                    performExtraction(column, 'extractAllSocial', false, 'all_social', 'RefineCTISocial');
                                }
                            }
                        ]
                    },
                    {},
                    {
                        id: 'refineCTI/hash',
                        label: 'Hash',
                        submenu: [
                            {
                                id: 'refineCTI/extract-md5',
                                label: 'Extract MD5 → New column',
                                click: function() {
                                    performExtraction(column, 'extractMD5', false, 'md5_hashes', 'RefineCTIHash');
                                }
                            },
                            {
                                id: 'refineCTI/extract-sha1',
                                label: 'Extract SHA1 → New column',
                                click: function() {
                                    performExtraction(column, 'extractSHA1', false, 'sha1_hashes', 'RefineCTIHash');
                                }
                            },
                            {
                                id: 'refineCTI/extract-sha256',
                                label: 'Extract SHA256 → New column',
                                click: function() {
                                    performExtraction(column, 'extractSHA256', false, 'sha256_hashes', 'RefineCTIHash');
                                }
                            },
                            {
                                id: 'refineCTI/extract-sha512',
                                label: 'Extract SHA512 → New column',
                                click: function() {
                                    performExtraction(column, 'extractSHA512', false, 'sha512_hashes', 'RefineCTIHash');
                                }
                            },
                            {
                                id: 'refineCTI/extract-murmurhash',
                                label: 'Extract MurmurHash → New column',
                                click: function() {
                                    performExtraction(column, 'extractMurmurHash', false, 'murmur_hashes', 'RefineCTIHash');
                                }
                            },
                            {},
                            {
                                id: 'refineCTI/extract-all-hashes',
                                label: 'Extract All Hashes → New column',
                                click: function() {
                                    performExtraction(column, 'extractAllHashes', false, 'all_hashes', 'RefineCTIHash');
                                }
                            }
                        ]
                    }
                ]
            }
        ]);
    });

    // Perform IOC extraction and create new column
    function performExtraction(column, functionName, defangResult, newColumnName, moduleName) {
        var baseColumnName = column.name;
        var columnIndex = Refine.columnNameToColumnIndex(baseColumnName);

        // Select the appropriate module
        var module;
        if (moduleName === 'RefineCTICrypto') {
            module = RefineCTICrypto;
        } else if (moduleName === 'RefineCTIIOC') {
            module = RefineCTIIOC;
        } else if (moduleName === 'RefineCTISocial') {
            module = RefineCTISocial;
        } else if (moduleName === 'RefineCTIHash') {
            module = RefineCTIHash;
        } else {
            module = RefineCTI;
        }

        // Store module and function in window scope for GREL expression
        window._refineCTI_currentModule = module;
        window._refineCTI_currentFunction = functionName;
        window._refineCTI_defangResult = defangResult;
        window._refineCTI_moduleName = moduleName;

        // Use a GREL-based column addition that processes ALL rows
        var grelExpression;
        if (moduleName === 'RefineCTICrypto' || moduleName === 'RefineCTISocial' || moduleName === 'RefineCTIHash') {
            // These modules don't use defangResult parameter
            grelExpression = 'grel:if(value != null, ' +
                '(function(v) { ' +
                'var result = window._refineCTI_currentModule[window._refineCTI_currentFunction](String(v)); ' +
                'return result || ""; ' +
                '})(value), "")';
        } else {
            // IOC module uses defangResult parameter
            grelExpression = 'grel:if(value != null, ' +
                '(function(v) { ' +
                'var result = window._refineCTI_currentModule[window._refineCTI_currentFunction](String(v), window._refineCTI_defangResult); ' +
                'return result || ""; ' +
                '})(value), "")';
        }

        // Create column using column-addition operation
        Refine.postCoreProcess(
            'add-column',
            {},
            {
                baseColumnName: baseColumnName,
                newColumnName: newColumnName,
                columnInsertIndex: columnIndex + 1,
                expression: grelExpression,
                onError: 'set-to-blank',
                engineConfig: JSON.stringify({
                    'facets': [],
                    'mode': 'row-based'
                })
            },
            { modelsChanged: true },
            {
                onDone: function(o) {
                    // Clean up temporary variables
                    delete window._refineCTI_currentModule;
                    delete window._refineCTI_currentFunction;
                    delete window._refineCTI_defangResult;
                    delete window._refineCTI_moduleName;

                    if (o.code === 'ok' || o.code === 'pending') {
                        Refine.update({ modelsChanged: true });
                    } else {
                        alert('Failed to create column. Error: ' + (o.message || 'Unknown error'));
                    }
                },
                onError: function(e) {
                    // Clean up temporary variables
                    delete window._refineCTI_currentModule;
                    delete window._refineCTI_currentFunction;
                    delete window._refineCTI_defangResult;
                    delete window._refineCTI_moduleName;

                    alert('Error creating column: ' + (e.message || 'Unknown error'));
                }
            }
        );
    }

    // Perform defang/fang transformation on existing column
    function performDefangFang(column, operation) {
        var baseColumnName = column.name;

        // Store operation in window scope for GREL expression
        window._refineCTI_operation = operation;

        // Use a GREL-based text transform that processes ALL rows
        var grelExpression = 'grel:if(value != null, ' +
            '(function(v) { ' +
            'var result = RefineCTI[window._refineCTI_operation](String(v)); ' +
            'return result || v; ' +
            '})(value), value)';

        // Apply transformation using text-transform operation
        Refine.postCoreProcess(
            'text-transform',
            {},
            {
                columnName: baseColumnName,
                expression: grelExpression,
                onError: 'keep-original',
                repeat: false,
                repeatCount: 0,
                engineConfig: JSON.stringify({
                    'facets': [],
                    'mode': 'row-based'
                })
            },
            { cellsChanged: true },
            {
                onDone: function(o) {
                    // Clean up temporary variable
                    delete window._refineCTI_operation;

                    if (o.code === 'ok' || o.code === 'pending') {
                        Refine.update({ modelsChanged: true });
                    } else {
                        alert('Failed to transform values. Error: ' + (o.message || 'Unknown error'));
                    }
                },
                onError: function(e) {
                    // Clean up temporary variable
                    delete window._refineCTI_operation;

                    alert('Error transforming column: ' + (e.message || 'Unknown error'));
                }
            }
        );
    }

})();
