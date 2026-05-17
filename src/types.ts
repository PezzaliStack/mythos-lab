// Mythos Lab — shared domain types

export type Severity = 'Critico' | 'Alto' | 'Medio' | 'Basso';

export type TabId =
  | 'overview'
  | 'payload'
  | 'detection'
  | 'mitigation'
  | 'indicators';

export interface ScenarioFiles {
  overview: string;
  payload: string;
  detection: string;
  mitigation: string;
  indicators: string;
}

export interface ScenarioMeta {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  tags: string[];
  files: ScenarioFiles;
}

export interface TimelineStep {
  phase: string;
  description: string;
}

export interface MitreMapping {
  tactic: string;
  technique: string;
  id: string;
}

// Enriched indicators.json schema. Legacy files only had
// severity/category/observables/mitigations/status — every new
// field is optional so older scenarios keep working.
export interface IndicatorsDoc {
  severity: Severity;
  category: string;
  observables: string[];
  mitigations: string[];
  status: string;
  narrative?: string;
  timeline?: TimelineStep[];
  process_chain?: string[];
  browser_indicators?: string[];
  endpoint_indicators?: string[];
  telemetry?: string[];
  mitre?: MitreMapping[];
  mitigation_checklist?: string[];
}

export interface WorkspaceNote {
  id: string;
  scenarioId: string;
  title: string;
  body: string;
  kind: 'note' | 'audit' | 'observation';
  createdAt: number;
  updatedAt: number;
}

export interface Bookmark {
  scenarioId: string;
  createdAt: number;
}

export interface ReportInput {
  scenario: ScenarioMeta;
  indicators: IndicatorsDoc | null;
  overview: string;
  detection: string;
  mitigation: string;
  notes: WorkspaceNote[];
}
