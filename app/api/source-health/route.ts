export async function GET(){
 try{
  const r=await fetch('https://raw.githubusercontent.com/FlashPoint007/shengyangmao/main/public/data/source-health.json',{signal:AbortSignal.timeout(5000),headers:{Accept:'application/json'}});
  if(!r.ok)throw new Error();
  const d=await r.json() as {checkedAt?:string,results?:{ok:boolean}[]};
  if(!d.checkedAt||!Array.isArray(d.results)||d.results.length>100)throw new Error();
  return Response.json({checkedAt:d.checkedAt,ok:d.results.filter(r=>r.ok).length,total:d.results.length},{headers:{'Cache-Control':'public,max-age=300'}});
 }catch{return Response.json({message:'暂无可读取的自动巡检记录。首批内容已人工核对；公开仓库工作流首次成功后可查看巡检结果。'},{headers:{'Cache-Control':'public,max-age=60'}})}
}
