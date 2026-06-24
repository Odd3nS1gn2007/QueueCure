# Queue Cure

A live token queue for clinics, featuring a cyberpunk aesthetic. It provides a real-time receptionist control dashboard and a public waiting-room display matrix that stay instantly synchronized when a token is generated or advanced—no browser refreshes required on either screen.

---

## What this is

| | Screen 1 — Gateway | Screen 2 — Reception Control | Screen 3 — Public Monitor View |
|---|---|---|---|
| **Route** | `/` | `/receptionist` | `/waiting-room` |
| **Does** | Selects control matrix terminal views and operational streams. | Injects new profiles, displays pending pipeline vectors, manages room state, and advances token priority elements. | Widescreen television display module featuring absolute live tracking and built-in native text-to-speech audio callouts. |
| **Updates** | Static Grid | Live, via Socket.io | Live, via Socket.io |

All layers are embedded components inside a single-page React app operating independently. Open `/receptionist` on a front-desk terminal and `/waiting-room` full-screen on a lobby monitor TV, and they will independently stay live against your backend array stream.

---

## Tech stack

- **Backend:** Node.js, Express, Socket.io
- **Frontend:** React (Vite), React Router DOM, Tailwind CSS, Socket.io-client, Lucide React (Icons)
- **Database Architecture:** MongoDB with Mongoose object modeling

---

## Project structure

```text
queue-cure/
├── backend/
│   ├── models/                # Database structure definitions (Patient schemas)
│   ├── routes/                # REST API endpoint vectors
│   ├── .env                   # Private backend system environment variables
│   └── server.js              # Entry initialization script for Express/Socket servers
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Gateway.jsx        # Central access hub matrix view
        │   ├── Receptionist.jsx   # Admin panel, registration form, and pipeline queue
        │   └── WaitingRoom.jsx    # Widescreen TV lobby layout display board with native TTS
        ├── App.jsx                # Router injection engine and cyberpunk layout wrappers
        └── index.css              # Global Tailwind overrides and design layout definitions
```
## Quick start

Requires Node.js 16+ and an active MongoDB instance.

**Fastest path** (manual split paths for exact execution control):

```bash
# Terminal 1: Backend Setup
cd backend
npm install
# Create your .env file with valid PORT and MONGO_URI string
npm run dev

# Terminal 2: Frontend Setup
cd frontend
npm install
npm run dev
Then visit `http://localhost:5173/receptionist` and, in a second tab or device, `http://localhost:5173/waiting-room`. Inject a profile into the queue array on the first screen and click **Trigger Next** — the second screen updates and executes audio text-to-speech streams immediately.
```
## Environment variables

| File | Variable | Default | Purpose |
|---|---|---|---|
| `backend/.env` | `PORT` | `5000` | Target API/Socket execution gateway port |
| `backend/.env` | `MONGO_URI` | `mongodb://localhost:27017/queue_cure` | Connection link targeting your database storage engine |

## REST API

| Method | Path | Body | Does |
|---|---|---|---|
| POST | `/api/queue/add` | `{ name, department, phone, duration }` | Injects a profile into the collection array and builds the next unique token tracker |
| POST | `/api/queue/next` | `{ department }` | Increments the active counter element to shift the line forward, pulling the next patient in line |
| POST | `/api/queue/move-next` | `{ department, patientId }` | Intercepts line mechanics to push a designated profile index straight into the primary upcoming tracking slot |
| POST | `/api/queue/reset` | `{ department }` | Completely purges active collection streams for a given clinic space, reverting counters safely back to #0 |

## WebSocket Event Matrix

- **`join_room`** (Client Emit) — Connects a terminal screen context directly to a dedicated isolated clinical department lane (General Medicine, Pediatrics, Cardiology, Dermatology).
- **`queue_updated`** (Server Broadcast) — Pushes full real-time operational payload deltas down to all connected frontend view states on database changes.
- **`call_patient`** (Server Broadcast) — Triggers cross-browser native `window.speechSynthesis` audio routing to execute real-time automated speech announcements for newly called patients.

## License

MIT.

