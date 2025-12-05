export const QUEUE_NAMES = {
  CHANGE_REQUEST: 'change-request',
  DEPLOYMENT: 'deployment',
} as const;

export interface ChangeRequestJobData {
  changeRequestId: string;
  projectId: string;
  description: string;
  repositoryUrl: string;
  defaultBranch: string;
}

export interface DeploymentJobData {
  changeRequestId: string;
  projectId: string;
  branchName: string;
  repositoryUrl: string;
}

export enum JobStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
