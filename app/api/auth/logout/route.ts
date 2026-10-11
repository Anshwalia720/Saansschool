import { publicDemoEnabled } from '../../../lib/server/demo-mode';
export async function POST() {
  if (publicDemoEnabled) return Response.json({ ok: true, demoMode: true });
  const { destroySession } = await import('../../../lib/server/auth');
  await destroySession();
  return Response.json({ok:true});
}
