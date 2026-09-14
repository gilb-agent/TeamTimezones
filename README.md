# Team Timezones

A Chrome extension that shows what time it is for your team — and, more usefully, who's actually reachable right now.

[Install from the Chrome Web Store →](https://chromewebstore.google.com/detail/team-timezones/makileokchiliacehpmkecgcehebflbb)

★★★★★ (8 ratings)

## Why

Every timezone extension can show you an offset. Team Timezones is built for the actual question you're asking, which is usually "can I message this person right now" or "when can the three of us actually meet" — not "what's the UTC delta."

- **Business hours at a glance** — one line ("Sarah is in business hours") instead of checking each person's clock separately
- **Holiday flags** — a teammate's row shows when their country's on a public holiday
- **Suggest a time** — pick a few people, it finds the best overlapping slot instead of just showing "now"
- **Schedule in one click** — turns that slot into a pre-filled Google Calendar or Outlook draft, with everyone's local time already written into the invite body
- **Copy as a message** — "It's 9am for me, 6pm in Tokyo, 2pm in London," ready to paste into Slack
- **No sign-in, no accounts, no calendar access.** Everything lives in `chrome.storage` — `storage` is the only permission this extension requests.

## What people say

> Use this constantly staying in touch with contacts in Singapore and the US after years in a global role based there. Wish this had existed back then, since it would've saved a lot of manual timezone math when coordinating across regions. No sign-in needed, everything's local, and the business hours view makes it easy to see at a glance who's actually reachable. Does exactly what it says, no fuss.
>
> — Dimitri H.

> I use it everyday. Great app!
>
> — Hidde B.

> Handy, fast and good looking
>
> — Steven M.

## Development

```bash
git clone https://github.com/gilb-agent/TeamTimezones.git
```

Then in Chrome: `chrome://extensions` → enable Developer mode → **Load unpacked** → select the repo folder.

No build step — it's plain HTML/CSS/JS, manifest v3.

## Privacy

See [`privacy-policy.html`](privacy-policy.html). Short version: nothing leaves your browser.
