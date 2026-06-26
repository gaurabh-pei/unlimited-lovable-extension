# Contributing

Thanks for your interest in improving Maxx's Lovable!

## Dev loop

There is no build step — load `./` as an unpacked extension and reload
from `chrome://extensions` after each edit. The side panel hot-reloads
on close/reopen.

## Code style

- Vanilla JS, no transpiler. Target evergreen Chromium.
- Keep modules small and side-effect free where possible.
- Prefer `chrome.storage.local` over `localStorage` (MV3 SW restriction).
- Never log access tokens, license keys, or user PII.

## Reporting issues

Open a GitHub issue with:
- Browser + version
- Steps to reproduce
- Console output (`chrome://extensions` → service worker → Inspect)

## Submitting changes

1. Fork & branch (`feat/<short-name>` or `fix/<short-name>`).
2. Keep PRs focused — one concern per PR.
3. Manually verify the side panel still opens and license validation
   round-trips against your dev backend.
4. Update README.md if you change install steps or config keys.

## License

By contributing you agree your changes are released under the MIT license.
