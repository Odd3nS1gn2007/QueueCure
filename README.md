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
