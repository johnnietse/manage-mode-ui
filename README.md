# TaskMaster 🧠📅

Welcome to my second Lovable project! **TaskMaster** is a modern, visually stunning, and intuitive task management web app inspired by popular productivity tools like Todoist and ClickUp — built with a clean, responsive UI and powerful task organization features. Built with **React**, **Tailwind CSS**, and **Supabase**.

## 🌟 Features

### 🔐 Authentication
- Email/password sign-up & login (via Supabase)
- Persistent sessions
- Optional: OAuth (Google/GitHub support coming soon)

### 📝 Task Management Core
- Add, update, delete tasks
- **Delete with confirmation** - Remove tasks with a confirmation dialog to prevent accidental deletions
- Task fields:
  - Title
  - Description (Markdown supported)
  - Due date
  - Priority: `Low` | `Medium` | `High`
  - Status: `To Do` | `In Progress` | `Done`
  - Reminder Date
  - Recurrence: `None` | `Daily` | `Weekly` | `Monthly` | `Yearly`
  - Tags (coming soon)
- Visual priority indicators
- Recurring task support with regeneration
- **Safe task deletion** with confirmation dialog showing task title

### 📅 Views & Filters
- **List View** and **Calendar View**
- Filter tasks by:
  - Category
  - Priority
  - Status
  - Due date (Today, This Week)
- Sort tasks by:
  - Due date
  - Priority
  - Creation time

### 📁 Categories & Sidebar
- Sidebar with categories:
  - Customizable categories
  - "All Tasks" view
  - Responsive UI for mobile and desktop
- Click category to filter tasks
- Create/edit/delete categories

### 🗑️ Task Deletion & Safety
- **Confirmation dialogs** for task deletion to prevent accidental removal
- Shows task title in confirmation for clarity
- Red-colored delete button with trash icon for clear visual indication
- Hover effects for better user experience
- Toast notifications for successful deletions

### 👥 Team Collaboration (Planned)
- Invite members via email
- Assign tasks to teammates
- Workspace/task board for each team

### 🛎️ Reminders & Notifications
- Reminder toast notifications
- Optional: Email notifications (planned)

### 🧭 Dashboard & Analytics
- Task statistics (charts for progress, categories, priority breakdown)
- Productivity trends (tasks completed per week/month)

### 🌗 UI/UX Design
- Responsive layout: mobile-first
- Sidebar navigation + main content area
- Smooth transitions (Framer Motion)
- Keyboard shortcuts: `n` = new task, `/` = search
- **Dark Mode / Light Mode toggle**
- Clean design system:
  - Indigo primary color
  - Accent colors by priority (red/yellow/green)
  - Rounded corners, soft shadows
  - Inter font (sans-serif)

### ⏱️ Productivity Enhancements
- **Pomodoro Timer** (planned)
- Task Templates (coming soon)
- Task Sharing
- Time Tracking
- Task Dependencies
- CSV/PDF Export/Import

---

## 🛠️ Tech Stack

| Tech        | Description                                 |
|-------------|---------------------------------------------|
| React       | UI framework                                |
| Tailwind CSS| Utility-first styling                       |
| Supabase    | Auth & realtime Postgres DB                 |
| Framer Motion| Animations                                 |
| TypeScript  | Type safety                                 |
| Lucide Icons| Icon set for modern UI                      |

---

## 🧪 Database Schema (via Supabase)

```sql
-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'To Do',
  category TEXT,
  reminder_date TIMESTAMPTZ,
  recurrence TEXT DEFAULT 'none',
  completed BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Triggers for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

```
---

## ✅ Security with Row-Level Policies
Tasks, Categories, and Profiles are protected with fine-grained RLS. Users can only access, modify, and delete their own data

## 🚀 Getting Started
Prerequisites
- Node.js ≥ 18
- Supabase project set up
- .env file with your Supabase keys

## Installation
```bash
git clone https://github.com/johnnietse/manage-mode-ui.git
cd manage-mode-ui
npm install
npm run dev
```

## Connect Supabase
1. Go to supabase.com
2. Create a project and copy the URL and anon/public key
3. Add to .env:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

## 📌 Roadmap
<pre>
☑︎ Basic Task CRUD
☑︎ Task Deletion with Confirmation
☑︎ Category Filtering
☑︎ Calendar View
☑︎ Supabase Auth Integration
☑︎ Reminder & Recurrence
☑︎ Dark Mode
☑︎ Task Statistics
☐ Team Collaboration
☐ Pomodoro Timer
☐ Task Sharing
☐ Task Templates
☐ Mobile App (React Native or PWA)
</pre>

## 📸 Screenshots
![Screenshot (2149)](https://github.com/user-attachments/assets/6d971807-73d8-4d76-95de-9f7ff39e6fb4)
![Screenshot (2150)](https://github.com/user-attachments/assets/22b65e98-bd2a-4aee-b537-99c38f2eacd7)
![Screenshot (2152)](https://github.com/user-attachments/assets/3f6185b8-a301-4494-bbb1-2562b58d748e)
![Screenshot (2153)](https://github.com/user-attachments/assets/ccc04ebd-e9aa-4bd2-93f4-f4a0ea6028d3)
![Screenshot (2154)](https://github.com/user-attachments/assets/11c009a9-81d7-48b6-8673-b684d8a9ec45)
![Screenshot (2155)](https://github.com/user-attachments/assets/9e316e70-3aeb-49b7-9901-ef2258d76142)
![Screenshot (2159)](https://github.com/user-attachments/assets/f2d7e261-0810-458f-9035-5c72825ca34e)


## 💡 Inspiration
This project is inspired by the UX of Todoist, ClickUp, and Notion, with a goal to create a more focused and elegant personal productivity app.

## 🤝 Contributing
Pull requests are welcome! Please open an issue first to discuss any changes.

## 📬 Contact
For questions or feedback:
Email: johnnietse994@gmail.com

---

Let me know if you'd like a version auto-populated with your GitHub info or if you want to export this for use in a README file directly.

---

## Project info

**URL**: https://lovable.dev/projects/260a9c23-d9e1-404e-aa50-ee9fc177a7db

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/260a9c23-d9e1-404e-aa50-ee9fc177a7db) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/johnnietse/manage-mode-ui.git

# Step 2: Navigate to the project directory.
cd manage-mode-ui

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/260a9c23-d9e1-404e-aa50-ee9fc177a7db) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

## Recently Added Features (May 24th, 2025)

1. Remove Task Feature
- **Delete Button**: Added a trash icon button to each task card that's styled in red to indicate it's a destructive action
- **Confirmation Dialog**: Implemented an AlertDialog that asks users to confirm before deleting a task to prevent accidental deletions
- **Clear Messaging**: The confirmation dialog shows the specific task title and warns that the action cannot be undone
- **Visual Feedback**: The delete button has hover effects and the confirmation button is styled with a red background to emphasize the destructive nature

The delete functionality uses the existing deleteTask function from the `TaskContext`, so it will properly remove tasks from both the database and local state, and show appropriate toast notifications.

2. User Isolation Features:
- **Tasks are User-Specific**: Each task is linked to a `user_id`, so users only see their own tasks
- **Categories are User-Specific**: Categories are also linked to `user_id`, so each user has their own set of categories
- **Row Level Security (RLS)**: The webapp database has RLS policies that ensure users can only access their own data

3. **GSAP animations** including 3D tilt effects on task cards, smooth hover animations, bouncy button interactions, and elegant entrance animations for all components.


--
## For testing the webapp in case if the sign-up verification functionality is not working:
Please use the following login information:
- Email: johnnietse994@gmail.com
- Password: 1234567890

