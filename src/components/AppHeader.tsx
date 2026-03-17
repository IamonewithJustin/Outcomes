import type { ChangeEvent, RefObject } from 'react';

type AppHeaderProps = {
  sessionName: string;
  sessionDate: string;
  onSessionNameChange: (value: string) => void;
  onSessionDateChange: (value: string) => void;
  onExport: () => void;
  onExportPowerPoint: () => void;
  onImportClick: () => void;
  onImport: (event: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
};

export function AppHeader({
  sessionName,
  sessionDate,
  onSessionNameChange,
  onSessionDateChange,
  onExport,
  onExportPowerPoint,
  onImportClick,
  onImport,
  fileInputRef,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
        </div>
        <div>
          <p className="eyebrow">Outcomes workshop transition</p>
          <h1>Outcomes Workshop</h1>
        </div>
      </div>

      <div className="session-toolbar">
        <label>
          <span>Session / team</span>
          <input
            type="text"
            value={sessionName}
            onChange={(event) => onSessionNameChange(event.target.value)}
            placeholder="Commercial excellence"
          />
        </label>
        <label>
          <span>Date</span>
          <input
            type="date"
            value={sessionDate}
            onChange={(event) => onSessionDateChange(event.target.value)}
          />
        </label>
        <div className="toolbar-actions">
          <div className="toolbar-stack">
            <button className="btn btn-primary" type="button" onClick={onExport}>Save JSON</button>
            <button className="btn btn-secondary" type="button" onClick={onExportPowerPoint}>Export PowerPoint</button>
          </div>
          <button className="btn btn-secondary" type="button" onClick={onImportClick}>Load JSON</button>
          <input ref={fileInputRef} type="file" accept=".json" hidden onChange={onImport} />
        </div>
      </div>
    </header>
  );
}