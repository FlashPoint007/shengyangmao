import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title:'省羊毛 · 每一份优惠，都有据可查',
 description:'银行支付、生活消费、电商优惠、AI 免费额度和游戏限免。一站查看官方来源、参与门槛、有效期与核验记录。',
 icons:{icon:'/favicon.svg'},
};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="zh-CN"><body>{children}</body></html>;
}
