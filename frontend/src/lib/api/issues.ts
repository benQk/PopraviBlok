import { supabase } from '../supabase';
import type { Enums } from '../database.types';

export const ISSUES_PAGE_SIZE = 6;

const ISSUE_SELECT =
  '*, categories(name), buildings(name), reporter:profiles!issues_reporter_id_fkey(full_name)';
const ACTIVE = '(CLOSED,REJECTED,MERGED)';

function searchFilter(term: string) {
  const t = term.trim().replace(/[%,()*\\_]/g, ' ').trim();
  return t ? `title.ilike.%${t}%,location.ilike.%${t}%,description.ilike.%${t}%` : null;
}

export async function listCategories() {
  const { data, error } = await supabase.from('categories').select('id, name').order('name');
  if (error) throw error;
  return data;
}

type NewIssue = { buildingId: string; categoryId: string; title: string; description: string; location: string };

export async function getIssue(id: string) {
  const { data, error } = await supabase
    .from('issues')
    .select(`*, categories(name), buildings(name),
      reporter:profiles!issues_reporter_id_fkey(full_name, email),
      assignee:profiles!issues_assignee_id_fkey(full_name, email)`)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function triageIssue(issueId: string, priority: Enums<'issue_priority'>, assigneeId: string) {
  const { data, error } = await supabase.rpc('triage_issue', {
    p_issue: issueId, p_priority: priority, p_assignee: assigneeId,
  });
  if (error) throw error;
  return data;
}

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
  let q = supabase.from('issues').select(ISSUE_SELECT, { count: 'exact' })
    .eq('building_id', buildingId)
    .not('status', 'in', ACTIVE);
  const f = searchFilter(search);
  if (f) q = q.or(f);
  const { data, count, error } = await q
    .order('created_at', { ascending: false })
    .range(from, from + ISSUES_PAGE_SIZE - 1);
  if (error) throw error;
  return { rows: data, total: count ?? 0 };
}

// Serviser: samo prijave, dodeljene njemu (AC1, AC5)
export async function listAssignedIssues(userId: string, page: number, search: string) {
  const from = page * ISSUES_PAGE_SIZE;
  let q = supabase.from('issues').select(ISSUE_SELECT, { count: 'exact' })
    .eq('assignee_id', userId)
    .not('status', 'in', ACTIVE);
  const f = searchFilter(search);
  if (f) q = q.or(f);
  const { data, count, error } = await q
    .order('created_at', { ascending: false })
    .range(from, from + ISSUES_PAGE_SIZE - 1);
  if (error) throw error;
  return { rows: data, total: count ?? 0 };
}

export async function transitionIssue(issueId: string, to: Enums<'issue_status'>, note?: string) {
  const { data, error } = await supabase.rpc('transition_issue', {
    p_issue: issueId, p_to: to, p_note: note,
  });
  if (error) throw error;
  return data;
}

// Zgodovina prijave, najstarejši dogodek prvi
export async function listIssueEvents(issueId: string) {
  const { data, error } = await supabase
    .from('issue_events')
    .select('*, actor:profiles(full_name)')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}