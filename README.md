# AssetFlow ERP

AssetFlow ERP is a full-stack web application for managing company assets in one place. It helps an organisation track which assets it owns, which department they belong to, and which user they are allocated to.

The project is built with a React frontend, a FastAPI backend, and a PostgreSQL database, with JWT-based login to protect the application.

## Features

- Secure login with JWT authentication
- Manage departments, users, and assets
- Allocate an asset to a user and track its current allocation
- Seed data to set up departments, users, and assets quickly for demo and testing
- Separate frontend and backend, so each part can be developed and run independently

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | React |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Authentication | JWT |
| API style | REST |

## How it works

1. The user logs in from the React frontend.
2. The FastAPI backend verifies the credentials and returns a JWT token.
3. The frontend sends that token with its API requests.
4. FastAPI validates the token, processes the request, and reads or writes data in PostgreSQL.
5. When an asset is allocated, its record is linked to a user, so the current holder can be seen at any time.

## Project structure

```text
assetflow-erp/
├── frontend/        # React application
├── backend/         # FastAPI application
└── README.md        # This file — copy this document to the repo root as README.md
```

## Getting started

### Prerequisites

- Node.js and npm
- Python 3
- PostgreSQL running locally, with an empty database created for this project

### 1. Clone the repository

```bash
git clone https://github.com/prathamvalecha19/assetflow-erp.git
cd assetflow-erp
```

### 2. Run the backend

```bash
cd backend
python -m venv venv
```

On Windows:

```bash
venv\Scripts\activate
```

On macOS or Linux:

```bash
source venv/bin/activate
```

Then install the dependencies and start the server:

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend API runs at `http://127.0.0.1:8000`. Open `http://127.0.0.1:8000/docs` for the interactive FastAPI documentation.

> If your backend entry file is not `main.py`, replace `main:app` with your file and app name.

### 3. Run the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

If the project was created with Create React App instead of Vite, use `npm start` instead of `npm run dev`.

### 4. Load the seed data

With the backend environment active and the database configured, run the seed script from the `backend` folder:

```bash
python seed.py
```

This loads the sample departments, users, and assets so you can log in and explore the application without entering data manually.

> If your seed file has a different name, run that file instead of `seed.py`.

## Environment variables

Create a `.env` file in the `backend` folder. Do not commit this file.

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database-name>
SECRET_KEY=<your-secret-key>
```

Use your own PostgreSQL username, password, and database name, and choose a strong secret key for signing JWT tokens.

## Main resources

| Resource | What it covers |
| --- | --- |
| Auth | Login and JWT token handling |
| Departments | Department records used to organise users and assets |
| Users | User accounts that assets can be allocated to |
| Assets | Asset records and their current status |
| Allocations | Linking an asset to a user and tracking that allocation |

For the exact routes and request formats, use the FastAPI docs at `/docs` while the backend is running.

## Cleanup

These files are generated locally or are temporary build logs. They should not be in the repository:

- `backend/__pycache__`
- `frontend/build_err.txt`
- `frontend/build_err2.txt`

Delete them:

```bash
# From the root of the repository
rm -rf backend/__pycache__
rm -f frontend/build_err.txt frontend/build_err2.txt
```

On Windows Command Prompt, use:

```bat
rmdir /s /q backend\__pycache__
del frontend\build_err.txt frontend\build_err2.txt
```

If they were already committed, remove them from Git tracking as well:

```bash
git rm -r --cached backend/__pycache__
git rm --cached frontend/build_err.txt frontend/build_err2.txt
```

Add them to `.gitignore` at the root of the repository so they do not come back:

```gitignore
# Python
__pycache__/
*.pyc

# Build logs
frontend/build_err.txt
frontend/build_err2.txt

# Local environment
.env
```

Then commit the cleanup:

```bash
git add .gitignore
git commit -m "Add README and remove generated files"
```

## Author

Built by Pratham Valecha — AI and ML Developer.

Works with React, FastAPI, PostgreSQL, computer vision, and MLOps.
