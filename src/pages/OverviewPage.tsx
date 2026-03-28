import React from 'react';
import { useGetProjectsQuery, useGetTasksQuery } from '../services/missionControlApi';
import StatusCircleChart from '../components/StatusCircleChart';
import type { MissionStatus } from '../types';
import './OverviewPage.css';

const STATUS_COLORS: Record<MissionStatus, string> = {
  BACKLOG: '#6c757d',
  READY: '#17a2b8',
  IN_PROGRESS: '#007bff',
  BLOCKED: '#dc3545',
  IN_REVIEW: '#ffc107',
  DONE: '#28a745',
};

const OverviewPage: React.FC = () => {
  const { data: projects, isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: tasks, isLoading: tasksLoading } = useGetTasksQuery();

  if (projectsLoading || tasksLoading) {
    return <div className="loading">Loading overview...</div>;
  }

  const getStatusCounts = <T extends { status: MissionStatus }>(items: T[] | undefined) => {
    const counts: Record<MissionStatus, number> = {
      BACKLOG: 0,
      READY: 0,
      IN_PROGRESS: 0,
      BLOCKED: 0,
      IN_REVIEW: 0,
      DONE: 0,
    };
    items?.forEach((item) => {
      counts[item.status]++;
    });
    return Object.entries(counts).map(([status, count]) => ({
      label: status.replace('_', ' '),
      count,
      color: STATUS_COLORS[status as MissionStatus],
    })).filter(item => item.count > 0);
  };

  const projectStatusData = getStatusCounts(projects);
  const taskStatusData = getStatusCounts(tasks);

  return (
    <div className="overview-page">
      <h1>Mission Overview</h1>
      <div className="charts-grid">
        <StatusCircleChart title="Projects Status" data={projectStatusData} />
        <StatusCircleChart title="Tasks Status" data={taskStatusData} />
      </div>
    </div>
  );
};

export default OverviewPage;
