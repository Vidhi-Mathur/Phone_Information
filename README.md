## Installation


1. Clone the repository:
   ```bash
   git clone https://github.com/Vidhi-Mathur/Phone_Information.git
    ```
2. Navigate to project repository:
    ```bash
   cd MedWander
    ```
### Backend Setup

1. Navigate to the backend directory: 
    ```bash
   cd backend
    ```
2. Install backend dependencies:
    ```bash
   npm install
    ```
3.  Set up the backend environment variables by creating a .env file in the root directory:
    ```bash
    DB_NAME=<your-database-name>
    DB_USER=<your-database-user>
    DB_PASSWORD=<your-database-password>
    DB_HOST=<your-database-host>
    ```
4. Start the backend server
    ```bash
   nodemon app.js
    ```
### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
   cd frontend
    ```
2. Install frontend dependencies: 
   ```bash
   npm install
    ```
3. Start the frontend server
    ```bash
   npm start
    ```

## Usage

Once the server and frontend are running:

- Visit http://localhost:5173 to view the application.
- Make sure server runs on http://localhost:3000 at the same time.
