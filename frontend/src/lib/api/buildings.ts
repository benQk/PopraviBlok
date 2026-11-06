import { supabase } from '../supabase';

export const PAGE_SIZE = 10;

export async function requestBuilding(name: string, address: string) {
  const { data, error } = await supabase.rpc('request_building', { p_name: name, p_address: address });
  if (error) throw error;
  return data;
}

export async function reviewBuilding(id: string, approve: boolean) {
  const { error } = await supabase.rpc('review_building', { p_building: id, p_approve: approve });
  if (error) throw error;
}

export async function joinBuilding(code: string, apartment: string) {
  const { data, error } = await supabase.rpc('join_building', { p_code: code, p_apartment: apartment });
  if (error) throw error;
  return data;
}

export async function reviewMembership(id: string, approve: boolean) {
  const { error } = await supabase.rpc('review_membership', { p_membership: id, p_approve: approve });
  if (error) throw error;
}

// Admin: čakajoči zahtevki za bloke, najnovejši prvi
export async function listPendingBuildings(page: number) {
  const from = page * PAGE_SIZE;
  const { data, count, error } = await supabase
    .from('buildings')
    .select('*, profiles(full_name, email)', { count: 'exact' })
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  if (error) throw error;
  return { rows: data, total: count ?? 0 };
}

// Upravnik: čakajoči stanovalci bloka
export async function listPendingMemberships(buildingId: string, page: number) {
  const from = page * PAGE_SIZE;
  const { data, count, error } = await supabase
    .from('memberships')
    .select('*, profiles(full_name, email)', { count: 'exact' })
    .eq('building_id', buildingId)
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  if (error) throw error;
  return { rows: data, total: count ?? 0 };
}