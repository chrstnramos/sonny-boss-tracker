import type { Task } from '../types'

type SeedTask = Omit<Task, 'id' | 'projectId' | 'status' | 'completedAt' | 'notes' | 'isCustom' | 'createdAt' | 'updatedAt'>

const seed: SeedTask[] = [
  // ── Week 1: April 27 – May 1, 2026 ──────────────────────────────────────
  // Monday, April 27 — Setup & Baseline
  { title: 'Set up your STX Promo command center in Notion', estimatedMinutes: 25, dueDate: '2026-04-27', dayLabel: 'Monday, April 27 — Setup & Baseline', weekNumber: 1, weekLabel: 'Week 1: April 27 – May 1, 2026', weekTheme: 'Deliverability Triage + Opt-In Diagnosis', order: 0 },
  { title: 'Log into Omnisend and find your bounce report', estimatedMinutes: 20, dueDate: '2026-04-27', dayLabel: 'Monday, April 27 — Setup & Baseline', weekNumber: 1, weekLabel: 'Week 1: April 27 – May 1, 2026', weekTheme: 'Deliverability Triage + Opt-In Diagnosis', order: 1 },
  { title: 'Take a baseline screenshot of your current Omnisend metrics', estimatedMinutes: 15, dueDate: '2026-04-27', dayLabel: 'Monday, April 27 — Setup & Baseline', weekNumber: 1, weekLabel: 'Week 1: April 27 – May 1, 2026', weekTheme: 'Deliverability Triage + Opt-In Diagnosis', order: 2 },
  // Tuesday, April 28 — Deliverability Cleanup
  { title: 'Suppress the bounced contacts to fix deliverability', estimatedMinutes: 40, dueDate: '2026-04-28', dayLabel: 'Tuesday, April 28 — Deliverability Cleanup', weekNumber: 1, weekLabel: 'Week 1: April 27 – May 1, 2026', weekTheme: 'Deliverability Triage + Opt-In Diagnosis', order: 3 },
  { title: 'Disable the 3 zombie flows', estimatedMinutes: 15, dueDate: '2026-04-28', dayLabel: 'Tuesday, April 28 — Deliverability Cleanup', weekNumber: 1, weekLabel: 'Week 1: April 27 – May 1, 2026', weekTheme: 'Deliverability Triage + Opt-In Diagnosis', order: 4 },
  // Wednesday, April 29 — Checkout Audit
  { title: 'Audit your current checkout email opt-in setup', estimatedMinutes: 35, dueDate: '2026-04-29', dayLabel: 'Wednesday, April 29 — Checkout Audit', weekNumber: 1, weekLabel: 'Week 1: April 27 – May 1, 2026', weekTheme: 'Deliverability Triage + Opt-In Diagnosis', order: 5 },
  { title: 'Check your Shopify checkout settings for email marketing consent', estimatedMinutes: 25, dueDate: '2026-04-29', dayLabel: 'Wednesday, April 29 — Checkout Audit', weekNumber: 1, weekLabel: 'Week 1: April 27 – May 1, 2026', weekTheme: 'Deliverability Triage + Opt-In Diagnosis', order: 6 },
  // Thursday, April 30 — Checkout Fix
  { title: 'Improve your checkout email opt-in settings', estimatedMinutes: 30, dueDate: '2026-04-30', dayLabel: 'Thursday, April 30 — Checkout Fix', weekNumber: 1, weekLabel: 'Week 1: April 27 – May 1, 2026', weekTheme: 'Deliverability Triage + Opt-In Diagnosis', order: 7 },
  { title: 'Verify your Shopify-to-Omnisend sync is working correctly', estimatedMinutes: 25, dueDate: '2026-04-30', dayLabel: 'Thursday, April 30 — Checkout Fix', weekNumber: 1, weekLabel: 'Week 1: April 27 – May 1, 2026', weekTheme: 'Deliverability Triage + Opt-In Diagnosis', order: 8 },
  // Friday, May 1 — Review Day
  { title: 'Friday Week 1 metrics check', estimatedMinutes: 30, dueDate: '2026-05-01', dayLabel: 'Friday, May 1 — Review Day', weekNumber: 1, weekLabel: 'Week 1: April 27 – May 1, 2026', weekTheme: 'Deliverability Triage + Opt-In Diagnosis', order: 9 },
  { title: 'Week 1 retrospective + Week 2 prep', estimatedMinutes: 25, dueDate: '2026-05-01', dayLabel: 'Friday, May 1 — Review Day', weekNumber: 1, weekLabel: 'Week 1: April 27 – May 1, 2026', weekTheme: 'Deliverability Triage + Opt-In Diagnosis', order: 10 },

  // ── Week 2: May 4 – May 8, 2026 ─────────────────────────────────────────
  { title: 'Audit every SMS step in your active flows', estimatedMinutes: 40, dueDate: '2026-05-04', dayLabel: 'Monday, May 4 — SMS Audit', weekNumber: 2, weekLabel: 'Week 2: May 4 – May 8, 2026', weekTheme: 'SMS Decision + Dead Flow Diagnosis', order: 0 },
  { title: 'Check your SMS billing and contact count', estimatedMinutes: 15, dueDate: '2026-05-04', dayLabel: 'Monday, May 4 — SMS Audit', weekNumber: 2, weekLabel: 'Week 2: May 4 – May 8, 2026', weekTheme: 'SMS Decision + Dead Flow Diagnosis', order: 1 },
  { title: 'Make the SMS decision and execute it', estimatedMinutes: 45, dueDate: '2026-05-05', dayLabel: 'Tuesday, May 5 — SMS Decision', weekNumber: 2, weekLabel: 'Week 2: May 4 – May 8, 2026', weekTheme: 'SMS Decision + Dead Flow Diagnosis', order: 2 },
  { title: 'Cancel any SMS billing add-on if applicable', estimatedMinutes: 15, dueDate: '2026-05-05', dayLabel: 'Tuesday, May 5 — SMS Decision', weekNumber: 2, weekLabel: 'Week 2: May 4 – May 8, 2026', weekTheme: 'SMS Decision + Dead Flow Diagnosis', order: 3 },
  { title: 'Diagnose the dead Flags abandoned cart flow', estimatedMinutes: 45, dueDate: '2026-05-06', dayLabel: 'Wednesday, May 6 — Flags Flow Diagnostic', weekNumber: 2, weekLabel: 'Week 2: May 4 – May 8, 2026', weekTheme: 'SMS Decision + Dead Flow Diagnosis', order: 4 },
  { title: 'Check the abandoned checkouts feeding the Flags flow', estimatedMinutes: 15, dueDate: '2026-05-06', dayLabel: 'Wednesday, May 6 — Flags Flow Diagnostic', weekNumber: 2, weekLabel: 'Week 2: May 4 – May 8, 2026', weekTheme: 'SMS Decision + Dead Flow Diagnosis', order: 5 },
  { title: 'Diagnose the dead Table Covers abandoned cart flow', estimatedMinutes: 40, dueDate: '2026-05-07', dayLabel: 'Thursday, May 7 — Table Covers & Tradeshow Diagnostics', weekNumber: 2, weekLabel: 'Week 2: May 4 – May 8, 2026', weekTheme: 'SMS Decision + Dead Flow Diagnosis', order: 6 },
  { title: 'Diagnose the dead Tradeshow Displays abandoned cart flow', estimatedMinutes: 20, dueDate: '2026-05-07', dayLabel: 'Thursday, May 7 — Table Covers & Tradeshow Diagnostics', weekNumber: 2, weekLabel: 'Week 2: May 4 – May 8, 2026', weekTheme: 'SMS Decision + Dead Flow Diagnosis', order: 7 },
  { title: 'Friday Week 2 metrics check', estimatedMinutes: 30, dueDate: '2026-05-08', dayLabel: 'Friday, May 8 — Review Day', weekNumber: 2, weekLabel: 'Week 2: May 4 – May 8, 2026', weekTheme: 'SMS Decision + Dead Flow Diagnosis', order: 8 },
  { title: 'Week 2 retrospective + Week 3 prep', estimatedMinutes: 25, dueDate: '2026-05-08', dayLabel: 'Friday, May 8 — Review Day', weekNumber: 2, weekLabel: 'Week 2: May 4 – May 8, 2026', weekTheme: 'SMS Decision + Dead Flow Diagnosis', order: 9 },

  // ── Week 3: May 11 – May 15, 2026 ───────────────────────────────────────
  { title: 'Create a 10% discount code for abandoned cart recovery', estimatedMinutes: 25, dueDate: '2026-05-11', dayLabel: 'Monday, May 11 — Prep', weekNumber: 3, weekLabel: 'Week 3: May 11 – May 15, 2026', weekTheme: 'Revive the Dead Flows', order: 0 },
  { title: 'Pull the updated performance numbers on the 3 dead flows', estimatedMinutes: 20, dueDate: '2026-05-11', dayLabel: 'Monday, May 11 — Prep', weekNumber: 3, weekLabel: 'Week 3: May 11 – May 15, 2026', weekTheme: 'Revive the Dead Flows', order: 1 },
  { title: 'Fix the Flags abandoned cart flow', estimatedMinutes: 45, dueDate: '2026-05-12', dayLabel: 'Tuesday, May 12 — Flags Fix', weekNumber: 3, weekLabel: 'Week 3: May 11 – May 15, 2026', weekTheme: 'Revive the Dead Flows', order: 2 },
  { title: 'Fix the Table Covers abandoned cart flow', estimatedMinutes: 45, dueDate: '2026-05-13', dayLabel: 'Wednesday, May 13 — Table Covers Fix', weekNumber: 3, weekLabel: 'Week 3: May 11 – May 15, 2026', weekTheme: 'Revive the Dead Flows', order: 3 },
  { title: 'Fix the Tradeshow Displays abandoned cart flow', estimatedMinutes: 40, dueDate: '2026-05-14', dayLabel: 'Thursday, May 14 — Tradeshow Fix + Live Test', weekNumber: 3, weekLabel: 'Week 3: May 11 – May 15, 2026', weekTheme: 'Revive the Dead Flows', order: 4 },
  { title: 'End-to-end test of one of the fixed flows', estimatedMinutes: 20, dueDate: '2026-05-14', dayLabel: 'Thursday, May 14 — Tradeshow Fix + Live Test', weekNumber: 3, weekLabel: 'Week 3: May 11 – May 15, 2026', weekTheme: 'Revive the Dead Flows', order: 5 },
  { title: 'Confirm email 2 of your test arrived + Friday metrics check', estimatedMinutes: 30, dueDate: '2026-05-15', dayLabel: 'Friday, May 15 — Review Day', weekNumber: 3, weekLabel: 'Week 3: May 11 – May 15, 2026', weekTheme: 'Revive the Dead Flows', order: 6 },
  { title: 'Week 3 retrospective + Week 4 prep', estimatedMinutes: 25, dueDate: '2026-05-15', dayLabel: 'Friday, May 15 — Review Day', weekNumber: 3, weekLabel: 'Week 3: May 11 – May 15, 2026', weekTheme: 'Revive the Dead Flows', order: 7 },

  // ── Week 4: May 18 – May 22, 2026 ───────────────────────────────────────
  { title: 'Identify your dormant customer segment in Omnisend', estimatedMinutes: 40, dueDate: '2026-05-18', dayLabel: 'Monday, May 18 — Segment + Email 1 Angle', weekNumber: 4, weekLabel: 'Week 4: May 18 – May 22, 2026', weekTheme: 'Build the Winback Flow', order: 0 },
  { title: 'Draft the winback email 1 subject line and angle', estimatedMinutes: 20, dueDate: '2026-05-18', dayLabel: 'Monday, May 18 — Segment + Email 1 Angle', weekNumber: 4, weekLabel: 'Week 4: May 18 – May 22, 2026', weekTheme: 'Build the Winback Flow', order: 1 },
  { title: 'Write the full body copy for winback email 1', estimatedMinutes: 35, dueDate: '2026-05-19', dayLabel: 'Tuesday, May 19 — Email 1 & 2 Drafts', weekNumber: 4, weekLabel: 'Week 4: May 18 – May 22, 2026', weekTheme: 'Build the Winback Flow', order: 2 },
  { title: 'Draft email 2 of the winback sequence', estimatedMinutes: 25, dueDate: '2026-05-19', dayLabel: 'Tuesday, May 19 — Email 1 & 2 Drafts', weekNumber: 4, weekLabel: 'Week 4: May 18 – May 22, 2026', weekTheme: 'Build the Winback Flow', order: 3 },
  { title: 'Draft email 3 of the winback sequence with the offer', estimatedMinutes: 35, dueDate: '2026-05-20', dayLabel: 'Wednesday, May 20 — Email 3 + Sequence Review', weekNumber: 4, weekLabel: 'Week 4: May 18 – May 22, 2026', weekTheme: 'Build the Winback Flow', order: 4 },
  { title: 'Review all 3 winback emails together as a sequence', estimatedMinutes: 20, dueDate: '2026-05-20', dayLabel: 'Wednesday, May 20 — Email 3 + Sequence Review', weekNumber: 4, weekLabel: 'Week 4: May 18 – May 22, 2026', weekTheme: 'Build the Winback Flow', order: 5 },
  { title: 'Build the winback flow in Omnisend — structure setup', estimatedMinutes: 45, dueDate: '2026-05-21', dayLabel: 'Thursday, May 21 — Flow Structure', weekNumber: 4, weekLabel: 'Week 4: May 18 – May 22, 2026', weekTheme: 'Build the Winback Flow', order: 6 },
  { title: 'Paste the 3 email drafts into the winback flow', estimatedMinutes: 40, dueDate: '2026-05-22', dayLabel: 'Friday, May 22 — Review Day', weekNumber: 4, weekLabel: 'Week 4: May 18 – May 22, 2026', weekTheme: 'Build the Winback Flow', order: 7 },
  { title: 'Friday Week 4 metrics check + retrospective', estimatedMinutes: 30, dueDate: '2026-05-22', dayLabel: 'Friday, May 22 — Review Day', weekNumber: 4, weekLabel: 'Week 4: May 18 – May 22, 2026', weekTheme: 'Build the Winback Flow', order: 8 },

  // ── Week 5: May 26 – May 29, 2026 ───────────────────────────────────────
  { title: 'Pilot-launch the winback flow to a test segment of 500 customers', estimatedMinutes: 40, dueDate: '2026-05-26', dayLabel: 'Tuesday, May 26 — Pilot Launch', weekNumber: 5, weekLabel: 'Week 5: May 26 – May 29, 2026', weekTheme: 'Winback Pilot Launch + Post-Purchase Flow Build', order: 0 },
  { title: 'Set up a real-time monitoring check', estimatedMinutes: 20, dueDate: '2026-05-26', dayLabel: 'Tuesday, May 26 — Pilot Launch', weekNumber: 5, weekLabel: 'Week 5: May 26 – May 29, 2026', weekTheme: 'Winback Pilot Launch + Post-Purchase Flow Build', order: 1 },
  { title: 'Morning winback check + post-purchase flow outline', estimatedMinutes: 40, dueDate: '2026-05-27', dayLabel: 'Wednesday, May 27 — Post-Purchase Outline', weekNumber: 5, weekLabel: 'Week 5: May 26 – May 29, 2026', weekTheme: 'Winback Pilot Launch + Post-Purchase Flow Build', order: 2 },
  { title: 'Afternoon winback check + draft post-purchase email 1', estimatedMinutes: 45, dueDate: '2026-05-28', dayLabel: 'Thursday, May 28 — Post-Purchase Email 1', weekNumber: 5, weekLabel: 'Week 5: May 26 – May 29, 2026', weekTheme: 'Winback Pilot Launch + Post-Purchase Flow Build', order: 3 },
  { title: 'Winback pilot results review + decision on scaling', estimatedMinutes: 35, dueDate: '2026-05-29', dayLabel: 'Friday, May 29 — Review Day', weekNumber: 5, weekLabel: 'Week 5: May 26 – May 29, 2026', weekTheme: 'Winback Pilot Launch + Post-Purchase Flow Build', order: 4 },
  { title: 'Friday Week 5 metrics + retrospective', estimatedMinutes: 30, dueDate: '2026-05-29', dayLabel: 'Friday, May 29 — Review Day', weekNumber: 5, weekLabel: 'Week 5: May 26 – May 29, 2026', weekTheme: 'Winback Pilot Launch + Post-Purchase Flow Build', order: 5 },

  // ── Week 6: June 1 – June 5, 2026 ───────────────────────────────────────
  { title: 'Scale the winback flow to the full dormant segment', estimatedMinutes: 35, dueDate: '2026-06-01', dayLabel: 'Monday, June 1 — Scale Winback + Investigate Product Mystery', weekNumber: 6, weekLabel: 'Week 6: June 1 – June 5, 2026', weekTheme: 'Product Intelligence — Activate the Findings', order: 0 },
  { title: 'Investigate the "No product ID" $40K mystery', estimatedMinutes: 25, dueDate: '2026-06-01', dayLabel: 'Monday, June 1 — Scale Winback + Investigate Product Mystery', weekNumber: 6, weekLabel: 'Week 6: June 1 – June 5, 2026', weekTheme: 'Product Intelligence — Activate the Findings', order: 1 },
  { title: 'Morning winback check + research Sandbags cross-sell setup', estimatedMinutes: 30, dueDate: '2026-06-02', dayLabel: 'Tuesday, June 2 — Cross-Sell Research', weekNumber: 6, weekLabel: 'Week 6: June 1 – June 5, 2026', weekTheme: 'Product Intelligence — Activate the Findings', order: 2 },
  { title: 'Add Sandbags as a cross-sell on canopy tent product pages', estimatedMinutes: 45, dueDate: '2026-06-03', dayLabel: 'Wednesday, June 3 — Sandbags Live', weekNumber: 6, weekLabel: 'Week 6: June 1 – June 5, 2026', weekTheme: 'Product Intelligence — Activate the Findings', order: 3 },
  { title: 'Morning winback check + extend flow coverage to Pureway line', estimatedMinutes: 45, dueDate: '2026-06-04', dayLabel: 'Thursday, June 4 — Pureway Coverage', weekNumber: 6, weekLabel: 'Week 6: June 1 – June 5, 2026', weekTheme: 'Product Intelligence — Activate the Findings', order: 4 },
  { title: 'Friday Week 6 metrics + winback full-volume check', estimatedMinutes: 35, dueDate: '2026-06-05', dayLabel: 'Friday, June 5 — Review Day', weekNumber: 6, weekLabel: 'Week 6: June 1 – June 5, 2026', weekTheme: 'Product Intelligence — Activate the Findings', order: 5 },
  { title: 'Week 6 retrospective + Week 7 prep', estimatedMinutes: 25, dueDate: '2026-06-05', dayLabel: 'Friday, June 5 — Review Day', weekNumber: 6, weekLabel: 'Week 6: June 1 – June 5, 2026', weekTheme: 'Product Intelligence — Activate the Findings', order: 6 },

  // ── Week 7: June 8 – June 12, 2026 ──────────────────────────────────────
  { title: 'Draft Post-Purchase Email 2 — "Your Gear Is On Its Way"', estimatedMinutes: 30, dueDate: '2026-06-08', dayLabel: 'Monday, June 8 — Emails 2 & 3', weekNumber: 7, weekLabel: 'Week 7: June 8 – June 12, 2026', weekTheme: 'Complete the Post-Purchase Flow', order: 0 },
  { title: 'Draft Post-Purchase Email 3 — The Review Request', estimatedMinutes: 30, dueDate: '2026-06-08', dayLabel: 'Monday, June 8 — Emails 2 & 3', weekNumber: 7, weekLabel: 'Week 7: June 8 – June 12, 2026', weekTheme: 'Complete the Post-Purchase Flow', order: 1 },
  { title: 'Draft Post-Purchase Email 4 — The Cross-Sell', estimatedMinutes: 35, dueDate: '2026-06-09', dayLabel: 'Tuesday, June 9 — Emails 4 & 5', weekNumber: 7, weekLabel: 'Week 7: June 8 – June 12, 2026', weekTheme: 'Complete the Post-Purchase Flow', order: 2 },
  { title: 'Draft Post-Purchase Email 5 — The Reorder Reminder', estimatedMinutes: 25, dueDate: '2026-06-09', dayLabel: 'Tuesday, June 9 — Emails 4 & 5', weekNumber: 7, weekLabel: 'Week 7: June 8 – June 12, 2026', weekTheme: 'Complete the Post-Purchase Flow', order: 3 },
  { title: 'Build the post-purchase flow structure in Omnisend', estimatedMinutes: 45, dueDate: '2026-06-10', dayLabel: 'Wednesday, June 10 — Flow Structure', weekNumber: 7, weekLabel: 'Week 7: June 8 – June 12, 2026', weekTheme: 'Complete the Post-Purchase Flow', order: 4 },
  { title: 'Check Shopify order confirmation settings + load copy into flow Part 1', estimatedMinutes: 45, dueDate: '2026-06-11', dayLabel: 'Thursday, June 11 — Load Emails 1 & 2', weekNumber: 7, weekLabel: 'Week 7: June 8 – June 12, 2026', weekTheme: 'Complete the Post-Purchase Flow', order: 5 },
  { title: 'Load Emails 3, 4, and 5 into the post-purchase flow', estimatedMinutes: 40, dueDate: '2026-06-12', dayLabel: 'Friday, June 12 — Review Day', weekNumber: 7, weekLabel: 'Week 7: June 8 – June 12, 2026', weekTheme: 'Complete the Post-Purchase Flow', order: 6 },
  { title: 'Week 7 metrics check + retrospective', estimatedMinutes: 25, dueDate: '2026-06-12', dayLabel: 'Friday, June 12 — Review Day', weekNumber: 7, weekLabel: 'Week 7: June 8 – June 12, 2026', weekTheme: 'Complete the Post-Purchase Flow', order: 7 },

  // ── Week 8: June 15 – June 19, 2026 ─────────────────────────────────────
  { title: 'Enable the post-purchase flow', estimatedMinutes: 25, dueDate: '2026-06-15', dayLabel: 'Monday, June 15 — Post-Purchase Goes Live', weekNumber: 8, weekLabel: 'Week 8: June 15 – June 19, 2026', weekTheme: 'Launch Post-Purchase + First Email Campaign', order: 0 },
  { title: 'Set up a test order to verify the sequence fires correctly', estimatedMinutes: 30, dueDate: '2026-06-15', dayLabel: 'Monday, June 15 — Post-Purchase Goes Live', weekNumber: 8, weekLabel: 'Week 8: June 15 – June 19, 2026', weekTheme: 'Launch Post-Purchase + First Email Campaign', order: 1 },
  { title: 'Morning post-purchase check + plan your first campaign', estimatedMinutes: 35, dueDate: '2026-06-16', dayLabel: 'Tuesday, June 16 — Campaign 1 Planning', weekNumber: 8, weekLabel: 'Week 8: June 15 – June 19, 2026', weekTheme: 'Launch Post-Purchase + First Email Campaign', order: 2 },
  { title: 'Morning post-purchase check + draft Campaign 1 copy', estimatedMinutes: 45, dueDate: '2026-06-17', dayLabel: 'Wednesday, June 17 — Campaign 1 Copy', weekNumber: 8, weekLabel: 'Week 8: June 15 – June 19, 2026', weekTheme: 'Launch Post-Purchase + First Email Campaign', order: 3 },
  { title: 'Build and schedule Campaign 1 in Omnisend', estimatedMinutes: 50, dueDate: '2026-06-18', dayLabel: 'Thursday, June 18 — Schedule Campaign 1', weekNumber: 8, weekLabel: 'Week 8: June 15 – June 19, 2026', weekTheme: 'Launch Post-Purchase + First Email Campaign', order: 4 },
  { title: 'Monitor Campaign 1 send + post-purchase flow performance', estimatedMinutes: 40, dueDate: '2026-06-19', dayLabel: 'Friday, June 19 — Review Day + Campaign 1 Send', weekNumber: 8, weekLabel: 'Week 8: June 15 – June 19, 2026', weekTheme: 'Launch Post-Purchase + First Email Campaign', order: 5 },
  { title: 'Week 8 full review + retrospective', estimatedMinutes: 25, dueDate: '2026-06-19', dayLabel: 'Friday, June 19 — Review Day + Campaign 1 Send', weekNumber: 8, weekLabel: 'Week 8: June 15 – June 19, 2026', weekTheme: 'Launch Post-Purchase + First Email Campaign', order: 6 },

  // ── Week 9: June 22 – June 26, 2026 ─────────────────────────────────────
  { title: 'Research browse abandonment setup in Omnisend', estimatedMinutes: 35, dueDate: '2026-06-22', dayLabel: 'Monday, June 22 — Research + Subject Lines', weekNumber: 9, weekLabel: 'Week 9: June 22 – June 26, 2026', weekTheme: 'Build the Browse Abandonment Flow', order: 0 },
  { title: 'Draft browse abandonment email subject lines and angle', estimatedMinutes: 25, dueDate: '2026-06-22', dayLabel: 'Monday, June 22 — Research + Subject Lines', weekNumber: 9, weekLabel: 'Week 9: June 22 – June 26, 2026', weekTheme: 'Build the Browse Abandonment Flow', order: 1 },
  { title: 'Write browse abandonment email body copy + morning flow health check', estimatedMinutes: 55, dueDate: '2026-06-23', dayLabel: 'Tuesday, June 23 — Draft Copy + Flow Health Check', weekNumber: 9, weekLabel: 'Week 9: June 22 – June 26, 2026', weekTheme: 'Build the Browse Abandonment Flow', order: 2 },
  { title: 'Build the browse abandonment flow in Omnisend', estimatedMinutes: 50, dueDate: '2026-06-24', dayLabel: 'Wednesday, June 24 — Build Structure', weekNumber: 9, weekLabel: 'Week 9: June 22 – June 26, 2026', weekTheme: 'Build the Browse Abandonment Flow', order: 4 },
  { title: 'Load the email copy + send test of the browse abandonment flow', estimatedMinutes: 45, dueDate: '2026-06-25', dayLabel: 'Thursday, June 25 — Load Copy + Test', weekNumber: 9, weekLabel: 'Week 9: June 22 – June 26, 2026', weekTheme: 'Build the Browse Abandonment Flow', order: 5 },
  { title: 'Enable the browse abandonment flow + metrics check', estimatedMinutes: 30, dueDate: '2026-06-26', dayLabel: 'Friday, June 26 — Review Day + Flow Enable', weekNumber: 9, weekLabel: 'Week 9: June 22 – June 26, 2026', weekTheme: 'Build the Browse Abandonment Flow', order: 6 },
  { title: 'Week 9 retrospective + Week 10 prep', estimatedMinutes: 25, dueDate: '2026-06-26', dayLabel: 'Friday, June 26 — Review Day + Flow Enable', weekNumber: 9, weekLabel: 'Week 9: June 22 – June 26, 2026', weekTheme: 'Build the Browse Abandonment Flow', order: 7 },

  // ── Week 10: June 29 – July 3, 2026 ─────────────────────────────────────
  { title: 'Audit the 10 product-specific abandoned flows', estimatedMinutes: 45, dueDate: '2026-06-29', dayLabel: 'Monday, June 29 — Flow Audit', weekNumber: 10, weekLabel: 'Week 10: June 29 – July 3, 2026', weekTheme: 'Flow Consolidation + Q3 Campaign Calendar', order: 0 },
  { title: 'Plan the 2 consolidated flow structures', estimatedMinutes: 45, dueDate: '2026-06-30', dayLabel: 'Tuesday, June 30 — Consolidation Design', weekNumber: 10, weekLabel: 'Week 10: June 29 – July 3, 2026', weekTheme: 'Flow Consolidation + Q3 Campaign Calendar', order: 1 },
  { title: 'Map out a Q3 campaign calendar', estimatedMinutes: 45, dueDate: '2026-07-01', dayLabel: 'Wednesday, July 1 — Q3 Calendar', weekNumber: 10, weekLabel: 'Week 10: June 29 – July 3, 2026', weekTheme: 'Flow Consolidation + Q3 Campaign Calendar', order: 2 },
  { title: 'Draft the July 13 newsletter (mid-summer check-in)', estimatedMinutes: 40, dueDate: '2026-07-02', dayLabel: 'Thursday, July 2 — Draft Campaign 2', weekNumber: 10, weekLabel: 'Week 10: June 29 – July 3, 2026', weekTheme: 'Flow Consolidation + Q3 Campaign Calendar', order: 3 },
  { title: 'Monthly metrics review — June full month', estimatedMinutes: 40, dueDate: '2026-07-03', dayLabel: 'Friday, July 3 — Review Day + Monthly Review', weekNumber: 10, weekLabel: 'Week 10: June 29 – July 3, 2026', weekTheme: 'Flow Consolidation + Q3 Campaign Calendar', order: 4 },
  { title: 'Week 10 retrospective + Week 11 prep', estimatedMinutes: 25, dueDate: '2026-07-03', dayLabel: 'Friday, July 3 — Review Day + Monthly Review', weekNumber: 10, weekLabel: 'Week 10: June 29 – July 3, 2026', weekTheme: 'Flow Consolidation + Q3 Campaign Calendar', order: 5 },

  // ── Week 11: July 6 – July 10, 2026 ─────────────────────────────────────
  { title: 'Load and schedule Campaign 2 (mid-summer newsletter)', estimatedMinutes: 30, dueDate: '2026-07-06', dayLabel: 'Monday, July 6 — Campaign 2 Scheduled + Flow Structure', weekNumber: 11, weekLabel: 'Week 11: July 6 – July 10, 2026', weekTheme: 'Build the Unified Abandoned Cart Flow', order: 0 },
  { title: 'Start building the Unified Abandoned Cart Flow — structure', estimatedMinutes: 30, dueDate: '2026-07-06', dayLabel: 'Monday, July 6 — Campaign 2 Scheduled + Flow Structure', weekNumber: 11, weekLabel: 'Week 11: July 6 – July 10, 2026', weekTheme: 'Build the Unified Abandoned Cart Flow', order: 1 },
  { title: 'Draft Email 1 for the unified cart flow', estimatedMinutes: 45, dueDate: '2026-07-07', dayLabel: 'Tuesday, July 7 — Email 1 Draft', weekNumber: 11, weekLabel: 'Week 11: July 6 – July 10, 2026', weekTheme: 'Build the Unified Abandoned Cart Flow', order: 2 },
  { title: 'Draft Email 2 for the unified cart flow', estimatedMinutes: 30, dueDate: '2026-07-08', dayLabel: 'Wednesday, July 8 — Email 2 Draft', weekNumber: 11, weekLabel: 'Week 11: July 6 – July 10, 2026', weekTheme: 'Build the Unified Abandoned Cart Flow', order: 3 },
  { title: 'Load both emails into the Unified Cart Flow + configure dynamic blocks', estimatedMinutes: 50, dueDate: '2026-07-09', dayLabel: 'Thursday, July 9 — Load Emails + Dynamic Blocks', weekNumber: 11, weekLabel: 'Week 11: July 6 – July 10, 2026', weekTheme: 'Build the Unified Abandoned Cart Flow', order: 4 },
  { title: 'Test the unified flow with a real cart abandonment', estimatedMinutes: 30, dueDate: '2026-07-10', dayLabel: 'Friday, July 10 — Review Day + Live Test', weekNumber: 11, weekLabel: 'Week 11: July 6 – July 10, 2026', weekTheme: 'Build the Unified Abandoned Cart Flow', order: 5 },
  { title: 'Week 11 metrics + retrospective', estimatedMinutes: 25, dueDate: '2026-07-10', dayLabel: 'Friday, July 10 — Review Day + Live Test', weekNumber: 11, weekLabel: 'Week 11: July 6 – July 10, 2026', weekTheme: 'Build the Unified Abandoned Cart Flow', order: 6 },

  // ── Week 12: July 13 – July 17, 2026 ────────────────────────────────────
  { title: 'Monitor Campaign 2 send + morning flow check', estimatedMinutes: 30, dueDate: '2026-07-13', dayLabel: 'Monday, July 13 — Campaign 2 Send + Flow Verification', weekNumber: 12, weekLabel: 'Week 12: July 13 – July 17, 2026', weekTheme: 'Unified Checkout Flow + VIP Dormant Customer Outreach', order: 0 },
  { title: 'Verify Email 2 of the Unified Cart Flow fired correctly', estimatedMinutes: 15, dueDate: '2026-07-13', dayLabel: 'Monday, July 13 — Campaign 2 Send + Flow Verification', weekNumber: 12, weekLabel: 'Week 12: July 13 – July 17, 2026', weekTheme: 'Unified Checkout Flow + VIP Dormant Customer Outreach', order: 1 },
  { title: 'Build the structure of the Unified Abandoned Checkout Flow', estimatedMinutes: 40, dueDate: '2026-07-14', dayLabel: 'Tuesday, July 14 — Checkout Flow Structure', weekNumber: 12, weekLabel: 'Week 12: July 13 – July 17, 2026', weekTheme: 'Unified Checkout Flow + VIP Dormant Customer Outreach', order: 2 },
  { title: 'Draft all 3 emails for the Unified Checkout Flow', estimatedMinutes: 45, dueDate: '2026-07-15', dayLabel: 'Wednesday, July 15 — Draft All 3 Checkout Emails', weekNumber: 12, weekLabel: 'Week 12: July 13 – July 17, 2026', weekTheme: 'Unified Checkout Flow + VIP Dormant Customer Outreach', order: 3 },
  { title: 'Load the 3 emails into the Unified Checkout Flow + launch', estimatedMinutes: 50, dueDate: '2026-07-16', dayLabel: 'Thursday, July 16 — Launch Unified Checkout + Retire Old Flows', weekNumber: 12, weekLabel: 'Week 12: July 13 – July 17, 2026', weekTheme: 'Unified Checkout Flow + VIP Dormant Customer Outreach', order: 4 },
  { title: 'Identify top 20 highest-value dormant customers for personal outreach', estimatedMinutes: 45, dueDate: '2026-07-17', dayLabel: 'Friday, July 17 — Review Day + VIP List', weekNumber: 12, weekLabel: 'Week 12: July 13 – July 17, 2026', weekTheme: 'Unified Checkout Flow + VIP Dormant Customer Outreach', order: 5 },
  { title: 'Week 12 metrics + retrospective', estimatedMinutes: 25, dueDate: '2026-07-17', dayLabel: 'Friday, July 17 — Review Day + VIP List', weekNumber: 12, weekLabel: 'Week 12: July 13 – July 17, 2026', weekTheme: 'Unified Checkout Flow + VIP Dormant Customer Outreach', order: 6 },

  // ── Week 13: July 20 – July 24, 2026 ────────────────────────────────────
  { title: 'Draft the personal VIP outreach email template', estimatedMinutes: 40, dueDate: '2026-07-20', dayLabel: 'Monday, July 20 — VIP Template', weekNumber: 13, weekLabel: 'Week 13: July 20 – July 24, 2026', weekTheme: 'VIP Outreach + 90-Day Closing Review', order: 0 },
  { title: 'Send personal VIP emails to the top 15', estimatedMinutes: 60, dueDate: '2026-07-21', dayLabel: 'Tuesday, July 21 — Send VIP Emails (15)', weekNumber: 13, weekLabel: 'Week 13: July 20 – July 24, 2026', weekTheme: 'VIP Outreach + 90-Day Closing Review', order: 1 },
  { title: 'Call or email the top 5 VIP customers personally', estimatedMinutes: 50, dueDate: '2026-07-22', dayLabel: 'Wednesday, July 22 — Call/Email Top 5', weekNumber: 13, weekLabel: 'Week 13: July 20 – July 24, 2026', weekTheme: 'VIP Outreach + 90-Day Closing Review', order: 2 },
  { title: 'Pull all the final metrics data for the 90-day closing review', estimatedMinutes: 60, dueDate: '2026-07-23', dayLabel: 'Thursday, July 23 — Data Collection', weekNumber: 13, weekLabel: 'Week 13: July 20 – July 24, 2026', weekTheme: 'VIP Outreach + 90-Day Closing Review', order: 3 },
  { title: 'Complete the 90-Day Assessment', estimatedMinutes: 50, dueDate: '2026-07-24', dayLabel: 'Friday, July 24 — 90-Day Closing Review', weekNumber: 13, weekLabel: 'Week 13: July 20 – July 24, 2026', weekTheme: 'VIP Outreach + 90-Day Closing Review', order: 4 },
  { title: 'Calculate your total revenue recovery', estimatedMinutes: 20, dueDate: '2026-07-24', dayLabel: 'Friday, July 24 — 90-Day Closing Review', weekNumber: 13, weekLabel: 'Week 13: July 20 – July 24, 2026', weekTheme: 'VIP Outreach + 90-Day Closing Review', order: 5 },
  { title: 'Identify top 3 priorities for the next 90 days', estimatedMinutes: 25, dueDate: '2026-07-24', dayLabel: 'Friday, July 24 — 90-Day Closing Review', weekNumber: 13, weekLabel: 'Week 13: July 20 – July 24, 2026', weekTheme: 'VIP Outreach + 90-Day Closing Review', order: 6 },
  { title: 'Close out the 90-day plan + set up next cycle', estimatedMinutes: 15, dueDate: '2026-07-24', dayLabel: 'Friday, July 24 — 90-Day Closing Review', weekNumber: 13, weekLabel: 'Week 13: July 20 – July 24, 2026', weekTheme: 'VIP Outreach + 90-Day Closing Review', order: 7 },
]

export function buildSeedTasks(projectId: string): Task[] {
  const now = new Date().toISOString()
  return seed.map((s) => ({
    ...s,
    id: crypto.randomUUID(),
    projectId,
    status: 'todo',
    completedAt: null,
    notes: '',
    isCustom: false,
    createdAt: now,
    updatedAt: now,
  }))
}

export const TOTAL_SEED_TASKS = seed.length

