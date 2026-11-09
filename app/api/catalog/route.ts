import catalog from '../../../data/catalog.json';
import sources from '../../../data/sources.json';
import {stateOf} from '../../../lib/catalog';
export function GET(){return Response.json({...catalog,deals:catalog.deals.map(d=>({...d,state:stateOf(d)})),sources,notice:'规则核对不等于保证资格或库存；超过7天未复核自动降级。'},{headers:{'Cache-Control':'public, max-age=60','X-Content-Type-Options':'nosniff'}})}
