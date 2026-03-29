export type MissionStatus = 'BACKLOG' | 'READY' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'DONE';

export interface UserDto {
  id: string;
  userName: string;
  dateCreated: string;
  dateModified: string;
}

export interface ProjectDto {
  id: string;
  name: string;
  prefix: string;
  description: string;
  assignedUserId?: string;
  status: MissionStatus;
  blockedReason?: string;
  dateCreated: string;
  dateModified: string;
}

export interface TaskDto {
  id: string;
  taskCode?: string;
  name: string;
  projectId: string;
  assignedUserId?: string;
  status: MissionStatus;
  blockedReason?: string;
  description: string;
  acceptanceCriteria: string;
  dateCreated: string;
  dateModified: string;
}
