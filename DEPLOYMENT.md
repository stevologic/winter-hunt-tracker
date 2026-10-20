# Hosting eligibility

Verified 2026-10-10: GitHub Pages is available for public repositories under GitHub Free, so this separate public static repository needs no plan upgrade. The authenticated account's plan field was unavailable; public repository eligibility does not depend on a paid plan.

Source: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

Reconciliation found no existing Winter Hunt release tracker in the owner's repository list. The game repository remains private and is not modified.


# Every public test-build delivery

1. Obtain the game owner's newest completed frozen package and exact source/build/payload/ZIP fingerprints. Do not advertise a source-only or unfinished build. Reserve executable validation with the game owner.
2. Inspect all ZIP entries, CRCs and hashes; exclude private source, Evidence/Recovery, logs, saves, credentials and unrelated files. Preserve compiled runtime, configs and required license notices. Publish the authorized ZIP as a test prerelease in this existing tracker repository; preserve old release assets.
3. Fetch the public asset anonymously, match the source size/SHA-256, freshly extract every file and run supported isolated checks. Verify actual Zombie presence; distinguish a diagnostic-mode fixture from menu selection. Record unavailable interactive or human checks and retain failed Horde/purchase gates. Release the executable window promptly.
4. Update `data/latest-playtest.json` with the exact public asset/release URL, build/date/source/payload/hash, extraction and `WinterHunt.exe` instructions, and candid limits. Update the static `#play` fallback to the identical latest asset/version/hash. Older public/private JSON manifests remain separate, explicitly older; the 1d79ef7 public baseline has no Zombie Mode.
5. Bump the playtest script/metadata cache token in `index.html` and `playtest.js`; update all hero/download CTA paths and full-page fallback links. Keep real screenshot/build provenance and labels accurate if imagery is retained from an earlier build.
6. Run the build/site checks, including latest/fallback identity and failed-fetch isolation. Publish tracker source and verify served HTML/metadata against the exact commit. Test desktop/mobile and disabled-JavaScript/failed-latest-fetch fallbacks; inspect every download CTA, mode instructions, donation controls and image links. Recheck the latest anonymous public asset hash. Delivery verification never closes human-playtest, gameplay, multiplayer or Steam gates.

The Support the developer footer uses only the user's supplied Dogecoin address and decoded X Money target. No transfer, payment, account authentication or tax/reward claim is performed by publication.

Display the actual GitHub release/publication timestamp beside each version/download in Phoenix local time (America/Phoenix, MST/UTC-7). Keep it distinct from package build time. Update data/download-dates.json for new releases; preserve old timestamps. Private drafts have no public release date. Never stamp the current date on an unchanged older build.

## Current publication override — October 20, 2026

The public-download presentation instructions above are historical. The current landing page must not display public package links or internal build labels. Keep provenance records and existing GitHub release artifacts intact. Publish the static root from main, run `npm run build` and `npm test`, and verify no legacy renderer restores download links. Testing access remains individually managed and pending; campaign contributions carry no advertised access promise.
