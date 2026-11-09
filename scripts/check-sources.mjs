/** Checks public source reachability; never interprets HTTP success as offer validity. */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const catalog=JSON.parse(await readFile(new URL('../data/catalog.json',import.meta.url),'utf8'));
const output=new URL('../public/data/source-health.json',import.meta.url);
let previous={results:[]};try{previous=JSON.parse(await readFile(output,'utf8'))}catch{}
const approvedHosts=new Set(catalog.deals.map(d=>new URL(d.url).hostname));
const urls=[...new Set(catalog.deals.map(d=>d.url))];
const results=[];
for(const url of urls){
 const start=Date.now();
 try{
  let target=url;let response;
  for(let redirects=0;redirects<=3;redirects++){
   const parsed=new URL(target);
   if(parsed.protocol!=='https:'||!approvedHosts.has(parsed.hostname))throw new Error('redirect_outside_approved_hosts');
   response=await fetch(target,{redirect:'manual',signal:AbortSignal.timeout(12000),headers:{'User-Agent':'ShengYangMao-SourceCheck/1.0 (+https://github.com/FlashPoint007/shengyangmao)','Accept':'text/html,text/markdown,application/json'}});
   if(response.status>=300&&response.status<400){const location=response.headers.get('location');if(!location)throw new Error('redirect_missing_location');target=new URL(location,target).href;if(redirects===3)throw new Error('too_many_redirects');continue;}break;
  }
  if(!response)throw new Error('missing_response');
  const type=response.headers.get('content-type')||'';
  if(!/text|json/.test(type))throw new Error('unsupported_content_type');
  const reader=response.body?.getReader();let bytes=0;const chunks=[];
  if(reader)try{while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>2000000)throw new Error('response_too_large');chunks.push(value)}}finally{await reader.cancel()}
  const body=Buffer.concat(chunks);const hash=createHash('sha256').update(body).digest('hex');
  const prev=previous.results.find(r=>r.url===url);
  results.push({url,ok:response.ok,status:response.status,elapsedMs:Date.now()-start,sha256:hash,changed:prev?.sha256?prev.sha256!==hash:null,meaning:'reachability_only'});
 }catch(error){results.push({url,ok:false,status:null,elapsedMs:Date.now()-start,error:String(error.message).slice(0,160),meaning:'reachability_only'})}
}
await mkdir(new URL('../public/data/',import.meta.url),{recursive:true});
await writeFile(output,JSON.stringify({checkedAt:new Date().toISOString(),notice:'HTTP成功不代表优惠有效。哈希变化可能来自页面动态内容，需人工复核，不自动刷新核验时间。',results},null,2)+'\n');
console.log(`Checked ${results.length} URLs: ${results.filter(r=>r.ok).length} reachable. No offer promoted or verification date changed.`);
