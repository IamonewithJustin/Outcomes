import type { ActionFilter, ActionItem, ActionPriority, ActionStatus } from '../../types';
import { SectionHeader } from '../shared';

type ActionsTabProps = {
  items: ActionItem[];
  filter: ActionFilter;
  onFilterChange: (filter: ActionFilter) => void;
  onAdd: () => void;
  onUpdate: (id: string, field: keyof ActionItem, value: string) => void;
  onDelete: (id: string) => void;
};

export function ActionsTab({ items, filter, onFilterChange, onAdd, onUpdate, onDelete }: ActionsTabProps) {
  return (
    <section className="panel-stack">
      <SectionHeader
        eyebrow="Action register"
        title="Who does what and when"
        copy="Track delivery commitments, dependencies, and blockers."
        actionLabel="Add action"
        onAction={onAdd}
      />

      <div className="filter-row">
        {(['all', 'High', 'In Progress', 'Blocked'] as ActionFilter[]).map((currentFilter) => (
          <button
            key={currentFilter}
            type="button"
            className={currentFilter === filter ? 'pill-button active' : 'pill-button'}
            onClick={() => onFilterChange(currentFilter)}
          >
            {currentFilter}
          </button>
        ))}
      </div>

      <div className="table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Task</th>
                <th>Owner</th>
                <th>Due Date</th>
                <th>Related Outcome</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Support Needed</th>
                <th>Decision Required</th>
                <th>Notes</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="id-cell">{item.id}</td>
                  <td><textarea value={item.task} onChange={(event) => onUpdate(item.id, 'task', event.target.value)} placeholder="Describe the task" /></td>
                  <td><input value={item.owner} onChange={(event) => onUpdate(item.id, 'owner', event.target.value)} placeholder="Owner" /></td>
                  <td><input type="date" value={item.due} onChange={(event) => onUpdate(item.id, 'due', event.target.value)} /></td>
                  <td><input value={item.related} onChange={(event) => onUpdate(item.id, 'related', event.target.value)} placeholder="Link to outcome" /></td>
                  <td>
                    <select value={item.status} onChange={(event) => onUpdate(item.id, 'status', event.target.value as ActionStatus)}>
                      {(['Not Started', 'In Progress', 'Done', 'Blocked'] as ActionStatus[]).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select value={item.priority} onChange={(event) => onUpdate(item.id, 'priority', event.target.value as ActionPriority)}>
                      {(['High', 'Medium', 'Low'] as ActionPriority[]).map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </td>
                  <td><input value={item.support} onChange={(event) => onUpdate(item.id, 'support', event.target.value)} placeholder="Support needed" /></td>
                  <td><input value={item.decision} onChange={(event) => onUpdate(item.id, 'decision', event.target.value)} placeholder="Decision required" /></td>
                  <td><input value={item.notes} onChange={(event) => onUpdate(item.id, 'notes', event.target.value)} placeholder="Notes" /></td>
                  <td><button className="icon-button danger" type="button" onClick={() => onDelete(item.id)}>Delete</button></td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td colSpan={11}>
                    <div className="empty-state small">No actions match the current filter.</div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}