import { describe, it, expect } from 'vitest';
import { STATUS_LABEL, PRIORITY_LABEL } from '../issueLabels';

describe('STATUS_LABEL', () => {
  it('vsebuje vse 8 statusov', () => {
    ['NEW','ASSIGNED','IN_PROGRESS','RESOLVED','CLOSED','REOPENED','REJECTED','MERGED']
      .forEach(s => expect(STATUS_LABEL).toHaveProperty(s));
  });
  it('NEW → text Nova, tone info', () => { expect(STATUS_LABEL.NEW.text).toBe('Nova'); expect(STATUS_LABEL.NEW.tone).toBe('info'); });
  it('RESOLVED → tone ok', () => expect(STATUS_LABEL.RESOLVED.tone).toBe('ok'));
});

describe('PRIORITY_LABEL', () => {
  it('LOW → Nizka', () => expect(PRIORITY_LABEL.LOW).toBe('Nizka'));
  it('NORMAL → Običajna', () => expect(PRIORITY_LABEL.NORMAL).toBe('Običajna'));
  it('URGENT → Nujno', () => expect(PRIORITY_LABEL.URGENT).toBe('Nujno'));
});
