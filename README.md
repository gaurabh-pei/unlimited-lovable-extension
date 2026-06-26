# Maxx's Lovable — Open Source Edition

Companion Chrome (MV3) extension for [Lovable.dev](https://lovable.dev):
license-gated side panel, prompt asset uploads, and lightweight analytics.

This is the **open source build** — no obfuscation, no anti-tamper, no
encrypted bundles. The exact same source ships in production with those
hardening layers added on top.

## License

MIT — see [LICENSE](./LICENSE).

## Install (unpacked)

1. Download and unzip this archive.
2. Open `chrome://extensions` in Chrome / Edge / Brave / Arc.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and pick the unzipped folder.
5. Open Lovable.dev — the side panel icon appears in the toolbar.

## Project layout

| File | Purpose |
| --- | --- |
| `manifest.json` | MV3 manifest, host permissions, side-panel registration |
| `background.js` | Service worker: license API, fetch proxy, message routing |
| `sidepanel.{html,js,css}` | Side panel UI (license gate, dashboard, settings) |
| `license-gate.js` | Activation gate calling `/api/public/validate-license` |
| `content.js` / `content-bridge.js` | Lovable.dev DOM integration |
| `pageHook.js` | Page-world hook (token capture, network instrumentation) |
| `lovable-auth.js` / `lovable-feature-api.js` | Lovable token + feature helpers |
| `extension-config.js` | API base URL and feature flags |
| `user-messages.js` | Human-readable error translation |
| `sounds.js` | Soft audio cues for success / error states |
| `jszip.min.js` | Vendored ZIP helper for bulk uploads |
| `assets/` | Icons & logo PNGs |

## Configuration

`extension-config.js` defines the backend base URL:

```js
self.MxxConfig = { apiBase: "https://unlimitedprompts.lovable.app" };
```

Point it at your own deployment if you self-host the dashboard.

## Differences vs. the production build

| | Open source | Production |
| --- | --- | --- |
| Obfuscation | none | string-array + control-flow flattening |
| Tamper guard | removed | SHA-256 pinned + Ed25519 signed responses |
| Bundled README / LICENSE | yes | no |

Both builds talk to the same `/api/public/*` endpoints and use the same
license format.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). PRs welcome.
