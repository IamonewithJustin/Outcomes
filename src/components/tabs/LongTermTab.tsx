import type { LongOutcome } from '../../types';
import { FieldBlock, OutcomeCard, SectionHeader } from '../shared';

type LongTermTabProps = {
  items: LongOutcome[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, field: keyof LongOutcome, value: string) => void;
};

export function LongTermTab({ items, onAdd, onDelete, onUpdate }: LongTermTabProps) {
  return (
    <section className="panel-stack">
      <SectionHeader
        eyebrow="Long-term outcomes"
        title="5-year vision"
        copy="The ultimate impact your team aims to achieve over the next five years."
        actionLabel="Add outcome"
        onAction={onAdd}
      />

      <div className="cards-grid">
        {items.map((item, index) => (
          <OutcomeCard key={item.id} index={index} tone="long" title="Long-Term Outcome" onDelete={() => onDelete(item.id)}>
            <FieldBlock label="Outcome (Impact) - 5-Year Vision">
              <textarea value={item.outcome} onChange={(event) => onUpdate(item.id, 'outcome', event.target.value)} placeholder="What is the ultimate impact you want to achieve?" />
            </FieldBlock>
            <div className="field-grid four">
              <FieldBlock label="Measure 1">
                <input value={item.measure1} onChange={(event) => onUpdate(item.id, 'measure1', event.target.value)} placeholder="Metric" />
              </FieldBlock>
              <FieldBlock label="Target 1">
                <input value={item.target1} onChange={(event) => onUpdate(item.id, 'target1', event.target.value)} placeholder="Target value" />
              </FieldBlock>
              <FieldBlock label="Measure 2">
                <input value={item.measure2} onChange={(event) => onUpdate(item.id, 'measure2', event.target.value)} placeholder="Metric" />
              </FieldBlock>
              <FieldBlock label="Target 2">
                <input value={item.target2} onChange={(event) => onUpdate(item.id, 'target2', event.target.value)} placeholder="Target value" />
              </FieldBlock>
            </div>
            <FieldBlock label="Notes">
              <textarea value={item.notes} onChange={(event) => onUpdate(item.id, 'notes', event.target.value)} placeholder="Strategic context, assumptions, or dependencies" />
            </FieldBlock>
          </OutcomeCard>
        ))}
        {items.length === 0 ? <div className="empty-state">No long-term outcomes yet.</div> : null}
      </div>
    </section>
  );
}