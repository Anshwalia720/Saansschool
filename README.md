# SaansSchool 🌿

SaansSchool is a school air-quality tracking and action-planning application. It turns regional air-quality forecasts into practical school-day guidance, lets staff email alerts to parent accounts, and gives parents a place to preview delivered alerts and share feedback.

> **Important:** Air-quality values are regional model estimates, not readings from sensors on school grounds or official advisories. Recommendations are general planning guidance and are not medical advice.

## Public demo deployment

The `deploy/no-login` branch supports a read-only public demo. Set `SAANSSCHOOL_PUBLIC_DEMO=true` in the deployment environment before building. Dashboard, Air quality, Tomorrow’s plan, and a generated Parent alert preview are available without signing in. The preview uses live Open-Meteo model data when available, but the demo does not load school records, parent contact details, or alert history.

Email sending, parent feedback, user management, school settings, and login are disabled in this mode. The regular authenticated behavior remains available when the flag is unset or `false`.

This demo mode avoids opening the SQLite database for public demo API requests. The normal authenticated application still uses `node:sqlite` and a local SQLite file; use a host that supports the project’s Node.js 24 runtime and persistent storage before deploying the authenticated application. No Gmail or bootstrap credentials are required for the public demo.

To deploy separately, select the `deploy/no-login` branch as a new project/production branch in your hosting provider and set `SAANSSCHOOL_PUBLIC_DEMO=true` for that deployment. Keep the existing `main` deployment attached to `main`.

## 🎥 SaansSchool Demo Video

[▶ Watch YouTube Demo](https://youtu.be/KgWy0e0rIfY)
<video controls preload="metadata" width="100%">
  <source src="https://raw.githubusercontent.com/abhinavruhela28/Saansschool/main/public/videos/Ultra%20Pro%20Max%20Main.mp4" type="video/mp4">
  Your browser does not support embedded video. <a href="public/videos/Ultra%20Pro%20Max%20Main.mp4">Open the MP4 file</a>.
</video>

[Download/open the MP4](public/videos/Ultra%20Pro%20Max%20Main.mp4) — `public/videos/Ultra Pro Max Main.mp4`

## 📸 Screenshots



![SaansSchool Homepage](public/screenshots/Screenshot%202026-10-11%20155450.png)



![SaansSchool Dashboard](public/screenshots/Screenshot%202026-10-11%20155656.png)

## 🎯 What's the Need for This?

School teams and families need clear, timely information when air quality may affect outdoor activities. Raw pollutant readings can be difficult to interpret, and schools need a practical way to decide whether to adjust assembly, physical training, sports, or break-time activities.

SaansSchool combines a regional forecast with a simple AQI view, suggested actions, school settings, and parent communication in one place. Parents can read alerts sent to their accounts and share concerns or suggestions with school staff.

## ⚙️ How Does It Work?

1. The app requests hourly PM2.5 and PM10 data from the Open-Meteo Air Quality API for the school's selected location.
2. A Next.js API route caches the response in SQLite for 15 minutes. If the upstream request fails, it can return previously cached data.
3. The app calculates an India-style AQI estimate and displays the outlook on the Dashboard, Air Quality, and Tomorrow's Plan pages.
4. Staff can review and send alerts to parent accounts. With Gmail SMTP configured, the app records each delivery result. Tomorrow's Plan emails use a formatted HTML layout with a plain-text fallback.
5. When parent previews are enabled, parents can view alerts delivered to their accounts and submit or update feedback. Staff can read that feedback in alert history.

## ✨ Features

- **Air Quality Dashboard:** Current AQI estimate, pollutant levels, location, and school guidance.
- **Air Quality Monitoring:** PM2.5 and PM10 readings with AQI context and forecast history.
- **Tomorrow's Plan:** Forecast-based recommendations for assembly, physical training, sports, breaks, and students with respiratory sensitivities.
- **Parent Alerts:** Staff can send email alerts, while parents can preview delivered alerts and provide feedback.
- **School Settings:** Manage location, school hours, assembly time, safety preferences, and school accounts.
- **Email Notifications:** Send formatted parent alerts using Gmail SMTP and Nodemailer.
- **Cached Data:** Store air-quality API responses in SQLite to reduce repeated requests.
- **Responsive Interface:** Built with Next.js, React, TypeScript, and CSS.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework and server-side API routes |
| React | User interface components |
| TypeScript | Type-safe application development |
| CSS | Styling and responsive layouts |
| SQLite | Local persistent database |
| Open-Meteo Air Quality API | Regional air-quality forecast data |
| Nodemailer | Email delivery |
| Gmail SMTP | Sending parent email alerts |
| Node.js | JavaScript runtime |

## 📁 Project Structure

| Path | Purpose |
|---|---|
| `app/dashboard/page.tsx` | School overview, AQI metrics, and current guidance |
| `app/air-quality/page.tsx` | Pollutant readings, AQI context, and forecast history |
| `app/tomorrow-plan/page.tsx` | Forecast-based activity recommendations and parent-plan email action |
| `app/parent-alerts/page.tsx` | Staff alert composition/history and parent preview/feedback |
| `app/settings/page.tsx` | School profile, timings, safety preferences, and school accounts |
| `app/api/` | API handlers for air quality, authentication, alerts, feedback, users, and settings |
| `app/lib/aqi.ts` | AQI calculations and daily/hourly helpers |
| `app/lib/server/auth.ts` | Session handling, password verification, and development demo accounts |
| `app/lib/server/db.ts` | SQLite connection, schema, and small schema migrations |
| `app/globals.css` | Application styles and responsive layouts |
| `.env.example` | Example environment variable configuration |
| `public/screenshots/` | Project screenshots used in this README |
| `package.json` | Dependencies and project scripts |

## 🚀 Getting Started

### Prerequisites

- Node.js 24 or newer
- npm
- Git (for cloning the repository)

This project requires Node.js 24 or newer because it uses the built-in `node:sqlite` module.

### 1. Clone the Repository

```bash
git clone git@github.com:abhinavruhela28/Saansschool.git
cd Saansschool
```

Alternatively, download the repository as a ZIP file from GitHub and extract it.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a local environment file from the example.

**PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

**macOS/Linux:**

```bash
cp .env.example .env.local
```

Open `.env.local` and configure the required values for your local environment. Email credentials are needed only if you want to send email alerts.

### 4. Start the Development Server

```bash
npm run dev
```

Open the application in your browser:

http://localhost:3000

## 🖥️ Frontend Setup

1. Install Node.js 24 or newer.
2. Clone or download the project.
3. Open the project root directory, where `package.json` is located.
4. Run `npm install`.
5. Configure `.env.local` if required.
6. Run `npm run dev`.
7. Open `http://localhost:3000`.

## 🔧 Backend Setup

There is no separate backend server to start. The frontend and backend API run together in Next.js.

The API handlers inside `app/api/` are available while `npm run dev` or `npm run start` is running.

By default, the application creates its SQLite database at:

```text
.data/saansschool.sqlite
```

To use another writable location, configure `SAANSSCHOOL_DB_PATH` in `.env.local` before starting the server.

## 🔌 API Routes

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/air-quality?lat=<latitude>&lon=<longitude>` | Fetch and cache Open-Meteo air-quality data |
| `POST` | `/api/auth/login` | Sign in and create a session |
| `GET` | `/api/auth/me` | Return the signed-in account |
| `POST` | `/api/auth/logout` | End the current session |
| `GET`, `POST` | `/api/alerts` | Read alert history or send parent emails |
| `POST` | `/api/alerts/draft` | Generate an alert draft from pollutant readings |
| `POST` | `/api/alerts/feedback` | Submit or update feedback on a delivered alert |
| `GET`, `PATCH` | `/api/school/settings` | Read or save school settings |
| `GET`, `POST` | `/api/users` | List school accounts or manage teacher/parent accounts |

Access to individual operations depends on the user's role and authentication status.

## 📧 Email Configuration

Parent email delivery uses Gmail SMTP through Nodemailer.

Add the following variables to `.env.local` for local development:

```dotenv
GMAIL_USER=your-sender@gmail.com
GMAIL_APP_PASSWORD=your-google-app-password
```

To configure Gmail SMTP:

1. Enable 2-Step Verification on your Google Account.
2. Generate an App Password.
3. Add your Gmail address and App Password to `.env.local`.
4. Add parent accounts with valid email addresses in **School Settings → School Accounts**.
5. Restart the Next.js server after changing environment variables.

**Security:** Do not use your normal Gmail password. Keep `.env.local` private and never commit email passwords, API keys, or other secrets.

## 👤 Development Accounts

In development mode, the application seeds these accounts:

| Role | Email |
|---|---|
| Principal | `principal@saansschool.demo` |
| Teacher | `teacher@saansschool.demo` |
| Parent | `parent@saansschool.demo` |

The development-only password for these seeded accounts is:

`SaansDemo123!`

These demo credentials are not created in production. Configure production bootstrap variables or create accounts through the principal account instead.

## 📜 Available Commands

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start the development server |
| `npm run lint` | Run the configured lint checks |
| `npm run build` | Build the production application |
| `npm run start` | Start the production server |

## 🔐 Production Setup Notes

- Set `SAANSSCHOOL_BOOTSTRAP_NAME`, `SAANSSCHOOL_BOOTSTRAP_EMAIL`, and a unique `SAANSSCHOOL_BOOTSTRAP_PASSWORD` before the first production start to create the principal account.
- Set a persistent `SAANSSCHOOL_DB_PATH` when deploying to a platform where the default filesystem is ephemeral.
- Configure Gmail SMTP and verify parent delivery addresses before sending real alerts.
- Use infrastructure that supports persistent database storage and outbound SMTP connections.
- Never expose `.env.local`, database files, private credentials, or real user information in the public repository.
- Review authentication, access controls, and production configuration before deploying the application.

## 🌍 Credits and Data Sources

- [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) provides regional forecast and historical model data.
- AQI categories are derived by the project from PM2.5 and PM10 concentrations using India-style breakpoints.

## ⚠️ Disclaimer

SaansSchool provides planning guidance based on regional air-quality model estimates. It does not replace official air-quality advisories, on-site measurements, medical advice, or school safety policies.

## 👨‍💻 Project

**SaansSchool — School Air Quality Tracking and Action Planning**

Built with Next.js, React, TypeScript, and SQLite.
