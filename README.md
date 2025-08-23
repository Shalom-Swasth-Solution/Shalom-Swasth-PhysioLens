# PhysioLens

PhysioLens is a full-stack application for AI-powered posture analysis, community learning, and health improvement. The project is organized into backend and frontend folders, with additional documentation and test support.

---

## Project Structure
├── backend/ │ ├── database.py │ ├── posture_analyzer.py │ ├── schemas.py │ ├── server.py │ ├── .env │ └── requirements.txt ├── frontend/ │ ├── public/ │ ├── src/ │ ├── package.json │ ├── tailwind.config.js │ ├── craco.config.js │ └── README.md ├── tests/ │ └── init.py ├── contracts.md ├── test_result.md ├── README.md └── .gitignore

---

## Folders Overview

### [backend/](backend/)
- **Purpose:** Contains the Python backend for API, database, and posture analysis logic.
- **Key Files:**
  - [`server.py`](backend/server.py): Main FastAPI server.
  - [`database.py`](backend/database.py): Database models and connection.
  - [`posture_analyzer.py`](backend/posture_analyzer.py): Core AI/ML posture analysis logic.
  - [`schemas.py`](backend/schemas.py): Pydantic schemas for API validation.
  - `.env`: Environment variables for backend configuration.
  - `requirements.txt`: Python dependencies.

### [frontend/](frontend/)
- **Purpose:** React-based frontend for user interaction, analysis visualization, and community features.
- **Key Files & Folders:**
  - [`src/`](frontend/src/): Source code for React components, pages, and styles.
  - [`public/`](frontend/public/): Static assets and HTML template.
  - [`package.json`](frontend/package.json): Frontend dependencies and scripts.
  - [`tailwind.config.js`](frontend/tailwind.config.js): Tailwind CSS configuration.
  - [`craco.config.js`](frontend/craco.config.js): Custom React app configuration.
  - [`README.md`](frontend/README.md): Frontend-specific instructions.

### [tests/](tests/)
- **Purpose:** Python test initialization and (optionally) test scripts for backend.

### [contracts.md](contracts.md)
- **Purpose:** API contracts, data models, and integration plans for frontend-backend communication.

### [test_result.md](test_result.md)
- **Purpose:** Protocol and logs for automated/manual testing, agent communication, and QA tracking.

---

## Getting Started

### Backend

1. **Install dependencies:**
   ```sh
   pip install -r backend/requirements.txt

2. Set up environment variables:
Copy or edit backend/.env as needed.

3. Run the server:
python backend/server.py

Frontend
1. Install dependencies:
cd frontend
npm install

2. Start the development server:
npm start

The app will be available at http://localhost:3000.

