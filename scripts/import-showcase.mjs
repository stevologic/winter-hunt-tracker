// Explicit first-party allowlist. Never crawl or copy a game checkout or build.
import {execFileSync} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const revision = '8c515f28c376ae9f27c40786c5432d24ef321633';
const files = [
  ['Environment', 'WH_PonderosaPine_C'],
  ['Environment', 'WH_PocketSpruce'],
  ['Environment', 'WH_BoulderSnow'],
  ['Camp', 'WH_CanvasTent'],
  ['Camp', 'WH_Campfire'],
  ['Camp', 'WH_CamperRV'],
  ['Camp', 'WH_Lantern']
];
const get = path => execFileSync('gh', ['api', `repos/stevologic/operation-winter-steam-sale/contents/AssetPacks/${path}?ref=${revision}`, '-H', 'Accept: application/vnd.github.raw'], {maxBuffer: 5_000_000});
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
await mkdir('assets/showcase', {recursive: true});
const models = [];
for (const [category, name] of files) {
  const sourcePath = `${category}/${name}/${name}.glb`;
  const bytes = get(sourcePath);
  if (bytes.toString('ascii', 0, 4) !== 'glTF') throw Error(`Invalid GLB: ${name}`);
  await writeFile(`assets/showcase/${name}.glb`, bytes);
  models.push({name, sourcePath: `AssetPacks/${sourcePath}`, bytes: bytes.length, sha256: sha256(bytes)});
}
const texturePath = 'Textures/WH_Tex_Snow/WH_Tex_Snow_BaseColor.jpg';
const original = get(texturePath);
const webTexture = await sharp(original).resize(512, 512).webp({quality: 76}).toBuffer();
await writeFile('assets/showcase/WH_Tex_Snow_BaseColor.webp', webTexture);
await writeFile('assets/showcase/LICENSE.md', get('LICENSE.md'));
await writeFile('assets/showcase/provenance.json', JSON.stringify({
  repository: 'stevologic/operation-winter-steam-sale', revision,
  sourceBranch: 'claude/friendly-turing-ozrk6r',
  rights: 'Original first-party Winter Hunt artwork. Rights belong to the project owner. Owner-authorized marketing use; no new public asset license is granted.',
  models,
  textures: [{name: 'WH_Tex_Snow_BaseColor', sourcePath: `AssetPacks/${texturePath}`, sourceBytes: original.length, sourceSha256: sha256(original), path: 'WH_Tex_Snow_BaseColor.webp', bytes: webTexture.length, sha256: sha256(webTexture), treatment: 'Resized to 512 x 512; WebP quality 76. No other texture maps used.'}],
  totalModelBytes: models.reduce((sum, model) => sum + model.bytes, 0)
}, null, 2) + '\n');
console.log(JSON.stringify({models: models.length, bytes: models.reduce((sum, model) => sum + model.bytes, 0), textureBytes: webTexture.length}));
