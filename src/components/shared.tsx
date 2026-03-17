import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  copy: string;
  actionLabel: string;
  onAction: () => void;
};

export function SectionHeader({ eyebrow, title, copy, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
      <button className="btn btn-primary" type="button" onClick={onAction}>{actionLabel}</button>
    </div>
  );
}

type FieldBlockProps = {
  label: string;
  children: ReactNode;
};

export function FieldBlock({ label, children }: FieldBlockProps) {
  return (
    <label className="field-block">
      <span>{label}</span>
      {children}
    </label>
  );
}

type OutcomeCardProps = {
  index: number;
  tone: 'long' | 'mid' | 'short';
  title: string;
  onDelete: () => void;
  children: ReactNode;
};

export function OutcomeCard({ index, tone, title, onDelete, children }: OutcomeCardProps) {
  return (
    <article className={`outcome-card ${tone}`}>
      <div className="card-index">{index + 1}</div>
      <div className="outcome-card-header">
        <div>
          <p className="eyebrow">{title}</p>
        </div>
        <button className="icon-button danger" type="button" onClick={onDelete}>Delete</button>
      </div>
      <div className="outcome-card-body">{children}</div>
    </article>
  );
}

export type LinkageItem = {
  id: string;
  tone: 'long' | 'mid' | 'short';
  index: number;
  text: string;
  details: string;
  onClick: () => void;
};

type LinkageColumnProps = {
  title: string;
  items: LinkageItem[];
};

export function LinkageColumn({ title, items }: LinkageColumnProps) {
  return (
    <div className="linkage-column">
      <div className="linkage-column-header">{title}</div>
      {items.length === 0 ? (
        <div className="empty-state small">No outcomes yet.</div>
      ) : (
        items.map((item) => (
          <button key={item.id} type="button" className={`linkage-item ${item.tone}`} onClick={item.onClick}>
            <span className="linkage-number">{item.index + 1}</span>
            <span className="linkage-text">{item.text}</span>
            {item.details ? <small>{item.details}</small> : null}
          </button>
        ))
      )}
    </div>
  );
}