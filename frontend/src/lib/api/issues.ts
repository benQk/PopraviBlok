import { supabase } from '../supabase';

export const ISSUES_PAGE_SIZE = 6;

export async function listCategories() {
  const { data, error } = await supabase.from('categories').select('id, name').order('name');
  if (error) throw error;
  return data;
}

type NewIssue = { buildingId: string; categoryId: string; title: string; description: string; location: string };

export async function createIssue(i: NewIssue) {
  const { data, error } = await supabase.rpc('create_issue', {
    p_building: i.buildingId,
    p_category: i.categoryId,
    p_title: i.title,
    p_description: i.description,
    p_location: i.location,
  });
  if (error) throw error;
  return data;
}

// Aktivne prijave bloka, najnovejše prve
export async function listIssues(buildingId: string, page: number, search: string) {
  const from = page * ISSUES_PAGE_SIZE;
  let q = supabase
    .from('issues')
    .select('*, categories(name), reporter:profiles!issues_reporter_id_fkey(full_name)', { count: 'exact' })
    .eq('building_id', buildingId)
    .not('status', 'in', '(CLOSED,REJECTED,MERGED)');

  const term = search.trim().replace(/[%,()*\\_]/g, ' ').trim();
  if (term) {
    q = q.or(`title.ilike.%${term}%,location.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const { data, count, error } = await q
    .order('created_at', { ascending: false })
    .range(from, from + ISSUES_PAGE_SIZE - 1);
  if (error) throw error;
  return { rows: data, total: count ?? 0 };
}