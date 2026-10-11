# SaansSchool

SaansSchool is a school air-quality tracking and action-planning app. It turns regional air-quality forecasts into practical school-day guidance, lets staff email alerts to parent accounts, and gives parents a place to preview sent alerts and share feedback.

> Air-quality values are regional model estimates, not readings from sensors on school grounds or official advisories. Recommendations are general planning guidance and are not medical advice.

## Demo video

A project walkthrough video has not been added yet.

## What's the need for this?

School teams and families need clear, timely information when air quality may affect outdoor activities. Raw pollutant readings can be difficult to interpret, and a school needs a practical way to decide whether to adjust assembly, physical training, sports, or break-time activities.

SaansSchool combines a regional forecast with a simple AQI view, suggested actions, school settings, and parent communication in one place. Parents can read alerts sent to their account and share concerns or suggestions with school staff.

## How does this work?

1. The app requests hourly PM2.5 and PM10 data from the Open-Meteo Air Quality API for the school's selected location.
2. The Next.js API route caches the response in SQLite for 15 minutes. If the upstream request fails, it can return a previously cached response.
3. The app calculates an India-style AQI estimate and displays the outlook on the dashboard, Air quality, and Tomorrow's plan pages.
4. Staff can review and send an alert to parent accounts. With Gmail SMTP configured, the app records each delivery result. Tomorrow's Plan emails use a formatted HTML layout with a plain-text fallback.
5. When parent previews are enabled, parents can view alerts delivered to their account and submit or update feedback. Staff can read that feedback in alert history.

## Files description

| Path | Purpose |
| --- | --- |
| `app/dashboard/page.tsx` | School overview, AQI metrics, and current guidance. |
| `app/air-quality/page.tsx` | Pollutant readings, AQI context, and forecast history. |
| `app/tomorrow-plan/page.tsx` | Forecast-based activity recommendations and formatted parent-plan email action. |
| `app/parent-alerts/page.tsx` | Staff alert composition/history and parent preview/feedback experience. |
| `app/settings/page.tsx` | School profile, timings, safety preferences, and school accounts. |
| `app/api/` | Next.js Route Handlers for air-quality data, authentication, alerts, feedback, users, and school settings. |
| `app/lib/aqi.ts` | AQI calculations and daily/hourly helpers. |
| `app/lib/server/auth.ts` | Session handling, password verification, and development demo accounts. |
| `app/lib/server/db.ts` | SQLite connection, schema, and small schema migrations. |
| `app/globals.css` | Application styles and responsive layouts. |
| `.env.example` | Names and examples of supported environment variables. Copy it to `.env.local` for local configuration. |

## Frontend UI

The interface is built with the Next.js App Router, React, TypeScript, and CSS. It includes:

- **Overview:** current AQI estimate, pollutant levels, location, and school guidance.
- **Air quality:** PM2.5/PM10 readings and AQI bands.
- **Tomorrow's plan:** recommendations for assembly, physical training, sports, breaks, and students with respiratory sensitivities.
- **Parent alerts:** staff can send alerts; parents can preview delivered alerts and give feedback when the school enables the feature.
- **School settings:** location, school hours, assembly time, safety preferences, and teacher/parent accounts.

## Commands to run on your local system

This project requires **Node.js 24 or newer** because it uses the built-in `node:sqlite` module.

Install dependencies:

```bash
npm install
```

Create a local environment file and edit it with your own values:

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS/Linux:

```bash
cp .env.example .env.local
```

Start the app in development mode:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other available commands:

```bash
npm run lint
npm run build
npm run start
```

## Steps to start frontend

1. Install Node.js 24+ and clone or download this project.
2. Open a terminal in the project root (the directory containing `package.json`).
3. Run `npm install`.
4. Copy `.env.example` to `.env.local` and configure email credentials if you want to send email.
5. Run `npm run dev` and visit `http://localhost:3000`.

## Steps to start backend

There is no separate backend server to start. The UI and backend API run together in Next.js. The handlers in `app/api/` are available while `npm run dev` or `npm run start` is running.

The app creates its SQLite database at `.data/saansschool.sqlite` by default. To use another writable location, set `SAANSSCHOOL_DB_PATH` in `.env.local` before starting the server.

### API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/air-quality?lat=<latitude>&lon=<longitude>` | Fetch/cache Open-Meteo air-quality data. |
| `POST` | `/api/auth/login` | Sign in and create a session. |
| `GET` | `/api/auth/me` | Return the signed-in account. |
| `POST` | `/api/auth/logout` | End the current session. |
| `GET`, `POST` | `/api/alerts` | Read alert history or send a parent email (staff only). Parents receive only alerts delivered to their account. |
| `POST` | `/api/alerts/draft` | Generate an alert draft from current pollutant readings. |
| `POST` | `/api/alerts/feedback` | Submit or update feedback on a delivered alert (parent only). |
| `GET`, `PATCH` | `/api/school/settings` | Read or save school settings. Only a principal can save settings. |
| `GET`, `POST` | `/api/users` | List school accounts or add a teacher/parent (principal only for account changes). |

## Email configuration

Parent email delivery uses Gmail SMTP through Nodemailer. For local development, set these values in `.env.local`:

```dotenv
GMAIL_USER=your-sender@gmail.com
GMAIL_APP_PASSWORD=your-google-app-password
```

Use a Google App Password with 2-Step Verification enabled; do not use your normal Gmail password. Restart the Next.js server after changing environment variables. Add parent accounts with real email addresses in **School settings → School accounts** before sending an alert.

Keep `.env.local` private. It is ignored by Git; never commit email passwords, API keys, or other secrets.

## Development accounts

In development mode, the app seeds these accounts:

| Role | Email |
| --- | --- |
| Principal | `principal@saansschool.demo` |
| Teacher | `teacher@saansschool.demo` |
| Parent | `parent@saansschool.demo` |

The development-only password for these seeded accounts is `SaansDemo123!`. These demo credentials are not created in production. Create production accounts using the `SAANSSCHOOL_BOOTSTRAP_*` variables in `.env.local` or add users through the principal account.

## Production setup notes

- Set `SAANSSCHOOL_BOOTSTRAP_NAME`, `SAANSSCHOOL_BOOTSTRAP_EMAIL`, and a unique `SAANSSCHOOL_BOOTSTRAP_PASSWORD` before the first production start to create the principal account.
- Set a persistent `SAANSSCHOOL_DB_PATH` when deploying to a platform where the default project filesystem is ephemeral.
- Configure Gmail SMTP and verify parent delivery addresses before sending real alerts.
- Keep the app and its SQLite database on infrastructure that supports persistent storage and outbound SMTP connections.

## Credits and data sources

- [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) provides regional forecast and historical model data.
- AQI categories are derived by the project from PM2.5 and PM10 concentrations using India-style breakpoints.

