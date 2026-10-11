import { demoReadOnlyResponse, publicDemoEnabled } from '../../../lib/server/demo-mode';
export async function POST(request: Request) {
  if (publicDemoEnabled) return demoReadOnlyResponse();
  const { createSession, publicUser, verifyPassword } = await import('../../../lib/server/auth');
  const body = await request.json().catch(() => null);
  if (typeof body?.email !== 'string' || typeof body?.password !== 'string') return Response.json({error:'Email and password are required.'},{status:400});
  const user = verifyPassword(body.email.trim(),body.password);
  if (!user) return Response.json({error:'Email or password is incorrect.'},{status:401});
  await createSession(user.id);
  return Response.json({user:publicUser(user)});
}
