# refineCTI - Test Examples

Sample data and GREL expressions for testing the refineCTI extension.

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

### Test 1: Extract URLs (Normal)

**Column:** threat_data
**Expression:**
```grel
extractURLs(value, false)
```

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
**Expression:**
```grel
extractURLs(value, true)
```

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
**Expression:**
```grel
extractDomains(value, false)
```

**Expected Results:**
```
Row 1: evil-c2.com
Row 2: backup.badsite.org, secondary.malware.net
Row 3: evil.com, phishing-site.com
Row 5: malware.domain.com
Row 6: test.com, test.com, test.org
Row 7: c2.evil.com
Row 8: badsite.org
Row 10: evil.com, badsite.org, malware.net
```

### Test 4: Extract IP Addresses

**Column:** threat_data
**Expression:**
```grel
extractIPs(value, false)
```

**Expected Results:**
```
Row 4: 192.168.1.100, 10.0.0.5, 172.16.0.1
Row 6: 8.8.8.8
Row 7: 192.168.1.1
```

### Test 5: Extract IP Addresses (Defanged)

**Column:** threat_data
**Expression:**
```grel
extractIPs(value, true)
```

**Expected Results:**
```
Row 4: 192[.]168[.]1[.]100, 10[.]0[.]0[.]5, 172[.]16[.]0[.]1
Row 6: 8[.]8[.]8[.]8
Row 7: 192[.]168[.]1[.]1
```

### Test 6: Extract Emails

**Column:** threat_data
**Expression:**
```grel
extractEmails(value, false)
```

**Expected Results:**
```
Row 3: attacker@evil.com
Row 5: admin@malware.domain.com
Row 6: user@test.com
Row 10: admin@evil.com, support@badsite.org, info@malware.net
```

### Test 7: Extract Emails (Defanged)

**Column:** threat_data
**Expression:**
```grel
extractEmails(value, true)
```

**Expected Results:**
```
Row 3: attacker[@]evil[.]com
Row 5: admin[@]malware[.]domain[.]com
Row 6: user[@]test[.]com
Row 10: admin[@]evil[.]com, support[@]badsite[.]org, info[@]malware[.]net
```

### Test 8: Extract All IOCs

**Column:** threat_data
**Expression:**
```grel
extractAllIOCs(value, false)
```

**Expected Results:**
```
Row 1: http://evil-c2.com, evil-c2.com
Row 2: http://backup.badsite.org, https://secondary.malware.net, backup.badsite.org, secondary.malware.net
Row 3: http://phishing-site.com/login.php, phishing-site.com, evil.com, attacker@evil.com
Row 4: 192.168.1.100, 10.0.0.5, 172.16.0.1
Row 5: malware.domain.com, admin@malware.domain.com
Row 6: http://test.com, 8.8.8.8, test.com, test.org, user@test.com
Row 7: http://c2.evil.com, 192.168.1.1, c2.evil.com
Row 8: ftp://files.badsite.org, badsite.org
Row 9: (empty)
Row 10: evil.com, badsite.org, malware.net, admin@evil.com, support@badsite.org, info@malware.net
```

### Test 9: Defang IOCs

**Column:** threat_data
**Expression:**
```grel
defang(value)
```

**Expected Results:**
```
Row 1: Malware beaconing to hxxp://evil-c2[.]com every 60 seconds
Row 2: C2 servers: hxxp://backup[.]badsite[.]org and hxxps://secondary[.]malware[.]net
Row 3: Phishing email from attacker[@]evil[.]com linking to hxxp://phishing-site[.]com/login[.]php
Row 4: Suspicious connections to 192[.]168[.]1[.]100, 10[.]0[.]0[.]5 and 172[.]16[.]0[.]1
```

### Test 10: Fang Defanged IOCs

**Column:** threat_data (Row 2 or 7)
**Expression:**
```grel
fang(value)
```

**Expected Results:**
```
Row 2: C2 servers: http://backup.badsite.org and https://secondary.malware.net
Row 7: Defanged report: http://c2.evil.com contacted from 192.168.1.1
```

## Advanced Test Cases

### Test 11: Count IOCs

**Expression:**
```grel
extractAllIOCs(value, false).split(", ").length()
```

**Expected:** Number of unique IOCs in each row

### Test 12: Get First IOC Only

**Expression:**
```grel
extractAllIOCs(value, false).split(", ")[0]
```

**Expected:** First IOC from each row

### Test 13: Check if Contains URLs

**Expression:**
```grel
if(extractURLs(value, false) != "", "Contains URLs", "No URLs")
```

**Expected:** "Contains URLs" or "No URLs"

### Test 14: Extract and Uppercase Domains

**Expression:**
```grel
extractDomains(value, false).split(", ").join(", ").toUppercase()
```

**Expected:** Domain names in uppercase

### Test 15: Combine Multiple Columns

**Expression (assuming columns: col1, col2):**
```grel
extractAllIOCs(cells["col1"].value + " " + cells["col2"].value, false)
```

**Expected:** IOCs from both columns combined

## Validation Checklist

- [ ] All URLs extracted correctly (normal and defanged)
- [ ] All domains extracted correctly (normal and defanged)
- [ ] All IPs extracted correctly (normal and defanged)
- [ ] All emails extracted correctly (normal and defanged)
- [ ] Defang operation converts correctly
- [ ] Fang operation converts correctly
- [ ] No duplicates in results
- [ ] Empty rows return empty string
- [ ] Multiple IOCs return comma-separated string
- [ ] Single IOC returns plain string
- [ ] Menu items appear in column dropdown
- [ ] All menu operations work correctly

## Performance Test

For performance testing, create a dataset with:
- 10,000 rows
- Each row containing 5-10 IOCs
- Mix of normal and defanged formats

**Test extraction time:**
```grel
extractAllIOCs(value, false)
```

Expected performance: < 1 second per 1000 rows on modern hardware.

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

### Edge Case 4: False Positives
```
Input: Version 1.2.3.4 released
Expected IPs: 1.2.3.4 (note: may be false positive)
```

### Edge Case 5: Email-like Text
```
Input: user@localhost
Expected: user@localhost (may need filtering)
```

## Troubleshooting Tests

If tests fail:

1. **Check OpenRefine Console** (F12 in browser)
   - Look for JavaScript errors
   - Verify functions are registered

2. **Verify Extension Loaded**
   - Check OpenRefine startup logs
   - Look for "refineCTI" in loaded extensions

3. **Test GREL Directly**
   - Use expressions in "Custom text facet"
   - Check if functions are available

4. **Restart OpenRefine**
   - Extensions are loaded at startup
   - Changes require restart

---

**All tests passing? Great! The extension is working correctly! ✅**
