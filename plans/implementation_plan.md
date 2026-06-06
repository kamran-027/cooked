# Cooked Phase 2: Polish & Advanced Slot Booking (Revised Plan)

This revised plan incorporates your feedback to build a mature, GTM-ready version of Cooked, focusing on predefined timeslot availability, RazorPay payment simulations, and high-fidelity UI components.

---

## 1. Core Features & Architecture

### A. Predefined Availability Slots (Option B)
* **Slot Creation:** Since there is no cook portal yet, availability slots will be created and managed by the **Admin** through the Admin Control Center.
* **Slot Structure:** Each slot belongs to a cook and defines:
  * A specific **Date** (e.g., `2026-06-10`)
  * A **Start Time** (e.g., `12:00 PM`)
  * An **End Time** (e.g., `03:00 PM`)
  * `isBooked` boolean (defaults to `false`).
* **Booking Rule:** When a user selects and books a slot, that slot's `isBooked` flag is set to `true`, making it unavailable for other users. If the booking is cancelled, `isBooked` returns to `false`.

### B. User-Controlled Booking Statuses
To keep it simple and user-driven in this phase, we will track two primary statuses:
1. **`BOOKED`:** The default state when a slot is booked and mock payment succeeds.
2. **`CANCELLED`:** The state when the user cancels the session.
* *Note:* Cancelling a session frees the cook's timeslot immediately.

### C. RazorPay Mock Checkout Dialog
* When a user confirms booking details, instead of an instant API call, a **RazorPay Checkout Modal** will overlay the screen.
* It will mimic the signature blue RazorPay checkout styling, featuring:
  * Merchant Name: **Cooked Culinary Services**
  * Total Price in **INR (₹)** (calculated from the cook's rate, converting USD rates if applicable, or using local pricing).
  * Selection tabs: **UPI (Google Pay, PhonePe, UPI ID)**, **Card (Visa/Mastercard/RuPay)**, and **Netbanking**.
  * A realistic "Processing Payment..." spinner, followed by a green "Payment Successful" checkmark, which then triggers the actual backend booking creation.

### D. Premium Design & Aceternity UI Elements
We will upgrade the layout to feel extremely professional:
* **RazorPay Custom Overlay:** Pixel-perfect clone of the RazorPay payment experience.
* **Slot Picker Grid:** Beautiful, responsive grid cards showing dates and time chips with micro-animations.
* **Aceternity UI & Framer Motion:** Enhance the existing cards, backgrounds, and modal transitions to feel fluid and premium.

---

## 2. Database Schema Changes (Prisma)

We will implement the following database schema in `backend/prisma/schema.prisma`:

```prisma
enum BookingStatus {
  BOOKED
  CANCELLED
}

model User {
  id        String    @id @default(uuid())
  name      String?
  email     String    @unique
  password  String
  role      Role      @default(USER)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  bookings  Booking[]
}

model Cook {
  id             String             @id @default(uuid())
  name           String?
  email          String             @unique
  cuisine        String?
  description    String?
  image          String?
  rate           Int                // Hourly rate in INR or USD
  createdAt      DateTime           @default(now())
  updatedAt      DateTime           @updatedAt
  bookings       Booking[]
  availabilities CookAvailability[]
}

model CookAvailability {
  id        String   @id @default(uuid())
  cookId    String
  date      DateTime // Specific date
  startTime String   // e.g. "09:00" or "09:00 AM"
  endTime   String   // e.g. "12:00" or "12:00 PM"
  isBooked  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  cook      Cook     @relation(fields: [cookId], references: [id], onDelete: Cascade)
  booking   Booking? // Optional reverse relation if booked

  @@index([cookId])
}

model Booking {
  id             String           @id @default(uuid())
  userId         String
  cookId         String
  availabilityId String           @unique // One slot = One booking
  status         BookingStatus    @default(BOOKED)
  notes          String?          // Special cooking notes / dietary instructions
  totalPrice     Int              // Calculated total amount
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  user           User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  cook           Cook             @relation(fields: [cookId], references: [id], onDelete: Cascade)
  availability   CookAvailability @relation(fields: [availabilityId], references: [id])

  @@index([userId])
  @@index([cookId])
}
```

---

## 3. Proposed API Endpoints

### User Endpoints (`/userRoutes.ts`)
1. **`GET /user/cooks/:id/availability`**
   * Returns all available slots (`isBooked: false` and date >= today) for a specific cook.
2. **`POST /user/bookings`**
   * Accepts `{ cookId, availabilityId, notes }`.
   * Backend transaction checks if the slot is still available. If yes, creates the Booking with `status: BOOKED` and sets the slot's `isBooked = true`.
3. **`GET /user/bookings`**
   * Fetch user's bookings, including the associated cook details and slot date/time.
4. **`POST /user/bookings/:id/cancel`**
   * Changes booking status to `CANCELLED` and resets the slot's `isBooked = false`.

### Admin Endpoints (`/adminRoutes.ts`)
1. **`POST /admin/cooks/:id/availability`**
   * Accepts `{ date, startTime, endTime }` and creates an availability slot for a cook.
2. **`GET /admin/cooks/:id/availability`**
   * Fetch all slots (both booked and unbooked) for a cook to allow management.
3. **`DELETE /admin/availability/:id`**
   * Allows admins to delete an unbooked slot.

---

## 4. UI/UX Plan

### Booking Dialog & RazorPay Flow
1. **Time Selection:** When "Book Now" is clicked, the dialog shows:
   * A clean date selector or day-tabs (e.g., "Mon, Jun 8", "Tue, Jun 9").
   * Visual "Time Chips" (e.g. "12:00 PM - 3:00 PM"). Chips are highlighted when selected, and disabled/greyed out if already booked.
   * A text area for **Special instructions / Dietary requirements**.
2. **Checkout Review:** Once a slot is selected, a summary card shows the rate, calculated hours, and total. Clicking "Proceed to Pay" launches the **RazorPay Mockup Modal**.
3. **RazorPay Modal Simulation:**
   * Overlay dialog with RazorPay signature colors.
   * QR Code / UPI input, mock credit card form, or netbanking list.
   * Clicking "Pay Now" shows a circular success animation, then resolves the booking on the backend.

### Admin Schedule Dashboard
* On the `/admin` page, add a **"Schedule Manager"** tab:
  * Select a cook from a dropdown.
  * Pick a Date and enter Start/End Times.
  * Click **"Add Slot"** to append a new availability block.
  * List all created slots for that cook with status indicators (`Booked` or `Available`).

---

## 5. Verification Plan

### Automated Tests & Race Condition Checks
* Ensure the backend uses a database transaction when reserving a slot. If two users try to book the same slot simultaneously, only one succeeds and the other receives a "Slot already booked" error.

### Manual Verification
* Create multiple slots as Admin.
* Log in as User A and book Slot 1. Confirm that Slot 1 is disabled/hidden for User B.
* Log in as User A and cancel Slot 1. Confirm that Slot 1 is once again open for User B.
* Walk through the RazorPay payment overlay flows to ensure aesthetics are premium and functional.
