import catalog from '../data/catalog.json';
import registry from '../data/sources.json';
export type Deal = (typeof catalog.deals)[number];
export type Source = (typeof registry)[number];
export const deals = catalog.deals;
export const sources = registry;
export const reviewedAt = catalog.reviewedAt;
export const repository = catalog.repository;
export const repositoryReady = catalog.repositoryReady;
export const categories = [
  {id:'all',name:'全部羊毛',icon:'grid'},
  {id:'bank',name:'银行支付',icon:'bank'},
  {id:'life',name:'生活消费',icon:'coffee'},
  {id:'shop',name:'电商优惠',icon:'bag'},
  {id:'ai',name:'AI 免费额度',icon:'spark'},
  {id:'game',name:'游戏限免',icon:'game'},
  {id:'digital',name:'数字工具',icon:'code'}
];
export function stateOf(d:Deal, now=Date.now()) {
  if(d.expiresAt && new Date(d.expiresAt).getTime()<now) return 'expired';
  if(d.startAt && new Date(d.startAt).getTime()>now) return 'upcoming';
  if(now-new Date(d.verifiedAt).getTime()>7*86400000) return 'stale';
  return d.verified==='rules'?'rules':'entry';
}
export const stateLabels:Record<string,string>={rules:'已核对规则',entry:'官方入口',stale:'待复核',expired:'已结束',upcoming:'未开始'};
export function shortDate(date:string){return new Date(date).toLocaleDateString('zh-CN',{timeZone:'Asia/Shanghai',month:'2-digit',day:'2-digit'});}
