import { publicDemoEnabled } from '../../../lib/server/demo-mode';
export async function GET() {
  if (publicDemoEnabled) return Response.json({ user: null, demoMode: true }, { headers: { 'Cache-Control': 'no-store' } });
  const { currentUser, publicUser } = await import('../../../lib/server/auth');
  const user=await currentUser();
  return user ? Response.json({user:publicUser(user)}) : Response.json({user:null},{status:401});
}
