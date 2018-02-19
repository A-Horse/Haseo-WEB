// @flow

declare type FlowStatus = 'INITAL' | 'RUNNING' | 'WAITTING' | 'SUCCESS' | 'FAILURE';

declare interface FlowDescription {
  [string]: string;
}

declare interface Flow {
  name: string;
  command: string;
  status: FlowStatus;
}

declare interface Project {
  name: string;
  flows: Flow[];
}

declare interface ProjectBase {
  flows: Array<{ [string]: string }>;
  name: string;
}

declare interface FlowOutputUnit {
  type: 'stdout' | 'stderr';
  data: string;
}

declare interface FlowResult {
  flowName: string;
  status: FlowStatus;
  result: FlowOutputUnit[];
  mock?: boolean;
}

declare interface ProjectReport {
  id: number;
  commitHash: string;
  projectName: string;
  repoPullOutput: string;
  startDate: Date;
  status: string;
  result: FlowResult[];
}

declare interface FlowLine {
  project: Project;
  report: ProjectReport;
  flows: Flow[];
}
