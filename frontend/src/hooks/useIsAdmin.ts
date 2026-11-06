import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useIsAdmin() {
  const { session } = useAuth();
  const uid = session?.user.id;
  const [state, setState] = useState({ loading: true, isAdmin: false });

  useEffect(() => {
    if (!uid) {
      setState({ loading: false, isAdmin: false });
      return;
    }
    let cancelled = false;
    supabase.from('profiles').select('is_admin').eq('id', uid).single()
      .then(({ data }) => {
        if (!cancelled) setState({ loading: false, isAdmin: !!data?.is_admin });
      });
    return () => { cancelled = true; };
  }, [uid]);

  return state;
}