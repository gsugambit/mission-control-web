import React, { useState } from 'react';
import { useGetTasksQuery, useGetUsersQuery } from '../services/missionControlApi';
import type { MissionStatus, TaskDto } from '../types';
import CreateProjectModal from '../components/CreateProjectModal';
import TaskModal from '../components/TaskModal';
import './KanbanPage.css';

const COLUMNS: MissionStatus[] = ['BACKLOG', 'READY', 'BLOCKED', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

const KanbanPage: React.FC = () => {
  const { data: tasks, isLoading: isTasksLoading } = useGetTasksQuery();
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDto | undefined>(undefined);

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
          <div key={column} className={`kanban-column column-${column.toLowerCase()}`}>
            <h3 className="column-title">
              {column.replace('_', ' ')}
              <span className="task-count">{(tasksByStatus[column] || []).length}</span>
            </h3>
            <div className="task-list">
              {(tasksByStatus[column] || []).map((task) => (
                <div key={task.id} className="task-card" onClick={() => handleTaskClick(task)}>
                  <div className="task-header">
                    <span className="task-name">{task.name}</span>
                  </div>
                  <div className="task-footer">
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
