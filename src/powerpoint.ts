import PptxGenJS from 'pptxgenjs';
import type { ActionItem, LongOutcome, MidOutcome, ShortOutcome, WorkshopState } from './types';
import { truncateText } from './workshop';

const COLORS = {
  background: 'F5F2E8',
  surface: 'FFFFFF',
  ink: '183126',
  muted: '68887A',
  green: '0D925A',
  deepGreen: '0A5940',
  amber: 'DE8F2A',
  blue: '2E6C9D',
  border: 'D9E5DE',
};

const SHAPES = {
  line: 'line',
  rect: 'rect',
  roundRect: 'roundRect',
} as const;

function sanitizeFileName(value: string): string {
  const fallback = 'outcomes_workshop';
  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  return trimmed.replace(/[^a-z0-9-_]+/gi, '_');
}

function chunk<T>(items: T[], size: number): T[][] {
  if (items.length === 0) {
    return [];
  }

  const groups: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size));
  }

  return groups;
}

function addSlideBase(slide: PptxGenJS.Slide, title: string, subtitle?: string) {
  slide.background = { color: COLORS.background };
  slide.addText(title, {
    x: 0.55,
    y: 0.4,
    w: 8.2,
    h: 0.45,
    fontFace: 'Aptos',
    fontSize: 24,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.58,
      y: 0.9,
      w: 8.8,
      h: 0.28,
      fontFace: 'Aptos',
      fontSize: 10,
      color: COLORS.muted,
      margin: 0,
    });
  }

  slide.addShape(SHAPES.line, {
    x: 0.55,
    y: 1.22,
    w: 12.2,
    h: 0,
    line: { color: COLORS.border, width: 1.2 },
  });
}

function addParagraph(slide: PptxGenJS.Slide, text: string, x: number, y: number, w: number, h: number) {
  slide.addText(text, {
    x,
    y,
    w,
    h,
    fontFace: 'Aptos',
    fontSize: 11,
    color: COLORS.ink,
    margin: 0.04,
    valign: 'top',
    breakLine: false,
    fit: 'shrink',
  });
}

function itemBlockText(lines: string[]): string {
  return lines.filter(Boolean).join('\n');
}

function longOutcomeText(item: LongOutcome, index: number): string {
  return itemBlockText([
    `${index + 1}. ${item.outcome || '(No description)'}`,
    item.measure1 || item.target1 ? `Measure 1: ${item.measure1 || '-'} | Target 1: ${item.target1 || '-'}` : '',
    item.measure2 || item.target2 ? `Measure 2: ${item.measure2 || '-'} | Target 2: ${item.target2 || '-'}` : '',
    item.notes ? `Notes: ${item.notes}` : '',
  ]);
}

function midOutcomeText(item: MidOutcome, index: number, state: WorkshopState): string {
  const linked = item.linkedLongTerm
    .map((id) => {
      const linkedIndex = state.long.findIndex((candidate) => candidate.id === id);
      return linkedIndex >= 0 ? `Long-Term ${linkedIndex + 1}` : null;
    })
    .filter((entry): entry is string => Boolean(entry));

  return itemBlockText([
    `${index + 1}. ${item.outcome || '(No description)'}`,
    linked.length > 0 ? `Linked to: ${linked.join(', ')}` : 'Linked to: None',
    item.progress ? `Progress: ${item.progress}` : '',
    item.measure1 || item.target1 ? `Measure 1: ${item.measure1 || '-'} | Target 1: ${item.target1 || '-'}` : '',
    item.measure2 || item.target2 ? `Measure 2: ${item.measure2 || '-'} | Target 2: ${item.target2 || '-'}` : '',
    item.owner ? `Owner: ${item.owner}` : '',
    item.notes ? `Notes: ${item.notes}` : '',
  ]);
}

function shortOutcomeText(item: ShortOutcome, index: number, state: WorkshopState): string {
  const linked = item.linkedMidTerm
    .map((id) => {
      const linkedIndex = state.mid.findIndex((candidate) => candidate.id === id);
      return linkedIndex >= 0 ? `Mid-Term ${linkedIndex + 1}` : null;
    })
    .filter((entry): entry is string => Boolean(entry));

  const outputs = item.outputs
    .map((output, outputIndex) => {
      const tasks = output.tasks
        .map((task, taskIndex) => `${taskIndex + 1}. ${task.description || '(Task)'}${task.owner ? ` (${task.owner})` : ''}`)
        .join('; ');
      return `Output ${outputIndex + 1}: ${output.name || '(No name)'}${tasks ? ` | Tasks: ${tasks}` : ''}`;
    })
    .join('\n');

  return itemBlockText([
    `${index + 1}. ${item.outcome || '(No description)'}`,
    linked.length > 0 ? `Linked to: ${linked.join(', ')}` : 'Linked to: None',
    item.measure1 || item.measure2 || item.target ? `Measures: ${item.measure1 || '-'} | ${item.measure2 || '-'} | Target: ${item.target || '-'}` : '',
    item.responsiblePerson ? `Responsible: ${item.responsiblePerson}` : '',
    item.notes ? `Notes: ${item.notes}` : '',
    outputs,
  ]);
}

function actionText(item: ActionItem, index: number): string {
  return itemBlockText([
    `${index + 1}. ${item.task || '(No task description)'}`,
    item.owner ? `Owner: ${item.owner}` : '',
    item.due ? `Due: ${item.due}` : '',
    item.related ? `Related: ${truncateText(item.related, 90)}` : '',
    `Status: ${item.status} | Priority: ${item.priority}`,
    item.support ? `Support: ${item.support}` : '',
    item.decision ? `Decision: ${item.decision}` : '',
    item.notes ? `Notes: ${item.notes}` : '',
  ]);
}

function addSectionSlides(
  pptx: PptxGenJS,
  title: string,
  subtitle: string,
  items: string[],
  accent: string,
) {
  if (items.length === 0) {
    const slide = pptx.addSlide();
    addSlideBase(slide, title, subtitle);
    slide.addShape(SHAPES.roundRect, {
      x: 0.75,
      y: 1.75,
      w: 11.7,
      h: 0.95,
      rectRadius: 0.08,
      fill: { color: COLORS.surface },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText('No items captured for this section.', {
      x: 1.05,
      y: 2.05,
      w: 10.8,
      h: 0.25,
      fontFace: 'Aptos',
      fontSize: 13,
      bold: true,
      color: COLORS.muted,
      align: 'center',
      margin: 0,
    });
    return;
  }

  chunk(items, 3).forEach((group, pageIndex) => {
    const slide = pptx.addSlide();
    addSlideBase(slide, title, `${subtitle}${items.length > 3 ? ` | Page ${pageIndex + 1}` : ''}`);

    group.forEach((text, cardIndex) => {
      const y = 1.55 + (cardIndex * 1.95);
      slide.addShape(SHAPES.roundRect, {
        x: 0.7,
        y,
        w: 11.75,
        h: 1.55,
        rectRadius: 0.08,
        fill: { color: COLORS.surface },
        line: { color: COLORS.border, width: 1 },
      });
      slide.addShape(SHAPES.rect, {
        x: 0.7,
        y,
        w: 0.12,
        h: 1.55,
        fill: { color: accent },
        line: { color: accent, width: 0 },
      });
      addParagraph(slide, text, 0.95, y + 0.12, 11.15, 1.26);
    });
  });
}

export async function exportWorkshopPowerPoint(state: WorkshopState): Promise<string> {
  const pptx = new PptxGenJS();
  const sessionLabel = state.sessionName.trim() || 'Outcomes Workshop';

  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'GitHub Copilot';
  pptx.company = 'Bayer';
  pptx.subject = 'Outcomes workshop export';
  pptx.title = `${sessionLabel} Outcomes Workshop`;
  pptx.theme = {
    headFontFace: 'Aptos Display',
    bodyFontFace: 'Aptos',
  };

  addSectionSlides(
    pptx,
    'Long-Term Outcomes',
    `${sessionLabel} | Five-year vision and success measures`,
    state.long.map((item, index) => longOutcomeText(item, index)),
    COLORS.deepGreen,
  );

  addSectionSlides(
    pptx,
    'Mid-Term Outcomes',
    `${sessionLabel} | 2026 milestones and linkages`,
    state.mid.map((item, index) => midOutcomeText(item, index, state)),
    COLORS.amber,
  );

  addSectionSlides(
    pptx,
    'Short-Term Outcomes',
    `${sessionLabel} | 90-day deliverables, outputs, and tasks`,
    state.short.map((item, index) => shortOutcomeText(item, index, state)),
    COLORS.green,
  );

  addSectionSlides(
    pptx,
    'Action Register',
    `${sessionLabel} | Current tasks, owners, and status`,
    state.actions.map((item, index) => actionText(item, index)),
    COLORS.blue,
  );

  const fileName = `${sanitizeFileName(sessionLabel)}_outcomes_${Date.now()}.pptx`;
  await pptx.writeFile({ fileName });
  return fileName;
}