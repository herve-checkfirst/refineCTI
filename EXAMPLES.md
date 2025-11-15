# refineCTI - Test Examples

Sample data and test procedures for the refineCTI extension.

**Important**: refineCTI is a client-side extension that operates through the menu interface only. It does NOT provide GREL functions. All examples below use the column menu interface.

## Test Dataset

Create a new project in OpenRefine with this CSV data:

```csv
id,threat_data
1,"Malware beaconing to http://evil-c2.com every 60 seconds"
2,"C2 servers: hxxp://backup[.]badsite[.]org and hxxps://secondary[.]malware[.]net"
3,"Phishing email from attacker@evil.com linking to http://phishing-site.com/login.php"
4,"Suspicious connections to 192.168.1.100, 10[.]0[.]0[.]5 and 172.16.0.1"
5,"Contact admin[@]malware[.]domain[.]com for more info"
6,"Mixed IOCs: http://test.com, 8.8.8.8, user@test.com, test[.]org"
7,"Defanged report: hxxp://c2[.]evil[.]com contacted from 192[.]168[.]1[.]1"
8,"FTP server at ftp://files.badsite.org contains malware"
9,"Normal text without any IOCs"
10,"Multiple emails: admin@evil.com, support@badsite.org, info@malware.net"
```

## Test Cases

All tests are performed using the column menu interface: Click column dropdown → CTI Operations → Select operation

### Test 1: Extract URLs (Normal)

**Column:** threat_data  
**Menu Path:** CTI Operations → Domains/IPs/Emails → Extract URLs → Create new column

**Expected Results:**
```
Row 1: http://evil-c2.com
Row 2: http://backup.badsite.org, https://secondary.malware.net
Row 3: http://phishing-site.com/login.php
Row 4: (empty)
Row 5: (empty)
Row 6: http://test.com
Row 7: http://c2.evil.com
Row 8: ftp://files.badsite.org
Row 9: (empty)
Row 10: (empty)
```

### Test 2: Extract URLs (Defanged)

**Column:** threat_data  
**Menu Path:** CTI Operations → Domains/IPs/Emails → Extract URLs (defanged) → Create new column

**Expected Results:**
```
Row 1: hxxp://evil-c2[.]com
Row 2: hxxp://backup[.]badsite[.]org, hxxps://secondary[.]malware[.]net
Row 3: hxxp://phishing-site[.]com/login[.]php
Row 7: hxxp://c2[.]evil[.]com
Row 8: fxp://files[.]badsite[.]org
```

### Test 3: Extract Domains

**Column:** threat_data  
**Menu Path:** CTI Operations → Domains/IPs/Emails → Extract Domains → Create new column

**Expected Results:**
```
Row 1: evil-c2.com
Row 2: backup.badsite.org, secondary.malware.net
Row 3: evil.com, phishing-site.com
Row 5: malware.domain.com
Row 6: test.com, test.org
Row 7: c2.evil.com
Row 8: badsite.org
Row 10: evil.com, badsite.org, malware.net
```

### Test 4: Extract IP Addresses

**Column:** threat_data  
**Menu Path:** CTI Operations → Domains/IPs/Emails → Extract IP Addresses → Create new column

**Expected Results:**
```
Row 4: 192.168.1.100, 10.0.0.5, 172.16.0.1
Row 6: 8.8.8.8
Row 7: 192.168.1.1
```

### Test 5: Extract IP Addresses (Defanged)

**Column:** threat_data  
**Menu Path:** CTI Operations → Domains/IPs/Emails → Extract IP Addresses (defanged) → Create new column

**Expected Results:**
```
Row 4: 192[.]168[.]1[.]100, 10[.]0[.]0[.]5, 172[.]16[.]0[.]1
Row 6: 8[.]8[.]8[.]8
Row 7: 192[.]168[.]1[.]1
```

### Test 6: Extract Emails

**Column:** threat_data  
**Menu Path:** CTI Operations → Domains/IPs/Emails → Extract Emails → Create new column

**Expected Results:**
```
Row 3: attacker@evil.com
Row 5: admin@malware.domain.com
Row 6: user@test.com
Row 10: admin@evil.com, support@badsite.org, info@malware.net
```

### Test 7: Extract Emails (Defanged)

**Column:** threat_data  
**Menu Path:** CTI Operations → Domains/IPs/Emails → Extract Emails (defanged) → Create new column

**Expected Results:**
```
Row 3: attacker[@]evil[.]com
Row 5: admin[@]malware[.]domain[.]com
Row 6: user[@]test[.]com
Row 10: admin[@]evil[.]com, support[@]badsite[.]org, info[@]malware[.]net
```

### Test 8: Extract All IOCs

**Column:** threat_data  
**Menu Path:** CTI Operations → Domains/IPs/Emails → Extract All IOCs → Create new column

**Expected Results:**
```
Row 1: http://evil-c2.com, evil-c2.com
Row 2: http://backup.badsite.org, https://secondary.malware.net, backup.badsite.org, secondary.malware.net
Row 3: http://phishing-site.com/login.php, attacker@evil.com, phishing-site.com, evil.com
Row 4: 192.168.1.100, 10.0.0.5, 172.16.0.1
Row 5: admin@malware.domain.com, malware.domain.com
Row 6: http://test.com, 8.8.8.8, user@test.com, test.com, test.org
Row 7: http://c2.evil.com, 192.168.1.1, c2.evil.com
Row 8: ftp://files.badsite.org, badsite.org
Row 9: (empty)
Row 10: admin@evil.com, support@badsite.org, info@malware.net, evil.com, badsite.org, malware.net
```

### Test 9: Defang IOCs

**Column:** threat_data  
**Menu Path:** CTI Operations → Domains/IPs/Emails → Defang (Militarize) IOCs → Transform cells

**Expected Results:**
```
Row 1: Malware beaconing to hxxp://evil-c2[.]com every 60 seconds
Row 2: C2 servers: hxxp://backup[.]badsite[.]org and hxxps://secondary[.]malware[.]net
Row 3: Phishing email from attacker[@]evil[.]com linking to hxxp://phishing-site[.]com/login[.]php
Row 4: Suspicious connections to 192[.]168[.]1[.]100, 10[.]0[.]0[.]5 and 172[.]16[.]0[.]1
```

### Test 10: Fang Defanged IOCs

**Column:** threat_data (Row 2 or 7)  
**Menu Path:** CTI Operations → Domains/IPs/Emails → Fang (Demilitarize) IOCs → Transform cells

**Expected Results:**
```
Row 2: C2 servers: http://backup.badsite.org and https://secondary.malware.net
Row 7: Defanged report: http://c2.evil.com contacted from 192.168.1.1
```

## Advanced Usage

### Split Multi-valued Results

After extraction, you can split comma-separated results into multiple rows:

1. Select the column with extraction results
2. Edit cells → Split multi-valued cells
3. Separator: `, ` (comma and space)
4. Click OK

### Deduplicate Results

To remove duplicate IOCs across rows:

1. Select the column with IOCs
2. Facet → Customized facets → Duplicates facet
3. Review duplicates
4. Or use: Edit cells → Blank down

### Count IOCs

To count how many IOCs are in each row:

1. Create a new column based on the extraction column
2. Edit column → Add column based on this column
3. New column name: "IOC_count"
4. Since we cannot use GREL, split the cells first, then use OpenRefine's count features

## Cryptocurrency Tests

### Test 11: Extract Bitcoin Addresses

**Test Data:**
```csv
id,ransom_note
1,"Send 1 BTC to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa for decryption"
2,"Payment: bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq or 3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy"
```

**Menu Path:** CTI Operations → Crypto Addresses → Extract Bitcoin (BTC) → Create new column

**Expected:**
```
Row 1: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
Row 2: bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq, 3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy
```

## Hash Tests

### Test 12: Extract Hashes

**Test Data:**
```csv
id,malware_analysis
1,"MD5: d41d8cd98f00b204e9800998ecf8427e SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
```

**Menu Path:** CTI Operations → Hash → Extract All Hashes → Create new column

**Expected:**
```
Row 1: d41d8cd98f00b204e9800998ecf8427e, e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

## Validation Checklist

- [ ] All URLs extracted correctly (normal and defanged)
- [ ] All domains extracted correctly (normal and defanged)
- [ ] All IPs extracted correctly (normal and defanged)
- [ ] All emails extracted correctly (normal and defanged)
- [ ] Defang operation converts correctly
- [ ] Fang operation converts correctly
- [ ] No duplicates in single-row results
- [ ] Empty rows return empty string (not error)
- [ ] Multiple IOCs return comma-separated string
- [ ] Menu items appear in column dropdown under "CTI Operations"
- [ ] All menu operations complete without errors

## Performance Test

For performance testing, create a dataset with:
- 10,000 rows
- Each row containing 5-10 IOCs
- Mix of normal and defanged formats

Expected performance: 
- 1,000 rows: < 5 seconds
- 10,000 rows: < 30 seconds

## Edge Cases

### Edge Case 1: Nested Brackets
```
Input: hxxp://evil[.]com[.]au
Expected: http://evil.com.au
```

### Edge Case 2: Multiple Protocols
```
Input: http://site.com ftp://site.com
Expected: http://site.com, ftp://site.com
```

### Edge Case 3: IP in URL
```
Input: http://192.168.1.1/malware.exe
Expected URLs: http://192.168.1.1/malware.exe
Expected IPs: 192.168.1.1
```

### Edge Case 4: False Positives (Version Numbers)
```
Input: Version 1.2.3.4 released
Note: May extract 1.2.3.4 as IP (known limitation)
```

## Troubleshooting Tests

If tests fail:

1. **Check OpenRefine Console** (F12 in browser)
   - Look for JavaScript errors
   - Verify extension scripts loaded

2. **Verify Extension Loaded**
   - Check OpenRefine startup logs
   - Look for "refineCTI" in loaded extensions list

3. **Check Menu Availability**
   - Open any column dropdown
   - Verify "CTI Operations" appears

4. **Restart OpenRefine**
   - Extensions are loaded at startup
   - Changes require restart

## Success Criteria

All tests passing indicates the extension is working correctly. The menu should be responsive and operations should complete without errors.
