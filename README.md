# refineCTI Extension for OpenRefine

**Cyber Threat Intelligence (CTI) extension for OpenRefine**

This extension provides powerful functions to extract, analyze, and sanitize Indicators of Compromise (IOCs) from text data.

**Pure JavaScript implementation** - No Python/Jython dependencies, fully portable and compatible with any OpenRefine installation.

## Features

### 🔍 IOC Extraction
- **URLs** - Extract HTTP/HTTPS/FTP URLs (normal and defanged)
- **Domains** - Extract domain names (normal and defanged)
- **IP Addresses** - Extract IPv4 addresses (normal and defanged)
- **Emails** - Extract email addresses (normal and defanged)
- **All IOCs** - Extract all types of IOCs at once

### 🛡️ Defang/Fang Operations
- **Defang (Militarize)** - Make IOCs safe to share without accidental clicks
  - `http://evil.com` → `hxxp://evil[.]com`
  - `192.168.1.1` → `192[.]168[.]1[.]1`
  - `user@evil.com` → `user[@]evil[.]com`

- **Fang (Demilitarize)** - Restore defanged IOCs to their original form
  - `hxxp://evil[.]com` → `http://evil.com`
  - `192[.]168[.]1[.]1` → `192.168.1.1`
  - `user[@]evil[.]com` → `user@evil.com`

## Installation

This extension is pre-installed with this OpenRefine OSINT Docker distribution.

For manual installation:
1. Copy the `refineCTI` folder to OpenRefine's `extensions` directory
2. Restart OpenRefine

## Usage

### Via Menu (GUI)

1. Select a column containing text with IOCs
2. Click on the column menu (▼)
3. Navigate to **"CTI Operations"**
4. Choose your desired operation:
   - Extract URLs
   - Extract URLs (defanged)
   - Extract Domains
   - Extract Domains (defanged)
   - Extract IP Addresses
   - Extract IP Addresses (defanged)
   - Extract Emails
   - Extract Emails (defanged)
   - Extract All IOCs
   - Extract All IOCs (defanged)
   - Defang (Militarize) IOCs
   - Fang (Demilitarize) IOCs

### Via JavaScript in Browser Console (Advanced)

For advanced users, you can access the JavaScript functions directly:

```javascript
// Extract URLs
RefineCTI.extractURLs("Visit http://evil.com for malware", false);

// Defang an IOC
RefineCTI.defang("http://evil.com");

// Fang an IOC
RefineCTI.fang("hxxp://evil[.]com");
```

**Note:** The extraction functions are executed client-side in the browser for optimal performance and portability.

## Examples

### Example 1: Extract URLs from Threat Intelligence Report

**Input column (threat_report):**
```
Malware communicates with http://evil-c2.com and hxxp://backup[.]badsite[.]org
```

**GREL Expression:**
```grel
extractURLs(value, false)
```

**Output:**
```
http://evil-c2.com, http://backup.badsite.org
```

### Example 2: Extract and Defang All IOCs

**Input column (incident_notes):**
```
Attacker used IP 192.168.1.100 and sent phishing from attacker@evil.com
visiting http://phishing-site.com/login.php
```

**GREL Expression:**
```grel
extractAllIOCs(value, true)
```

**Output:**
```
hxxp://phishing-site[.]com/login[.]php, 192[.]168[.]1[.]100, phishing-site[.]com, attacker[@]evil[.]com
```

### Example 3: Defang URLs for Safe Sharing

**Input column (urls):**
```
http://malware-download.com/payload.exe
```

**GREL Expression:**
```grel
defang(value)
```

**Output:**
```
hxxp://malware-download[.]com/payload[.]exe
```

### Example 4: Fang Defanged IOCs from MISP

**Input column (misp_iocs):**
```
hxxp://command-and-control[.]badsite[.]org
```

**GREL Expression:**
```grel
fang(value)
```

**Output:**
```
http://command-and-control.badsite.org
```

### Example 5: Extract IPs from Network Logs

**Input column (firewall_logs):**
```
Connection from 10.0.0.5 to 192[.]168[.]1[.]100 blocked
```

**GREL Expression:**
```grel
extractIPs(value, false)
```

**Output:**
```
10.0.0.5, 192.168.1.100
```

## Return Values

### Single IOC
When **only one IOC** is found, the function returns a **string**:
```
http://evil.com
```

### Multiple IOCs
When **multiple IOCs** are found, the function returns a **comma-separated string**:
```
http://evil.com, http://badsite.org, 192.168.1.1
```

### No IOCs
When **no IOCs** are found, the function returns an **empty string**:
```
(empty)
```

### Processing Multiple Values

To split comma-separated IOCs into multiple rows:
```grel
// In "Edit cells" → "Split multi-valued cells"
// Separator: , (comma)
```

To keep as array for further processing:
```grel
// Convert to array
value.split(", ")

// Count IOCs
value.split(", ").length()

// Get first IOC
value.split(", ")[0]
```

## Supported IOC Formats

### URLs
- Normal: `http://example.com`, `https://secure.com`, `ftp://files.com`
- Defanged: `hxxp://example[.]com`, `hxxps://secure[.]com`, `fxp://files[.]com`

### Domains
- Normal: `example.com`, `sub.domain.example.com`
- Defanged: `example[.]com`, `sub[.]domain[.]example[.]com`

### IP Addresses (IPv4)
- Normal: `192.168.1.1`, `10.0.0.5`
- Defanged: `192[.]168[.]1[.]1`, `10[.]0[.]0[.]5`

### Emails
- Normal: `user@example.com`, `admin@domain.org`
- Defanged: `user[@]example[.]com`, `admin[@]domain[.]org`

## Technical Details

### Pattern Matching
The extension uses intelligent pattern matching to:
- Recognize both normal and defanged formats
- Normalize all IOCs to a consistent format
- Remove duplicates automatically
- Validate IOC structure (e.g., valid IP ranges, domain TLDs)

### No Regular Expressions User-Side
The extension handles all pattern matching internally. Users don't need to write regex patterns.

### Performance
- Optimized for large datasets
- Single-pass extraction for multiple IOC types
- Efficient deduplication

## Use Cases

### Threat Intelligence Analysis
- Extract IOCs from threat reports
- Normalize defanged IOCs from OSINT sources
- Prepare IOCs for SIEM/IDS ingestion

### Incident Response
- Extract IOCs from incident notes
- Defang IOCs for safe documentation
- Share IOCs in reports without accidental activation

### Malware Analysis
- Extract C2 domains and IPs from strings
- Process sandbox reports
- Correlate IOCs across samples

### Phishing Investigation
- Extract malicious URLs from emails
- Identify sender domains and IPs
- Build comprehensive IOC lists

## Best Practices

### 1. Always Defang for Sharing
When sharing IOCs in documents, chat, or emails:
```grel
defang(value)
```

### 2. Validate Before Using
When using extracted IOCs for automated queries:
```grel
fang(extractURLs(value, false))
```

### 3. Deduplicate Results
Use OpenRefine's built-in features:
- `Facet` → `Customized facets` → `Duplicates facet`
- `Edit cells` → `Blank down`

### 4. Combine with Other Tools
Chain with other OpenRefine functions:
```grel
// Extract and count unique domains
extractDomains(value, false).split(", ").uniques().length()

// Extract IPs and join with pipe separator
extractIPs(value, false).split(", ").join(" | ")
```

## Limitations

### IPv6
Currently supports **IPv4 only**. IPv6 support planned for future release.

### URL Validation
Extracts syntactically valid URLs. Does not verify if URLs are reachable or malicious.

### Context Awareness
Extracts all matching patterns. May include false positives in some contexts (e.g., version numbers mistaken for IPs).

## Troubleshooting

### IOCs Not Extracted
- Check if IOCs are in supported formats
- Verify text encoding (UTF-8 recommended)
- Try extracting each IOC type separately to identify the issue

### Unexpected Results
- Some text patterns may match IOC patterns (e.g., version 1.2.3.4)
- Use facets to review extracted values
- Manually filter false positives if needed

### Performance Issues
- For very large text blocks (>1MB), consider splitting data first
- Process in batches if dataset is very large

## Development

### Code Quality

This extension uses ESLint for code quality and consistency. Before contributing:

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Linting Rules

- **Code style**: ES5 compatible, single quotes, 4-space indentation
- **Globals**: OpenRefine-specific globals (`Refine`, `theProject`, etc.) are configured
- **Standards**: Follows `eslint:recommended` with OpenRefine adaptations

All JavaScript files are linted against consistent style rules to ensure maintainability.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Run `npm run lint` to check code style
4. Submit a pull request with a clear description

Please ensure your code passes linting before submitting.

## License

MIT License

Copyright (c) 2025

## Version

**Current Version:** 1.0.0

## Changelog

### v1.0.0 (2025-01-26)
- Initial release
- IOC extraction (URLs, domains, IPs, emails)
- Defang/Fang operations
- GUI menu integration
- GREL function support

## Author

Created for OpenRefine OSINT Docker distribution.

## Support

For issues or questions:
1. Check this README
2. Review examples above
3. Open an issue on the repository

---

**Happy Threat Hunting! 🔍🛡️**
