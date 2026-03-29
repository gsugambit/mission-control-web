import React, { useState } from 'react';
import Modal from './Modal';
import { useCreateProjectMutation } from '../services/missionControlApi';
import type { MissionStatus } from '../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [prefix, setPrefix] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<MissionStatus>('BACKLOG');
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject({ name, prefix, description, status }).unwrap();
      onClose();
      setName('');
      setPrefix('');
      setDescription('');
      setStatus('BACKLOG');
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Project Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="prefix">Project Prefix</label>
          <input
            id="prefix"
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            required
            placeholder="e.g. PRJ"
          />
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
        <div className="form-actions">
          <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
