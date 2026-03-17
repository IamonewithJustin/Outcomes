import type {
  ActionItem,
  ActionPriority,
  ActionStatus,
  LongOutcome,
  MidOutcome,
  OutcomeOutput,
  OutputTask,
  ShortOutcome,
  WorkshopState,
} from './types';

export const STORAGE_KEY = 'moa_workflow_biotech';

export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }

  return Math.random().toString(36).slice(2, 10);
}

export function createTask(): OutputTask {
  return { id: uid(), description: '', owner: '' };
}

export function createOutput(): OutcomeOutput {
  return { id: uid(), name: '', tasks: [createTask()] };
}

export function createShortOutcome(): ShortOutcome {
  return {
    id: uid(),
    outcome: '',
    measure1: '',
    measure2: '',
    target: '',
    responsiblePerson: '',
    notes: '',
    linkedMidTerm: [],
    outputs: [createOutput()],
  };
}

export function createMidOutcome(): MidOutcome {
  return {
    id: uid(),
    outcome: '',
    progress: '',
    measure1: '',
    target1: '',
    measure2: '',
    target2: '',
    owner: '',
    notes: '',
    linkedLongTerm: [],
  };
}

export function createLongOutcome(): LongOutcome {
  return {
    id: uid(),
    outcome: '',
    measure1: '',
    target1: '',
    measure2: '',
    target2: '',
    notes: '',
  };
}

export function createAction(id: string): ActionItem {
  return {
    id,
    task: '',
    owner: '',
    due: '',
    related: '',
    status: 'Not Started',
    priority: 'Medium',
    support: '',
    decision: '',
    notes: '',
  };
}

export function createInitialState(): WorkshopState {
  return {
    sessionName: '',
    sessionDate: todayString(),
    short: [],
    mid: [],
    long: [],
    actions: [],
  };
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeTask(value: unknown): OutputTask {
  if (!isRecord(value)) {
    return createTask();
  }

  return {
    id: asString(value.id) || uid(),
    description: asString(value.description),
    owner: asString(value.owner),
  };
}

function normalizeOutput(value: unknown): OutcomeOutput {
  if (!isRecord(value)) {
    return createOutput();
  }

  const tasks = Array.isArray(value.tasks) ? value.tasks.map(normalizeTask) : [createTask()];

  return {
    id: asString(value.id) || uid(),
    name: asString(value.name),
    tasks: tasks.length > 0 ? tasks : [createTask()],
  };
}

function normalizeShortOutcome(value: unknown): ShortOutcome {
  if (!isRecord(value)) {
    return createShortOutcome();
  }

  const outputs = Array.isArray(value.outputs) ? value.outputs.map(normalizeOutput) : [createOutput()];

  return {
    id: asString(value.id) || uid(),
    outcome: asString(value.outcome),
    measure1: asString(value.measure1),
    measure2: asString(value.measure2),
    target: asString(value.target),
    responsiblePerson: asString(value.responsiblePerson),
    notes: asString(value.notes),
    linkedMidTerm: asStringArray(value.linkedMidTerm),
    outputs: outputs.length > 0 ? outputs : [createOutput()],
  };
}

function normalizeMidOutcome(value: unknown): MidOutcome {
  if (!isRecord(value)) {
    return createMidOutcome();
  }

  return {
    id: asString(value.id) || uid(),
    outcome: asString(value.outcome),
    progress: asString(value.progress),
    measure1: asString(value.measure1),
    target1: asString(value.target1),
    measure2: asString(value.measure2),
    target2: asString(value.target2),
    owner: asString(value.owner),
    notes: asString(value.notes),
    linkedLongTerm: asStringArray(value.linkedLongTerm),
  };
}

function normalizeLongOutcome(value: unknown): LongOutcome {
  if (!isRecord(value)) {
    return createLongOutcome();
  }

  return {
    id: asString(value.id) || uid(),
    outcome: asString(value.outcome),
    measure1: asString(value.measure1),
    target1: asString(value.target1),
    measure2: asString(value.measure2),
    target2: asString(value.target2),
    notes: asString(value.notes),
  };
}

function normalizeActionStatus(value: unknown): ActionStatus {
  return value === 'In Progress' || value === 'Done' || value === 'Blocked' ? value : 'Not Started';
}

function normalizeActionPriority(value: unknown): ActionPriority {
  return value === 'High' || value === 'Low' ? value : 'Medium';
}

function normalizeAction(value: unknown): ActionItem {
  if (!isRecord(value)) {
    return createAction('A01');
  }

  return {
    id: asString(value.id) || 'A01',
    task: asString(value.task),
    owner: asString(value.owner),
    due: asString(value.due),
    related: asString(value.related),
    status: normalizeActionStatus(value.status),
    priority: normalizeActionPriority(value.priority),
    support: asString(value.support),
    decision: asString(value.decision),
    notes: asString(value.notes),
  };
}

export function normalizeState(value: unknown): WorkshopState {
  if (!isRecord(value)) {
    return createInitialState();
  }

  return {
    sessionName: asString(value.sessionName),
    sessionDate: asString(value.sessionDate) || todayString(),
    short: Array.isArray(value.short) ? value.short.map(normalizeShortOutcome) : [],
    mid: Array.isArray(value.mid) ? value.mid.map(normalizeMidOutcome) : [],
    long: Array.isArray(value.long) ? value.long.map(normalizeLongOutcome) : [],
    actions: Array.isArray(value.actions) ? value.actions.map(normalizeAction) : [],
  };
}

export function truncateText(value: string, length = 60): string {
  if (!value) {
    return '(No description)';
  }

  return value.length > length ? `${value.slice(0, length)}...` : value;
}

export function outcomeOptionLabel(value: string, index: number): string {
  return value ? `${index + 1}. ${truncateText(value, 50)}` : `${index + 1}. Outcome ${index + 1}`;
}

export function getNextPrefixedId(ids: string[], prefix: string): string {
  const max = ids.reduce((highest, id) => {
    const match = id.match(/(\d+)$/);
    if (!match) {
      return highest;
    }

    return Math.max(highest, Number.parseInt(match[1], 10));
  }, 0);

  return `${prefix}${String(max + 1).padStart(2, '0')}`;
}