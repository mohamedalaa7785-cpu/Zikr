/*
# Revoke public EXECUTE on profile-creation trigger functions

## Summary
The three SECURITY DEFINER trigger functions that create/maintain user
profiles (`create_profile_for_new_user`, `create_profile_on_login`,
`ensure_profile_for_user`) were callable by anyone via the PostgREST Data API
(`/rest/v1/rpc/...`) because Postgres grants EXECUTE to PUBLIC by default and
the `anon`/`authenticated` roles inherit from PUBLIC. These functions are only
meant to fire from triggers on `auth.users`; they must not be a public API
endpoint.

## Changes
1. Revoke EXECUTE on all three functions from `public` (which covers `anon`
   and `authenticated` by inheritance).
2. Re-grant EXECUTE to no role — triggers execute as the function owner
   regardless of role grants, so the triggers keep working.

## Security
- Closes the "Public Can Execute SECURITY DEFINER Function" and
  "Signed-In Users Can Execute SECURITY DEFINER Function" findings for all
  three functions.
- Trigger behaviour is unaffected: a trigger runs with the privileges of the
  function owner (the table owner / migration creator), not the calling role,
  so revoking EXECUTE does not stop the triggers from firing.

## Notes
1. The functions remain SECURITY DEFINER because they must insert into
   `public.profiles` during auth events before a profile row exists for the
   user. SECURITY DEFINER is the correct model for a trigger on `auth.users`;
   the exposure was the EXECUTE grant, not the security mode.
2. `create_profile_for_new_user` currently has no active trigger attached, but
   is retained as a trigger function for future use; its EXECUTE grant is
   revoked for the same reason.
*/

REVOKE EXECUTE ON FUNCTION public.create_profile_for_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_profile_on_login() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.ensure_profile_for_user() FROM PUBLIC;
