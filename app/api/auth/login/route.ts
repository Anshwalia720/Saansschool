import { createSession, publicUser, verifyPassword } from '../../../lib/server/auth';
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (typeof body?.email !== 'string' || typeof body?.password !== 'string') return Response.json({error:'Email and password are required.'},{status:400});
  const user = verifyPassword(body.email.trim(),body.password);
  if (!user) return Response.json({error:'Email or password is incorrect.'},{status:401});
  await createSession(user.id);
  return Response.json({user:publicUser(user)});
}
