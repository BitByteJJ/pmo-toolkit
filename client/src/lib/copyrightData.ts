// Copyright disclosures for proprietary tools, frameworks, and methodologies
// referenced in the PMO Toolkit Navigator

export interface CopyrightNotice {
  name: string;
  owner: string;
  notice: string;
  url?: string;
}

// Map from card ID to list of copyright notices that apply to that card
export const CARD_COPYRIGHTS: Record<string, CopyrightNotice[]> = {
  // Methodologies
  M2: [
    {
      name: 'Scrum',
      owner: 'Scrum Alliance / Scrum.org',
      notice: 'Scrum is a framework developed by Ken Schwaber and Jeff Sutherland. "Scrum" is a registered trademark of Scrum Alliance and Scrum.org.',
      url: 'https://www.scrum.org',
    },
  ],
  M3: [
    {
      name: 'Kanban',
      owner: 'Lean Kanban Inc.',
      notice: 'The Kanban Method was developed by David J. Anderson. "Kanban" as a project management method is associated with Lean Kanban Inc.',
      url: 'https://leankanban.com',
    },
  ],
  // Tools
  T4: [
    {
      name: 'Earned Value Management (EVM)',
      owner: 'Project Management Institute (PMI)',
      notice: 'Earned Value Management is a practice described in the PMBOK® Guide. PMBOK® is a registered mark of the Project Management Institute, Inc.',
      url: 'https://www.pmi.org',
    },
  ],
  T7: [
    {
      name: 'MoSCoW Method',
      owner: 'DSDM Consortium',
      notice: 'The MoSCoW prioritisation technique was developed by Dai Clegg and is associated with the DSDM Agile Project Framework. DSDM® is a registered trademark of the DSDM Consortium.',
      url: 'https://www.agilebusiness.org',
    },
  ],
  T11: [
    {
      name: 'Balanced Scorecard',
      owner: 'Balanced Scorecard Institute / Palladium Group',
      notice: 'The Balanced Scorecard was developed by Robert S. Kaplan and David P. Norton. "Balanced Scorecard" is associated with the Balanced Scorecard Institute and Palladium Group.',
      url: 'https://balancedscorecard.org',
    },
  ],
  T17: [
    {
      name: 'Scrum / Sprint Planning',
      owner: 'Scrum Alliance / Scrum.org',
      notice: 'Sprint Planning is a Scrum ceremony. "Scrum" is a registered trademark of Scrum Alliance and Scrum.org.',
      url: 'https://www.scrum.org',
    },
  ],
  // Advanced Techniques
  A21: [
    {
      name: 'Six Sigma DMAIC',
      owner: 'Motorola / ASQ',
      notice: 'Six Sigma was developed at Motorola. "Six Sigma" is a registered trademark of Motorola Solutions, Inc. DMAIC is a core methodology of Six Sigma.',
      url: 'https://www.asq.org',
    },
  ],
  A35: [
    {
      name: "Kotter's 8-Step Change Model",
      owner: 'Kotter Inc.',
      notice: "Kotter's 8-Step Model for leading change was developed by Dr. John P. Kotter. It is described in his book \"Leading Change\" (Harvard Business Review Press, 1996). © John P. Kotter. Kotter Inc. reserves all rights.",
      url: 'https://www.kotterinc.com',
    },
  ],
  A36: [
    {
      name: 'Critical Chain Project Management (CCPM)',
      owner: 'Eliyahu M. Goldratt',
      notice: 'Critical Chain Project Management was developed by Eliyahu M. Goldratt and described in his book "Critical Chain" (1997). © The Goldratt Group.',
      url: 'https://www.toc-goldratt.com',
    },
  ],
  A44: [
    {
      name: "McKinsey 7-S Framework",
      owner: 'McKinsey & Company',
      notice: 'The 7-S Framework was developed by Tom Peters and Robert Waterman at McKinsey & Company. © McKinsey & Company. All rights reserved.',
      url: 'https://www.mckinsey.com',
    },
  ],
  A45: [
    {
      name: 'Belbin Team Roles',
      owner: 'Belbin Associates',
      notice: 'Belbin Team Roles were developed by Dr. Meredith Belbin. "Belbin" is a registered trademark of Belbin Associates. The model is described in "Management Teams: Why They Succeed or Fail" (1981).',
      url: 'https://www.belbin.com',
    },
  ],
  A46: [
    {
      name: 'The Five Dysfunctions of a Team',
      owner: 'Patrick Lencioni / The Table Group',
      notice: 'The Five Dysfunctions of a Team model was developed by Patrick Lencioni and described in his book of the same name (Jossey-Bass, 2002). © Patrick Lencioni / The Table Group.',
      url: 'https://www.tablegroup.com',
    },
  ],
  A47: [
    {
      name: 'PDCA (Plan-Do-Check-Act)',
      owner: 'W. Edwards Deming / ASQ',
      notice: 'The PDCA cycle is attributed to W. Edwards Deming (also known as the Deming Cycle). It is a foundational quality improvement method widely referenced by the American Society for Quality (ASQ).',
      url: 'https://www.asq.org',
    },
  ],
  A48: [
    {
      name: 'Nudge Theory',
      owner: 'Richard H. Thaler & Cass R. Sunstein',
      notice: 'Nudge Theory was developed by Richard H. Thaler and Cass R. Sunstein, described in their book "Nudge: Improving Decisions About Health, Wealth, and Happiness" (Yale University Press, 2008). Richard Thaler was awarded the Nobel Prize in Economics (2017).',
    },
  ],
  A49: [
    {
      name: "Maslow's Hierarchy of Needs",
      owner: 'Abraham H. Maslow',
      notice: 'The Hierarchy of Needs was developed by Abraham H. Maslow and first described in "A Theory of Human Motivation" (Psychological Review, 1943). The model is in the public domain.',
    },
  ],
  A50: [
    {
      name: "Rogers' Diffusion of Innovation",
      owner: 'Everett M. Rogers',
      notice: 'The Diffusion of Innovation model was developed by Everett M. Rogers and described in "Diffusion of Innovations" (Free Press, 1962, 5th ed. 2003). © Everett M. Rogers.',
    },
  ],
  A51: [
    {
      name: "McKinsey's Three Horizons",
      owner: 'McKinsey & Company',
      notice: "The Three Horizons framework was developed by Mehrdad Baghai, Stephen Coley, and David White at McKinsey & Company, described in \"The Alchemy of Growth\" (Perseus Books, 1999). © McKinsey & Company.",
      url: 'https://www.mckinsey.com',
    },
  ],
  A52: [
    {
      name: "Lewin's Force Field Analysis",
      owner: 'Kurt Lewin',
      notice: 'Force Field Analysis was developed by Kurt Lewin and described in "Field Theory in Social Science" (Harper & Row, 1951). The model is in the public domain.',
    },
  ],
  A53: [
    {
      name: 'Situational Leadership Model',
      owner: 'Center for Leadership Studies',
      notice: 'The Situational Leadership® Model was developed by Paul Hersey and Ken Blanchard. "Situational Leadership" is a registered trademark of the Center for Leadership Studies.',
      url: 'https://situational.com',
    },
  ],
  A55: [
    {
      name: "Porter's Five Forces",
      owner: 'Michael E. Porter / Harvard Business School',
      notice: "Porter's Five Forces framework was developed by Michael E. Porter and described in \"Competitive Strategy\" (Free Press, 1980). © Michael E. Porter / Harvard Business School Publishing.",
      url: 'https://www.hbs.edu',
    },
  ],
  A56: [
    {
      name: "Vroom's Expectancy Theory",
      owner: 'Victor H. Vroom',
      notice: "Expectancy Theory was developed by Victor H. Vroom and described in \"Work and Motivation\" (Wiley, 1964). © Victor H. Vroom.",
    },
  ],
  A57: [
    {
      name: 'The Cultural Web',
      owner: 'Gerry Johnson & Kevan Scholes',
      notice: 'The Cultural Web was developed by Gerry Johnson and Kevan Scholes and described in "Exploring Corporate Strategy" (Prentice Hall, 1992). © Gerry Johnson and Kevan Scholes.',
    },
  ],
  A58: [
    {
      name: 'BCG Growth-Share Matrix',
      owner: 'Boston Consulting Group',
      notice: 'The BCG Growth-Share Matrix was developed by Bruce D. Henderson at the Boston Consulting Group in 1970. © Boston Consulting Group (BCG). All rights reserved.',
      url: 'https://www.bcg.com',
    },
  ],
  A59: [
    {
      name: 'SCARF Model',
      owner: 'David Rock / NeuroLeadership Institute',
      notice: 'The SCARF Model was developed by David Rock and described in "Your Brain at Work" (HarperCollins, 2009) and the NeuroLeadership Journal. © David Rock / NeuroLeadership Institute.',
      url: 'https://neuroleadership.com',
    },
  ],
  A60: [
    {
      name: 'Thomas-Kilmann Conflict Mode Instrument (TKI)',
      owner: 'Kilmann Diagnostics',
      notice: 'The Thomas-Kilmann Conflict Mode Instrument (TKI) was developed by Kenneth W. Thomas and Ralph H. Kilmann. TKI® is a registered trademark of Kilmann Diagnostics.',
      url: 'https://kilmanndiagnostics.com',
    },
  ],
  A61: [
    {
      name: "Bridges' Transition Model",
      owner: 'William Bridges Associates',
      notice: "Bridges' Transition Model was developed by William Bridges and described in \"Managing Transitions\" (Addison-Wesley, 1991). © William Bridges Associates.",
      url: 'https://wmbridges.com',
    },
  ],
  A62: [
    {
      name: 'Kübler-Ross Change Curve',
      owner: 'Elisabeth Kübler-Ross Foundation',
      notice: 'The five stages of grief were developed by Dr. Elisabeth Kübler-Ross in "On Death and Dying" (Macmillan, 1969). Their application to organisational change is a widely adopted adaptation. © Elisabeth Kübler-Ross Foundation.',
      url: 'https://www.ekrfoundation.org',
    },
  ],
  A63: [
    {
      name: 'Tannenbaum-Schmidt Leadership Continuum',
      owner: 'Robert Tannenbaum & Warren H. Schmidt',
      notice: 'The Leadership Continuum was developed by Robert Tannenbaum and Warren H. Schmidt and described in "How to Choose a Leadership Pattern" (Harvard Business Review, 1958). © Harvard Business Publishing.',
      url: 'https://hbr.org',
    },
  ],
  A64: [
    {
      name: 'Johari Window',
      owner: 'Joseph Luft & Harrington Ingham',
      notice: 'The Johari Window was developed by Joseph Luft and Harrington Ingham in 1955. The model is in the public domain.',
    },
  ],
  A66: [
    {
      name: 'Theory of Constraints (TOC)',
      owner: 'Eliyahu M. Goldratt / The Goldratt Group',
      notice: 'The Theory of Constraints was developed by Eliyahu M. Goldratt and described in "The Goal" (North River Press, 1984). © The Goldratt Group.',
      url: 'https://www.toc-goldratt.com',
    },
  ],
  A67: [
    {
      name: 'TRIZ',
      owner: 'Genrich Altshuller / MATRIZ',
      notice: 'TRIZ (Teoriya Resheniya Izobretatelskikh Zadach) was developed by Genrich Altshuller beginning in 1946. The International TRIZ Association (MATRIZ) maintains the methodology.',
      url: 'https://matriz.org',
    },
  ],
  A70: [
    {
      name: 'Soft Systems Methodology (SSM)',
      owner: 'Peter Checkland',
      notice: "Soft Systems Methodology was developed by Peter Checkland and described in \"Systems Thinking, Systems Practice\" (Wiley, 1981). © Peter Checkland.",
    },
  ],
  A73: [
    {
      name: 'Cynefin Framework',
      owner: 'Dave Snowden / Cognitive Edge',
      notice: 'The Cynefin Framework was developed by Dave Snowden at IBM and later through Cognitive Edge. "Cynefin" is a registered trademark of Cognitive Edge Pte Ltd.',
      url: 'https://thecynefin.co',
    },
  ],
  A74: [
    {
      name: 'PMBOK® Process Groups',
      owner: 'Project Management Institute (PMI)',
      notice: 'The five Process Groups are defined in the PMBOK® Guide. PMBOK® is a registered mark of the Project Management Institute, Inc. © Project Management Institute, Inc.',
      url: 'https://www.pmi.org',
    },
  ],
  A75: [
    {
      name: 'ADKAR® Model',
      owner: 'Prosci Inc.',
      notice: 'The ADKAR® Model was developed by Jeff Hiatt at Prosci Inc. ADKAR® is a registered trademark of Prosci Inc.',
      url: 'https://www.prosci.com',
    },
  ],
  A76: [
    {
      name: "McClelland's Theory of Needs",
      owner: 'David C. McClelland',
      notice: "McClelland's Theory of Needs (Achievement, Affiliation, Power) was developed by David C. McClelland and described in \"The Achieving Society\" (Van Nostrand, 1961). The model is in the public domain.",
    },
  ],
};

// Get all copyright notices for a given card ID
export function getCopyrightNotices(cardId: string): CopyrightNotice[] {
  return CARD_COPYRIGHTS[cardId] || [];
}

// General disclaimer shown on all cards
export const GENERAL_DISCLAIMER =
  'All referenced frameworks, models, and methodologies are the intellectual property of their respective owners. This app is an educational reference tool only.';
