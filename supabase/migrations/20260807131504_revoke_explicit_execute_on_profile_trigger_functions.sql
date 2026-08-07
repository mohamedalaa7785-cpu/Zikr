/*
# Revoke explicit EXECUTE grants on profile trigger functions

## Summary
A previous migration revoked EXECUTE from the `public` role on the three
profile-creation trigger functions. However, the ACL still contained explicit
`EXECUTE` grants to the `anon` and `authenticated` roles (granted by the
`postgres` superuser during function creation), so the functions remained
callable via the Data API. This migration removes those explicit grants.

## Changes
1. Revoke EXECUTE on all three functions from `anon` and `authenticated`
   explicitly.

## Security
- Fully closes the "Public Can Execute SECURITY DEFINER Function" and
  "Signed-In Users Can Execute SECURITY DEFINER Function" findings. After
  this, only `postgres` and `service_role` retain EXECUTE, which is correct
  for trigger functions that should never be called directly from the API.

## Notes
1. Triggers are unaffected — they run as the function owner, not the
   calling role, so revoking role grants does not stop them from firing.
2. The functions remain SECURITY DEFINER because they must insert into
   `public.profiles` during auth events.
*/

REVOKE EXECUTE ON FUNCTION public.create_profile_for_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.create_profile_for_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.create_profile_on_login() FROM anon;
REVOKE EXECUTE ON FUNCTION public.create_profile_on_login() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.ensure_profile_for_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.ensure_profile_for_user() FROM authenticated;
