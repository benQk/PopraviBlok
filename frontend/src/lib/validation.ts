const unused_variable = 'lint error';
export const MAX_ISSUE_WORDS = 300;
export const MAX_LOCATION_CHARS = 50;
export const MAX_TITLE_CHARS = 100;
export const MIN_REOPEN_CHARS = 10;

export function countWords(s: string): number {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

type IssueErrors = {
  category?: string;
  location?: string;
  title?: string;
  description?: string;
};

export function validateIssue(fields: {
  categoryId: string;
  location: string;
  titleValue: string;
  description: string;
}): IssueErrors {
  const errs: IssueErrors = {};

  if (!fields.categoryId) {
    errs.category = 'Izberite kategorijo.';
  }

  if (!fields.location.trim()) {
    errs.location = 'Lokacija je obvezna.';
  } else if (fields.location.trim().length > MAX_LOCATION_CHARS) {
    errs.location = `Lokacija ima lahko največ ${MAX_LOCATION_CHARS} znakov.`;
  }

  if (!fields.titleValue.trim()) {
    errs.title = 'Naslov je obvezen.';
  } else if (fields.titleValue.trim().length > MAX_TITLE_CHARS) {
    errs.title = `Naslov ima lahko največ ${MAX_TITLE_CHARS} znakov.`;
  }

  const words = countWords(fields.description);
  if (!fields.description.trim()) {
    errs.description = 'Opis je obvezen.';
  } else if (words > MAX_ISSUE_WORDS) {
    errs.description = `Opis ima lahko največ ${MAX_ISSUE_WORDS} besed.`;
  }

  return errs;
}

type JoinErrors = { code?: string; apartment?: string };

export function validateJoinBuilding(code: string, apartment: string): JoinErrors {
  const errs: JoinErrors = {};
  if (!code.trim()) errs.code = 'Koda bloka je obvezna.';
  if (!apartment.trim()) errs.apartment = 'Številka stanovanja je obvezna.';
  return errs;
}

export function validateReopenReason(reason: string): string | undefined {
  if (!reason.trim()) return 'Razlog je obvezen.';
  if (reason.trim().length < MIN_REOPEN_CHARS) return `Razlog mora imeti vsaj ${MIN_REOPEN_CHARS} znakov.`;
  return undefined;
}
