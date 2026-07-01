# Maxx's Lovable — Unlimited Edition ✨

**Version: 2.0.0** | **License: MIT** | **Status: Production Ready**

> 🚀 **Fully Unlimited** — All features, zero restrictions, no license keys required.

## What's Included

✅ **Unlimited Features**
- ∞ Asset uploads (no daily limit)
- ∞ Prompt optimizations
- ∞ Prompts stored in history
- ∞ File size capacity (100MB per file)
- Full API access
- Advanced analytics
- Custom branding support

✅ **Core Capabilities**
- **Side Panel UI** — Craft prompts directly in Lovable.dev
- **Asset Upload** — Attach images, PDFs, and files to prompts
- **Prompt Optimization** — AI-powered prompt enhancement
- **Chat History** — Keep track of all your conversations
- **Theme Customization** — Dark/light mode toggle
- **Quick Shortcuts** — Pre-built prompt templates
- **Advanced Options** — Shield, native chat, watermark removal

✅ **No Setup Required**
- Install and use immediately
- All features enabled by default
- No license keys or validation
- No internet dependency for core features

---

## Installation (Unpacked)

1. **Download and unzip** this repository
2. Open `chrome://extensions` in Chrome/Edge/Brave/Arc
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the unzipped folder
5. Open [Lovable.dev](https://lovable.dev) — the extension icon appears in your toolbar

---

## Features at a Glance

### 💬 Send Prompts with AI Context
- Type naturally or use quick shortcuts (Bugs, Refactor, Errors, Optimize, Comments, SEO, UI, Components, Review)
- Attach images and files inline
- Voice input support
- Automatic token management

### 📎 Attach & Upload Assets
- **Supported formats:** Images (PNG/JPG/WebP), PDFs, documents, code files
- **Auto-compression** for images
- **Drag-and-drop** or paste from clipboard
- **Instant previews** before sending
- No file count or size restrictions

### ✨ Prompt Optimization
- AI-powered prompt enhancement
- One-click optimization
- Maintains context and intent
- Unlimited optimization calls

### 📊 Advanced Tools
- **Remove Watermark** — Hide Lovable branding from your projects
- **Shield** — Lock inputs when you need focus
- **Native Chat** — Use Lovable's native chat interface
- **Download Source** — Export all project files as ZIP
- **Create Project** — Quick project initialization
- **Publish Project** — Share live projects
- **Enable Cloud** — Lovable Cloud support

### 🎨 Customization
- Dark/light theme toggle
- Persistent history
- Custom shortcuts
- Collapsible advanced options
- Keyboard shortcuts support

---

## Project Structure

```
unlimited-lovable-extension/
├── manifest.json                 # MV3 manifest & permissions
├── background.js                 # Service worker & message routing
├── sidepanel.{html,js,css}       # Side panel UI & logic
├── license-gate.js               # Unlimited access (no validation)
├── feature-guard.js              # Feature management (all unlocked)
├── plan-config.js                # Plan tier definitions
├── content.js                    # Lovable.dev integration
├── content-bridge.js             # Bridge between contexts
├── pageHook.js                   # Page-world hook
├── lovable-auth.js               # Token helpers
├── lovable-feature-api.js        # Feature API client
├── user-messages.js              # Error translations
├── extension-config.js           # Configuration & telemetry
├── sounds.js                     # Audio notifications
├── theme.css                     # Theme variables
├── sidepanel.css                 # Sidebar styles
├── jszip.min.js                  # ZIP library
└── assets/                       # Icons & branding
```

---

## Configuration

All settings are in `extension-config.js`:

```javascript
// API endpoint
self.MxxConfig = { apiBase: "https://unlimitedprompts.lovable.app" };
```

Self-host? Update the endpoint URL and redeploy.

---

## Differences: Open-Source vs Production

| Aspect | Open-Source | Production |
|--------|-------------|----------|
| Obfuscation | None | String-array + control-flow flattening |
| Tamper guard | Removed | SHA-256 pinned + Ed25519 signed |
| License validation | None | Backend API calls |
| Features | All unlocked | Plan-based gating available |
| Default mode | Unlimited | Free (with plan upgrades) |

Both versions use the same Lovable API endpoints and file formats.

---

## API Endpoints

The extension communicates with:
- `https://unlimitedprompts.lovable.app/api/public/*` — License validation, uploads, analytics
- `https://api.lovable.dev/*` — Project data, tokens, chat
- `https://lovable.dev/*` — Main application

All requests include proper headers and authentication tokens.

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Send prompt | `Ctrl+Enter` |
| Toggle theme | Click theme button |
| Toggle history | Click history button |
| Attach file | Click paperclip or `Ctrl+Shift+A` |
| Voice input | Click microphone button |

---

## Troubleshooting

### Extension doesn't appear in toolbar
- Reload `chrome://extensions`
- Verify the manifest and content scripts loaded
- Check browser console for errors

### Can't send prompts
- Ensure Lovable.dev tab is open and active
- Wait for "✅ Synced!" status indicator
- Check token status in storage

### Upload fails
- Verify file size (max 100MB)
- Check file format is supported
- Try a smaller file first

### Missing Lovable session
- Open a Lovable project in your main tab
- Refresh the Lovable tab
- Wait for sync indicator to show ✅

---

## Security

- ✅ No obfuscation (open-source transparency)
- ✅ All network requests use HTTPS
- ✅ Tokens stored securely in `chrome.storage.local`
- ✅ No external tracking (analytics are optional)
- ✅ No telemetry by default

---

## Contributing

This is open-source! Feel free to:
- Report bugs or request features
- Submit pull requests
- Fork and customize
- Deploy your own version

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## License

**MIT License** — See [LICENSE](./LICENSE) for full text.

You're free to use, modify, and distribute this extension.

---

## Support & Feedback

- 🐛 Report bugs: [GitHub Issues](https://github.com/gaurabh-pei/unlimited-lovable-extension/issues)
- 💡 Feature requests: Open a discussion
- 📧 Email: support@unlimitedprompts.lovable.app

---

## Changelog

### v2.0.0 (Current)
- ✨ Simplified to Unlimited mode by default
- ✨ Removed license validation
- ✨ All features enabled by default
- ✨ Cleaner UI without upgrade prompts
- ✨ Optimized for open-source distribution

### v1.2.0
- Added three-tier plan system
- Implemented feature gating
- Enhanced license validation

### v1.0.0
- Initial release with basic features

---

**Made with ❤️ for Lovable.dev users**

🚀 **Ready to build? Install now and start creating amazing things!**
