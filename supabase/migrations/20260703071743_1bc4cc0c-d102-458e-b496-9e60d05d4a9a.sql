
CREATE OR REPLACE FUNCTION public.get_my_sessions()
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  refreshed_at timestamptz,
  not_after timestamptz,
  user_agent text,
  ip inet,
  aal text,
  is_current boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = auth, public
AS $$
  SELECT s.id, s.created_at, s.updated_at, s.refreshed_at, s.not_after,
         s.user_agent, s.ip, s.aal::text,
         (s.id::text = (current_setting('request.jwt.claims', true)::jsonb ->> 'session_id')) AS is_current
  FROM auth.sessions s
  WHERE s.user_id = auth.uid()
  ORDER BY COALESCE(s.refreshed_at, s.updated_at, s.created_at) DESC;
$$;

REVOKE ALL ON FUNCTION public.get_my_sessions() FROM public;
GRANT EXECUTE ON FUNCTION public.get_my_sessions() TO authenticated;

CREATE OR REPLACE FUNCTION public.revoke_my_session(_session_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
  _deleted int;
BEGIN
  DELETE FROM auth.sessions
  WHERE id = _session_id AND user_id = auth.uid();
  GET DIAGNOSTICS _deleted = ROW_COUNT;
  RETURN _deleted > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.revoke_my_session(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.revoke_my_session(uuid) TO authenticated;
