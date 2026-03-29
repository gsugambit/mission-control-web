import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  useGetTasksQuery, 
  useGetUsersQuery, 
  useUpdateTaskStatusMutation 
} from '../services/missionControlApi';
import type { MissionStatus, TaskDto } from '../types';
import CreateProjectModal from '../components/CreateProjectModal';
import TaskModal from '../components/TaskModal';
import './KanbanPage.css';

const COLUMNS: MissionStatus[] = ['BACKLOG', 'READY', 'BLOCKED', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

const KanbanPage: React.FC = () => {
  const { data: tasks, isLoading: isTasksLoading } = useGetTasksQuery();
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDto | undefined>(undefined);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<MissionStatus | null>(null);

  if (isTasksLoading || isUsersLoading) {
    return <div className="loading">Loading board...</div>;
  }

  const userMap = users?.reduce<Record<string, string>>((acc, user) => {
    acc[user.id] = user.userName;
    return acc;
  }, {}) || {};

  const handleTaskClick = (task: TaskDto) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCreateTaskClick = () => {
    setSelectedTask(undefined);
    setIsTaskModalOpen(true);
  };
  
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, column: MissionStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== column) {
      setDragOverColumn(column);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: MissionStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('taskId') || draggedTaskId;
    setDraggedTaskId(null);

    if (!taskId) return;

    const task = tasks?.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Special handling for BLOCKED status - if it's a quick move, we might need a reason.
    // For now, let's just use a default reason or prompt if possible, 
    // but the requirement is "quickly change", so I'll use a default and they can edit it later.
    const updatePayload: Partial<TaskDto> = {
      id: taskId,
      status: newStatus,
    };

    if (newStatus === 'BLOCKED' && !task.blockedReason) {
      updatePayload.blockedReason = 'Status updated via drag and drop';
    }

    try {
      await updateTaskStatus({
        id: taskId,
        status: newStatus,
        blockedReason: updatePayload.blockedReason
      }).unwrap();
      toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      console.error('Failed to update task status:', err);
      toast.error('Failed to move task');
    }
  };

  const tasksByStatus = tasks?.reduce<Partial<Record<MissionStatus, TaskDto[]>>>((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status]?.push(task);
    return acc;
  }, {}) || {};

  return (
    <div className="kanban-page">
      <div className="kanban-header">
        <h1>SDLC Kanban Board</h1>
        <div className="header-actions">
          <button className="create-btn" onClick={() => setIsProjectModalOpen(true)}>Create Project</button>
          <button className="create-btn" onClick={handleCreateTaskClick}>Create Task</button>
        </div>
      </div>
      <div className="kanban-board">
        {COLUMNS.map((column) => (
          <div 
            key={column} 
            className={`kanban-column column-${column.toLowerCase()} ${dragOverColumn === column ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, column)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column)}
          >
            <h3 className="column-title">
              {column.replace('_', ' ')}
              <span className="task-count">{(tasksByStatus[column] || []).length}</span>
            </h3>
            <div className="task-list">
              {(tasksByStatus[column] || []).map((task) => (
                <div 
                  key={task.id} 
                  className={`task-card ${draggedTaskId === task.id ? 'is-dragging' : ''}`}
                  onClick={() => handleTaskClick(task)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={() => setDraggedTaskId(null)}
                >
                  <div className="task-header">
                    {task.taskCode && <span className="task-code">{task.taskCode}</span>}
                    <span className="task-name">{task.name}</span>
                  </div>
                  <div className="task-footer">
                    {(task.status === 'IN_REVIEW' || task.status === 'DONE') && (
                      <span className="task-date" title={`Last modified: ${new Date(task.dateModified).toLocaleString()}`}>
                        📅 {new Date(task.dateModified).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    )}
                    {task.assignedUserId && (
                      <span className="task-assignee" title={`Assigned to ${userMap[task.assignedUserId] || 'Unknown'}`}>
                        👤 {userMap[task.assignedUserId] || 'Unknown'}
                      </span>
                    )}
                  </div>
                  {task.status === 'BLOCKED' && task.blockedReason && (
                    <div className="blocked-reason">
                      <strong>Blocked:</strong> {task.blockedReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <CreateProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
      />
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        task={selectedTask}
      />
    </div>
  );
};

export default KanbanPage;
