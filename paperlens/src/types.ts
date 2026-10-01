export type NodeCategory =
  | 'problem'
  | 'method'
  | 'dataset'
  | 'model'
  | 'experiments'
  | 'findings'
  | 'limitations'
  | 'future_work';

export type EdgeLabel =
  | 'uses'
  | 'evaluates'
  | 'results in'
  | 'limited by'
  | 'extends'
  | 'addresses'
  | 'benchmarks on'
  | 'compares with';

export interface GraphNode {
  id: string;
  label: string;
  category: NodeCategory;
  description: string;
  details?: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: EdgeLabel;
}

export interface FlowchartStep {
  stepNumber: number;
  phase: string;
  title: string;
  description: string;
  inputs: string[];
  outputs: string[];
  keyTechnique: string;
}

export interface QuantitativeFinding {
  metricName: string;
  baselineValue: string; // e.g., "33.9 BLEU" or "Not reported"
  paperValue: string; // e.g., "41.8 BLEU" or "Not reported"
  baselineModel?: string;
  paperModel?: string;
  benchmarkOrDataset: string;
  improvement?: string;
  numericBaseline?: number; // parsed if available for chart
  numericPaper?: number; // parsed if available for chart
  higherIsBetter?: boolean;
  notes: string;
}

export interface QualitativeFinding {
  title: string;
  insight: string;
  significance: string;
}

export interface TimelineItem {
  year: string;
  workTitle: string;
  authorsOrGroup: string;
  coreContribution: string;
  paperDifference: string;
}

export interface ConceptVariable {
  term: string;
  definition: string;
  roleInPaper: string;
}

export interface PaperAtAGlance {
  problem: {
    title: string;
    summary: string;
    significance: string;
  };
  approach: {
    title: string;
    summary: string;
    keyInnovation: string;
  };
  data: {
    title: string;
    summary: string;
    benchmarks: string[];
  };
  results: {
    title: string;
    summary: string;
    highlight: string;
  };
  limitations: {
    title: string;
    summary: string;
    criticalBottleneck: string;
  };
}

export interface PaperAnalysis {
  id: string;
  title: string;
  authors: string[];
  year: string | number;
  venue: string;
  doi?: string;
  abstract: string;
  tldr: string;
  researchProblem: string;
  researchObjectives: string[];
  atAGlance: PaperAtAGlance;
  researchMap: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  methodologyFlowchart: FlowchartStep[];
  keyFindings: {
    quantitative: QuantitativeFinding[];
    qualitative: QualitativeFinding[];
  };
  timelineEvolution: TimelineItem[];
  conceptsAndVariables: ConceptVariable[];
  importantReferences: Array<{
    citation: string;
    relevance: string;
  }>;
}
