export type TabName = 'overview' | 'long' | 'mid' | 'short' | 'actions';

export type ActionStatus = 'Not Started' | 'In Progress' | 'Done' | 'Blocked';
export type ActionPriority = 'High' | 'Medium' | 'Low';
export type ActionFilter = 'all' | 'High' | 'In Progress' | 'Blocked';

export interface OutputTask {
  id: string;
  description: string;
  owner: string;
}

export interface OutcomeOutput {
  id: string;
  name: string;
  tasks: OutputTask[];
}

export interface ShortOutcome {
  id: string;
  outcome: string;
  measure1: string;
  measure2: string;
  target: string;
  responsiblePerson: string;
  notes: string;
  linkedMidTerm: string[];
  outputs: OutcomeOutput[];
}

export interface MidOutcome {
  id: string;
  outcome: string;
  progress: string;
  measure1: string;
  target1: string;
  measure2: string;
  target2: string;
  owner: string;
  notes: string;
  linkedLongTerm: string[];
}

export interface LongOutcome {
  id: string;
  outcome: string;
  measure1: string;
  target1: string;
  measure2: string;
  target2: string;
  notes: string;
}

export interface ActionItem {
  id: string;
  task: string;
  owner: string;
  due: string;
  related: string;
  status: ActionStatus;
  priority: ActionPriority;
  support: string;
  decision: string;
  notes: string;
}

export interface WorkshopState {
  sessionName: string;
  sessionDate: string;
  short: ShortOutcome[];
  mid: MidOutcome[];
  long: LongOutcome[];
  actions: ActionItem[];
}