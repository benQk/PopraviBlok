import { describe, it, expect } from 'vitest';
import { countWords, validateIssue, validateJoinBuilding, validateReopenReason } from '../validation';

const validIssue = {
  categoryId: 'cat-1',
  location: 'klet',
  titleValue: 'Pokvarjena luč',
  description: 'Luč v kleti ne deluje.',
};

describe('countWords', () => {
  it('vrne 0 za prazen niz', () => expect(countWords('')).toBe(0));
  it('pravilno šteje besede', () => expect(countWords('ena dve tri')).toBe(3));
  it('ignorira odvečne presledke', () => expect(countWords('  a  b  ')).toBe(2));
});

describe('validateIssue', () => {
  it('ni napak pri veljavnih podatkih', () => expect(Object.keys(validateIssue(validIssue))).toHaveLength(0));
  it('napaka pri manjkajoči kategoriji', () => expect(validateIssue({ ...validIssue, categoryId: '' }).category).toBeDefined());
  it('napaka pri prazni lokaciji', () => expect(validateIssue({ ...validIssue, location: '' }).location).toBeDefined());
  it('napaka pri lokaciji nad 50 znakov', () => expect(validateIssue({ ...validIssue, location: 'a'.repeat(51) }).location).toBeDefined());
  it('napaka pri praznem opisu', () => expect(validateIssue({ ...validIssue, description: '' }).description).toBeDefined());
  it('napaka pri opisu nad 300 besed', () => expect(validateIssue({ ...validIssue, description: Array(301).fill('x').join(' ') }).description).toBeDefined());
});

describe('validateJoinBuilding', () => {
  it('ni napak pri veljavnih podatkih', () => expect(Object.keys(validateJoinBuilding('ABC123', '5A'))).toHaveLength(0));
  it('napaka pri manjkajoči kodi', () => expect(validateJoinBuilding('', '5A').code).toBeDefined());
  it('napaka pri manjkajočem stanovanju', () => expect(validateJoinBuilding('ABC123', '').apartment).toBeDefined());
});

describe('validateReopenReason', () => {
  it('napaka pri praznem razlogu', () => expect(validateReopenReason('')).toBeDefined());
  it('ni napake pri zadostnem razlogu', () => expect(validateReopenReason('Zadosten razlog za zavrnitev.')).toBeUndefined());
});
