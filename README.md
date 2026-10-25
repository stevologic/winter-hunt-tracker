# Winter Hunt public checkpoint journal

## Original-art website showcase — October 25, 2026

The landing page now pairs a lightweight, explicitly labeled Three.js art scene
with a separate authentic gameplay gallery. The scene is original Winter Hunt
marketing artwork, not gameplay or confirmation of Unity integration. The
historical gameplay manifest and all original capture hashes remain unchanged.
`assets/showcase/provenance.json` and the adjacent license document the seven
unchanged first-party GLBs, one optimized snow texture and pinned art revision.
No bought/private third-party raw assets, Unity files or build packages are used.

Use Node 22+, `npm ci`, `npm run build`, `npm test`, and `npm run qa` (requires the
Playwright Chromium browser). `npm run preview` serves http://127.0.0.1:4173/.
The generated `static/showcase.js` and Three.js MIT notice are committed because
GitHub Pages serves the repository root. Rebuild after editing `scene/camp.js`.
No new backend, analytics, accounts or payment service is introduced.

The first render is an 82 KB poster; 3D code and models load only on request.
The 622 KB bundle compresses to 160 KB gzip; models total 774,108 bytes and the
texture is 4,454 bytes. The scene uses 72 draw calls / 17,972 triangles, a maximum
1.5 DPR and 1.2 million pixels, one render pass, no dynamic shadows, and optional
24 FPS motion. Motion starts paused, respects reduced-motion changes, and stops
rendering offscreen or in hidden tabs. Model failure, disabled WebGL/JavaScript
and context loss retain the poster and all essential links.

`npm test` retains all existing Drive, Build81, donation and image integrity
guards, and adds exact source hashes, self-contained GLBs, truthful labeling,
notice and byte budgets. `npm run qa` checks desktop/mobile accessibility,
keyboard controls, no eager 3D requests, rendering limits, reduced motion,
failed downloads/retry and real WebGL loss/recovery. The PR workflow produces
a downloadable website preview and screenshots; it does not deploy. Publication
remains a separate review/merge decision. Local/browser timings are not a claim
about real mobile GPU performance or game acceptance.

The earlier theme notes below describe prior revisions. Current copy continues
to use the approved restricted Drive folder and Build81 designation; newer game
build delivery is separate work and is not promoted by this website change.

Static GitHub Pages website. Only public-safe branding, requirements and milestone information belong here. Never copy private game source, account identities, app IDs or credentials into this repository. Private download URLs are excluded except for the user's explicitly authorized a047a9a private draft release-page link in `data/private-playtest.json`. That public link does not grant access or authorize uploading its ZIP publicly. The earlier vetted public Windows ZIP remains a separate baseline.

`data/checkpoints.json` is the auditable source. Update a checkpoint to `verified` only with acceptance evidence and public-safe evidence links. A compiled source candidate is not a delivered playable build. Decision verification is distinct from implementation verification. Add the included-feature manifest from a tested build's actual evidence, not the requested feature list.

Run `npm run build && npm test`. Publish the repository root from `main` through GitHub Pages. No paid services, server, package dependencies or custom domain are required.

Planning targets are not deadlines or promises. Steam account gates stay pending until reviewed privately; publish only the sanitized gate result. Official documentation is linked on the website.

The active hero and camp section use genuine visual05 packaged scene/HUD captures; the finale gallery retains its visual02 source labels. Prior AI campfire artwork is retired from the active layout and preserved unchanged as the user's two-character reference. Screenshot provenance is explicit, and captures do not close human or full-game acceptance.

`data/playtest.json` controls the public playtest. Set `state` to `verified` only after receiving the tested complete ZIP and redistribution clearance, inspecting contents, matching the supplied SHA-256 and checking the public release asset. Include exact version, publish date, executable, features and known limits. Keep binaries out of Pages.

`data/private-playtest.json` controls the separately labeled latest private playtest. Its exact release-page URL is allowlisted by validation. Keep the GitHub sign-in/private-draft permission notice, version, launch instructions, exact package identity and unfinished acceptance gates visible. Do not change repository permissions, publish the draft, upload private assets to this tracker or replace `data/playtest.json` when updating this handoff. Draft URLs must be reverified if the release is edited.

The latest publicly authorized test candidate is identified in `data/latest-playtest.json`, with direct `WinterHunt.exe` extraction/launch instructions and separate delivery/human acceptance labels. Earlier public/private download manifests remain frozen. The active hero uses the real visual05 packaged capture recorded in `data/hero.json`; former concept hero assets are retired. No character replacement or generated gameplay is used.

The active theme uses the game's forest/earth/snow/HUD palette, unique visual05 Bigfoot and UFO frames, and solid/gradient content panels. Repeated SVG scene backgrounds, jagged motifs and the invented web compass are retired. Gallery frames remain separately identified as visual02.

The October 14 Phoenix tracker refresh presents existing Visual05 frames uncropped with captions outside the game HUD, and keeps the older Visual02 finale archive collapsed and explicitly dated. The ledger/checkpoints foreground the public Visual05 test rather than the earlier sign-in-only draft. Current private validation remains separate from downloadable builds. Steam Deck, sustained 30 FPS, human acceptance, high-density and separate-PC multiplayer gates remain open.

## Current public website access policy — October 20, 2026

The landing page now uses plain work-in-progress copy and an individually approved restricted Google Drive access link. Do not expose public package/download links, internal build IDs or technical provenance in the page. Retain the existing data manifests, original image filenames and historical verification scripts as provenance; they are not rendered by the landing page. The old app/playtest/production renderers must remain disconnected from index.html. `npm test` checks this public-page policy. Earlier package-delivery checks are historical and must not be used to restore public download links.

The GoFundMe link supports development. Do not promise testing access, a game copy or a reward for any contribution until explicitly authorized following the separate campaign-terms review. The published Google Drive folder link lets signed-in users request access; the owner approves requests individually. Keep the stable folder URL rather than a direct build-file link.
