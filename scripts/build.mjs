import{mkdir,cp,rm}from'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const p of ['index.html','style.css','app.js','playtest.js','world.css','world.js','data','assets','.nojekyll'])await cp(p,`dist/${p}`,{recursive:true});
console.log('Static build complete.');

