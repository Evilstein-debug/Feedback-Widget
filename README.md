# Sayback - Open Source Feedback Collection System

![Platform](https://img.shields.io/badge/platform-Web-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Tech](https://img.shields.io/badge/tech-Next.js%20|%20Node.js%20|%20Prisma%20|%20Gemini%20AI-purple)

A comprehensive, full-stack solution for collecting, managing, and analyzing user feedback from any website. Built with performance, security, and developer experience in mind.

## 🚀 Key Features

*   **⚡ Universal Embeddable Widget**: A lightweight, high-performance widget built with Preact and Vite that works on any website (React, Vue, plain HTML, etc.).
*   **🧠 AI-Powered Sentiment Analysis**: Automatically analyzes user feedback using **Google Gemini 2.5 Flash** to classify sentiment (Positive, Negative, Neutral, Frustrated, Happy, Urgent).
*   **📊 Powerful Dashboard**: A modern, responsive dashboard built with Next.js and Shadcn UI to view, filter, and manage feedback.
*   **🔒 Secure & Private**: Project-based isolation with secure project keys. All data is validated server-side.
*   **📝 Rich Feedback Types**: Supports Bug Reports, Feature Requests, and General Feedback with user contact details.

## 🏗️ Technical Architecture

The project is structured as a monorepo with three distinct applications:

1.  **Client (`/client`)**:
    *   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
    *   **Styling**: Tailwind CSS, Shadcn UI, Radix UI
    *   **Auth**: NextAuth.js
    *   **Features**: Landing page, Project Management, Feedback Dashboard, Code Snippet Generation.

2.  **Server (`/server`)**:
    *   **Runtime**: Node.js & Express
    *   **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
    *   **AI**: Google GenAI SDK (Gemini 2.5 Flash)
    *   **Role**: Handles API requests, serves the widget script, performs sentiment analysis, and manages database interactions.

3.  **Widget (`/widget`)**:
    *   **Framework**: [Preact](https://preactjs.com/) (for minimal bundle size)
    *   **Build Tool**: Vite (UMD library mode)
    *   **Isolation**: Uses Shadow DOM to prevent style conflicts with host websites.
    *   **Role**: The actual UI element embedded on user sites.

## 📂 Repository Structure

```text
.
├── client/                 # Next.js Frontend Dashboard
│   ├── app/                # App Router pages (Dashboard, Projects, Login)
│   ├── components/         # Reusable UI components (Shadcn)
│   └── ...
├── server/                 # Express Backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers (Feedback, Project)
│   │   ├── services/       # Business logic & AI integration
│   │   ├── routes/         # API Route definitions
│   │   └── ...
│   ├── prisma/             # Database schema
│   └── public/             # Serves the compiled widget.umd.js
└── widget/                 # Embeddable Preact Widget
    ├── src/                # Widget source code
    └── ...
```

## 🔌 How the Embeddable Widget Works

The magic of this project lies in how the widget is delivered and integrated:

1.  **Development**: The widget is developed in the `widget` folder using Preact for speed and small size.
2.  **Compilation**: When built (`npm run build` in `/widget`), Vite bundles the code into a single `widget.js` file.
3.  **Serving**: This bundled script is copied to the `server/public` directory. The Express backend serves this file statically.
4.  **Embedding**: Users include a simple script tag on their website:
    ```html
    <script src="https://feedback-widget-h9cr.onrender.com/widget.js"></script>
    <feedback-widget project-key="your-project-key"></feedback-widget>
    ```
5.  **Initialization**: When the script loads on the client's site, it:
    *   Injects a Shadow DOM container (isolating styles).
    *   Mounts the widget UI.
    *   Reads the `project-key` to authorize API calls.

## 🛠️ Getting Started

### Prerequisites
*   Node.js v18+
*   PostgreSQL Database
*   Google Gemini API Key

### 1. Setup Backend (`server`)

```bash
cd server
npm install
cp .env.example .env # Configure DATABASE_URL, JWT_SECRET, GEMINI_API_KEY
npx prisma generate
npx prisma db push
npm run dev
```
*   Backend runs on `http://localhost:5001`
*   **Note**: Ensure `GEMINI_API_KEY` is set for Sentiment Analysis to work.

### 2. Setup Widget (`widget`)

```bash
cd widget
npm install
npm run build
```
*   This builds the widget and ideally works in tandem with the server.
*   For local dev, update the API URL in `widget/src/app.tsx` if needed.

### 3. Setup Frontend (`client`)

```bash
cd client
npm install
cp .env.example .env # Configure NEXT_PUBLIC_API_URL="http://localhost:5001/api"
npm run dev
```
*   Frontend runs on `http://localhost:3000`

## 🤖 Sentiment Analysis Usage

1.  Go to the **Dashboard** and select a Project.
2.  View the Feedback Table.
3.  Click the **"Analyse"** button (magic wand icon) on any feedback item.
4.  The system calls the backend `POST /api/feedback/:id/sentiment`.
5.  Gemini AI processes the text and categorizes it (e.g., "POSITIVE", "URGENT").
6.  The table updates instantly with a colored sentiment badge.

---
Built with ❤️ by Tejas Pathak.
