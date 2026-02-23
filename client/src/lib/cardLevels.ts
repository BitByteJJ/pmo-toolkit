/**
 * Card Difficulty Levels
 *
 * Maps every card ID to a difficulty level:
 *   'beginner'     — no prior PM knowledge needed; accessible to anyone
 *   'intermediate' — assumes some project experience or familiarity with basics
 *   'advanced'     — specialist knowledge; most useful for experienced PMs
 *
 * Rationale:
 *   - Phase cards and core methodology cards are Beginner (foundational concepts)
 *   - Domain task cards and standard tools are Intermediate (require context)
 *   - Advanced Techniques (A-series) are split: simpler ones are Intermediate,
 *     specialist/academic ones are Advanced
 */

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export const CARD_LEVELS: Record<string, DifficultyLevel> = {
  // ── Project Phases (all Beginner — foundational) ──────────────────────────
  'phase-setup':     'beginner',
  'phase-execution': 'beginner',
  'phase-closure':   'beginner',

  // ── Archetyping Guide (Beginner — self-assessment) ────────────────────────
  'AG1': 'beginner',
  'AG2': 'beginner',
  'AG3': 'beginner',

  // ── Methodologies ─────────────────────────────────────────────────────────
  'M1': 'beginner',      // Waterfall — widely known
  'M2': 'beginner',      // Agile — widely known
  'M3': 'intermediate',  // Kanban — requires some context
  'M4': 'intermediate',  // Hybrid — requires understanding of both

  // ── People Domain ─────────────────────────────────────────────────────────
  'P1':  'intermediate', // Manage Conflict
  'P2':  'intermediate', // Plan & Manage Resources
  'P3':  'beginner',     // Develop Team
  'P4':  'intermediate', // Empower Team Members
  'P5':  'intermediate', // Ensure Team Members/Stakeholders are adequately trained
  'P6':  'beginner',     // Build Shared Understanding
  'P7':  'intermediate', // Remove Impediments
  'P8':  'intermediate', // Negotiate Project Agreements
  'P9':  'beginner',     // Engage and Support Virtual Teams
  'P10': 'beginner',     // Collaborate with Stakeholders
  'P11': 'intermediate', // Build Relationships
  'P12': 'intermediate', // Mentor Relevant Stakeholders
  'P13': 'advanced',     // Support Diversity and Inclusion
  'P14': 'intermediate', // Assess and Manage Stakeholders

  // ── Process Domain ────────────────────────────────────────────────────────
  'PR1':  'intermediate', // Execute with Urgency
  'PR2':  'beginner',     // Manage Communications
  'PR3':  'intermediate', // Assess & Manage Risks
  'PR4':  'beginner',     // Engage Stakeholders
  'PR5':  'intermediate', // Plan & Manage Budget
  'PR6':  'intermediate', // Plan & Manage Schedule
  'PR7':  'intermediate', // Plan & Manage Quality
  'PR8':  'intermediate', // Plan & Manage Scope
  'PR9':  'advanced',     // Integrate Project Planning
  'PR10': 'intermediate', // Manage Project Changes
  'PR11': 'advanced',     // Plan & Manage Procurement
  'PR12': 'intermediate', // Manage Project Artifacts
  'PR13': 'intermediate', // Determine Methodology
  'PR14': 'advanced',     // Establish Governance
  'PR15': 'intermediate', // Manage Project Issues
  'PR16': 'intermediate', // Ensure Knowledge Transfer
  'PR17': 'intermediate', // Plan Project Closure

  // ── Business Environment ──────────────────────────────────────────────────
  'business-1': 'intermediate', // Benefits Realisation
  'business-2': 'advanced',     // Compliance
  'business-3': 'advanced',     // Organisational Change
  'business-4': 'intermediate', // External Business Environment

  // ── Tools Deck ────────────────────────────────────────────────────────────
  'T1':  'beginner',     // Gantt Chart
  'T2':  'beginner',     // Kanban Board
  'T3':  'beginner',     // Work Breakdown Structure
  'T4':  'intermediate', // Earned Value Management
  'T5':  'beginner',     // Project Charter
  'T6':  'beginner',     // Communication Plan
  'T7':  'beginner',     // Risk Register
  'T8':  'intermediate', // Business Case
  'T9':  'intermediate', // RACI Matrix
  'T10': 'intermediate', // Issue Log
  'T11': 'beginner',     // Meeting Agenda
  'T12': 'intermediate', // Lessons Learned Register
  'T13': 'intermediate', // Change Log
  'T14': 'advanced',     // Benefits Realisation Plan
  'T15': 'intermediate', // Stakeholder Register
  'T16': 'intermediate', // Project Status Report
  'T17': 'advanced',     // Resource Histogram

  // ── Advanced Techniques ───────────────────────────────────────────────────
  'A1':  'intermediate', // MoSCoW Prioritisation
  'A2':  'beginner',     // RACI Matrix (technique)
  'A3':  'intermediate', // Stakeholder Mapping
  'A4':  'intermediate', // Force Field Analysis
  'A5':  'advanced',     // Cynefin Framework
  'A6':  'intermediate', // SWOT Analysis
  'A7':  'intermediate', // PESTLE Analysis
  'A8':  'advanced',     // Porter's Five Forces
  'A9':  'intermediate', // Balanced Scorecard
  'A10': 'advanced',     // OKRs
  'A11': 'intermediate', // Critical Path Method
  'A12': 'advanced',     // Monte Carlo Simulation
  'A13': 'intermediate', // S-Curve Analysis
  'A14': 'intermediate', // Burndown Chart
  'A15': 'beginner',     // Retrospective
  'A16': 'intermediate', // Daily Standup
  'A17': 'intermediate', // Three-Point Estimating
  'A18': 'advanced',     // Function Point Analysis
  'A19': 'intermediate', // Parametric Estimating
  'A20': 'intermediate', // Analogous Estimating
  'A21': 'intermediate', // Bottom-Up Estimating
  'A22': 'intermediate', // Planning Poker
  'A23': 'intermediate', // T-Shirt Sizing
  'A24': 'advanced',     // Delphi Technique
  'A25': 'advanced',     // Decision Tree Analysis
  'A26': 'advanced',     // Expected Monetary Value
  'A27': 'advanced',     // Sensitivity Analysis
  'A28': 'advanced',     // Kotter's 8-Step Model
  'A29': 'intermediate', // Network Diagram
  'A30': 'advanced',     // Design Thinking
  'A31': 'intermediate', // Prioritisation Matrix
  'A32': 'intermediate', // SWOT for Projects
  'A33': 'advanced',     // Portfolio Management
  'A34': 'intermediate', // Value Stream Mapping
  'A35': 'intermediate', // Sprint Planning
  'A36': 'intermediate', // ADKAR Model
  'A37': 'advanced',     // Prosci Change Management
  'A38': 'beginner',     // Responsibility Assignment Matrix
  'A39': 'intermediate', // Thomas-Kilmann Conflict Model
  'A40': 'intermediate', // Root Cause Analysis
  'A41': 'intermediate', // Issue Escalation
  'A42': 'intermediate', // Team Charter
  'A43': 'intermediate', // Conflict Resolution Techniques
  'A44': 'intermediate', // Situational Leadership
  'A45': 'intermediate', // Delegation Poker
  'A46': 'intermediate', // 5 Whys
  'A47': 'intermediate', // Constraint Management
  'A48': 'intermediate', // Stakeholder Engagement Plan
  'A49': 'advanced',     // Earned Schedule
  'A50': 'advanced',     // Complexity Assessment
  'A51': 'intermediate', // Pre-Mortem
  'A52': 'intermediate', // Decision Matrix
  'A53': 'advanced',     // VUCA Framework
  'A54': 'intermediate', // Requirements Management
  'A55': 'intermediate', // Change Readiness Assessment
  'A56': 'intermediate', // Motivation Theories
  'A57': 'intermediate', // Risk Probability & Impact Matrix
  'A58': 'beginner',     // Lessons Learned
  'A59': 'beginner',     // Meeting Facilitation
  'A60': 'intermediate', // Recognition and Rewards
  'A61': 'intermediate', // Project Dashboard
  'A62': 'intermediate', // Requirements Traceability Matrix
  'A63': 'intermediate', // Transition Plan
  'A64': 'intermediate', // Change Control Board
  'A65': 'advanced',     // Compliance Checklist
  'A66': 'beginner',     // Elevator Pitch
  'A67': 'intermediate', // Coaching Techniques
  'A68': 'advanced',     // Agile Scaling Frameworks
  'A69': 'advanced',     // SAFe Framework
  'A70': 'advanced',     // LeSS Framework
  'A71': 'advanced',     // Disciplined Agile
  'A72': 'advanced',     // Culture Mapping
  'A73': 'intermediate', // Vendor Evaluation Matrix
  'A74': 'advanced',     // Contract Types
  'A75': 'intermediate', // Benefits Map
  'A76': 'advanced',     // Programme Management
  'A77': 'advanced',     // MSP Framework
  'A78': 'advanced',     // PRINCE2 Overview
  'A79': 'intermediate', // Handover Checklist
  'A80': 'intermediate', // Story Points
  'A81': 'intermediate', // Benefits Tracking
  'A82': 'intermediate', // Rough Order of Magnitude
};

/**
 * Returns the difficulty level for a given card ID.
 * Falls back to 'intermediate' if the card is not in the lookup.
 */
export function getCardLevel(cardId: string): DifficultyLevel {
  return CARD_LEVELS[cardId] ?? 'intermediate';
}

export const LEVEL_LABELS: Record<DifficultyLevel, string> = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
};

export const LEVEL_COLORS: Record<DifficultyLevel, { bg: string; text: string; border: string }> = {
  beginner:     { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' },
  intermediate: { bg: '#FEF9C3', text: '#854D0E', border: '#FDE047' },
  advanced:     { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
};
