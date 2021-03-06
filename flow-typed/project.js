// @flow

declare type FlowStatus = 'INITAL' | 'RUNNING' | 'WAITTING' | 'SUCCESS' | 'FAILURE';
declare type ReportStatus = 'INITAL' | 'RUNNING' | 'WAITTING' | 'SUCCESS' | 'FAILURE';

declare interface User {
  username: string;
  createdDate: number;
  id: number;
  isAdmin: boolean;
}

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

declare interface FlowResutWithoutOutput {
  flowName: string;
  status: FlowStatus;
  finishTime: number;
  duration: number;
}

declare interface FlowResult {
  flowName: string;
  status: FlowStatus;
  result: FlowOutputUnit[];
  finishTime: number;
  duration: number;
}

declare interface ProjectReport {
  id: number;
  commitHash: string;
  flows: any[];
  commitMessasge?: string;
  projectName: string;
  repoPullOutput: string;
  startDate: Date;
  status: ReportStatus;
  result: FlowResult[];
}

declare interface FlowLine {
  project: Project;
  report: ProjectReport;
  flows: Flow[];
}
