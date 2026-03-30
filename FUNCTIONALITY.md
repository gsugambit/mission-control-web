# Mission Control Web - Functionality Overview

Mission Control Web is a project management application designed for tracking tasks and projects using a Kanban-based workflow.

## Navigation
The application features a sidebar for quick navigation between different sections:
- **Overview (🏠)**: Dashboard with mission stats.
- **Kanban Board (📋)**: The primary task management interface.
- **Admin (⚙️)**: Control panel for administrative tasks.

## 1. Mission Overview
The Overview page serves as a dashboard providing a visual summary of the system's state:
- **Status Circle Charts**: Visual representation of the distribution of Projects and Tasks across different statuses.
- **Real-time Data**: Displays current counts for each status category (Backlog, Ready, In Progress, Blocked, In Review, Done).

## 2. Kanban Board
The Kanban board is the central hub for managing tasks and quickly adding projects.

### Task Management
- **Status Columns**: Tasks are organized into columns based on their current status:
  - **Backlog**: Initial stage for new tasks.
  - **Ready**: Tasks ready to be started.
  - **Blocked**: Tasks that are currently halted (requires a "Blocked Reason").
  - **In Progress**: Tasks currently being worked on.
  - **In Review**: Tasks waiting for approval or review.
  - **Done**: Completed tasks.
- **Task Interaction**:
  - **Create Task**: Add new tasks directly from the board.
  - **Edit Task**: Click on any task card to update its details (name, description, acceptance criteria, status, and assignee). The system-generated **Task Code** is visible but cannot be modified, and the **Project** cannot be changed after task creation.
  - **Assignment**: Tasks can be assigned to specific users.
  - **Task Code**: Each task displays its system-generated **Task Code** on the Kanban card for easy identification.
  - **Drag and Drop**: Tasks can be dragged and dropped between columns to quickly update their status.
  - **Status Updates**: Tasks display the last modified date and time when in "In Review" or "Done" columns.
  - **Blocking**: When a task is moved to "Blocked", a reason must be provided, which is then displayed on the task card. (Note: A default reason is provided during quick drag-and-drop moves to ensure a smooth workflow).
  - **Comments**: View and add comments to a task from the edit modal to facilitate communication and updates.

### Project Creation
- **Quick Create**: Projects can be created directly from the Kanban board header via a modal.

## 3. Admin Control Panel
The Admin page provides tools for managing the foundational elements of the application.

### User Management
- **Create User**: Add new users to the system by providing a username.
- **Delete User**: Remove existing users from the system.
- **User List**: View all currently registered users.

### Project Management
- **Create Project**: Add new projects with a name, unique prefix, detailed description, and status.
- **Delete Project**: Remove existing projects.
- **Project List**: View all current projects and their descriptions, prefixes, and statuses.

## Notifications
The application uses toast notifications to provide immediate feedback on user actions, such as successful creation, updates, or deletions, as well as error messages if an operation fails.
