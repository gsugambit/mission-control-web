import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  useCreateUserMutation, 
  useCreateProjectMutation, 
  useDeleteUserMutation,
  useDeleteProjectMutation,
  useGetUsersQuery, 
  useGetProjectsQuery 
} from '../services/missionControlApi';
import './AdminPage.css';

const AdminPage: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [createProject, { isLoading: isCreatingProject }] = useCreateProjectMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [deleteProject] = useDeleteProjectMutation();
  
  const { data: users } = useGetUsersQuery();
  const { data: projects } = useGetProjectsQuery();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    try {
      console.log('Creating user:', userName);
      const result = await createUser({ userName }).unwrap();
      console.log('User created:', result);
      setUserName('');
      toast.success('User created successfully!');
    } catch (err) {
      console.error('Failed to create user:', err);
      const errorMsg = (err as any)?.data?.message || (err as any)?.error || 'Unknown error';
      toast.error(`Failed to create user: ${errorMsg}`);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    try {
      console.log('Creating project:', projectName);
      const result = await createProject({ 
        name: projectName, 
        description: projectDescription 
      }).unwrap();
      console.log('Project created:', result);
      setProjectName('');
      setProjectDescription('');
      toast.success('Project created successfully!');
    } catch (err) {
      console.error('Failed to create project:', err);
      const errorMsg = (err as any)?.data?.message || (err as any)?.error || 'Unknown error';
      toast.error(`Failed to create project: ${errorMsg}`);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id).unwrap();
      toast.success('User deleted successfully!');
    } catch (err) {
      console.error('Failed to delete user:', err);
      const errorMsg = (err as any)?.data?.message || (err as any)?.error || 'Unknown error';
      toast.error(`Failed to delete user: ${errorMsg}`);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id).unwrap();
      toast.success('Project deleted successfully!');
    } catch (err) {
      console.error('Failed to delete project:', err);
      const errorMsg = (err as any)?.data?.message || (err as any)?.error || 'Unknown error';
      toast.error(`Failed to delete project: ${errorMsg}`);
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Control Panel</h1>
      
      <div className="admin-grid">
        <section className="admin-section">
          <h2>Create User</h2>
          <form onSubmit={handleCreateUser} className="admin-form">
            <div className="form-group">
              <label htmlFor="userName">Username</label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <button type="submit" disabled={isCreatingUser}>
              {isCreatingUser ? 'Creating...' : 'Create User'}
            </button>
          </form>

          <div className="list-container">
            <h3>Existing Users</h3>
            <ul className="admin-list">
              {users?.map(user => (
                <li key={user.id} className="admin-list-item">
                  <span>{user.userName}</span>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-btn"
                    title="Delete User"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="admin-section">
          <h2>Create Project</h2>
          <form onSubmit={handleCreateProject} className="admin-form">
            <div className="form-group">
              <label htmlFor="projectName">Project Name</label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="projectDescription">Description</label>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Enter project description"
              />
            </div>
            <button type="submit" disabled={isCreatingProject}>
              {isCreatingProject ? 'Creating...' : 'Create Project'}
            </button>
          </form>

          <div className="list-container">
            <h3>Existing Projects</h3>
            <ul className="admin-list">
              {projects?.map(project => (
                <li key={project.id} className="admin-list-item">
                  <div className="project-info">
                    <strong>{project.name}</strong>
                    <p>{project.description}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="delete-btn"
                    title="Delete Project"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
