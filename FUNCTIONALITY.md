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
  - **Edit Task**: Click on any task card to update its details (name, description, acceptance criteria, status, and assignee).
  - **Assignment**: Tasks can be assigned to specific users.
  - **Blocking**: When a task is moved to "Blocked", a reason must be provided, which is then displayed on the task card.

### Project Creation
- **Quick Create**: Projects can be created directly from the Kanban board header via a modal.

## 3. Admin Control Panel
The Admin page provides tools for managing the foundational elements of the application.

### User Management
- **Create User**: Add new users to the system by providing a username.
- **Delete User**: Remove existing users from the system.
- **User List**: View all currently registered users.

### Project Management
- **Create Project**: Add new projects with a name and detailed description.
- **Delete Project**: Remove existing projects.
- **Project List**: View all current projects and their descriptions.

## Notifications
The application uses toast notifications to provide immediate feedback on user actions, such as successful creation, updates, or deletions, as well as error messages if an operation fails.
