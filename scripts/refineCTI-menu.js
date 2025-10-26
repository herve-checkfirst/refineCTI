/*
 * refineCTI Menu Integration
 * Adds menu items to OpenRefine for CTI operations
 */

/* global RefineCTI */
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
                        id: 'refineCTI/extract-urls',
                        label: 'Extract URLs → New column',
                        click: function() {
                            performExtraction(column, 'extractURLs', false, 'urls');
                        }
                    },
                    {
                        id: 'refineCTI/extract-urls-defanged',
                        label: 'Extract URLs (defanged) → New column',
                        click: function() {
                            performExtraction(column, 'extractURLs', true, 'urls_defanged');
                        }
                    },
                    {},
                    {
                        id: 'refineCTI/extract-domains',
                        label: 'Extract Domains → New column',
                        click: function() {
                            performExtraction(column, 'extractDomains', false, 'domains');
                        }
                    },
                    {
                        id: 'refineCTI/extract-domains-defanged',
                        label: 'Extract Domains (defanged) → New column',
                        click: function() {
                            performExtraction(column, 'extractDomains', true, 'domains_defanged');
                        }
                    },
                    {},
                    {
                        id: 'refineCTI/extract-ips',
                        label: 'Extract IP Addresses → New column',
                        click: function() {
                            performExtraction(column, 'extractIPs', false, 'ips');
                        }
                    },
                    {
                        id: 'refineCTI/extract-ips-defanged',
                        label: 'Extract IP Addresses (defanged) → New column',
                        click: function() {
                            performExtraction(column, 'extractIPs', true, 'ips_defanged');
                        }
                    },
                    {},
                    {
                        id: 'refineCTI/extract-emails',
                        label: 'Extract Emails → New column',
                        click: function() {
                            performExtraction(column, 'extractEmails', false, 'emails');
                        }
                    },
                    {
                        id: 'refineCTI/extract-emails-defanged',
                        label: 'Extract Emails (defanged) → New column',
                        click: function() {
                            performExtraction(column, 'extractEmails', true, 'emails_defanged');
                        }
                    },
                    {},
                    {
                        id: 'refineCTI/extract-all',
                        label: 'Extract All IOCs → New column',
                        click: function() {
                            performExtraction(column, 'extractAllIOCs', false, 'all_iocs');
                        }
                    },
                    {
                        id: 'refineCTI/extract-all-defanged',
                        label: 'Extract All IOCs (defanged) → New column',
                        click: function() {
                            performExtraction(column, 'extractAllIOCs', true, 'all_iocs_defanged');
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
            }
        ]);
    });

    // Perform IOC extraction and create new column
    function performExtraction(column, functionName, defangResult, newColumnName) {
        var baseColumnName = column.name;
        var columnIndex = Refine.columnNameToColumnIndex(baseColumnName);

        // Access data directly from theProject
        var rows = theProject.rowModel.rows;
        if (!rows || rows.length === 0) {
            alert('No data available in the project');
            return;
        }

        // Process each row to extract IOCs and build value map
        var valueMap = {};
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.cells && row.cells[columnIndex]) {
                var cell = row.cells[columnIndex];
                if (cell && cell.v) {
                    var originalValue = String(cell.v);
                    if (!valueMap[originalValue]) {
                        var extracted = RefineCTI[functionName](originalValue, defangResult);
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
        var columnIndex = Refine.columnNameToColumnIndex(column.name);

        // Access data directly from theProject
        var rows = theProject.rowModel.rows;
        if (!rows || rows.length === 0) {
            alert('No data available in the project');
            return;
        }

        // Build a mapping of original values to transformed values
        var transformMap = {};
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.cells && row.cells[columnIndex]) {
                var cell = row.cells[columnIndex];
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
