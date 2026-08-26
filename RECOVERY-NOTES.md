# Recovery notes (2026-08-26)

Original dev source was lost in a local machine crash. This copy was
reconstructed from the installed extension files under Chrome's profile
directory (`.../Extensions/<id>/2.5.1_0/`), which is unminified and appears
complete.

## What was changed from the raw installed copy

- Removed `_metadata/computed_hashes.json` and `_metadata/verified_contents.json`
  — Chrome-generated integrity files, not source, regenerated per-package.
- Removed `"key"` and `"update_url"` from `manifest.json` — both are injected
  by Chrome on install. `update_url` in particular is **rejected** by the
  Chrome Web Store dashboard on upload (reserved for self-hosted CRX
  extensions).

## Before uploading a new build to the Web Store

- [ ] Bump `"version"` in `manifest.json` above `2.5.1` (the Store will not
      accept a re-upload at the currently-published version, even after
      this cleanup).
- [ ] Load this folder as an unpacked extension (`chrome://extensions` →
      Developer mode → "Load unpacked") and smoke-test popup + options
      before zipping for upload.
- [ ] Zip the *contents* of this folder (manifest.json at the zip root),
      not the folder itself.

## Known issue found in this version (not yet fixed)

`options.js` sets `city` from the same free-text field as `name`
(~line 374), and `popup.js` falls back to `member.city` for the row
subtitle when no teammate names are set (~line 1156-1158). Net effect:
a city added without teammate names renders its own name twice, in
whatever case it was typed (see e.g. "helsinki", "london" in current
screenshots). Not fixed here — flagging for the next change.
