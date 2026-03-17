import type { ActionItem, TabName, WorkshopState } from '../../types';
import { truncateText } from '../../workshop';
import { LinkageColumn } from '../shared';

type OverviewTabProps = {
  state: WorkshopState;
  doneCount: number;
  blockedCount: number;
  highPriorityActions: ActionItem[];
  onSwitchTab: (tab: TabName) => void;
};

export function OverviewTab({
  state,
  doneCount,
  blockedCount,
  highPriorityActions,
  onSwitchTab,
}: OverviewTabProps) {
  return (
    <section className="panel-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Live summary</p>
          <h2>Outcome architecture across time horizons</h2>
        </div>
        <div className="timeline-band">
          <div className="timeline-node">
            <span className="timeline-dot long">{state.long.length}</span>
            <span>5-Year Long-Term</span>
          </div>
          <div className="timeline-node">
            <span className="timeline-dot mid">{state.mid.length}</span>
            <span>2026 Mid-Term</span>
          </div>
          <div className="timeline-node">
            <span className="timeline-dot short">{state.short.length}</span>
            <span>90-Day Short-Term</span>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total Outcomes</span>
          <strong>{state.long.length + state.mid.length + state.short.length}</strong>
          <small>Across all time horizons</small>
        </article>
        <article className="stat-card accent-green">
          <span>Actions Captured</span>
          <strong>{state.actions.length}</strong>
          <small>{doneCount} complete</small>
        </article>
        <article className="stat-card accent-amber">
          <span>Blocked Actions</span>
          <strong>{blockedCount}</strong>
          <small>Require attention</small>
        </article>
      </section>

      <section className="diagram-panel">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Outcomes summary</p>
            <h3>Linkage map</h3>
          </div>
        </div>

        {state.long.length === 0 && state.mid.length === 0 && state.short.length === 0 ? (
          <div className="empty-state">No outcomes created yet. Add outcomes to see the linkage map.</div>
        ) : (
          <div className="linkage-grid">
            <LinkageColumn
              title="Long-Term (5Y)"
              items={state.long.map((item, index) => {
                const linkedMid = state.mid
                  .map((midItem, midIndex) => (midItem.linkedLongTerm.includes(item.id) ? `Mid-Term Outcome ${midIndex + 1}` : null))
                  .filter((entry): entry is string => Boolean(entry));

                return {
                  id: item.id,
                  tone: 'long' as const,
                  index,
                  text: truncateText(item.outcome),
                  details: linkedMid.length > 0 ? `Linked from ${linkedMid.join(', ')}` : '',
                  onClick: () => onSwitchTab('long'),
                };
              })}
            />

            <LinkageColumn
              title="Mid-Term (2026)"
              items={state.mid.map((item, index) => {
                const linkedLong = item.linkedLongTerm
                  .map((linkedId) => {
                    const longIndex = state.long.findIndex((longItem) => longItem.id === linkedId);
                    return longIndex >= 0 ? `Long-Term Outcome ${longIndex + 1}` : null;
                  })
                  .filter((entry): entry is string => Boolean(entry));

                const linkedShort = state.short
                  .map((shortItem, shortIndex) => (shortItem.linkedMidTerm.includes(item.id) ? `Short-Term Outcome ${shortIndex + 1}` : null))
                  .filter((entry): entry is string => Boolean(entry));

                const details = [
                  linkedLong.length > 0 ? `Linked to ${linkedLong.join(', ')}` : 'Not linked to long-term',
                  linkedShort.length > 0 ? `Linked from ${linkedShort.join(', ')}` : '',
                ].filter(Boolean);

                return {
                  id: item.id,
                  tone: 'mid' as const,
                  index,
                  text: truncateText(item.outcome),
                  details: details.join(' | '),
                  onClick: () => onSwitchTab('mid'),
                };
              })}
            />

            <LinkageColumn
              title="Short-Term (90D)"
              items={state.short.map((item, index) => {
                const linkedMid = item.linkedMidTerm
                  .map((linkedId) => {
                    const midIndex = state.mid.findIndex((midItem) => midItem.id === linkedId);
                    return midIndex >= 0 ? `Mid-Term Outcome ${midIndex + 1}` : null;
                  })
                  .filter((entry): entry is string => Boolean(entry));

                const details = [
                  linkedMid.length > 0 ? `Linked to ${linkedMid.join(', ')}` : 'Not linked to mid-term',
                  item.outputs.length > 0 ? `${item.outputs.length} output${item.outputs.length === 1 ? '' : 's'}` : '',
                ].filter(Boolean);

                return {
                  id: item.id,
                  tone: 'short' as const,
                  index,
                  text: truncateText(item.outcome),
                  details: details.join(' | '),
                  onClick: () => onSwitchTab('short'),
                };
              })}
            />
          </div>
        )}
      </section>

      <section className="summary-grid">
        <article className="summary-card">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Actions</p>
              <h3>High priority queue</h3>
            </div>
          </div>
          {highPriorityActions.length === 0 ? (
            <div className="empty-state small">No high-priority actions.</div>
          ) : (
            <ul className="mini-list">
              {highPriorityActions.map((item) => (
                <li key={item.id}>
                  <span className={`status-dot ${item.status === 'Blocked' ? 'red' : item.status === 'In Progress' ? 'amber' : 'blue'}`} />
                  <div>
                    <strong>{item.id}</strong>
                    <p>{item.task || '(no description)'}</p>
                    {item.owner ? <small>{item.owner}</small> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </section>
  );
}