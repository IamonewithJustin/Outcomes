import type { MidOutcome, LongOutcome } from '../../types';
import { outcomeOptionLabel } from '../../workshop';
import { FieldBlock, OutcomeCard, SectionHeader } from '../shared';

type MidTermTabProps = {
  items: MidOutcome[];
  longItems: LongOutcome[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, field: keyof MidOutcome, value: string | string[]) => void;
};

export function MidTermTab({ items, longItems, onAdd, onDelete, onUpdate }: MidTermTabProps) {
  return (
    <section className="panel-stack">
      <SectionHeader
        eyebrow="Mid-term outcomes"
        title="2026 milestone layer"
        copy="Progress milestones toward your long-range vision, achievable by the end of 2026."
        actionLabel="Add outcome"
        onAction={onAdd}
      />

      <div className="cards-grid">
        {items.map((item, index) => (
          <OutcomeCard key={item.id} index={index} tone="mid" title="Mid-Term Outcome" onDelete={() => onDelete(item.id)}>
            <FieldBlock label="Outcome (Impact) - by 2026">
              <textarea value={item.outcome} onChange={(event) => onUpdate(item.id, 'outcome', event.target.value)} placeholder="What will be different by the end of 2026?" />
            </FieldBlock>
            <FieldBlock label="Linked to Long-Term Outcomes">
              <select
                multiple
                size={Math.max(3, Math.min(5, longItems.length || 3))}
                value={item.linkedLongTerm}
                onChange={(event) => onUpdate(item.id, 'linkedLongTerm', Array.from(event.target.selectedOptions, (option) => option.value))}
              >
                {longItems.length === 0 ? <option disabled>No long-term outcomes yet</option> : null}
                {longItems.map((longItem, longIndex) => (
                  <option key={longItem.id} value={longItem.id}>{outcomeOptionLabel(longItem.outcome, longIndex)}</option>
                ))}
              </select>
              <small>Hold Ctrl/Cmd to select multiple outcomes.</small>
            </FieldBlock>
            <FieldBlock label="Progress toward 5-Year Vision">
              <textarea value={item.progress} onChange={(event) => onUpdate(item.id, 'progress', event.target.value)} placeholder="How does this move you toward the 5-year goal?" />
            </FieldBlock>
            <div className="field-grid four">
              <FieldBlock label="Measure 1">
                <input value={item.measure1} onChange={(event) => onUpdate(item.id, 'measure1', event.target.value)} placeholder="Metric" />
              </FieldBlock>
              <FieldBlock label="2026 Target 1">
                <input value={item.target1} onChange={(event) => onUpdate(item.id, 'target1', event.target.value)} placeholder="Target value" />
              </FieldBlock>
              <FieldBlock label="Measure 2">
                <input value={item.measure2} onChange={(event) => onUpdate(item.id, 'measure2', event.target.value)} placeholder="Metric" />
              </FieldBlock>
              <FieldBlock label="2026 Target 2">
                <input value={item.target2} onChange={(event) => onUpdate(item.id, 'target2', event.target.value)} placeholder="Target value" />
              </FieldBlock>
            </div>
            <div className="field-grid two">
              <FieldBlock label="Owner">
                <input value={item.owner} onChange={(event) => onUpdate(item.id, 'owner', event.target.value)} placeholder="Person responsible" />
              </FieldBlock>
              <FieldBlock label="Notes">
                <input value={item.notes} onChange={(event) => onUpdate(item.id, 'notes', event.target.value)} placeholder="Any caveats or context" />
              </FieldBlock>
            </div>
          </OutcomeCard>
        ))}
        {items.length === 0 ? <div className="empty-state">No mid-term outcomes yet.</div> : null}
      </div>
    </section>
  );
}