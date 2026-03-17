import type { MidOutcome, OutcomeOutput, OutputTask, ShortOutcome } from '../../types';
import { outcomeOptionLabel } from '../../workshop';
import { FieldBlock, OutcomeCard, SectionHeader } from '../shared';

type ShortTermTabProps = {
  items: ShortOutcome[];
  midItems: MidOutcome[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, field: keyof ShortOutcome, value: string | string[] | OutcomeOutput[]) => void;
  onAddOutput: (outcomeId: string) => void;
  onRemoveOutput: (outcomeId: string, outputId: string) => void;
  onUpdateOutput: (outcomeId: string, outputId: string, value: string) => void;
  onAddTask: (outcomeId: string, outputId: string) => void;
  onRemoveTask: (outcomeId: string, outputId: string, taskId: string) => void;
  onUpdateTask: (outcomeId: string, outputId: string, taskId: string, field: keyof OutputTask, value: string) => void;
  onPushTask: (outcomeId: string, outputId: string, taskId: string) => void;
};

export function ShortTermTab({
  items,
  midItems,
  onAdd,
  onDelete,
  onUpdate,
  onAddOutput,
  onRemoveOutput,
  onUpdateOutput,
  onAddTask,
  onRemoveTask,
  onUpdateTask,
  onPushTask,
}: ShortTermTabProps) {
  return (
    <section className="panel-stack">
      <SectionHeader
        eyebrow="Short-term outcomes"
        title="90-day delivery layer"
        copy="Immediate wins and deliverables your team will achieve in the next 90 days."
        actionLabel="Add outcome"
        onAction={onAdd}
      />

      <div className="cards-grid">
        {items.map((item, index) => (
          <OutcomeCard key={item.id} index={index} tone="short" title="Short-Term Outcome" onDelete={() => onDelete(item.id)}>
            <FieldBlock label="Outcome (Impact)">
              <textarea value={item.outcome} onChange={(event) => onUpdate(item.id, 'outcome', event.target.value)} placeholder="What will change as a result of this work?" />
            </FieldBlock>
            <FieldBlock label="Linked to Mid-Term 2026 Outcomes">
              <select
                multiple
                size={Math.max(3, Math.min(5, midItems.length || 3))}
                value={item.linkedMidTerm}
                onChange={(event) => onUpdate(item.id, 'linkedMidTerm', Array.from(event.target.selectedOptions, (option) => option.value))}
              >
                {midItems.length === 0 ? <option disabled>No mid-term outcomes yet</option> : null}
                {midItems.map((midItem, midIndex) => (
                  <option key={midItem.id} value={midItem.id}>{outcomeOptionLabel(midItem.outcome, midIndex)}</option>
                ))}
              </select>
              <small>Hold Ctrl/Cmd to select multiple outcomes.</small>
            </FieldBlock>
            <div className="field-grid three">
              <FieldBlock label="Measure 1 (Metric)">
                <input value={item.measure1} onChange={(event) => onUpdate(item.id, 'measure1', event.target.value)} placeholder="Stakeholders engaged" />
              </FieldBlock>
              <FieldBlock label="Measure 2 (Metric)">
                <input value={item.measure2} onChange={(event) => onUpdate(item.id, 'measure2', event.target.value)} placeholder="Adoption rate" />
              </FieldBlock>
              <FieldBlock label="Target">
                <input value={item.target} onChange={(event) => onUpdate(item.id, 'target', event.target.value)} placeholder=">= 80%" />
              </FieldBlock>
            </div>
            <div className="field-grid two">
              <FieldBlock label="Responsible Person">
                <input value={item.responsiblePerson} onChange={(event) => onUpdate(item.id, 'responsiblePerson', event.target.value)} placeholder="Person responsible" />
              </FieldBlock>
              <FieldBlock label="Notes">
                <input value={item.notes} onChange={(event) => onUpdate(item.id, 'notes', event.target.value)} placeholder="Any caveats or context" />
              </FieldBlock>
            </div>
            <FieldBlock label="Outputs and Tasks">
              <div className="output-stack">
                {item.outputs.map((output, outputIndex) => (
                  <div className="output-card" key={output.id}>
                    <div className="output-toolbar">
                      <div>
                        <span className="output-label">Output {outputIndex + 1}</span>
                      </div>
                      <button className="icon-button danger" type="button" onClick={() => onRemoveOutput(item.id, output.id)}>Remove</button>
                    </div>
                    <FieldBlock label="Deliverable name">
                      <input value={output.name} onChange={(event) => onUpdateOutput(item.id, output.id, event.target.value)} placeholder="Deliverable name" />
                    </FieldBlock>
                    <div className="task-stack">
                      {output.tasks.map((task, taskIndex) => (
                        <div className="task-row" key={task.id}>
                          <input value={task.description} onChange={(event) => onUpdateTask(item.id, output.id, task.id, 'description', event.target.value)} placeholder={`Task ${taskIndex + 1} description`} />
                          <input value={task.owner} onChange={(event) => onUpdateTask(item.id, output.id, task.id, 'owner', event.target.value)} placeholder="Owner" />
                          <button className="btn btn-secondary btn-tight" type="button" onClick={() => onPushTask(item.id, output.id, task.id)}>Push</button>
                          <button className="btn btn-danger btn-tight" type="button" onClick={() => onRemoveTask(item.id, output.id, task.id)}>Delete</button>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-secondary btn-tight" type="button" onClick={() => onAddTask(item.id, output.id)}>Add Task</button>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" type="button" onClick={() => onAddOutput(item.id)}>Add Output</button>
            </FieldBlock>
          </OutcomeCard>
        ))}
        {items.length === 0 ? <div className="empty-state">No short-term outcomes yet.</div> : null}
      </div>
    </section>
  );
}