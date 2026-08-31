# Recovery notes (2026-08-26)

Original dev source was lost in a local machine crash. This copy was
reconstructed from the installed extension files under Chrome's profile
directory (`.../Extensions/<id>/2.5.1_0/`), which was unminified and
complete.

## What was changed from the raw installed copy

- Removed `_metadata/computed_hashes.json` and `_metadata/verified_contents.json`
  — Chrome-generated integrity files, not source, regenerated per-package.
- Removed `"key"` and `"update_url"` from `manifest.json` — both are injected
  by Chrome on install. `update_url` in particular is **rejected** by the
  Chrome Web Store dashboard on upload (reserved for self-hosted CRX
  extensions).

## Since recovery

- Version bumped past `2.5.1` (currently `2.6.0`) as features were added.
- Repo layout flattened to the root — source files used to sit under a
  `Team Timezones 2.5.1_0/` subfolder (an artifact of the raw install-dump
  recovery), now they're at the repo root like a normal extension repo.

## Known issue (still open)

`options.js` sets `city` from the same free-text field as `name`
(`city: name`, ~line 412), and `popup.js` falls back to `member.city` for
the row subtitle when no teammate names are set (~line 1522). Net effect:
a city added without teammate names renders its own name twice, in
whatever case it was typed (e.g. "helsinki", "london" instead of proper
case). Not fixed yet.
