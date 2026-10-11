/** Public, read-only access is the default after removing the login screen. */
export const publicDemoEnabled = process.env.SAANSSCHOOL_PUBLIC_DEMO !== 'false';

export function demoReadOnlyResponse() {
  return Response.json(
    { error: 'This action is unavailable in the public demo.', demoMode: true },
    { status: 403, headers: { 'Cache-Control': 'no-store' } },
  );
}
