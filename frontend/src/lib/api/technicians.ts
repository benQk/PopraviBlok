import { supabase } from '../supabase';

export async function addTechnician(buildingId: string, email: string, categoryId: string) {
  const { data, error } = await supabase.rpc('add_technician', {
    p_building: buildingId, p_email: email, p_category: categoryId,
  });
  if (error) throw error;
  return data;
}

// Serviserji bloka; z categoryId samo tisti prave stroke (AC2)
export async function listTechnicians(buildingId: string, categoryId?: string) {
  let q = supabase
    .from('memberships')
    .select('id, user_id, category_id, created_at, profiles(full_name, email), categories(name)')
    .eq('building_id', buildingId)
    .eq('role', 'TECHNICIAN')
    .eq('status', 'APPROVED');
  if (categoryId) q = q.eq('category_id', categoryId);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}