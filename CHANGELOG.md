# Changelog - refineCTI Extension

All notable changes to the refineCTI extension will be documented in this file.

## [2.0.0] - 2025-01-26

### Changed
- **BREAKING:** Complete rewrite in pure JavaScript
- Removed Python/Jython dependencies for better portability
- Client-side IOC extraction for improved performance
- Direct browser execution - no server-side GREL registration needed

### Improved
- Faster IOC extraction (client-side processing)
- Fully portable - works with any OpenRefine installation
- No Python interpreter required
- Simplified architecture and maintenance

### Migration from 1.x
- Menu operations remain unchanged (backward compatible)
- All functionality preserved
- Remove any Python-based GREL expressions (no longer supported)
- Use menu operations for all IOC extraction tasks

## [1.0.0] - 2025-01-26

### Added
- Initial release of refineCTI extension
- IOC extraction functions:
  - `extractURLs(text, defang)` - Extract HTTP/HTTPS/FTP URLs
  - `extractDomains(text, defang)` - Extract domain names
  - `extractIPs(text, defang)` - Extract IPv4 addresses
  - `extractEmails(text, defang)` - Extract email addresses
  - `extractAllIOCs(text, defang)` - Extract all IOC types
- Defang/Fang operations:
  - `defang(ioc)` - Militarize IOCs for safe sharing
  - `fang(ioc)` - Demilitarize defanged IOCs
- GUI menu integration under "CTI Operations"
- Support for both normal and defanged IOC formats
- Automatic deduplication of extracted IOCs
- Smart return values (string for single, comma-separated for multiple)
- Comprehensive documentation (README.md, EXAMPLES.md, QUICK_TEST.md)
- 15+ test cases with expected outputs
- CSS styling for IOC display

### Technical
- Pure JavaScript implementation
- No external dependencies required
- Compatible with OpenRefine 3.x
- Follows OpenRefine extension standards
- Performance optimized for large datasets

## [Unreleased]

### Planned for Future Releases
- IPv6 address extraction support
- MD5/SHA1/SHA256 hash extraction
- CVE identifier extraction
- Bitcoin/cryptocurrency address extraction
- Custom IOC pattern support
- Batch defang/fang operations
- Export IOCs to STIX/MISP formats
- Integration with threat intelligence APIs
- IOC validation and enrichment
- Performance improvements for 100k+ rows

---

## Release Notes

### Version 1.0.0

**Initial Release - Core CTI Functionality**

This first release provides essential tools for working with Indicators of Compromise (IOCs) in OpenRefine:

**🎯 Main Features:**
1. Extract 5 types of IOCs from unstructured text
2. Handle both normal and defanged formats automatically
3. Defang IOCs for safe documentation and sharing
4. Fang (restore) defanged IOCs for automated processing
5. Easy-to-use GUI menu integration
6. GREL function support for advanced workflows

**📊 Use Cases:**
- Parse threat intelligence reports
- Extract IOCs from incident notes
- Sanitize IOCs for sharing in documents
- Prepare IOC feeds for SIEM/IDS
- Clean and normalize CTI data

**🚀 Getting Started:**
See [QUICK_TEST.md](QUICK_TEST.md) for a 5-minute quick start guide.

**📖 Full Documentation:**
See [README.md](README.md) for complete documentation and examples.

---

## Upgrade Guide

### From: No Extension → v1.0.0

**Installation:**
1. Extension is pre-installed in OpenRefine OSINT Docker
2. Restart OpenRefine container: `docker-compose restart openrefine`
3. Functions available immediately after restart

**Verification:**
```grel
extractURLs("test http://example.com", false)
```
Should return: `http://example.com`

---

## Feedback and Contributions

- Report issues on GitHub repository
- Feature requests welcome
- Pull requests accepted

---

**Thank you for using refineCTI! 🔍🛡️**
