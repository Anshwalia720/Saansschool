import { currentUser, publicUser } from '../../../lib/server/auth';
export async function GET() { const user=await currentUser(); return user ? Response.json({user:publicUser(user)}) : Response.json({user:null},{status:401}); }
