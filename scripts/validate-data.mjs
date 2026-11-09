import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const catalog=JSON.parse(await readFile(new URL('../data/catalog.json',import.meta.url),'utf8'));
const sources=JSON.parse(await readFile(new URL('../data/sources.json',import.meta.url),'utf8'));
const categories=new Set(['bank','life','shop','ai','game','digital']);
const ids=new Set();
for(const d of catalog.deals){
 assert(!ids.has(d.id),`Duplicate deal ID ${d.id}`);ids.add(d.id);
 assert(categories.has(d.category),`Invalid category ${d.id}`);
 assert(new URL(d.url).protocol==='https:',`Unsafe source URL ${d.id}`);
 assert(['rules','entry'].includes(d.verified),`Invalid verification ${d.id}`);
 assert(['purchase','free'].includes(d.cost),`Invalid cost ${d.id}`);
 assert(Number.isFinite(Date.parse(d.verifiedAt)),`Missing review time ${d.id}`);
 assert(d.eligibility&&d.threshold&&d.cautions.length&&d.steps.length,`Missing conditions ${d.id}`);
 if(d.expiresAt){assert(Number.isFinite(Date.parse(d.expiresAt)));assert(!d.startAt||Date.parse(d.expiresAt)>Date.parse(d.startAt));}
}
assert.equal(new Set(sources.map(s=>s.id)).size,sources.length);
for(const s of sources){assert(categories.has(s.category));assert(['P0','P1','P2'].includes(s.tier));assert(['curated','planned'].includes(s.state));assert(new URL(s.url).protocol==='https:');}
for(const c of categories)assert(catalog.deals.some(d=>d.category===c),`Missing category ${c}`);
console.log(`Validated ${catalog.deals.length} opportunities, ${sources.length} sources, conditions, unique IDs, HTTPS provenance and dates.`);
