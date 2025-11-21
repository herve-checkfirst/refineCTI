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

        // Access data directly from theProject
        var rows = theProject.rowModel.rows;
        if (!rows || rows.length === 0) {
            alert('No data available in the project');
            return;
        }

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

        // Find the cellIndex for the column
        var cellIndex = null;
        for (var j = 0; j < theProject.columnModel.columns.length; j++) {
            if (theProject.columnModel.columns[j].name === baseColumnName) {
                cellIndex = theProject.columnModel.columns[j].cellIndex;
                break;
            }
        }

        if (cellIndex === null) {
            alert('Column not found: ' + baseColumnName);
            return;
        }

        // Process each row to extract IOCs and build value map
        var valueMap = {};
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.cells && row.cells[cellIndex]) {
                var cell = row.cells[cellIndex];
                if (cell && cell.v) {
                    var originalValue = String(cell.v);
                    if (!valueMap[originalValue]) {
                        var extracted;
                        // Crypto, Social, and Hash functions don't use defangResult parameter
                        if (moduleName === 'RefineCTICrypto' || moduleName === 'RefineCTISocial' || moduleName === 'RefineCTIHash') {
                            extracted = module[functionName](originalValue);
                        } else {
                            extracted = module[functionName](originalValue, defangResult);
                        }
                        valueMap[originalValue] = extracted || '';
                    }
                }
            }
        }

        // Create column and populate using mass edit
        createColumnWithMassEdit(baseColumnName, columnIndex, newColumnName, valueMap);
    }

    // Create column and populate it with extracted values using a single batch operation
    function createColumnWithMassEdit(baseColumnName, columnIndex, newColumnName, valueMap) {
        // Build operations array with all transformations
        var operations = [];

        // Step 1: Create the new column based on the original column
        operations.push({
            'op': 'core/column-addition',
            'engineConfig': {
                'facets': [],
                'mode': 'row-based'
            },
            'newColumnName': newColumnName,
            'columnInsertIndex': columnIndex + 1,
            'baseColumnName': baseColumnName,
            'expression': 'grel:value',
            'onError': 'set-to-blank'
        });

        // Step 2: Mass edit to replace with extracted values
        var edits = [];
        for (var originalValue in valueMap) {
            if (Object.prototype.hasOwnProperty.call(valueMap, originalValue)) {
                edits.push({
                    from: [originalValue],
                    to: valueMap[originalValue]
                });
            }
        }

        // Only add mass-edit if there are edits to perform
        if (edits.length > 0) {
            operations.push({
                'op': 'core/mass-edit',
                'engineConfig': {
                    'facets': [],
                    'mode': 'row-based'
                },
                'columnName': newColumnName,
                'expression': 'value',
                'edits': edits
            });
        }

        // Apply all operations in one batch
        Refine.postCoreProcess(
            'apply-operations',
            {},
            { operations: JSON.stringify(operations) },
            { modelsChanged: true },
            {
                onDone: function(o) {
                    if (o.code === 'ok' || o.code === 'pending') {
                        Refine.update({ modelsChanged: true });
                    } else {
                        alert('Failed to create and populate column. Error: ' + (o.message || 'Unknown error'));
                    }
                },
                onError: function(e) {
                    alert('Error creating column: ' + (e.message || 'Unknown error'));
                }
            }
        );
    }

    // Perform defang/fang transformation on existing column
    function performDefangFang(column, operation) {
        var baseColumnName = column.name;

        // Access data directly from theProject
        var rows = theProject.rowModel.rows;
        if (!rows || rows.length === 0) {
            alert('No data available in the project');
            return;
        }

        // Find the cellIndex for the column
        var cellIndex = null;
        for (var j = 0; j < theProject.columnModel.columns.length; j++) {
            if (theProject.columnModel.columns[j].name === baseColumnName) {
                cellIndex = theProject.columnModel.columns[j].cellIndex;
                break;
            }
        }

        if (cellIndex === null) {
            alert('Column not found: ' + baseColumnName);
            return;
        }

        // Build a mapping of original values to transformed values
        var transformMap = {};
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.cells && row.cells[cellIndex]) {
                var cell = row.cells[cellIndex];
                if (cell && cell.v) {
                    var value = String(cell.v);
                    if (!transformMap[value]) {
                        transformMap[value] = RefineCTI[operation](value);
                    }
                }
            }
        }

        // Apply transformation using mass edit
        var edits = [];
        for (var originalValue in transformMap) {
            if (Object.prototype.hasOwnProperty.call(transformMap, originalValue)) {
                edits.push({
                    from: [originalValue],
                    to: transformMap[originalValue]
                });
            }
        }

        if (edits.length === 0) {
            alert('No values to transform in column ' + column.name);
            return;
        }

        Refine.postCoreProcess(
            'mass-edit',
            {},
            {
                columnName: column.name,
                expression: 'value',
                edits: JSON.stringify(edits),
                engineConfig: JSON.stringify({
                    'facets': [],
                    'mode': 'row-based'
                })
            },
            { cellsChanged: true },
            {
                onDone: function(o) {
                    if (o.code === 'ok' || o.code === 'pending') {
                        Refine.update({ modelsChanged: true });
                    } else {
                        alert('Failed to transform values. Error: ' + (o.message || 'Unknown error'));
                    }
                },
                onError: function(e) {
                    alert('Error transforming column: ' + (e.message || 'Unknown error'));
                }
            }
        );
    }

})();
