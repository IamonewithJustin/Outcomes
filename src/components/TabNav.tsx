import type { TabName, WorkshopState } from '../types';

type NavTab = {
  id: TabName;
  label: string;
  badge?: number;
};

const navTabs = (state: WorkshopState): NavTab[] => [
  { id: 'overview', label: 'Overview' },
  { id: 'long', label: 'Long-Term 5Y', badge: state.long.length },
  { id: 'mid', label: 'Mid-Term 2026', badge: state.mid.length },
  { id: 'short', label: 'Short-Term 90D', badge: state.short.length },
  { id: 'actions', label: 'Action Register', badge: state.actions.length },
];

type TabNavProps = {
  state: WorkshopState;
  activeTab: TabName;
  onSwitch: (tab: TabName) => void;
};

export function TabNav({ state, activeTab, onSwitch }: TabNavProps) {
  return (
    <nav className="tab-bar" aria-label="Primary">
      {navTabs(state).map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={tab.id === activeTab ? 'tab-button active' : 'tab-button'}
          onClick={() => onSwitch(tab.id)}
        >
          <span>{tab.label}</span>
          {typeof tab.badge === 'number' ? <strong>{tab.badge}</strong> : null}
        </button>
      ))}
    </nav>
  );
}