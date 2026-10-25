import{mkdir,cp,rm}from'node:fs/promises';
import {build} from 'esbuild';
// Commit this bundle too: GitHub Pages serves the repository root directly.
await build({entryPoints:['scene/camp.js'],outfile:'static/showcase.js',bundle:true,format:'esm',target:['es2022'],minify:true,legalComments:'eof'});
await cp('node_modules/three/LICENSE','static/three-LICENSE.txt');
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const p of ['index.html','roadmap.html','style.css','app.js','playtest.js','support.js','world.css','delivery.css','game-theme.css','site-refresh.css','forest-theme.css','world.js','production.js','data','assets','.nojekyll','landing.css','showcase-entry.js','static'])await cp(p,`dist/${p}`,{recursive:true});
console.log('Static build complete.');

