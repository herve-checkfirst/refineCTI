# Quick Test - refineCTI Extension

## 5-Minute Functional Test

### Step 1: Start OpenRefine

```bash
make start
# or
docker-compose up -d
```

Access: http://127.0.0.1:8081

### Step 2: Create Test Project

1. Click "Create Project" → "Clipboard"
2. Paste this data:

```
Malware C2: hxxp://evil[.]com and backup at 192[.]168[.]1[.]100
Phishing from attacker[@]badsite[.]org
Normal text without IOCs
```

3. Click "Next" → "Create Project"

### Step 3: Test Extraction (Via Menu)

**Important**: refineCTI operates through the menu interface only. It does NOT provide GREL functions.

1. Click column dropdown (arrow next to column name)
2. Navigate to "CTI Operations" → "Domains/IPs/Emails" → "Extract All IOCs"
3. Select "Create new column"
4. Enter column name: "extracted_iocs"
5. Click OK

**Expected Result:**
- Row 1: `http://evil.com, 192.168.1.100, evil.com`
- Row 2: `attacker@badsite.org, badsite.org`
- Row 3: (empty)

### Step 4: Test Defang

1. Select the original column dropdown
2. Navigate to "CTI Operations" → "Domains/IPs/Emails" → "Defang (Militarize) IOCs"
3. This will transform cells in place

**Expected Result:**
Row 1 should now show: `Malware C2: hxxp://evil[.]com and backup at 192[.]168[.]1[.]100`

### Step 5: Test Individual Extractors

Try each operation from the menu:

**Domains/IPs/Emails submenu:**
- Extract URLs
- Extract Domains
- Extract IP Addresses
- Extract Emails

All should work without errors and create appropriate results.

### Step 6: Test Crypto and Hash Extraction

Add this test data to a new column:

```
Bitcoin: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
Hash: d41d8cd98f00b204e9800998ecf8427e
```

Test:
- CTI Operations → Crypto Addresses → Extract Bitcoin (BTC)
- CTI Operations → Hash → Extract MD5

## Success Criteria

- [ ] Menu "CTI Operations" appears in column dropdown
- [ ] All submenu items are accessible (Domains/IPs/Emails, Crypto Addresses, Social Media, Hash)
- [ ] Extract functions return comma-separated IOCs
- [ ] Defang converts: http → hxxp, . → [.], @ → [@]
- [ ] Fang converts: hxxp → http, [.] → ., [@] → @
- [ ] Empty cells return empty string (not error)
- [ ] No JavaScript errors in browser console (F12)
- [ ] Operations complete in reasonable time (< 5 seconds for small datasets)

## If Tests Fail

### Extension Not Loading

```bash
# Check OpenRefine logs
docker-compose logs openrefine | grep -i "refineCTI\|extension"

# Restart container
docker-compose restart openrefine
```

### Menu Not Appearing

1. Clear browser cache (Ctrl+Shift+Del)
2. Hard refresh page (Ctrl+Shift+R)
3. Check browser console (F12) for JavaScript errors
4. Verify extension files are in correct location

### Operations Not Working

1. Open browser console (F12)
2. Look for error messages
3. Verify no JavaScript conflicts with other extensions
4. Try on a small dataset first

### Performance Issues

If operations are slow:
- Reduce dataset size for testing
- Check browser console for errors
- Ensure adequate system resources
- Try in a different browser

## Expected Performance

- 100 rows: < 1 second
- 1,000 rows: < 5 seconds
- 10,000 rows: < 30 seconds

Performance depends on:
- Text length per cell
- Number of IOCs per cell
- Browser and system resources

## Next Steps

If all tests pass:
1. Read [README.md](README.md) for full documentation
2. Try [EXAMPLES.md](EXAMPLES.md) for comprehensive test cases
3. Use in real CTI workflows

## Notes

- refineCTI is a **client-side extension** that works through the **menu interface only**
- Functions are **NOT available as GREL expressions**
- All operations must be performed via column menu → CTI Operations
- Results are returned as comma-separated strings
- Use "Split multi-valued cells" to separate IOCs into individual rows

Test completed successfully? The extension is ready for production use.
