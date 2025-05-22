# Todo-Summary-Assistant
A comprehensive Todo Summary Assistant built with React &amp; Node.js (Express) backend. Utilizes Supabase for database, Google Gemini for AI summarization, and Slack for notifications. Features task management with priorities &amp; one-click startup.


This is a full-stack web application designed to help users manage their to-do lists and automatically summarize pending tasks, sending the summary to a Slack channel. The application is built with a React frontend, a Node.js Express backend, and uses Supabase for database management and Google Gemini for AI-powered summarization.

## Features

* **Todo Management:** Add, edit, delete, and mark todos as complete.
* **Priority Levels:** Assign High, Medium, or Low priority to tasks.
* **AI Summarization:** Automatically summarize all pending todos using the Google Gemini API.
* **Slack Integration:** Send the generated summary to a designated Slack channel.
* **Intuitive UI:** A clean and responsive user interface for managing tasks.
* **One-Click Startup:** A convenience script to start both frontend and backend servers.

## Tech Stack

**Frontend:**
* React.js
* HTML/CSS

**Backend:**
* Node.js
* Express.js
* Supabase (PostgreSQL database, Authentication, Realtime)
* Google Gemini API (for LLM summarization)
* Node-Fetch (for Slack Webhook calls)

## Setup Instructions

To run this project locally, follow these steps:

### Prerequisites

* Node.js (LTS version recommended) and npm installed.
* A Supabase account and project.
* A Google Cloud Project with the Gemini API enabled.
* A Slack Workspace with an Incoming Webhook URL configured.





### 2\. Backend Setup

Navigate to the backend directory: `   cd backend   `


Install dependencies: `   npm install   `


Create a .env file in the backend directory and add your environment variables:_(Refer to .env.example for required variables)_

`   SUPABASE_URL=your_supabase_project_url  `

`   SUPABASE_ANON_KEY=your_supabase_anon_key  `

`   GOOGLE_API_KEY=your_google_gemini_api_key  `

`   SLACK_WEBHOOK_URL=your_slack_incoming_webhook_url   `




### 3\. Frontend Setup

Navigate to the frontend directory: `   cd ../frontend   `


Install dependencies: `   npm install   `


Create a .env file in the frontend directory and add your environment variables:_(Refer to .env.example for required variables)_

`   REACT_APP_BACKEND_URL=http://localhost:5000   `



### 4\. Database Setup (Supabase)

1.  Log in to your Supabase project dashboard.
    
2.  Go to **"Table Editor"** (the spreadsheet icon on the left sidebar).
    
3.  Click **"+ New Table"** (or use the SQL editor).
    
4.  Create a table named todos with the following columns:
    
    *   id: uuid (Primary Key, Default Value: gen\_random\_uuid())
        
    *   created\_at: timestampz (Default Value: now(), Is unique: No, Is primary key: No)
        
    *   title: text (Nullable: No)
        
    *   is\_completed: boolean (Default Value: false, Nullable: No)
        
    *   priority: text (Optional: Default Value: 'Medium', Nullable: Yes)
        
5.  Save the table.

    

### 5\. Running the Application (One-Click or Manual)

#### Option A: One-Click Startup (Recommended for Windows)

From the root of the project directory (todo-summary-assistant/), simply double-click the start\_app.bat file.This script will open two separate terminal windows, one for the backend and one for the frontend, and start both servers automatically.

#### Option B: Manual Startup

**Start Backend:**Open a terminal in the backend directory and run: `   node index.js   `

**Start Frontend:**Open a separate terminal in the frontend directory and run: `   npm start   `

Once both servers are running, open your browser to http://localhost:3000.



Slack and LLM (Gemini) Setup Guidance
-------------------------------------

### Google Gemini API

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
    
2.  Create a new project or select an existing one.
    
3.  Search for "Gemini API" or "Generative Language API" in the search bar.
    
4.  Enable the API.
    
5.  Go to "Credentials" -> "Create Credentials" -> "API Key".
    
6.  Copy the generated API key and set it as GOOGLE\_API\_KEY in your backend/.env file.
    
7.  (Optional but recommended) Restrict the API key to only allow calls from your backend server's IP address or a specific HTTP referrer if deployed.
    

### Slack Incoming Webhook

1.  Go to the [Slack App Directory](https://slack.com/apps).
    
2.  Search for "Incoming WebHooks" and select it.
    
3.  Click "Add to Slack" or "Add to \[Your Workspace Name\]".
    
4.  Choose the channel where you want the summaries to be posted.
    
5.  Click "Add Incoming WebHooks integration".
    
6.  Copy the generated **Webhook URL** and set it as SLACK\_WEBHOOK\_URL in your backend/.env file.
    

Design/Architecture Decisions
-----------------------------

*   **Monorepo-like Structure:** The project uses a simple monorepo-like structure (backend and frontend in separate folders within one main repository) for easy management and deployment of related services.
    
*   **Clear Separation of Concerns:**
    
    *   **Frontend (React):** Handles all user interaction, state management for the UI, and makes API calls to the backend. It's a Single Page Application (SPA).
        
    *   **Backend (Node.js/Express):** Acts as an API layer, handling business logic, database interactions (Supabase), and external API calls (Gemini, Slack). This keeps sensitive API keys secure on the server side.
        
*   **RESTful API Design:** The backend exposes clear RESTful endpoints for CRUD operations on todos (/todos) and a dedicated endpoint for summarization (/summarize).
    
*   **Supabase for Database & BaaS:** Chosen for its ease of setup, real-time capabilities (though not fully utilized in this demo), and PostgreSQL compatibility, allowing quick iteration on database schema. It simplifies common backend tasks like authentication and database management.
    
*   **Google Gemini for LLM:** Utilized for its powerful text summarization capabilities, providing concise and actionable insights from the user's pending tasks. The model is called via a secure backend endpoint to protect the API key.
    
*   **Slack Webhooks:** A straightforward method for integrating notifications into a team's communication channel, demonstrating external service integration.
    
*   **Environment Variables (.env):** Strict use of environment variables to manage sensitive API keys and configurations, ensuring they are not hardcoded or committed to version control.
    
*   **Asynchronous Operations:** Consistent use of async/await for handling asynchronous operations (API calls, database queries) for cleaner and more readable code.
    
*   **Error Handling:** Basic error handling is implemented in both frontend and backend to provide user feedback and log issues.
