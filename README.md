# Job Tracker - React Frontend

## Setup

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

3. Make sure your Spring Boot backend is running on `http://localhost:8080`

## Pages & Routes

### Auth
- `/login` → Login page
- `/register` → Register page

### User (role: USER)
- `/dashboard` → Stats overview + recent jobs
- `/jobs` → Kanban board (Add / Edit / Delete jobs)
- `/analytics` → Charts and statistics
- `/notifications` → Notifications list
- `/profile` → View/edit profile + change password

### Admin (role: ADMIN)
- `/admin` → Admin dashboard
- `/admin/users` → Manage users (activate/deactivate)
- `/admin/site-header` → Manage site header (logo, name)
- `/admin/site-footer` → Manage site footer
- `/admin/navigation` → Manage navigation links
- `/admin/footer-navigation` → Manage footer links

### HR (role: HR)
- `/hr` → HR dashboard (view admins)
- `/hr/register-admin` → Register new admin account

## Notes
- HR users must be created manually: register as USER then run in MySQL:
  `UPDATE users SET role='HR' WHERE username='your_hr_username';`
- Logo is loaded from Google Drive URL stored in `site_header` table
- Token stored in localStorage, auto-attached to all API requests
