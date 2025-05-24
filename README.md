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
git clone https://github.com/your-username/taskmaster.git
cd taskmaster
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

## 📸 Screenshots
Add screenshots/gifs of your app UI here

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
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

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
