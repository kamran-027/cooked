# Cooked 🍲

Book your cooks in one-go with Cooked

## Technologies Used

### Frontend

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Vite](https://vitejs.dev/) - A fast build tool for modern web development.
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
- [React Router](https://reactrouter.com/) - A declarative routing library for React.

### Backend

- [Node.js](https://nodejs.org/) - A JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express.js](https://expressjs.com/) - A fast, unopinionated, minimalist web framework for Node.js.
- [Prisma](https://www.prisma.io/) - A next-generation ORM for Node.js and TypeScript.
- [JSON Web Tokens (JWT)](https://jwt.io/) - A compact, URL-safe means of representing claims to be transferred between two parties.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/your_project_name.git
   ```
2. Install NPM packages for the backend
   ```sh
   cd backend
   npm install
   ```
3. Install NPM packages for the frontend
   ```sh
   cd ../frontend
   npm install
   ```

### Running the Application

1.  **Backend:**

    In the `backend` directory, you can run the development server:

    ```sh
    npm run dev
    ```

2.  **Frontend:**

    In the `frontend` directory, you can run the development server:

    ```sh
    npm run dev
    ```

## Project Structure

```
.
├── backend
│   ├── prisma
│   └── src
└── frontend
    ├── public
    └── src
        ├── components
        └── pages
```

## Available Scripts

### Frontend

- `npm run dev`: Runs the app in the development mode.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the code.
- `npm run preview`: Previews the production build.

### Backend

- `npm run dev`: Runs the app in the development mode with hot-reloading.
- `npm run build`: Compiles the TypeScript code to JavaScript.
- `npm run start`: Starts the production server.
