import {
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import './App.css';
import { exportWorkshopPowerPoint } from './powerpoint';
import { AppHeader } from './components/AppHeader';
import { TabNav } from './components/TabNav';
import { ActionsTab } from './components/tabs/ActionsTab';
import { LongTermTab } from './components/tabs/LongTermTab';
import { MidTermTab } from './components/tabs/MidTermTab';
import { OverviewTab } from './components/tabs/OverviewTab';
import { ShortTermTab } from './components/tabs/ShortTermTab';
import type {
  ActionFilter,
  ActionItem,
  LongOutcome,
  MidOutcome,
  OutcomeOutput,
  OutputTask,
  ShortOutcome,
  TabName,
  WorkshopState,
} from './types';
import {
  STORAGE_KEY,
  createAction,
  createInitialState,
  createLongOutcome,
  createMidOutcome,
  createOutput,
  createShortOutcome,
  createTask,
  getNextPrefixedId,
  normalizeState,
  todayString,
  truncateText,
} from './workshop';

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasRestoredRef = useRef(false);

  const [state, setState] = useState<WorkshopState>(createInitialState);
  const [activeTab, setActiveTab] = useState<TabName>('overview');
  const [actionFilter, setActionFilter] = useState<ActionFilter>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useEffectEvent((message: string) => {
    setToastMessage(message);
  });

  const persistState = useEffectEvent(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      persistState();
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [persistState]);

  useEffect(() => {
    if (hasRestoredRef.current) {
      return;
    }

    hasRestoredRef.current = true;
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    try {
      const parsed = normalizeState(JSON.parse(saved));
      const hasData = parsed.short.length > 0 || parsed.mid.length > 0 || parsed.long.length > 0 || parsed.actions.length > 0;

      if (hasData && window.confirm('Restore previous session?')) {
        setState(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(null), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const switchTab = (tab: TabName) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  const updateSessionField = (field: 'sessionName' | 'sessionDate', value: string) => {
    setState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const addLongOutcome = () => {
    setState((current) => ({
      ...current,
      long: [...current.long, createLongOutcome()],
    }));
    showToast('Long-term outcome added.');
  };

  const addMidOutcome = () => {
    setState((current) => ({
      ...current,
      mid: [...current.mid, createMidOutcome()],
    }));
    showToast('Mid-term outcome added.');
  };

  const addShortOutcome = () => {
    setState((current) => ({
      ...current,
      short: [...current.short, createShortOutcome()],
    }));
    showToast('Short-term outcome added.');
  };

  const removeLongOutcome = (id: string) => {
    if (!window.confirm('Remove this outcome?')) {
      return;
    }

    setState((current) => ({
      ...current,
      long: current.long.filter((item) => item.id !== id),
      mid: current.mid.map((item) => ({
        ...item,
        linkedLongTerm: item.linkedLongTerm.filter((linkedId) => linkedId !== id),
      })),
    }));
    showToast('Long-term outcome removed.');
  };

  const removeMidOutcome = (id: string) => {
    if (!window.confirm('Remove this outcome?')) {
      return;
    }

    setState((current) => ({
      ...current,
      mid: current.mid.filter((item) => item.id !== id),
      short: current.short.map((item) => ({
        ...item,
        linkedMidTerm: item.linkedMidTerm.filter((linkedId) => linkedId !== id),
      })),
    }));
    showToast('Mid-term outcome removed.');
  };

  const removeShortOutcome = (id: string) => {
    if (!window.confirm('Remove this outcome?')) {
      return;
    }

    setState((current) => ({
      ...current,
      short: current.short.filter((item) => item.id !== id),
    }));
    showToast('Short-term outcome removed.');
  };

  const updateLongField = (id: string, field: keyof LongOutcome, value: string) => {
    setState((current) => ({
      ...current,
      long: current.long.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const updateMidField = (id: string, field: keyof MidOutcome, value: string | string[]) => {
    setState((current) => ({
      ...current,
      mid: current.mid.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const updateShortField = (id: string, field: keyof ShortOutcome, value: string | string[] | OutcomeOutput[]) => {
    setState((current) => ({
      ...current,
      short: current.short.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const addOutputToShortOutcome = (outcomeId: string) => {
    setState((current) => ({
      ...current,
      short: current.short.map((item) => (
        item.id === outcomeId
          ? { ...item, outputs: [...item.outputs, createOutput()] }
          : item
      )),
    }));
    showToast('Output added.');
  };

  const removeOutputFromShortOutcome = (outcomeId: string, outputId: string) => {
    if (!window.confirm('Remove this output and all its tasks?')) {
      return;
    }

    setState((current) => ({
      ...current,
      short: current.short.map((item) => (
        item.id === outcomeId
          ? { ...item, outputs: item.outputs.filter((output) => output.id !== outputId) }
          : item
      )),
    }));
    showToast('Output removed.');
  };

  const updateOutputField = (outcomeId: string, outputId: string, value: string) => {
    setState((current) => ({
      ...current,
      short: current.short.map((item) => (
        item.id === outcomeId
          ? {
              ...item,
              outputs: item.outputs.map((output) => (
                output.id === outputId ? { ...output, name: value } : output
              )),
            }
          : item
      )),
    }));
  };

  const addTaskToOutput = (outcomeId: string, outputId: string) => {
    setState((current) => ({
      ...current,
      short: current.short.map((item) => (
        item.id === outcomeId
          ? {
              ...item,
              outputs: item.outputs.map((output) => (
                output.id === outputId
                  ? { ...output, tasks: [...output.tasks, createTask()] }
                  : output
              )),
            }
          : item
      )),
    }));
    showToast('Task added.');
  };

  const removeTaskFromOutput = (outcomeId: string, outputId: string, taskId: string) => {
    setState((current) => ({
      ...current,
      short: current.short.map((item) => (
        item.id === outcomeId
          ? {
              ...item,
              outputs: item.outputs.map((output) => (
                output.id === outputId
                  ? { ...output, tasks: output.tasks.filter((task) => task.id !== taskId) }
                  : output
              )),
            }
          : item
      )),
    }));
    showToast('Task removed.');
  };

  const updateTaskField = (outcomeId: string, outputId: string, taskId: string, field: keyof OutputTask, value: string) => {
    setState((current) => ({
      ...current,
      short: current.short.map((item) => (
        item.id === outcomeId
          ? {
              ...item,
              outputs: item.outputs.map((output) => (
                output.id === outputId
                  ? {
                      ...output,
                      tasks: output.tasks.map((task) => (
                        task.id === taskId ? { ...task, [field]: value } : task
                      )),
                    }
                  : output
              )),
            }
          : item
      )),
    }));
  };

  const pushTaskToActions = (outcomeId: string, outputId: string, taskId: string) => {
    const outcome = state.short.find((item) => item.id === outcomeId);
    const output = outcome?.outputs.find((item) => item.id === outputId);
    const task = output?.tasks.find((item) => item.id === taskId);

    if (!outcome || !output || !task) {
      return;
    }

    const nextId = getNextPrefixedId(state.actions.map((item) => item.id), 'A');
    const outcomeIndex = state.short.findIndex((item) => item.id === outcomeId);
    const related = `90D Outcome ${outcomeIndex + 1}: ${truncateText(outcome.outcome, 40)} -> Output: ${output.name || 'Untitled output'}`;

    setState((current) => ({
      ...current,
      actions: [
        ...current.actions,
        {
          ...createAction(nextId),
          task: task.description,
          owner: task.owner,
          related,
          notes: 'Pushed from short-term output task.',
        },
      ],
    }));

    setActionFilter('all');
    switchTab('actions');
    showToast('Task added to the Action Register.');
  };

  const addAction = () => {
    const nextId = getNextPrefixedId(state.actions.map((item) => item.id), 'A');
    setState((current) => ({
      ...current,
      actions: [...current.actions, createAction(nextId)],
    }));
    showToast('Action added.');
  };

  const updateActionField = (id: string, field: keyof ActionItem, value: string) => {
    setState((current) => ({
      ...current,
      actions: current.actions.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeAction = (id: string) => {
    if (!window.confirm('Remove this action?')) {
      return;
    }

    setState((current) => ({
      ...current,
      actions: current.actions.filter((item) => item.id !== id),
    }));
    showToast('Action removed.');
  };

  const handleExport = () => {
    const payload = JSON.stringify(state, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const sessionName = state.sessionName.trim() || 'workshop';
    anchor.href = url;
    anchor.download = `${sessionName.replace(/\s+/g, '_')}_moa_workflow_${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast('Session exported.');
  };

  const handleExportPowerPoint = async () => {
    try {
      const fileName = await exportWorkshopPowerPoint(state);
      showToast(`PowerPoint exported: ${fileName}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown export error';
      window.alert(`Unable to export PowerPoint: ${message}`);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const loaded = normalizeState(JSON.parse(String(reader.result)));
        setState(loaded);
        setActionFilter('all');
        showToast('Session loaded.');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown import error';
        window.alert(`Error loading file: ${message}`);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const filteredActions = state.actions.filter((item) => {
    if (actionFilter === 'all') {
      return true;
    }

    if (actionFilter === 'High') {
      return item.priority === 'High';
    }

    return item.status === actionFilter;
  });

  const doneCount = state.actions.filter((item) => item.status === 'Done').length;
  const blockedCount = state.actions.filter((item) => item.status === 'Blocked').length;
  const highPriorityActions = state.actions.filter((item) => item.priority === 'High' && item.status !== 'Done').slice(0, 6);

  return (
    <div className="app-shell">
      <AppHeader
        sessionName={state.sessionName}
        sessionDate={state.sessionDate || todayString()}
        onSessionNameChange={(value) => updateSessionField('sessionName', value)}
        onSessionDateChange={(value) => updateSessionField('sessionDate', value)}
        onExport={handleExport}
        onExportPowerPoint={handleExportPowerPoint}
        onImportClick={handleImportClick}
        onImport={handleImport}
        fileInputRef={fileInputRef}
      />

      <TabNav state={state} activeTab={activeTab} onSwitch={switchTab} />

      <main className="page-content">
        {activeTab === 'overview' ? (
          <OverviewTab
            state={state}
            doneCount={doneCount}
            blockedCount={blockedCount}
            highPriorityActions={highPriorityActions}
            onSwitchTab={switchTab}
          />
        ) : null}

        {activeTab === 'long' ? (
          <LongTermTab items={state.long} onAdd={addLongOutcome} onDelete={removeLongOutcome} onUpdate={updateLongField} />
        ) : null}

        {activeTab === 'mid' ? (
          <MidTermTab items={state.mid} longItems={state.long} onAdd={addMidOutcome} onDelete={removeMidOutcome} onUpdate={updateMidField} />
        ) : null}

        {activeTab === 'short' ? (
          <ShortTermTab
            items={state.short}
            midItems={state.mid}
            onAdd={addShortOutcome}
            onDelete={removeShortOutcome}
            onUpdate={updateShortField}
            onAddOutput={addOutputToShortOutcome}
            onRemoveOutput={removeOutputFromShortOutcome}
            onUpdateOutput={updateOutputField}
            onAddTask={addTaskToOutput}
            onRemoveTask={removeTaskFromOutput}
            onUpdateTask={updateTaskField}
            onPushTask={pushTaskToActions}
          />
        ) : null}

        {activeTab === 'actions' ? (
          <ActionsTab
            items={filteredActions}
            filter={actionFilter}
            onFilterChange={setActionFilter}
            onAdd={addAction}
            onUpdate={updateActionField}
            onDelete={removeAction}
          />
        ) : null}
      </main>

      <div className={toastMessage ? 'toast show' : 'toast'}>{toastMessage}</div>
    </div>
  );
}

export default App;
