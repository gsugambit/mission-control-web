import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { 
  useCreateTaskMutation, 
  useUpdateTaskMutation, 
  useGetProjectsQuery, 
  useGetUsersQuery 
} from '../services/missionControlApi';
import type { MissionStatus, TaskDto } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskDto; // If provided, we are in edit mode
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const [projectId, setProjectId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [status, setStatus] = useState<MissionStatus>('BACKLOG');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [blockedReason, setBlockedReason] = useState('');
  const [taskCode, setTaskCode] = useState('');
  
  const { data: projects } = useGetProjectsQuery();
  const { data: users } = useGetUsersQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const isEditMode = !!task;

  useEffect(() => {
    if (task) {
      setProjectId(task.projectId || '');
      setName(task.name || '');
      setDescription(task.description || '');
      setAcceptanceCriteria(task.acceptanceCriteria || '');
      setStatus(task.status || 'BACKLOG');
      setAssignedUserId(task.assignedUserId || '');
      setBlockedReason(task.blockedReason || '');
      setTaskCode(task.taskCode || '');
    } else {
      // In create mode, default to the first project if available
      if (projects && projects.length > 0 && !projectId) {
        setProjectId(projects[0].id);
      } else if (!projects || projects.length === 0) {
        setProjectId('');
      }
      setName('');
      setDescription('');
      setAcceptanceCriteria('');
      setStatus('BACKLOG');
      setAssignedUserId('');
      setBlockedReason('');
      setTaskCode('');
    }
  }, [task, isOpen, projects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      toast.error('Please select a project first');
      return;
    }
    try {
      const taskData: Partial<TaskDto> = {
        projectId,
        name,
        description,
        acceptanceCriteria,
        status,
        assignedUserId: assignedUserId || undefined,
        blockedReason: status === 'BLOCKED' ? blockedReason : undefined
      };

      if (isEditMode && task) {
        await updateTask({ ...taskData, id: task.id }).unwrap();
        toast.success('Task updated successfully!');
      } else {
        await createTask(taskData).unwrap();
        toast.success('Task created successfully!');
      }
      onClose();
    } catch (err) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} task:`, err);
      const errorMsg = (err as any)?.data?.message || (err as any)?.error || 'Unknown error';
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} task: ${errorMsg}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Task' : 'Create New Task'}>
      <form onSubmit={handleSubmit}>
        {isEditMode && taskCode && (
          <div className="form-group">
            <label htmlFor="taskCode">Task Code</label>
            <input
              id="taskCode"
              type="text"
              value={taskCode}
              disabled
              className="read-only-input"
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="name">Task Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectId">Project</label>
          <select
            id="projectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            disabled={isEditMode}
            className={isEditMode ? 'read-only-input' : ''}
          >
            {(!projects || projects.length === 0) ? (
              <option value="">No projects available - please create one first</option>
            ) : (
              <>
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="assignedUserId">Assigned User</label>
          <select
            id="assignedUserId"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
          >
            <option value="">Unassigned</option>
            {users?.map(user => (
              <option key={user.id} value={user.id}>
                {user.userName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="acceptanceCriteria">Acceptance Criteria</label>
          <textarea
            id="acceptanceCriteria"
            value={acceptanceCriteria}
            onChange={(e) => setAcceptanceCriteria(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as MissionStatus)}
          >
            <option value="BACKLOG">Backlog</option>
            <option value="READY">Ready</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="BLOCKED">Blocked</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        {status === 'BLOCKED' && (
          <div className="form-group">
            <label htmlFor="blockedReason">Blocked Reason</label>
            <input
              id="blockedReason"
              type="text"
              value={blockedReason}
              onChange={(e) => setBlockedReason(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-actions">
          <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          <button type="submit" className="submit-btn" disabled={isCreating || isUpdating || !projectId}>
            {isCreating || isUpdating ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
