# Cooked 🍲

Book your cooks in one-go with Cooked. Cooked is a modern premium platform linking food lovers with professional private culinary chefs.

---

## Key Features & Highlights

- **Split-Panel Interactive Booking Modal**: An upgraded interactive booking wizard layout:
  - **Left Side**: Displays Chef details, rate, cuisine, bio, and a dedicated scrollable **Customer Reviews / Comments** section.
  - **Right Side**: Steps through Date selection, visual **SVG Clock Face Timeslot Selector**, dietary preferences, cost receipt breakdown, and a simulated secure payment workflow.
- **Visual SVG Clock-Face Scheduler**: Choose slots visually by clicking sectors representing morning, afternoon, or evening availability.
- **Secure Mock RazorPay checkout**: Simulate a payment checkout processing flow using card, UPI, or popular Netbanking accounts directly within the wizard.
- **Admin Dashboard Control Panel**:
  - Decoupled admin controls with a dedicated **Edit Cook Profile** Dialog modal.
  - Custom custom-styled ShadCN DropdownMenu component for selecting and managing timeslot schedules.
- **Sample Credentials Auto-login**: A quick checkbox option on the signin screen to auto-fill sample credentials (`d.rice@arsenal.com` / `ricericebaby`).
- **Show/Hide Password Toggle**: Toggle visibility for passwords in registration/signin fields.

---

## Technologies Used

### Frontend

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Vite](https://vitejs.dev/) - A fast build tool for modern web development.
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
- [React Router](https://reactrouter.com/) - A declarative routing library for React.
- [Lucide React](https://lucide.dev/) - Premium vector icons.

### Backend

- [Node.js](https://nodejs.org/) - A JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express.js](https://expressjs.com/) - A fast, minimalist web framework.
- [Prisma](https://www.prisma.io/) - A next-generation ORM for Node.js and TypeScript.
- [PostgreSQL](https://www.postgresql.org/) - Production-ready relational database.
- [JSON Web Tokens (JWT)](https://jwt.io/) - Secure transmission of authorization states.

---

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

1. **Backend:**

   In the `backend` directory, run the development server:
   ```sh
   npm run dev
   ```

2. **Frontend:**

   In the `frontend` directory, run the development server:
   ```sh
   npm run dev
   ```

---

## Project Structure

```
.
├── backend
│   ├── prisma       # Database migrations and seed script
│   └── src          # Controllers, models, routers, and server logic
└── frontend
    ├── public       # Image assets and static files
    └── src
        ├── components  # Reusable React components (Clock face, dialogs, cards)
        └── pages       # Main route screens (Signin, Signup, Main, Admin Control)
```

---

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
