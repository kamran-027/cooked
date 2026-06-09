# Cooked 🍲 – Application Overview & Setup Guide

Cooked connects food lovers with professional private culinary chefs, featuring custom booking flows, mock payment checkout options, and admin control panels.

## Key Features

### Interactive Chef Discovery
- Browse verified chefs with ratings, hourly rates, specialties, and cover banners.
- Featured chef showcase utilizing a custom 3D card layout on the landing page hero section.

### Split-Panel Booking Wizard
- **Step 1 (Date)**: Check open availability slots and pick a target date.
- **Step 2 (Timeslot)**: Clickable SVG Clock Face. Interactively choose morning, afternoon, or evening slots.
- **Step 3 (Dietary)**: Customize specific kitchen requests or meal preferences.
- **Step 4 (Checkout)**: Visual breakdown of hours, rates, and total cost.

### Simulated Secure Payments
- Simulates the RazorPay Gateway Checkout experience (UPI handles, Card inputs with visibility toggles, and Netbanking lists) directly within the wizard.

### Review System
- Read ratings and comments left by other customers under the chef profile.
- Submit star ratings and text reviews for completed bookings directly from the client panel.

### My Bookings Center
- Track scheduled reservations, review status updates, cancel slots, or leave chef feedback.

### Admin Dashboard Control
- Edit, delete, or add chef profiles within dedicated edit modals.
- Select chefs using custom dropdown interfaces and add date/time availability slots.
- Control registration keys and promote standard accounts to administrators.

### Security & Convenience Toggles
- Password input eye toggles.
- Sample credentials shortcut checkbox on the login page for automated sign-in.

---

## Setup Guide

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your database URL and JWT credentials inside a `.env` file:
   ```env
   DATABASE_URL="YOUR_DATABASE_CONNECTION_STRING"
   JWT_SECRET="YOUR_JWT_SIGNING_SECRET"
   PORT=5000
   ```
4. Push schema layouts and run data seeds:
   ```bash
   npx prisma db push --force-reset
   npx prisma db seed
   ```
5. Run the dev server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
