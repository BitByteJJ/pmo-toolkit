// PMO Toolkit Navigator — Template Filler
// Fillable, interactive template form with dynamic rows, rich fields, and download engine.
import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, FileText, Plus, Trash2, ChevronDown,
  CheckSquare, Square, Calendar, AlertTriangle, FileDown,
  Printer, RotateCcw, Save, Info,
} from 'lucide-react';
import { CARDS } from '@/lib/pmoData';
import { ALL_TEMPLATES, CardTemplate, TemplateSection } from '@/lib/templateData';
import { DECK_THEME, COPYRIGHT_STATEMENT } from '@/lib/templateFieldSchema';
import { generateTemplatePDF } from '@/lib/pdfGenerator';
import { generateTemplateDocx } from '@/lib/docxGenerator';
import { useTheme } from '@/contexts/ThemeContext';

// ─── Types ───────────────────────────────────────────────────────────────────
interface TableRow {
  id: string;
  cells: Record<string, string>;
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

type FieldValue =
  | string
  | TableRow[]
  | ChecklistItem[];

interface SectionState {
  fields: Record<string, FieldValue>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

/** Parse a Markdown pipe-table into column headers and initial rows */
function parseMarkdownTable(content: string): { headers: string[]; rows: string[][] } | null {
  const lines = content.trim().split('\n').filter(l => l.trim().startsWith('|'));
  if (lines.length < 2) return null;
  const parseRow = (line: string) =>
    line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
  const headers = parseRow(lines[0]);
  const sepLine = lines[1];
  if (!/^[\|\-\s:]+$/.test(sepLine)) return null;
  const dataRows = lines.slice(2).map(parseRow);
  return { headers, rows: dataRows };
}

/** Detect if content is primarily a Markdown table */
function isTable(content: string): boolean {
  const lines = content.trim().split('\n');
  const tableLines = lines.filter(l => l.trim().startsWith('|'));
  return tableLines.length >= 2 && /^[\|\-\s:]+$/.test((lines[1] || '').trim());
}

/** Detect if content is a checklist */
function isChecklist(content: string): boolean {
  return content.trim().split('\n').some(l => /^-\s*\[[ xX]\]/.test(l.trim()));
}

/** Parse checklist items from Markdown */
function parseChecklist(content: string): ChecklistItem[] {
  return content.trim().split('\n')
    .filter(l => /^-\s*\[[ xX]\]/.test(l.trim()))
    .map(l => {
      const checked = /^-\s*\[x\]/i.test(l.trim());
      const text = l.replace(/^-\s*\[[ xX]\]\s*/, '').trim();
      return { id: generateId(), text, checked };
    });
}

/** Infer column type from header name */
function inferColumnType(header: string): 'date' | 'rag' | 'select-priority' | 'textarea' | 'text' {
  if (/date|deadline|due|by when/i.test(header)) return 'date';
  if (/status|rag|colour|color/i.test(header)) return 'rag';
  if (/priority/i.test(header)) return 'select-priority';
  if (/notes?|comment|description|detail|action/i.test(header)) return 'textarea';
  return 'text';
}

/** Build initial TableRow array from parsed markdown table */
function buildInitialRows(headers: string[], rows: string[][]): TableRow[] {
  // Always start with at least 3 empty rows, plus any pre-filled data rows
  const dataRows = rows.filter(r => r.some(c => c.length > 0));
  const initialRows: TableRow[] = dataRows.map(r => ({
    id: generateId(),
    cells: Object.fromEntries(headers.map((h, i) => [h, r[i] || ''])),
  }));
  // Pad to at least 3 rows
  while (initialRows.length < 3) {
    initialRows.push({ id: generateId(), cells: Object.fromEntries(headers.map(h => [h, ''])) });
  }
  return initialRows;
}

// ─── RAG Status Picker ───────────────────────────────────────────────────────
const RAG_OPTIONS = [
  { value: 'Green',  label: 'Green',  color: '#22c55e', bg: '#dcfce7' },
  { value: 'Amber',  label: 'Amber',  color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  { value: 'Red',    label: 'Red',    color: '#ef4444', bg: '#fee2e2' },
  { value: 'Blue',   label: 'Blue',   color: '#3b82f6', bg: '#dbeafe' },
  { value: 'Grey',   label: 'N/A',    color: '#94a3b8', bg: '#f1f5f9' },
];

function RAGPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const current = RAG_OPTIONS.find(o => o.value === value) || RAG_OPTIONS[4];
  return (
    <div className="flex gap-1 flex-wrap">
      {RAG_OPTIONS.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="px-2 py-0.5 rounded-full text-xs font-semibold transition-all border-2"
          style={{
            backgroundColor: value === opt.value ? opt.color : opt.bg,
            color: value === opt.value ? '#fff' : opt.color,
            borderColor: value === opt.value ? opt.color : 'transparent',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Priority Picker ─────────────────────────────────────────────────────────
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

function PriorityPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const colors: Record<string, { bg: string; text: string }> = {
    High:   { bg: '#fee2e2', text: '#ef4444' },
    Medium: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
    Low:    { bg: '#dcfce7', text: '#22c55e' },
  };
  return (
    <div className="flex gap-1">
      {PRIORITY_OPTIONS.map(p => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className="px-2 py-0.5 rounded-full text-xs font-semibold border-2 transition-all"
          style={{
            backgroundColor: value === p ? colors[p].text : colors[p].bg,
            color: value === p ? '#fff' : colors[p].text,
            borderColor: value === p ? colors[p].text : 'transparent',
          }}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

// ─── Dynamic Table ────────────────────────────────────────────────────────────
function DynamicTable({
  headers, rows, onChange, accentColor,
}: {
  headers: string[];
  rows: TableRow[];
  onChange: (rows: TableRow[]) => void;
  accentColor: string;
}) {
  const addRow = () => {
    onChange([...rows, { id: generateId(), cells: Object.fromEntries(headers.map(h => [h, ''])) }]);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    onChange(rows.filter(r => r.id !== id));
  };

  const updateCell = (rowId: string, header: string, value: string) => {
    onChange(rows.map(r => r.id === rowId ? { ...r, cells: { ...r.cells, [header]: value } } : r));
  };

  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: accentColor + '33' }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ backgroundColor: accentColor + '18' }}>
            {headers.map(h => (
              <th key={h} className="px-3 py-2 text-left text-xs font-bold border-b" style={{ borderColor: accentColor + '33', color: accentColor }}>
                {h}
              </th>
            ))}
            <th className="w-8 border-b" style={{ borderColor: accentColor + '33' }} />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id} className={idx % 2 === 0 ? 'bg-white/5' : 'bg-white/3'}>
              {headers.map(h => {
                const colType = inferColumnType(h);
                const val = row.cells[h] || '';
                return (
                  <td key={h} className="px-2 py-1.5 border-b border-white/8 align-top">
                    {colType === 'date' ? (
                      <input
                        type="date"
                        value={val}
                        onChange={e => updateCell(row.id, h, e.target.value)}
                        className="w-full text-xs border border-white/15 bg-white/5 text-slate-100 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400"
                      />
                    ) : colType === 'rag' ? (
                      <RAGPicker value={val} onChange={v => updateCell(row.id, h, v)} />
                    ) : colType === 'select-priority' ? (
                      <PriorityPicker value={val} onChange={v => updateCell(row.id, h, v)} />
                    ) : colType === 'textarea' ? (
                      <textarea
                        value={val}
                        onChange={e => updateCell(row.id, h, e.target.value)}
                        rows={2}
                        placeholder={`Enter ${h.toLowerCase()}…`}
                        className="w-full text-xs border border-white/15 bg-white/5 text-slate-100 placeholder-slate-500 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400 resize-none min-w-[140px]"
                      />
                    ) : (
                      <input
                        type="text"
                        value={val}
                        onChange={e => updateCell(row.id, h, e.target.value)}
                        placeholder={`Enter ${h.toLowerCase()}…`}
                        className="w-full text-xs border border-white/15 bg-white/5 text-slate-100 placeholder-slate-500 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400 min-w-[100px]"
                      />
                    )}
                  </td>
                );
              })}
              <td className="px-1 py-1.5 border-b border-white/8 align-middle">
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length <= 1}
                  className="p-1 rounded hover:bg-red-900/30 text-foreground hover:text-red-400 transition-colors disabled:opacity-30"
                >
                  <Trash2 size={12} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-2" style={{ backgroundColor: accentColor + '08' }}>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: accentColor, backgroundColor: accentColor + '15' }}
        >
          <Plus size={12} /> Add Row
        </button>
      </div>
    </div>
  );
}

// ─── Dynamic Checklist ────────────────────────────────────────────────────────
function DynamicChecklist({
  items, onChange, accentColor,
}: {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
  accentColor: string;
}) {
  const toggle = (id: string) => onChange(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const updateText = (id: string, text: string) => onChange(items.map(i => i.id === id ? { ...i, text } : i));
  const addItem = () => onChange([...items, { id: generateId(), text: '', checked: false }]);
  const removeItem = (id: string) => { if (items.length > 1) onChange(items.filter(i => i.id !== id)); };

  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.id} className="flex items-start gap-2">
          <button type="button" onClick={() => toggle(item.id)} className="mt-0.5 shrink-0">
            {item.checked
              ? <CheckSquare size={18} style={{ color: accentColor }} />
              : <Square size={18} className="text-foreground" />}
          </button>
          <input
            type="text"
            value={item.text}
            onChange={e => updateText(item.id, e.target.value)}
            placeholder="Add checklist item…"
            className="flex-1 text-sm border-b border-white/15 focus:border-blue-400 focus:outline-none py-0.5 bg-transparent text-foreground"
            style={{ textDecoration: item.checked ? 'line-through' : 'none', opacity: item.checked ? 0.5 : 1 }}
          />
          <button type="button" onClick={() => removeItem(item.id)} className="p-0.5 text-foreground hover:text-red-400 transition-colors shrink-0">
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors mt-2"
        style={{ color: accentColor, backgroundColor: accentColor + '15' }}
      >
        <Plus size={12} /> Add Item
      </button>
    </div>
  );
}

// ─── Section Renderer ─────────────────────────────────────────────────────────
function SectionForm({
  section, sectionIndex, state, onChange, accentColor,
}: {
  section: TemplateSection;
  sectionIndex: number;
  state: SectionState;
  onChange: (s: SectionState) => void;
  accentColor: string;
}) {
  const content = section.content;
  const [isOpen, setIsOpen] = useState(true);

  const updateField = (key: string, value: FieldValue) => {
    onChange({ fields: { ...state.fields, [key]: value } });
  };

  // Determine content type
  const tableData = useMemo(() => isTable(content) ? parseMarkdownTable(content) : null, [content]);
  const checklistData = useMemo(() => isChecklist(content) ? parseChecklist(content) : null, [content]);

  // Initialise field state
  const tableKey = `table_${sectionIndex}`;
  const checklistKey = `checklist_${sectionIndex}`;
  const textKey = `text_${sectionIndex}`;

  const tableRows = useMemo(() => {
    if (!tableData) return [];
    const existing = state.fields[tableKey] as TableRow[] | undefined;
    if (existing && existing.length > 0) return existing;
    return buildInitialRows(tableData.headers, tableData.rows);
  }, [tableData, state.fields, tableKey]);

  const checklistItems = useMemo(() => {
    if (!checklistData) return [];
    const existing = state.fields[checklistKey] as ChecklistItem[] | undefined;
    if (existing && existing.length > 0) return existing;
    return checklistData;
  }, [checklistData, state.fields, checklistKey]);

  const textValue = (state.fields[textKey] as string) || '';

  return (
    <div className="rounded-2xl overflow-hidden mb-4 bg-card shadow-sm border border-white/10">
      {/* Section header */}
      <button
        type="button"
        onClick={() => setIsOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{ backgroundColor: accentColor + '12' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: accentColor }}>
            {sectionIndex + 1}
          </div>
          <span className="text-sm font-bold" style={{ color: accentColor }}>{section.heading}</span>
        </div>
        <ChevronDown
          size={16}
          style={{ color: accentColor, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-4">
              {tableData ? (
                <DynamicTable
                  headers={tableData.headers}
                  rows={tableRows}
                  onChange={rows => updateField(tableKey, rows)}
                  accentColor={accentColor}
                />
              ) : checklistData ? (
                <DynamicChecklist
                  items={checklistItems}
                  onChange={items => updateField(checklistKey, items)}
                  accentColor={accentColor}
                />
              ) : (
                <div className="space-y-3">
                  {/* Parse prose into labelled fields */}
                  {parseProseSections(content).map((field, fi) => {
                    const fieldKey = `${textKey}_${fi}`;
                    const val = (state.fields[fieldKey] as string) || '';
                    return (
                      <div key={fi}>
                        {field.label && (
                          <label className="block text-xs font-bold mb-1" style={{ color: accentColor }}>
                            {field.label}
                          </label>
                        )}
                        {field.hint && (
                          <p className="text-[11px] text-foreground mb-1 leading-relaxed">{field.hint}</p>
                        )}
                        {field.isDate ? (
                          <input
                            type="date"
                            value={val}
                            onChange={e => updateField(fieldKey, e.target.value)}
                            className="w-full text-sm border border-white/15 bg-white/5 text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                          />
                        ) : field.isLong ? (
                          <textarea
                            value={val}
                            onChange={e => updateField(fieldKey, e.target.value)}
                            rows={4}
                            placeholder={field.placeholder}
                            className="w-full text-sm border border-white/15 bg-white/5 text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 resize-y"
                          />
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={e => updateField(fieldKey, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full text-sm border border-white/15 bg-white/5 text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Prose Parser ─────────────────────────────────────────────────────────────
interface ProseField {
  label: string;
  hint: string;
  placeholder: string;
  isDate: boolean;
  isLong: boolean;
}

function parseProseSections(content: string): ProseField[] {
  const lines = content.trim().split('\n');
  const fields: ProseField[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Bold label lines like **Project Name:** or **Owner:**
    const boldMatch = trimmed.match(/^\*\*([^*]+)\*\*:?\s*(.*)?$/);
    if (boldMatch) {
      const label = boldMatch[1].trim().replace(/:$/, '');
      const hint = boldMatch[2]?.trim() || '';
      const isDate = /date|deadline|due|by when/i.test(label);
      const isLong = /description|objective|scope|notes?|summary|background|outcome|rationale|approach|detail/i.test(label);
      fields.push({ label, hint, placeholder: `Enter ${label.toLowerCase()}…`, isDate, isLong });
      continue;
    }

    // Bullet items like "- Item name" or "- Item name: description"
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      const text = bulletMatch[1];
      const colonIdx = text.indexOf(':');
      const label = colonIdx > 0 ? text.slice(0, colonIdx).trim() : text;
      const hint = colonIdx > 0 ? text.slice(colonIdx + 1).trim() : '';
      const isDate = /date|deadline|due/i.test(label);
      const isLong = /description|objective|scope|notes?|summary|detail/i.test(label);
      fields.push({ label, hint, placeholder: `Enter ${label.toLowerCase()}…`, isDate, isLong });
      continue;
    }

    // Plain text lines — treat as a single textarea
    if (fields.length === 0) {
      fields.push({ label: '', hint: trimmed, placeholder: 'Enter your response…', isDate: false, isLong: true });
    }
  }

  // If nothing was parsed, create a single textarea
  if (fields.length === 0) {
    fields.push({ label: '', hint: '', placeholder: 'Enter your response…', isDate: false, isLong: true });
  }

  return fields;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
const STORAGE_VERSION = 'v1';
function storageKey(cardId: string) {
  return `pmo-template-${STORAGE_VERSION}-${cardId}`;
}
interface SavedFormData {
  projectName: string;
  projectOwner: string;
  projectDate: string;
  version: string;
  sectionStates: SectionState[];
  savedAt: number;
}
function loadSavedData(cardId: string): SavedFormData | null {
  try {
    const raw = localStorage.getItem(storageKey(cardId));
    if (!raw) return null;
    return JSON.parse(raw) as SavedFormData;
  } catch {
    return null;
  }
}
function saveData(cardId: string, data: SavedFormData) {
  try {
    localStorage.setItem(storageKey(cardId), JSON.stringify(data));
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TemplateFiller() {
  const { cardId } = useParams<{ cardId: string }>();
  const { isDark } = useTheme();
  const [, navigate] = useLocation();

  const card = useMemo(() => CARDS.find(c => c.id === cardId), [cardId]);
  const template = useMemo(() => ALL_TEMPLATES.find(t => t.cardId === cardId), [cardId]);

  const theme = useMemo(() => {
    if (!card) return DECK_THEME.tools;
    return DECK_THEME[card.deckId] || DECK_THEME.tools;
  }, [card]);

  // Load saved data on mount (keyed by cardId)
  const savedData = useMemo(() => cardId ? loadSavedData(cardId) : null, [cardId]);

  // Form state: one SectionState per section — restored from localStorage if available
  const [sectionStates, setSectionStates] = useState<SectionState[]>(() => {
    if (savedData?.sectionStates?.length) return savedData.sectionStates;
    return (template?.sections || []).map(() => ({ fields: {} }));
  });

  // Header fields — restored from localStorage if available
  const [projectName, setProjectName] = useState(savedData?.projectName ?? '');
  const [projectOwner, setProjectOwner] = useState(savedData?.projectOwner ?? '');
  const [projectDate, setProjectDate] = useState(savedData?.projectDate ?? '');
  const [version, setVersion] = useState(savedData?.version ?? '1.0');
  const [hasSavedData, setHasSavedData] = useState(() => !!savedData);

  // Auto-save to localStorage whenever form state changes (debounced 800ms)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!cardId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveData(cardId, { projectName, projectOwner, projectDate, version, sectionStates, savedAt: Date.now() });
      setHasSavedData(true);
    }, 800);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [cardId, projectName, projectOwner, projectDate, version, sectionStates]);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<'pdf' | 'docx' | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const updateSection = useCallback((idx: number, state: SectionState) => {
    setSectionStates(prev => {
      const next = [...prev];
      next[idx] = state;
      return next;
    });
  }, []);

  const handleReset = () => {
    setSectionStates((template?.sections || []).map(() => ({ fields: {} })));
    setProjectName('');
    setProjectOwner('');
    setProjectDate('');
    setVersion('1.0');
    if (cardId) {
      try { localStorage.removeItem(storageKey(cardId)); } catch { /* ignore */ }
    }
    setHasSavedData(false);
  };

  const handleDownload = async (type: 'pdf' | 'docx') => {
    if (!template || !card) return;
    setIsDownloading(true);
    setDownloadType(type);
    setShowDownloadMenu(false);

    // Resolve section states: if a table/checklist section has no state yet,
    // use the initial data built from the template content
    const resolvedSectionStates = template.sections.map((section, idx) => {
      const existing = sectionStates[idx] || { fields: {} };
      const tableKey = `table_${idx}`;
      const checklistKey = `checklist_${idx}`;

      // If table section but no state yet, build initial rows from template
      if (isTable(section.content) && !existing.fields[tableKey]) {
        const tableData = parseMarkdownTable(section.content);
        if (tableData) {
          const rows = buildInitialRows(tableData.headers, tableData.rows);
          return { fields: { ...existing.fields, [tableKey]: rows } };
        }
      }

      // If checklist section but no state yet, parse from template
      if (isChecklist(section.content) && !existing.fields[checklistKey]) {
        const items = parseChecklist(section.content);
        return { fields: { ...existing.fields, [checklistKey]: items } };
      }

      return existing;
    });

    const formData = {
      projectName,
      projectOwner,
      projectDate,
      version,
      sections: template.sections.map((section, idx) => ({
        heading: section.heading,
        state: resolvedSectionStates[idx] || { fields: {} },
        originalContent: section.content,
      })),
    };

    try {
      if (type === 'pdf') {
        await generateTemplatePDF({ card, template, theme, formData });
      } else {
        await generateTemplateDocx({ card, template, theme, formData });
      }
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  if (!card || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: isDark ? '#0a1628' : '#f1f5f9' }}>
        <div className="text-center">
          <AlertTriangle size={32} className="text-amber-400 mx-auto mb-3" />
          <p className="text-white font-semibold">Template not found</p>
          <button onClick={() => navigate('/templates')} className="text-blue-400 text-sm mt-2 underline">
            Back to Template Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-32" style={{ background: isDark ? '#0a1628' : '#f1f5f9' }}>
      {/* Sticky header — top-12 keeps it below the fixed 48px TopNav */}
      <div className="sticky top-12 z-40 px-4 py-3"
        style={{ background: theme.color, boxShadow: `0 2px 16px ${theme.color}40` }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/templates')} className="p-1.5 rounded-lg bg-white/20 hover:bg-card/30 transition-colors">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-card/25 text-white">{card.id}</span>
              <span className="text-[10px] text-white/70">{theme.title}</span>
            </div>
            <h1 className="text-sm font-bold text-white truncate" style={{ fontFamily: 'Sora, sans-serif' }}>
              {template.title}
            </h1>
            {hasSavedData && (
              <span className="text-[9px] text-white/60 flex items-center gap-0.5 mt-0.5">
                <Save size={8} /> Auto-saved
              </span>
            )}
          </div>
          {/* Download button */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(m => !m)}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card font-bold text-sm transition-colors"
              style={{ color: theme.color }}
            >
              {isDownloading ? (
                <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> {downloadType === 'pdf' ? 'PDF…' : 'Word…'}</>
              ) : (
                <><Download size={14} /> Download</>
              )}
            </button>
            <AnimatePresence>
              {showDownloadMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  className="absolute right-0 top-full mt-1 bg-card rounded-xl shadow-xl border border-white/10 overflow-hidden z-50 min-w-[160px]"
                >
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm font-semibold text-foreground hover:bg-white/10 transition-colors"
                  >
                    <FileDown size={16} className="text-red-500" /> Download PDF
                  </button>
                  <button
                    onClick={() => handleDownload('docx')}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm font-semibold text-foreground hover:bg-white/10 transition-colors border-t border-white/10"
                  >
                    <FileText size={16} className="text-blue-500" /> Download Word
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click-away for download menu */}
      {showDownloadMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setShowDownloadMenu(false)} />
      )}

      <div ref={formRef} className="px-4 pt-4">
        {/* Template description */}
        <div className="rounded-2xl p-4 mb-4 flex items-start gap-3"
          style={{ backgroundColor: theme.bg, border: `1px solid ${theme.color}33` }}>
          <Info size={16} style={{ color: theme.color, flexShrink: 0, marginTop: 2 }} />
          <p className="text-sm leading-relaxed" style={{ color: theme.text }}>{template.description}</p>
        </div>

        {/* Header fields */}
        <div className="bg-card rounded-2xl shadow-sm border border-white/10 p-4 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: theme.color }}>
            Document Header
          </h2>
          <div className="flex flex-col gap-3">
            {/* Row 1: Project / Organisation Name — full width */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Project / Organisation Name</label>
              <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="e.g. Digital Transformation Programme"
                className="w-full text-sm border border-white/15 bg-white/5 text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
            {/* Row 2: Prepared By + Version side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Prepared By</label>
                <input
                  type="text"
                  value={projectOwner}
                  onChange={e => setProjectOwner(e.target.value)}
                  placeholder="Your name"
                  className="w-full text-sm border border-white/15 bg-white/5 text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  placeholder="1.0"
                  className="w-full text-sm border border-white/15 bg-white/5 text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
            {/* Row 3: Date — full width so the native date picker has room */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Date</label>
              <input
                type="date"
                value={projectDate}
                onChange={e => setProjectDate(e.target.value)}
                className="w-full text-sm border border-white/15 bg-white/5 text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                style={{ minWidth: 0, boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        {/* Template sections */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-1" style={{ color: theme.color }}>
            Template Sections ({template.sections.length})
          </h2>
          {template.sections.map((section, idx) => (
            <SectionForm
              key={idx}
              section={section}
              sectionIndex={idx}
              state={sectionStates[idx] || { fields: {} }}
              onChange={state => updateSection(idx, state)}
              accentColor={theme.color}
            />
          ))}
        </div>

        {/* Bottom action bar */}
        <div className="fixed bottom-20 left-0 right-0 px-4 z-30">
          <div className="flex gap-2 max-w-lg mx-auto">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-card shadow-md border border-white/15 text-foreground hover:bg-white/10 transition-colors"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-md transition-all"
              style={{ background: `linear-gradient(135deg, ${theme.color}, ${theme.color}cc)`, boxShadow: `0 3px 10px ${theme.color}40` }}
            >
              {isDownloading && downloadType === 'pdf' ? (
                <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating…</>
              ) : (
                <><FileDown size={13} /> Download PDF</>
              )}
            </button>
            <button
              onClick={() => handleDownload('docx')}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-md transition-all"
              style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', boxShadow: '0 3px 10px rgba(37,99,235,0.35)' }}
            >
              {isDownloading && downloadType === 'docx' ? (
                <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating…</>
              ) : (
                <><FileText size={13} /> Download Word</>
              )}
            </button>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="mt-6 px-2 pb-4">
          <p className="text-[10px] text-foreground text-center leading-relaxed">{COPYRIGHT_STATEMENT}</p>
        </div>
      </div>
    </div>
  );
}
