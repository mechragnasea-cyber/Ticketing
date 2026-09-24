# Ticketing Vue App (mock)

Quick scaffold for a ticketing system using Vue 3, Vite, Pinia, Vue Router, TailwindCSS, and Chart.js. Backend is a simple localStorage mock in `src/mock/backend.js`.

Setup (Windows):

```bash
cd "d:/Ticketing"
npm install
npm run dev
```

Notes:
- Windows Authentication is simulated as a stub; integrate AD/SSO for real auto-login.
- Invoices and tickets are stored in browser `localStorage` for demo purposes.
- Routes:
  - `/` Dashboard (requires auth)
  - `/submit-ticket` Public ticket submission
  - `/upload-invoice` Upload invoice (validates invoice number)
  - `/login` Login/Register
  - `/maintenance` Maintenance page

  Also added two separate apps in the workspace:

  - `customer-portal/` — public site with invoice validation, multi-step ticket creation, and ticket check. See [customer-portal/README.md](customer-portal/README.md).
  - `admin-portal/` — internal admin/support site with dashboards, ticket management, invoice management, and login stub. See [admin-portal/README.md](admin-portal/README.md).

  Run each app by `cd` into its folder and running `npm install` then `npm run dev`.
