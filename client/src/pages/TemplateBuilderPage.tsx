// StratAlign — Template Builder Page
// Interactive form-based templates for key PM tools with copy/print export

import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, Copy, Printer, Check, X } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

// ── Template definitions ─────────────────────────────────────────────────────
interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'list'; // list = multiple rows
  rows?: number;
  listCount?: number; // for list type
}

interface PMTemplate {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bgColor: string;
  cardCode?: string; // linked card
  description: string;
  sections: {
    title: string;
    fields: TemplateField[];
  }[];
}

const TEMPLATES: PMTemplate[] = [
  {
    id: 'project-brief',
    title: 'Project Brief',
    subtitle: 'One-page project summary',
    icon: '📋',
    color: '#0284C7',
    bgColor: '#EFF6FF',
    description: 'A concise document that captures what the project is, why it exists, and what success looks like.',
    sections: [
      {
        title: 'Project Overview',
        fields: [
          { id: 'project_name', label: 'Project Name', placeholder: 'e.g. Customer Portal Redesign', type: 'text' },
          { id: 'project_sponsor', label: 'Project Sponsor', placeholder: 'e.g. Jane Smith, Head of Product', type: 'text' },
          { id: 'project_manager', label: 'Project Manager', placeholder: 'Your name', type: 'text' },
          { id: 'start_date', label: 'Planned Start Date', placeholder: 'e.g. 1 March 2026', type: 'text' },
          { id: 'end_date', label: 'Planned End Date', placeholder: 'e.g. 30 June 2026', type: 'text' },
        ],
      },
      {
        title: 'Purpose & Objectives',
        fields: [
          { id: 'problem', label: 'Problem / Opportunity', placeholder: 'What problem are we solving or opportunity are we capturing?', type: 'textarea', rows: 3 },
          { id: 'objectives', label: 'Key Objectives', placeholder: 'What are the 2–3 main things this project must achieve?', type: 'textarea', rows: 3 },
          { id: 'success_criteria', label: 'Success Criteria', placeholder: 'How will we know the project has succeeded? Be specific and measurable.', type: 'textarea', rows: 3 },
        ],
      },
      {
        title: 'Scope',
        fields: [
          { id: 'in_scope', label: 'In Scope', placeholder: 'What is included in this project?', type: 'textarea', rows: 3 },
          { id: 'out_of_scope', label: 'Out of Scope', placeholder: 'What is explicitly NOT included?', type: 'textarea', rows: 2 },
        ],
      },
      {
        title: 'Resources & Constraints',
        fields: [
          { id: 'budget', label: 'Budget', placeholder: 'e.g. £50,000 total', type: 'text' },
          { id: 'team', label: 'Key Team Members', placeholder: 'Who is on the project team?', type: 'textarea', rows: 2 },
          { id: 'constraints', label: 'Key Constraints', placeholder: 'Any fixed deadlines, budget limits, or technical constraints?', type: 'textarea', rows: 2 },
        ],
      },
    ],
  },
  {
    id: 'risk-register',
    title: 'Risk Register',
    subtitle: 'Track and manage project risks',
    icon: '⚠️',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    cardCode: 'PR03',
    description: 'A structured log of identified risks, their likelihood, impact, and planned responses.',
    sections: [
      {
        title: 'Project Details',
        fields: [
          { id: 'project_name', label: 'Project Name', placeholder: 'e.g. ERP Implementation', type: 'text' },
          { id: 'date', label: 'Date', placeholder: 'e.g. 21 February 2026', type: 'text' },
          { id: 'owner', label: 'Risk Owner', placeholder: 'Who is responsible for managing risks?', type: 'text' },
        ],
      },
      {
        title: 'Risk 1',
        fields: [
          { id: 'risk1_description', label: 'Risk Description', placeholder: 'What could go wrong?', type: 'textarea', rows: 2 },
          { id: 'risk1_likelihood', label: 'Likelihood (High / Medium / Low)', placeholder: 'e.g. Medium', type: 'text' },
          { id: 'risk1_impact', label: 'Impact (High / Medium / Low)', placeholder: 'e.g. High', type: 'text' },
          { id: 'risk1_response', label: 'Response / Mitigation', placeholder: 'What will we do to reduce or manage this risk?', type: 'textarea', rows: 2 },
        ],
      },
      {
        title: 'Risk 2',
        fields: [
          { id: 'risk2_description', label: 'Risk Description', placeholder: 'What could go wrong?', type: 'textarea', rows: 2 },
          { id: 'risk2_likelihood', label: 'Likelihood', placeholder: 'e.g. Low', type: 'text' },
          { id: 'risk2_impact', label: 'Impact', placeholder: 'e.g. High', type: 'text' },
          { id: 'risk2_response', label: 'Response / Mitigation', placeholder: 'What will we do to reduce or manage this risk?', type: 'textarea', rows: 2 },
        ],
      },
      {
        title: 'Risk 3',
        fields: [
          { id: 'risk3_description', label: 'Risk Description', placeholder: 'What could go wrong?', type: 'textarea', rows: 2 },
          { id: 'risk3_likelihood', label: 'Likelihood', placeholder: 'e.g. High', type: 'text' },
          { id: 'risk3_impact', label: 'Impact', placeholder: 'e.g. Medium', type: 'text' },
          { id: 'risk3_response', label: 'Response / Mitigation', placeholder: 'What will we do to reduce or manage this risk?', type: 'textarea', rows: 2 },
        ],
      },
    ],
  },
  {
    id: 'stakeholder-map',
    title: 'Stakeholder Map',
    subtitle: 'Identify and plan stakeholder engagement',
    icon: '🤝',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    description: 'A structured analysis of who your stakeholders are, their interests, and how to engage them.',
    sections: [
      {
        title: 'Project Details',
        fields: [
          { id: 'project_name', label: 'Project Name', placeholder: 'e.g. Office Relocation', type: 'text' },
          { id: 'date', label: 'Date', placeholder: 'e.g. 21 February 2026', type: 'text' },
        ],
      },
      {
        title: 'Key Stakeholder 1',
        fields: [
          { id: 'sh1_name', label: 'Name / Role', placeholder: 'e.g. CEO', type: 'text' },
          { id: 'sh1_interest', label: 'Interest / Concern', placeholder: 'What do they care about?', type: 'textarea', rows: 2 },
          { id: 'sh1_influence', label: 'Level of Influence (High / Medium / Low)', placeholder: 'e.g. High', type: 'text' },
          { id: 'sh1_engagement', label: 'Engagement Approach', placeholder: 'How will you keep them informed and involved?', type: 'textarea', rows: 2 },
        ],
      },
      {
        title: 'Key Stakeholder 2',
        fields: [
          { id: 'sh2_name', label: 'Name / Role', placeholder: 'e.g. IT Director', type: 'text' },
          { id: 'sh2_interest', label: 'Interest / Concern', placeholder: 'What do they care about?', type: 'textarea', rows: 2 },
          { id: 'sh2_influence', label: 'Level of Influence', placeholder: 'e.g. Medium', type: 'text' },
          { id: 'sh2_engagement', label: 'Engagement Approach', placeholder: 'How will you keep them informed and involved?', type: 'textarea', rows: 2 },
        ],
      },
      {
        title: 'Key Stakeholder 3',
        fields: [
          { id: 'sh3_name', label: 'Name / Role', placeholder: 'e.g. End Users', type: 'text' },
          { id: 'sh3_interest', label: 'Interest / Concern', placeholder: 'What do they care about?', type: 'textarea', rows: 2 },
          { id: 'sh3_influence', label: 'Level of Influence', placeholder: 'e.g. Low', type: 'text' },
          { id: 'sh3_engagement', label: 'Engagement Approach', placeholder: 'How will you keep them informed and involved?', type: 'textarea', rows: 2 },
        ],
      },
    ],
  },
  {
    id: 'lessons-learned',
    title: 'Lessons Learned',
    subtitle: 'Capture what went well and what to improve',
    icon: '🎓',
    color: '#059669',
    bgColor: '#ECFDF5',
    description: 'A structured record of insights from the project to improve future delivery.',
    sections: [
      {
        title: 'Project Details',
        fields: [
          { id: 'project_name', label: 'Project Name', placeholder: 'e.g. Website Relaunch', type: 'text' },
          { id: 'date', label: 'Date', placeholder: 'e.g. 21 February 2026', type: 'text' },
          { id: 'facilitator', label: 'Facilitator', placeholder: 'Who ran the session?', type: 'text' },
          { id: 'attendees', label: 'Attendees', placeholder: 'Who participated?', type: 'textarea', rows: 2 },
        ],
      },
      {
        title: 'What Went Well',
        fields: [
          { id: 'went_well_1', label: 'Lesson 1', placeholder: 'What worked well and should be repeated?', type: 'textarea', rows: 2 },
          { id: 'went_well_2', label: 'Lesson 2', placeholder: 'Another thing that worked well', type: 'textarea', rows: 2 },
          { id: 'went_well_3', label: 'Lesson 3', placeholder: 'Another thing that worked well', type: 'textarea', rows: 2 },
        ],
      },
      {
        title: 'What Could Be Improved',
        fields: [
          { id: 'improve_1', label: 'Issue 1', placeholder: 'What went wrong or could be done better?', type: 'textarea', rows: 2 },
          { id: 'improve_2', label: 'Issue 2', placeholder: 'Another area for improvement', type: 'textarea', rows: 2 },
          { id: 'improve_3', label: 'Issue 3', placeholder: 'Another area for improvement', type: 'textarea', rows: 2 },
        ],
      },
      {
        title: 'Actions for Next Time',
        fields: [
          { id: 'action_1', label: 'Action 1', placeholder: 'What specific change will be made on the next project?', type: 'textarea', rows: 2 },
          { id: 'action_2', label: 'Action 2', placeholder: 'Another specific action', type: 'textarea', rows: 2 },
        ],
      },
    ],
  },
  {
    id: 'meeting-agenda',
    title: 'Meeting Agenda',
    subtitle: 'Structure any project meeting',
    icon: '📅',
    color: '#D97706',
    bgColor: '#FEF3C7',
    description: 'A clear agenda ensures meetings stay focused and produce decisions.',
    sections: [
      {
        title: 'Meeting Details',
        fields: [
          { id: 'meeting_title', label: 'Meeting Title', placeholder: 'e.g. Sprint Review — Week 4', type: 'text' },
          { id: 'date_time', label: 'Date & Time', placeholder: 'e.g. 21 Feb 2026, 10:00–11:00', type: 'text' },
          { id: 'location', label: 'Location / Link', placeholder: 'e.g. Conference Room B or Zoom link', type: 'text' },
          { id: 'attendees', label: 'Attendees', placeholder: 'Who needs to be there?', type: 'textarea', rows: 2 },
          { id: 'objective', label: 'Meeting Objective', placeholder: 'What must we achieve by the end of this meeting?', type: 'textarea', rows: 2 },
        ],
      },
      {
        title: 'Agenda Items',
        fields: [
          { id: 'item_1', label: 'Item 1 (time)', placeholder: 'e.g. Project status update (10 mins)', type: 'text' },
          { id: 'item_2', label: 'Item 2 (time)', placeholder: 'e.g. Risk review (15 mins)', type: 'text' },
          { id: 'item_3', label: 'Item 3 (time)', placeholder: 'e.g. Decision: go/no-go for Phase 2 (20 mins)', type: 'text' },
          { id: 'item_4', label: 'Item 4 (time)', placeholder: 'e.g. Actions and next steps (10 mins)', type: 'text' },
          { id: 'item_5', label: 'Item 5 (optional)', placeholder: 'Additional agenda item', type: 'text' },
        ],
      },
      {
        title: 'Pre-reading / Preparation',
        fields: [
          { id: 'pre_reading', label: 'What should attendees review beforehand?', placeholder: 'e.g. Last week\'s status report, risk register', type: 'textarea', rows: 2 },
        ],
      },
    ],
  },
];

// ── Template form ─────────────────────────────────────────────────────────────
function TemplateForm({ template, onBack }: { template: PMTemplate; onBack: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  function setValue(fieldId: string, value: string) {
    setValues(prev => ({ ...prev, [fieldId]: value }));
  }

  function generateText(): string {
    let output = `${template.title.toUpperCase()}\n${'='.repeat(template.title.length)}\n\n`;
    for (const section of template.sections) {
      output += `${section.title}\n${'-'.repeat(section.title.length)}\n`;
      for (const field of section.fields) {
        const val = values[field.id] || '(not filled in)';
        output += `${field.label}:\n${val}\n\n`;
      }
      output += '\n';
    }
    return output;
  }

  function handleCopy() {
    navigator.clipboard.writeText(generateText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handlePrint() {
    const text = generateText();
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>${template.title}</title>
      <style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:0 20px;color:#1c1917;}
      h1{font-size:22px;margin-bottom:4px;}
      h2{font-size:14px;border-bottom:1px solid #e7e5e4;padding-bottom:4px;margin-top:24px;}
      .field{margin-bottom:16px;}
      .label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#78716c;margin-bottom:4px;}
      .value{font-size:14px;line-height:1.6;color:#1c1917;white-space:pre-wrap;}
      </style></head><body>
      <h1>${template.title}</h1>
      <p style="color:#78716c;font-size:13px;">${template.subtitle}</p>
      ${template.sections.map(s => `
        <h2>${s.title}</h2>
        ${s.fields.map(f => `
          <div class="field">
            <div class="label">${f.label}</div>
            <div class="value">${values[f.id] || '—'}</div>
          </div>
        `).join('')}
      `).join('')}
      </body></html>
    `);
    win.document.close();
    win.print();
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: '#F7F5F0' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(247,245,240,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <button onClick={onBack} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors">
          <ChevronLeft size={16} />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <span className="text-sm font-bold text-stone-800">{template.title}</span>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors">
            {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors">
            <Printer size={13} />
            Print
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 max-w-2xl mx-auto w-full">
        {/* Template header */}
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ backgroundColor: template.bgColor, border: `1px solid ${template.color}20` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{template.icon}</span>
            <div>
              <h2 className="text-base font-black text-stone-900" style={{ fontFamily: 'Sora, sans-serif' }}>{template.title}</h2>
              <p className="text-xs text-stone-500">{template.description}</p>
            </div>
          </div>
        </div>

        {/* Sections */}
        {template.sections.map((section, si) => (
          <div key={si} className="mb-5">
            <h3
              className="text-[11px] font-black text-stone-400 uppercase tracking-wider mb-3"
            >
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.fields.map(field => (
                <div key={field.id}>
                  <label className="block text-xs font-bold text-stone-600 mb-1.5">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={values[field.id] || ''}
                      onChange={e => setValue(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      rows={field.rows ?? 3}
                      className="w-full px-4 py-3 rounded-2xl bg-white text-sm text-stone-800 placeholder-stone-300 focus:outline-none resize-none"
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: `1px solid ${template.color}20` }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[field.id] || ''}
                      onChange={e => setValue(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-2xl bg-white text-sm text-stone-800 placeholder-stone-300 focus:outline-none"
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: `1px solid ${template.color}20` }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Export buttons */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.99] bg-white text-stone-800"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy text'}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ backgroundColor: template.color }}
          >
            <Printer size={14} />
            Print / PDF
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TemplateBuilderPage() {
  const [, navigate] = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<PMTemplate | null>(null);

  return (
    <>
      <div className="min-h-screen flex flex-col pb-24" style={{ backgroundColor: '#F7F5F0' }}>
        <div
          className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
          style={{ background: 'rgba(247,245,240,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors">
            <ChevronLeft size={16} />
            <span className="text-sm font-semibold">Back</span>
          </button>
          <span className="text-sm font-bold text-stone-800">Template Builder</span>
          <div className="w-16" />
        </div>

        <div className="px-4 py-4 max-w-2xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
            <h1 className="text-xl font-black text-stone-900 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>Template Builder</h1>
            <p className="text-sm text-stone-500">Fill in a template and copy or print the completed document.</p>
          </motion.div>

          <div className="space-y-3">
            {TEMPLATES.map((template, i) => (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTemplate(template)}
                className="w-full text-left rounded-2xl overflow-hidden bg-white"
                style={{ boxShadow: `0 2px 8px ${template.color}15, 0 1px 3px rgba(0,0,0,0.06)` }}
              >
                <div className="h-1" style={{ backgroundColor: template.color }} />
                <div className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-stone-900" style={{ fontFamily: 'Sora, sans-serif' }}>{template.title}</p>
                    <p className="text-[11px] text-stone-400">{template.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-stone-400">{template.sections.length} sections</span>
                    <ChevronRight size={14} className="text-stone-300" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <BottomNav />
      </div>

      <AnimatePresence>
        {selectedTemplate && (
          <TemplateForm template={selectedTemplate} onBack={() => setSelectedTemplate(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
