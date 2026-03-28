import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ProjectDto, TaskDto, UserDto } from '../types';
import { getEnv } from '../env';

const rawBaseQuery = fetchBaseQuery({ 
  baseUrl: getEnv('VITE_API_URL') || '/api/mission-control/v1/' 
});

export const missionControlApi = createApi({
  reducerPath: 'missionControlApi',
  baseQuery: async (args, api, extraOptions) => {
    // Note: RTK Query caches results. If you don't see a network request, 
    // it's likely because the data is already in the Redux store.
    console.log('RTK Query Request Start:', args);
    try {
      const result = await rawBaseQuery(args, api, extraOptions);
      console.log('RTK Query Result:', result);
      if (result.error) {
        console.error('RTK Query Error:', result.error);
      }
      return result;
    } catch (err) {
      console.error('RTK Query Unexpected Error:', err);
      throw err;
    }
  },
  tagTypes: ['Project', 'Task', 'User'],
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectDto[], void>({
      query: () => 'projects',
      providesTags: ['Project'],
    }),
    getTasks: builder.query<TaskDto[], void>({
      query: () => 'tasks',
      providesTags: ['Task'],
    }),
    getUsers: builder.query<UserDto[], void>({
      query: () => 'users',
      providesTags: ['User'],
    }),
    createUser: builder.mutation<UserDto, Partial<UserDto>>({
      query: (user) => ({
        url: 'users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    createProject: builder.mutation<ProjectDto, Partial<ProjectDto>>({
      query: (project) => ({
        url: 'projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: ['Project'],
    }),
    createTask: builder.mutation<TaskDto, Partial<TaskDto>>({
      query: (task) => ({
        url: 'tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<TaskDto, Partial<TaskDto>>({
      query: (task) => ({
        url: `tasks/${task.id}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const { 
  useGetProjectsQuery, 
  useGetTasksQuery, 
  useGetUsersQuery,
  useCreateUserMutation,
  useCreateProjectMutation,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteUserMutation,
  useDeleteProjectMutation
} = missionControlApi;
