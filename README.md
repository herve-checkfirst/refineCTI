# refineCTI Extension for OpenRefine

**Cyber Threat Intelligence (CTI) extension for OpenRefine**

This extension provides powerful functions to extract, analyze, and sanitize Indicators of Compromise (IOCs) from text data.

**Pure JavaScript implementation** - No Python/Jython dependencies, fully portable and compatible with any OpenRefine installation.

## Features

### 🔍 IOC Extraction
- **URLs** - Extract HTTP/HTTPS/FTP URLs (normal and defanged)
- **Domains** - Extract domain names (normal and defanged)
- **IP Addresses** - Extract IPv4 and IPv6 addresses (normal and defanged)
- **Emails** - Extract email addresses (normal and defanged)
- **All IOCs** - Extract all types of IOCs at once

### 💰 Cryptocurrency Address Extraction
- **Bitcoin (BTC)** - All formats: Legacy (P2PKH), SegWit (P2SH), Native SegWit (Bech32), Taproot
- **Ethereum (ETH)** - Standard 0x addresses
- **Monero (XMR)** - Standard, Integrated, and SubAddress formats
- **Solana (SOL)** - Base58 encoded addresses
- **All Crypto** - Extract all cryptocurrency addresses at once

### 📱 Social Media Extraction
- **Telegram** - Post URLs and usernames (t.me/username/123456, t.me/username)
- **Bluesky** - Handles (@user.bsky.social, @user.domain.tld, bridges)
- **Handles** - All social media handles starting with @ (Twitter, Instagram, etc.)
- **All Social** - Extract all social media identifiers at once

### 🔐 Cryptographic Hash Extraction
- **MD5** - 32 hexadecimal character hashes
- **SHA1** - 40 hexadecimal character hashes
- **SHA256** - 64 hexadecimal character hashes
- **SHA512** - 128 hexadecimal character hashes
- **MurmurHash** - 8 hexadecimal character hashes (favicon hash, etc.)
- **All Hashes** - Extract all hash types at once

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
4. Choose your category:

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

### Example 6: Extract Bitcoin Addresses from Ransom Note

**Input column (ransom_demand):**
```
Send 0.5 BTC to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa or bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
for decryption key. Alternative address: 3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy
```

**Menu action:** CTI Operations → Crypto Addresses → Extract Bitcoin (BTC) → New column

**Output (btc_addresses column):**
```
1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa, bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq, 3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy
```

### Example 7: Extract Ethereum Addresses from Phishing Email

**Input column (email_body):**
```
Please send funds to our wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Contact us at scammer@evil.com for confirmation.
```

**Menu action:** CTI Operations → Crypto Addresses → Extract Ethereum (ETH) → New column

**Output (eth_addresses column):**
```
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

**Note:** Email addresses are **not** extracted by crypto functions - use "Domains/IPs/Emails" → "Extract Emails" for that.

### Example 8: Extract All Crypto Addresses from Incident Report

**Input column (incident_notes):**
```
Ransomware operators used multiple wallets:
- BTC: 1BoatSLRHtKNngkdXEeobR76b53LETtpyT
- ETH: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
- XMR: 4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Ec2QgWZdoUYkMYdFdYYXy4mVDzPFYYJNBNGFSvZzqMc8BbnShnQ7S
Payment demanded via BTC address bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
```

**Menu action:** CTI Operations → Crypto Addresses → Extract All Crypto Addresses → New column

**Output (crypto_addresses column):**
```
1BoatSLRHtKNngkdXEeobR76b53LETtpyT, 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb, 4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Ec2QgWZdoUYkMYdFdYYXy4mVDzPFYYJNBNGFSvZzqMc8BbnShnQ7S, bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
```

### Example 9: Extract IPv6 Addresses from Network Logs

**Input column (firewall_logs):**
```
Connection from 2001:db8:85a3::8a2e:370:7334 to fe80::1ff:fe23:4567:890a blocked
Defanged address: 2001[:]0db8[:]85a3[:]0000[:]0000[:]8a2e[:]0370[:]7334
IPv4 fallback: 192.168.1.100
```

**Menu action:** CTI Operations → Domains/IPs/Emails → Extract IP Addresses (IPv4 + IPv6) → New column

**Output (ips column):**
```
2001:db8:85a3::8a2e:370:7334, fe80::1ff:fe23:4567:890a, 2001:0db8:85a3:0000:0000:8a2e:0370:7334, 192.168.1.100
```

**Note:** Both normal and defanged IPv6 addresses are extracted and normalized. The function automatically detects full and compressed IPv6 formats.

### Example 10: Extract Telegram Information from Threat Report

**Input column (threat_notes):**
```
Threat actor using Telegram for C2:
- Main channel: https://t.me/malware_updates/12345
- Backup: https://t.me/backup_channel/67890
- Direct contact: https://t.me/threat_actor_handle
```

**Menu action:** CTI Operations → Social Media → Telegram → Extract Telegram Post URLs → New column

**Output (telegram_posts column):**
```
https://t.me/malware_updates/12345, https://t.me/backup_channel/67890
```

**Menu action:** CTI Operations → Social Media → Telegram → Extract Telegram Usernames → New column

**Output (telegram_usernames column):**
```
malware_updates, backup_channel, threat_actor_handle
```

### Example 11: Extract Bluesky Handles from Social Media Intel

**Input column (osint_data):**
```
Threat researchers on Bluesky:
@researcher.bsky.social is tracking this campaign
Custom domain handle: @analyst.securityfirm.com
Mastodon bridge: @investigator.infosec.exchange.ap.brid.gy
```

**Menu action:** CTI Operations → Social Media → Extract Bluesky Handles → New column

**Output (bluesky_handles column):**
```
researcher.bsky.social, analyst.securityfirm.com, investigator.infosec.exchange.ap.brid.gy
```

### Example 12: Extract All Social Media Handles from Posts

**Input column (social_posts):**
```
Follow @malware_analyst on Twitter for updates
Instagram: @securitynews
Bluesky: @researcher.bsky.social
Contact @admin for more info
```

**Menu action:** CTI Operations → Social Media → Extract All Handles (@) → New column

**Output (social_handles column):**
```
@malware_analyst, @securitynews, @researcher.bsky.social, @admin
```

### Example 13: Extract Hashes from Malware Analysis Report

**Input column (malware_report):**
```
Sample Analysis:
File MD5: d41d8cd98f00b204e9800998ecf8427e
SHA1: da39a3ee5e6b4b0d3255bfef95601890afd80709
SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
Sample downloaded from hxxp://malware[.]example[.]com
MurmurHash: a1b2c3d4 (favicon hash)
```

**Menu action:** CTI Operations → Hash → Extract All Hashes → New column

**Output (all_hashes column):**
```
d41d8cd98f00b204e9800998ecf8427e, da39a3ee5e6b4b0d3255bfef95601890afd80709, e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855, a1b2c3d4
```

**Individual hash extraction:**
- **Extract MD5**: Returns `d41d8cd98f00b204e9800998ecf8427e`
- **Extract SHA1**: Returns `da39a3ee5e6b4b0d3255bfef95601890afd80709`
- **Extract SHA256**: Returns `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- **Extract MurmurHash**: Returns `a1b2c3d4`

**Note:** The extraction intelligently avoids extracting substrings. For example, MD5 hashes won't be extracted from within SHA256 hashes.

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

### IP Addresses

**IPv4:**
- Normal: `192.168.1.1`, `10.0.0.5`
- Defanged: `192[.]168[.]1[.]1`, `10[.]0[.]0[.]5`

**IPv6:**
- Full format: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
- Compressed: `2001:db8:85a3::8a2e:370:7334`
- Loopback: `::1`
- Unspecified: `::`
- Link-local: `fe80::1ff:fe23:4567:890a`
- Defanged: `2001[:]db8[:]85a3[:][:]8a2e[:]370[:]7334`

### Emails
- Normal: `user@example.com`, `admin@domain.org`
- Defanged: `user[@]example[.]com`, `admin[@]domain[.]org`

## Supported Cryptocurrency Address Formats

### Bitcoin (BTC)
- **Legacy P2PKH**: Starts with `1`, 26-34 characters
  - Example: `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`
- **P2SH SegWit**: Starts with `3`, 26-34 characters
  - Example: `3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy`
- **Native SegWit (Bech32)**: Starts with `bc1q`, 42-62 characters
  - Example: `bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq`
- **Taproot**: Starts with `bc1p`, 62 characters
  - Example: `bc1pmzfrwwndsqmk5yh69yjr5lfgfg4ev8c0tsc06e`

### Ethereum (ETH)
- **Standard**: Starts with `0x`, followed by 40 hexadecimal characters
  - Example: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
  - Example: `0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe`

### Monero (XMR)
- **Standard Address**: Starts with `4`, 95 characters
  - Example: `4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Ec2QgWZdoUYkMYdFdYYXy4mVDzPFYYJNBNGFSvZzqMc8BbnShnQ7S`
- **Integrated Address**: Starts with `4`, 106 characters
  - Example: `4LL9oSLmtpccfufTMvppY6JwXNouMBzSkbLYfpAV5Ec2QgWZdoUYkMYdFdYYXy4mVDzPFYYJNBNGFSvZzqMc8BbnShnQ7S2x7m5Y`
- **SubAddress**: Starts with `8`, 95 characters
  - Example: `8BfHm8YJJ9GnZ7YKDn5g5K6UpP3XqCHu9qCPmvM7qNqECz8C3y6QU7n5cq8QAX2vXvkq4vN8w9Y`

### Solana (SOL)
- **Standard**: Base58 encoded, 32-44 characters
  - Example: `7EqQdEUACu4at8cJv6V8dFmgSYuqLSQJ4hJhZPf3C`
  - Example: `DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK`

**Note:** Cryptocurrency address extraction uses pattern matching. Always validate addresses before using them for transactions.

## Supported Social Media Formats

### Telegram
- **Post URLs**: `https://t.me/username/123456` or `http://t.me/channel/789`
  - Username/channel: alphanumeric and underscore
  - Post ID: numeric (1 to millions)
- **Username extraction**: Extracts just `username` from URLs
  - Works with both post URLs and direct channel URLs

### Bluesky
- **Standard handles**: `@user.bsky.social`
- **Custom domain**: `@user.customdomain.com`, `@analyst.securityfirm.io`
- **Mastodon bridges**: `@user.mastodon.social.ap.brid.gy`
  - Any handle ending with `.brid.gy` is recognized as a bridge
- **Format**: Always starts with `@`, followed by domain notation

### Generic Handles
- **Format**: `@username` where username contains:
  - Alphanumeric characters
  - Underscores, hyphens
  - Dots (for domain-based handles)
- **Platforms**: Twitter/X, Instagram, TikTok, Threads, and any @ -based platform
- **Special cases**:
  - Bluesky domain handles: `@user.domain.tld`
  - Mastodon federation: `@user@instance.social` (captured as `@user`)

## Supported Cryptographic Hash Formats

### MD5
- **Length**: 32 hexadecimal characters
- **Pattern**: `[a-fA-F0-9]{32}`
- **Examples**:
  - `d41d8cd98f00b204e9800998ecf8427e` (empty file)
  - `5d41402abc4b2a76b9719d911017c592` ("hello")
- **Use cases**: File integrity, legacy malware signatures

### SHA1
- **Length**: 40 hexadecimal characters
- **Pattern**: `[a-fA-F0-9]{40}`
- **Examples**:
  - `da39a3ee5e6b4b0d3255bfef95601890afd80709` (empty file)
  - `aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d` ("hello")
- **Use cases**: Git commits, file signatures, malware IOCs

### SHA256
- **Length**: 64 hexadecimal characters
- **Pattern**: `[a-fA-F0-9]{64}`
- **Examples**:
  - `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` (empty file)
  - `2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824` ("hello")
- **Use cases**: Modern file integrity, malware signatures, YARA rules

### SHA512
- **Length**: 128 hexadecimal characters
- **Pattern**: `[a-fA-F0-9]{128}`
- **Examples**:
  - `cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e` (empty file)
  - `9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043` ("hello")
- **Use cases**: High-security file integrity, critical malware signatures

### MurmurHash
- **Length**: 8 hexadecimal characters
- **Pattern**: `[a-fA-F0-9]{8}`
- **Context-aware extraction**:
  - With prefix: `murmur: a1b2c3d4`, `mmh3: 12345678`, `murmurhash: abcd1234`
  - Without prefix: Extracted but may have false positives
- **Examples**:
  - `f3418a44` (favicon hash)
  - `1234abcd` (content hash)
- **Use cases**: Favicon hashes (Shodan), content fingerprinting, fast hash lookups
- **Note**: Filters out date patterns (YYYYMMDD) to reduce false positives

### Intelligent Deduplication
The `extractAllHashes` function extracts hashes in order from longest to shortest (SHA512 → SHA256 → SHA1 → MD5 → MurmurHash) to avoid substring extraction. For example:
- SHA256 `e3b0c442...` won't also match as MD5 substrings
- SHA1 won't also match as MD5 substrings
- Each hash is only extracted once

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

### Ransomware Analysis
- Extract cryptocurrency payment addresses from ransom notes
- Track Bitcoin/Ethereum/Monero wallets used by threat actors
- Build crypto address IOC databases
- Correlate payment addresses across campaigns

### Cryptocurrency Fraud Investigation
- Extract wallet addresses from phishing emails
- Identify crypto addresses in social engineering attacks
- Track addresses used in investment scams
- Analyze crypto-related threat intelligence feeds

### Malware File Analysis
- Extract file hashes (MD5, SHA1, SHA256, SHA512) from malware reports
- Build hash-based IOC databases from sandbox reports
- Correlate file signatures across threat intelligence feeds
- Search VirusTotal, Hybrid Analysis, and other platforms

### Favicon Fingerprinting
- Extract MurmurHash values from Shodan results
- Identify infrastructure based on favicon hashes
- Track threat actor infrastructure by unique favicons
- Correlate web properties across different domains

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

### URL Validation
Extracts syntactically valid URLs. Does not verify if URLs are reachable or malicious.

### Context Awareness
Extracts all matching patterns. May include false positives in some contexts (e.g., version numbers mistaken for IPv4).

### IPv6 Edge Cases
IPv6 extraction supports most common formats but may not catch all edge cases or unusual representations. Test with your specific data if you have complex IPv6 formats.

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

**Current Version:** 2.4.0

## Changelog

### v2.4.0 (2025-10-27)
- **Cryptographic Hash Extraction**: NEW module for hash extraction
  - `refineCTI-hash.js`: MD5, SHA1, SHA256, SHA512, MurmurHash extraction
  - Intelligent deduplication to avoid substring matches
  - Context-aware MurmurHash extraction with date filtering
  - Extract all hash types at once
- New "Hash" menu with 6 extraction options
- Example 13: Extract hashes from malware analysis report
- Comprehensive hash format documentation
- Use cases: Malware file analysis, favicon fingerprinting (Shodan)

### v2.3.0 (2025-10-27)
- **Social Media Extraction**: NEW module for social media identifiers
  - `refineCTI-social.js`: Telegram, Bluesky, Handles extraction
  - Telegram: Post URLs (https://t.me/user/123) and usernames
  - Bluesky: Standard handles, custom domains, Mastodon bridges
  - Generic handles: All @username formats (Twitter, Instagram, etc.)
  - Extract all social media identifiers at once
- New "Social Media" menu with organized submenus
- 3 new examples (Telegram, Bluesky, Handles)
- Documentation for all social media formats

### v2.2.0 (2025-10-27)
- **Code Refactoring**: Split modules for better maintainability
  - `refineCTI-core.js`: Defang/Fang operations only
  - `refineCTI-IOC.js`: All IOC extraction functions (NEW)
  - `refineCTI-crypto.js`: Cryptocurrency extraction
  - `refineCTI-menu.js`: Menu integration
- **IPv6 Support**: Full IPv6 address extraction with defang/fang
  - Full format, compressed format, loopback, link-local
  - Defanged IPv6 with [:] notation
  - Combined IPv4 + IPv6 extraction
- Enhanced documentation with IPv6 examples
- Improved code organization for community contributions

### v2.1.0 (2025-10-27)
- Added cryptocurrency address extraction
- Support for Bitcoin (all formats), Ethereum, Monero, Solana
- Reorganized menu structure with categories
- New "Crypto Addresses" submenu
- Enhanced documentation with crypto examples

### v2.0.0 (2025-10-26)
- Complete rewrite in pure JavaScript (removed Python/Jython dependencies)
- Fixed RuntimeException on different machines
- Fixed duplicate IOCs in extractAllIOCs
- Added ESLint configuration for code quality
- Improved performance with stable API usage

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
2. Review examples above
3. Open an issue on the repository

---

**Happy Threat Hunting! 🔍🛡️**
