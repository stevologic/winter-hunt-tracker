# Winter Hunt public checkpoint journal

Static GitHub Pages website. Only public-safe branding, requirements and milestone information belong here. Never copy private game source, account identities, app IDs or credentials into this repository. Private download URLs are excluded except for the user's explicitly authorized a047a9a private draft release-page link in `data/private-playtest.json`. That public link does not grant access or authorize uploading its ZIP publicly. The earlier vetted public Windows ZIP remains a separate baseline.

`data/checkpoints.json` is the auditable source. Update a checkpoint to `verified` only with acceptance evidence and public-safe evidence links. A compiled source candidate is not a delivered playable build. Decision verification is distinct from implementation verification. Add the included-feature manifest from a tested build's actual evidence, not the requested feature list.

Run `npm run build && npm test`. Publish the repository root from `main` through GitHub Pages. No paid services, server, package dependencies or custom domain are required.

Planning targets are not deadlines or promises. Steam account gates stay pending until reviewed privately; publish only the sanitized gate result. Official documentation is linked on the website.

The active hero and camp section use genuine visual05 packaged scene/HUD captures; the finale gallery retains its visual02 source labels. Prior AI campfire artwork is retired from the active layout and preserved unchanged as the user's two-character reference. Screenshot provenance is explicit, and captures do not close human or full-game acceptance.

`data/playtest.json` controls the public playtest. Set `state` to `verified` only after receiving the tested complete ZIP and redistribution clearance, inspecting contents, matching the supplied SHA-256 and checking the public release asset. Include exact version, publish date, executable, features and known limits. Keep binaries out of Pages.

`data/private-playtest.json` controls the separately labeled latest private playtest. Its exact release-page URL is allowlisted by validation. Keep the GitHub sign-in/private-draft permission notice, version, launch instructions, exact package identity and unfinished acceptance gates visible. Do not change repository permissions, publish the draft, upload private assets to this tracker or replace `data/playtest.json` when updating this handoff. Draft URLs must be reverified if the release is edited.

The latest publicly authorized test candidate is identified in `data/latest-playtest.json`, with direct `WinterHunt.exe` extraction/launch instructions and separate delivery/human acceptance labels. Earlier public/private download manifests remain frozen. The active hero uses the real visual05 packaged capture recorded in `data/hero.json`; former concept hero assets are retired. No character replacement or generated gameplay is used.

The active theme uses the game's forest/earth/snow/HUD palette, unique visual05 Bigfoot and UFO frames, and solid/gradient content panels. Repeated SVG scene backgrounds, jagged motifs and the invented web compass are retired. Gallery frames remain separately identified as visual02.
