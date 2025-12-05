export interface Project {
  id: string;
  name: string;
  description: string | null;
  repositoryUrl: string;
  defaultBranch: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  repositoryUrl: string;
  defaultBranch?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  repositoryUrl?: string;
  defaultBranch?: string;
}

export interface ProjectResponse {
  id: string;
  name: string;
  description: string | null;
  repositoryUrl: string;
  defaultBranch: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
