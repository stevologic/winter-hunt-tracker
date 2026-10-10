# Winter Hunt public checkpoint journal

Static GitHub Pages website. Only public-safe branding, requirements and milestone information belong here. Never copy private game source, private download URLs, account identities, app IDs or credentials into this repository. The user authorized one vetted compiled Windows ZIP for public playtesting, hosted as a GitHub Release asset after package, runtime and redistribution checks.

`data/checkpoints.json` is the auditable source. Update a checkpoint to `verified` only with acceptance evidence and public-safe evidence links. A compiled source candidate is not a delivered playable build. Decision verification is distinct from implementation verification. Add the included-feature manifest from a tested build's actual evidence, not the requested feature list.

Run `npm run build && npm test`. Publish the repository root from `main` through GitHub Pages. No paid services, server, package dependencies or custom domain are required.

Planning targets are not deadlines or promises. Steam account gates stay pending until reviewed privately; publish only the sanitized gate result. Official documentation is linked on the website.

Current visuals use genuine historical game screenshots, labeled with their source checkpoint. Screenshots do not verify features in a newer package and were not used as AI input. The earlier imagined concept artwork is no longer displayed.

`data/playtest.json` controls the public playtest. Set `state` to `verified` only after receiving the tested complete ZIP and redistribution clearance, inspecting contents, matching the supplied SHA-256 and checking the public release asset. Include exact version, publish date, executable, features and known limits. Keep binaries out of Pages.
