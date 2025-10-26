# Quick Test - refineCTI Extension

## 🚀 5-Minute Test

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

### Step 3: Test Extraction

**Method 1: Via Menu (Easiest)**
1. Click column dropdown (▼)
2. Select "CTI Operations" → "Extract All IOCs"
3. ✅ Should show: `http://evil.com, 192.168.1.100, evil.com` in first row

**Method 2: Via GREL**
1. Click column dropdown → "Edit cells" → "Transform..."
2. Enter expression:
```grel
extractAllIOCs(value, false)
```
3. Click "OK"
4. ✅ Same result as Method 1

### Step 4: Test Defang

1. Column dropdown → "CTI Operations" → "Defang (Militarize) IOCs"
2. ✅ Should convert URLs to hxxp://evil[.]com format

### Step 5: Test Individual Extractors

Try each from menu:
- Extract URLs ✅
- Extract Domains ✅
- Extract IP Addresses ✅
- Extract Emails ✅

## ✅ Success Criteria

- [ ] Menu "CTI Operations" appears in column dropdown
- [ ] Extract functions return comma-separated IOCs
- [ ] Defang converts http → hxxp, . → [.]
- [ ] Fang converts hxxp → http, [.] → .
- [ ] Empty cells return empty (not error)
- [ ] No JavaScript errors in browser console (F12)

## 🐛 If Tests Fail

### Extension Not Loading
```bash
# Check OpenRefine logs
docker-compose logs openrefine | grep -i "refineCTI\|extension"

# Restart container
docker-compose restart openrefine
```

### Menu Not Appearing
1. Clear browser cache (Ctrl+Shift+Del)
2. Hard refresh (Ctrl+Shift+R)
3. Check browser console (F12) for errors

### Functions Not Working
1. Test in browser console:
```javascript
extractURLs("test http://evil.com", false)
```
2. Should return: "http://evil.com"

## 📊 Expected Performance

- 1000 rows: < 1 second
- 10,000 rows: < 10 seconds
- 100,000 rows: < 2 minutes

## 🔗 Next Steps

If all tests pass:
1. Read [README.md](README.md) for full documentation
2. Try [EXAMPLES.md](EXAMPLES.md) for comprehensive tests
3. Use in real CTI workflows!

---

**Test completed successfully? Excellent! 🎉**
