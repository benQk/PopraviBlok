import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Tables } from '../lib/database.types';

type MyMembership = Tables<'memberships'> & { buildings: Tables<'buildings'> | null };

export function useMyBuildingState() {
  const { session } = useAuth();
  const uid = session!.user.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [memberships, setMemberships] = useState<MyMembership[]>([]);
  const [requests, setRequests] = useState<Tables<'buildings'>[]>([]);

  const reload = useCallback(async () => {
    const [p, m, r] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', uid).single(),
      supabase.from('memberships').select('*, buildings(*)').eq('user_id', uid)
        .order('created_at', { ascending: false }),
      supabase.from('buildings').select('*').eq('requested_by', uid)
        .order('created_at', { ascending: false }),
    ]);
    const err = p.error ?? m.error ?? r.error;

    if (err) {
        setError(err.message);
    } else if (!p.data) {
        setError('Profile not found');
    } else {
        setError(null);
        setFullName(p.data.full_name);
        setMemberships(m.data as MyMembership[]);
        setRequests(r.data ?? []);
    }
    setLoading(false);
  }, [uid]);

  useEffect(() => {
    reload();
    const onVisible = () => { if (document.visibilityState === 'visible') reload(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [reload]);

  return { loading, error, fullName, memberships, requests, reload };
}