import{mkdir,cp,rm}from'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const p of ['index.html','roadmap.html','style.css','app.js','playtest.js','support.js','world.css','delivery.css','game-theme.css','site-refresh.css','forest-theme.css','world.js','production.js','data','assets','.nojekyll'])await cp(p,`dist/${p}`,{recursive:true});
console.log('Static build complete.');

