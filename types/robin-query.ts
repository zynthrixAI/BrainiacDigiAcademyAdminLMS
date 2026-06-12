/** A single student question routed through Robin (the AI tutor). */
export interface RobinQuery {
  id: string;
  student: string;
  subject: string;
  query: string;
  /** Flagged for teacher attention (e.g. Robin's answer looked off). */
  flagged: boolean;
  /** Teacher the subject is assigned to. */
  teacher: string;
  /** Relative time copy, e.g. "23 min ago". */
  time: string;
}

export interface RobinQueryKpi {
  label: string;
  value: string;
  note: string;
}

export interface RobinQueriesData {
  kpis: RobinQueryKpi[];
  items: RobinQuery[];
}
