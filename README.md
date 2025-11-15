# refineCTI Extension for OpenRefine

**Cyber Threat Intelligence (CTI) extension for OpenRefine**

This extension provides powerful functions to extract, analyze, and sanitize Indicators of Compromise (IOCs) from text data through an easy-to-use menu interface.

**Pure JavaScript implementation** - No Python/Jython dependencies, fully portable and compatible with any OpenRefine installation.

**Client-side operation** - All extraction and transformation operations are performed client-side in the browser through the column menu interface.

## Features

### IOC Extraction
- **URLs** - Extract HTTP/HTTPS/FTP URLs (normal and defanged)
- **Domains** - Extract domain names (normal and defanged)
- **IP Addresses** - Extract IPv4 and IPv6 addresses (normal and defanged)
- **Emails** - Extract email addresses (normal and defanged)
- **All IOCs** - Extract all types of IOCs at once

### Cryptocurrency Address Extraction
- **Bitcoin (BTC)** - All formats: Legacy (P2PKH), SegWit (P2SH), Native SegWit (Bech32), Taproot
- **Ethereum (ETH)** - Standard 0x addresses
- **Monero (XMR)** - Standard, Integrated, and SubAddress formats
- **Solana (SOL)** - Base58 encoded addresses
- **All Crypto** - Extract all cryptocurrency addresses at once

### Social Media Extraction
- **Telegram** - Post URLs and usernames (t.me/username/123456, t.me/username)
- **Bluesky** - Handles (@user.bsky.social, @user.domain.tld, bridges)
- **Handles** - All social media handles starting with @ (Twitter, Instagram, etc.)
- **All Social** - Extract all social media identifiers at once

### Cryptographic Hash Extraction
- **MD5** - 32 hexadecimal character hashes
- **SHA1** - 40 hexadecimal character hashes
- **SHA256** - 64 hexadecimal character hashes
- **SHA512** - 128 hexadecimal character hashes
- **MurmurHash** - 8 hexadecimal character hashes (favicon hash, etc.)
- **All Hashes** - Extract all hash types at once

### Defang/Fang Operations
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

### Important Note

This extension operates **client-side only** through the **menu interface**. The functions are **NOT available as GREL expressions** and cannot be used in custom transforms or column-based expressions. All operations must be performed through the "CTI Operations" column menu.

### Via Menu (GUI)

1. Select a column containing text with IOCs
2. Click on the column menu (dropdown arrow)
3. Navigate to **"CTI Operations"**
4. Choose your category and operation

**Available Menu Categories:**

**Domains/IPs/Emails:**
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

**Crypto Addresses:**
- Extract Bitcoin (BTC)
- Extract Ethereum (ETH)
- Extract Monero (XMR)
- Extract Solana (SOL)
- Extract All Crypto Addresses

**Social Media:**
- Telegram
  - Extract Telegram Post URLs
  - Extract Telegram Usernames
- Extract Bluesky Handles
- Extract All Handles (@)
- Extract All Social Media

**Hash:**
- Extract MD5
- Extract SHA1
- Extract SHA256
- Extract SHA512
- Extract MurmurHash
- Extract All Hashes

## Examples

All examples below use the menu interface. Select the column, then choose the appropriate menu option.

### Example 1: Extract URLs from Threat Intelligence Report

**Input column (threat_report):**
```
Malware communicates with http://evil-c2.com and hxxp://backup[.]badsite[.]org
```

**Menu action:** Column menu → CTI Operations → Domains/IPs/Emails → Extract URLs → Create new column

**Output (new column):**
```
http://evil-c2.com, http://backup.badsite.org
```

### Example 2: Extract and Defang All IOCs

**Input column (incident_notes):**
```
Attacker used IP 192.168.1.100 and sent phishing from attacker@evil.com
visiting http://phishing-site.com/login.php
```

**Menu action:** Column menu → CTI Operations → Domains/IPs/Emails → Extract All IOCs (defanged) → Create new column

**Output (new column):**
```
hxxp://phishing-site[.]com/login[.]php, 192[.]168[.]1[.]100, attacker[@]evil[.]com, phishing-site[.]com
```

### Example 3: Defang URLs for Safe Sharing

**Input column (urls):**
```
http://malware-download.com/payload.exe
```

**Menu action:** Column menu → CTI Operations → Domains/IPs/Emails → Defang (Militarize) IOCs → Transform cells

**Output (transformed):**
```
hxxp://malware-download[.]com/payload[.]exe
```

### Example 4: Extract Bitcoin Addresses from Ransom Note

**Input column (ransom_demand):**
```
Send 0.5 BTC to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa or bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
for decryption key. Alternative address: 3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy
```

**Menu action:** Column menu → CTI Operations → Crypto Addresses → Extract Bitcoin (BTC) → Create new column

**Output (new column):**
```
1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa, bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq, 3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy
```

### Example 5: Extract Hashes from Malware Analysis Report

**Input column (malware_report):**
```
Sample Analysis:
File MD5: d41d8cd98f00b204e9800998ecf8427e
SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

**Menu action:** Column menu → CTI Operations → Hash → Extract All Hashes → Create new column

**Output (new column):**
```
d41d8cd98f00b204e9800998ecf8427e, e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

## Return Values

All extraction functions return comma-separated strings:

- **Single IOC found**: Returns plain string (e.g., `http://evil.com`)
- **Multiple IOCs found**: Returns comma-separated string (e.g., `http://evil.com, http://bad.org`)
- **No IOCs found**: Returns empty string

### Processing Results

To split comma-separated results into multiple rows:
1. Select the column with results
2. Edit cells → Split multi-valued cells
3. Use `, ` (comma and space) as separator

## Supported Formats

### IOC Formats

**URLs:**
- Normal: `http://example.com`, `https://secure.com`, `ftp://files.com`
- Defanged: `hxxp://example[.]com`, `hxxps://secure[.]com`, `fxp://files[.]com`

**Domains:**
- Normal: `example.com`, `sub.domain.example.com`
- Defanged: `example[.]com`, `sub[.]domain[.]example[.]com`

**IPv4:**
- Normal: `192.168.1.1`, `10.0.0.5`
- Defanged: `192[.]168[.]1[.]1`, `10[.]0[.]0[.]5`

**IPv6:**
- Full: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
- Compressed: `2001:db8:85a3::8a2e:370:7334`
- Defanged: `2001[:]db8[:]85a3[:][:]8a2e[:]370[:]7334`

**Emails:**
- Normal: `user@example.com`
- Defanged: `user[@]example[.]com`

### Cryptocurrency Formats

**Bitcoin (BTC):**
- Legacy P2PKH: Starts with `1` (e.g., `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`)
- P2SH SegWit: Starts with `3` (e.g., `3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy`)
- Native SegWit: Starts with `bc1q` (e.g., `bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq`)
- Taproot: Starts with `bc1p`

**Ethereum (ETH):**
- Standard: `0x` + 40 hex chars (e.g., `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`)

**Monero (XMR):**
- Standard: Starts with `4`, 95 characters
- Integrated: Starts with `4`, 106 characters
- SubAddress: Starts with `8`, 95 characters

**Solana (SOL):**
- Base58 encoded, 32-44 characters

### Hash Formats

- **MD5**: 32 hex characters
- **SHA1**: 40 hex characters
- **SHA256**: 64 hex characters
- **SHA512**: 128 hex characters
- **MurmurHash**: 8 hex characters

## Use Cases

### Threat Intelligence Analysis
- Extract IOCs from threat reports
- Normalize defanged IOCs from OSINT sources
- Prepare IOCs for SIEM/IDS ingestion

### Incident Response
- Extract IOCs from incident notes
- Defang IOCs for safe documentation
- Share IOCs in reports without accidental activation

### Ransomware Analysis
- Extract cryptocurrency payment addresses from ransom notes
- Track Bitcoin/Ethereum/Monero wallets used by threat actors
- Build crypto address IOC databases

### Malware File Analysis
- Extract file hashes from malware reports
- Build hash-based IOC databases from sandbox reports
- Correlate file signatures across threat intelligence feeds

### Favicon Fingerprinting
- Extract MurmurHash values from Shodan results
- Identify infrastructure based on favicon hashes

## Limitations

### No GREL Support
This extension works through the menu interface only. Functions are not available as GREL expressions and cannot be used in transformations or custom column creation via expressions.

### Context Awareness
Extracts all matching patterns. May include false positives in some contexts (e.g., version numbers like 1.2.3.4 mistaken for IPv4).

### URL Validation
Extracts syntactically valid patterns. Does not verify if URLs are reachable or malicious.

## Troubleshooting

### Menu Not Appearing
- Ensure extension is properly installed in `extensions/refineCTI/`
- Restart OpenRefine
- Clear browser cache and reload

### IOCs Not Extracted
- Check if IOCs are in supported formats
- Verify text encoding (UTF-8 recommended)
- Try extracting each IOC type separately

### Performance Issues
- For very large text blocks (>1MB), consider splitting data first
- Process in batches if dataset is very large

## Development

### Code Quality

This extension uses ESLint for code quality:

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Code Style
- ES5 compatible JavaScript
- Single quotes, 4-space indentation
- Follows `eslint:recommended`

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Run `npm run lint` to check code style
4. Submit a pull request

## License

MIT License - Copyright (c) 2025

## Version

**Current Version:** 2.4.0

## Changelog

### v2.4.0 (2025-10-27)
- Added cryptographic hash extraction (MD5, SHA1, SHA256, SHA512, MurmurHash)
- New "Hash" menu category with 6 extraction options
- Intelligent deduplication to avoid substring matches
- Context-aware MurmurHash extraction

### v2.3.0 (2025-10-27)
- Added social media extraction (Telegram, Bluesky, generic handles)
- New "Social Media" menu category
- Telegram: Post URLs and usernames
- Bluesky: Standard handles, custom domains, Mastodon bridges

### v2.2.0 (2025-10-27)
- Code refactoring: Split into modular architecture
- Added IPv6 support (full, compressed, defanged formats)
- Improved code organization

### v2.1.0 (2025-10-27)
- Added cryptocurrency address extraction (BTC, ETH, XMR, SOL)
- New "Crypto Addresses" menu category
- Support for all major Bitcoin address formats

### v2.0.0 (2025-10-26)
- Complete rewrite in pure JavaScript
- Removed Python/Jython dependencies
- Client-side processing for better portability

### v1.0.0 (2025-10-25)
- Initial release
- IOC extraction (URLs, domains, IPv4, emails)
- Defang/Fang operations
- GUI menu integration

## Author

Created for OpenRefine OSINT Docker distribution.

## Support

For issues or questions:
1. Check this README
2. Review the EXAMPLES.md file
3. Open an issue on the repository
