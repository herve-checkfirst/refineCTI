# Changelog - refineCTI Extension

All notable changes to the refineCTI extension will be documented in this file.

## [2.4.0] - 2025-10-27

### Added
- Cryptographic hash extraction module (refineCTI-hash.js)
  - MD5, SHA1, SHA256, SHA512 hash extraction
  - MurmurHash extraction for favicon fingerprinting
  - Intelligent deduplication to avoid substring matches
  - Context-aware MurmurHash extraction with date filtering
- New "Hash" menu category with 6 extraction options
- Comprehensive hash format documentation

### Use Cases
- Malware file analysis and hash-based IOC databases
- Favicon fingerprinting with Shodan MurmurHash values
- Correlation of file signatures across threat feeds

## [2.3.0] - 2025-10-27

### Added
- Social media extraction module (refineCTI-social.js)
  - Telegram post URL and username extraction
  - Bluesky handle extraction (standard, custom domains, bridges)
  - Generic social media handle extraction (@username formats)
  - Extract all social identifiers at once
- New "Social Media" menu category with organized submenus
- Support for Mastodon bridge handles (@user.domain.ap.brid.gy)

### Documentation
- Added 3 new examples for social media extraction
- Documented all supported social media formats

## [2.2.0] - 2025-10-27

### Changed
- Major code refactoring for modular architecture
  - refineCTI-core.js: Defang/Fang operations only
  - refineCTI-IOC.js: All IOC extraction functions (NEW)
  - refineCTI-crypto.js: Cryptocurrency extraction
  - refineCTI-menu.js: Menu integration

### Added
- Full IPv6 address extraction support
  - Full format, compressed format, loopback, link-local
  - Defanged IPv6 with [:] notation
  - Combined IPv4 + IPv6 extraction in single operation

### Improved
- Better code organization for community contributions
- Enhanced documentation with IPv6 examples
- Separated concerns for easier maintenance

## [2.1.0] - 2025-10-27

### Added
- Cryptocurrency address extraction module (refineCTI-crypto.js)
  - Bitcoin: Legacy (P2PKH), SegWit (P2SH), Native SegWit (Bech32), Taproot
  - Ethereum: Standard 0x addresses
  - Monero: Standard, Integrated, and SubAddress formats
  - Solana: Base58 encoded addresses
  - Extract all cryptocurrency addresses at once
- New "Crypto Addresses" menu category
- Reorganized menu structure with clear categories

### Documentation
- Added cryptocurrency examples and use cases
- Documented all supported crypto address formats

## [2.0.0] - 2025-10-26

### Changed
- **BREAKING:** Complete rewrite in pure JavaScript
- Removed Python/Jython dependencies for better portability
- Client-side IOC extraction for improved performance
- Menu-only interface (no GREL functions)

### Improved
- Faster IOC extraction through client-side processing
- Fully portable - works with any OpenRefine installation
- No Python interpreter required
- Simplified architecture and maintenance
- Fixed RuntimeException on different machines
- Fixed duplicate IOCs in extractAllIOCs

### Added
- ESLint configuration for code quality
- Consistent code style enforcement

### Migration from 1.x
- Menu operations remain unchanged (backward compatible)
- All functionality preserved
- No GREL expressions available (client-side only)
- Use menu operations for all IOC extraction tasks

## [1.0.0] - 2025-10-25

### Added
- Initial release of refineCTI extension
- IOC extraction capabilities:
  - Extract HTTP/HTTPS/FTP URLs
  - Extract domain names
  - Extract IPv4 addresses
  - Extract email addresses
  - Extract all IOC types at once
- Defang/Fang operations:
  - Defang (Militarize) IOCs for safe sharing
  - Fang (Demilitarize) defanged IOCs
- GUI menu integration under "CTI Operations"
- Support for both normal and defanged IOC formats
- Automatic deduplication of extracted IOCs
- Smart return values (string for single, comma-separated for multiple)
- Comprehensive documentation (README.md, EXAMPLES.md, QUICK_TEST.md)
- CSS styling for IOC display

### Technical
- Pure JavaScript implementation
- No external dependencies
- Compatible with OpenRefine 3.x and 4.x
- Performance optimized for large datasets

## [Unreleased]

### Planned for Future Releases
- CVE identifier extraction
- MITRE ATT&CK technique extraction
- Custom IOC pattern support
- Batch operations improvements
- Export IOCs to STIX/MISP formats
- Integration with threat intelligence APIs
- IOC validation and enrichment
- Performance improvements for 100k+ row datasets

## Upgrade Guide

### From 1.x to 2.x

**Breaking Changes:**
- No GREL functions available (client-side processing only)
- All operations must use menu interface

**Benefits:**
- No Python dependencies required
- Faster client-side processing
- Better portability across systems
- More stable operation

**Migration Steps:**
1. Remove any GREL expressions using refineCTI functions
2. Use menu operations instead: Column dropdown → CTI Operations
3. All functionality remains available through menu

### From 2.x to 2.4.x

**Non-breaking changes:**
- New categories added to CTI Operations menu
- All existing operations remain in same locations
- No migration required

## Version History Summary

- **v2.4.0**: Added hash extraction (MD5, SHA1, SHA256, SHA512, MurmurHash)
- **v2.3.0**: Added social media extraction (Telegram, Bluesky, handles)
- **v2.2.0**: Code refactoring, IPv6 support
- **v2.1.0**: Added cryptocurrency address extraction
- **v2.0.0**: Complete JavaScript rewrite, removed Python dependencies
- **v1.0.0**: Initial release with basic IOC extraction

## Release Notes

### Version 2.4.0 - Hash Extraction

This release adds comprehensive cryptographic hash extraction capabilities, essential for malware analysis and threat intelligence workflows.

**Key Features:**
- Extract MD5, SHA1, SHA256, SHA512 hashes from malware reports
- MurmurHash extraction for favicon fingerprinting (Shodan)
- Intelligent deduplication prevents substring matches
- Context-aware extraction reduces false positives

**Use Cases:**
- Build hash-based IOC databases from sandbox reports
- Extract file signatures from threat intelligence feeds
- Favicon fingerprinting for infrastructure tracking

### Version 2.0.0 - Pure JavaScript Rewrite

This major release removes all Python/Jython dependencies, making refineCTI fully portable and easier to deploy.

**Benefits:**
- Works on any OpenRefine installation without Python
- Faster client-side processing
- Simpler installation and maintenance
- More reliable operation across different systems

**Breaking Changes:**
- No GREL functions (use menu interface instead)
- All operations perform client-side processing

## Feedback and Contributions

- Report issues on GitHub repository
- Feature requests welcome
- Pull requests accepted
- Follow ESLint code style guidelines

---

**Documentation:** See README.md for complete usage guide and examples.
