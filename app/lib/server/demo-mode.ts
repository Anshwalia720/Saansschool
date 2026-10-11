/** Public, read-only deployment mode for demos that must not expose school records. */
export const publicDemoEnabled = process.env.SAANSSCHOOL_PUBLIC_DEMO === 'true';

export function demoReadOnlyResponse() {
  return Response.json(
    { error: 'This action is unavailable in the public demo.', demoMode: true },
    { status: 403, headers: { 'Cache-Control': 'no-store' } },
  );
}
