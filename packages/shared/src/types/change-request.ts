export enum ChangeRequestStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  AWAITING_REVIEW = 'AWAITING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  MERGED = 'MERGED',
  FAILED = 'FAILED',
}

export interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  status: ChangeRequestStatus;
  projectId: string;
  authorId: string;
  branchName: string | null;
  previewUrl: string | null;
  diffContent: string | null;
  aiResponse: string | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChangeRequestDto {
  title: string;
  description: string;
  projectId: string;
}

export interface UpdateChangeRequestDto {
  title?: string;
  description?: string;
  status?: ChangeRequestStatus;
}

export interface ChangeRequestResponse {
  id: string;
  title: string;
  description: string;
  status: ChangeRequestStatus;
  projectId: string;
  authorId: string;
  branchName: string | null;
  previewUrl: string | null;
  diffContent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChangeRequestListResponse {
  items: ChangeRequestResponse[];
  total: number;
  page: number;
  pageSize: number;
}
