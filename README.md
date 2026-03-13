# 🍽️ Smart Canteen Pre-Order System

A full-stack web application that allows college students to pre-order food from the canteen, skip queues, and track orders in real time.

---

## 🚀 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Bootstrap 5, Chart.js |
| Backend | Node.js, Express.js |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Hosting | Firebase Hosting |

---

## 📁 Project Structure

```
smart-canteen/
├── frontend/                   # React frontend
│   ├── public/
│   └── src/
│       ├── components/         # Reusable components
│       │   ├── Navbar/
│       │   ├── Footer/
│       │   ├── MenuCard/
│       │   ├── StarRating/
│       │   ├── Spinner/
│       │   ├── ProtectedRoute/
│       │   └── AdminRoute/
│       ├── context/            # React contexts
│       │   ├── AuthContext.js
│       │   └── CartContext.js
│       ├── firebase/           # Firebase config
│       │   └── firebaseConfig.js
│       ├── pages/              # All pages
│       │   ├── Landing/
│       │   ├── Login/
│       │   ├── Signup/
│       │   ├── UserDashboard/
│       │   ├── Menu/
│       │   ├── Cart/
│       │   ├── OrderConfirmation/
│       │   ├── OrderHistory/
│       │   ├── Feedback/
│       │   ├── AdminLogin/
│       │   ├── AdminDashboard/
│       │   ├── AdminMenu/
│       │   ├── AdminOrders/
│       │   ├── AdminFeedback/
│       │   └── AdminPayments/
│       ├── services/
│       │   ├── firestoreService.js
│       │   └── recommendationService.js
│       ├── styles/
│       │   └── global.css
│       ├── App.js
│       └── index.js
│
├── backend/                    # Node.js/Express API
│   ├── controllers/
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   ├── paymentController.js
│   │   └── feedbackController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── firebase.js
│   ├── routes/
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── feedbackRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── firebase/                   # Firebase config & rules
    ├── firebaseConfig.js
    ├── firestore.rules
    └── firebase.json
```

---

## 📋 Features

### 👨‍🎓 Student (User) Module
- Sign up with Name, Email, Password
- Login with Email and Password
- Browse food menu with category filters and search
- Add items to cart
- Pre-order food with real-time confirmation
- Simulated online payment (UPI, Card, Net Banking, Cash)
- Track order status in real time
- View full order history
- Submit feedback and star ratings
- Monthly spending/budget analysis with chart
- AI-based food recommendations

### 👑 Admin Module
- Secure admin login
- Dashboard with analytics charts and stats
- Add / Edit / Delete menu items
- Toggle item availability
- View and update order statuses
- View payment records
- View and filter student feedback with rating analysis

---

## 🗄️ Firebase Collections

| Collection | Fields |
|-----------|--------|
| `users` | userId, name, email, role, createdAt |
| `menu` | itemId, itemName, description, price, category, imageURL, available |
| `orders` | orderId, userId, userName, items, totalPrice, note, orderStatus, orderTime |
| `payments` | paymentId, orderId, userId, amount, paymentMethod, paymentStatus, createdAt |
| `feedback` | feedbackId, userId, userName, rating, comment, category, date |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Firebase project (free Spark plan is sufficient)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Jithendrakotian/smart-canteen.git
cd smart-canteen
```

---

### Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → name it `smart-canteen`
3. Enable **Authentication** → Sign-in method → **Email/Password**
4. Enable **Firestore Database** → Start in **test mode**
5. Go to **Project Settings** → **Your apps** → Add a **Web app**
6. Copy the config values

---

### Step 3: Configure Frontend

```bash
cd frontend
cp .env.example .env
```

Edit `.env` with your Firebase config values:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123:web:abc123
```

---

### Step 4: Install & Run Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

---

### Step 5: Configure Backend (Optional)

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

To get the service account key:
- Firebase Console → Project Settings → **Service accounts**
- Click **Generate new private key** → download JSON
- Paste the JSON as a single line string in `FIREBASE_SERVICE_ACCOUNT_KEY`

---

### Step 6: Install & Run Backend

```bash
cd backend
npm install
npm run dev    # development with nodemon
```

Backend API runs on: **http://localhost:5000**

---

### Step 7: Create Admin Account

1. Sign up via the app to create your account
2. Go to Firebase Console → Firestore → `users` collection
3. Find your user document
4. Change `role: "user"` → `role: "admin"`
5. Log out and log in via **/admin/login**

---

### Step 8: Deploy Firestore Security Rules

```bash
cd firebase
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules
```

---

## 🌐 Firebase Hosting Deployment

```bash
cd frontend
npm run build

firebase deploy --only hosting
```

---

## 📱 Pages

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing Page | Public |
| `/login` | Student Login | Public |
| `/signup` | Student Signup | Public |
| `/admin/login` | Admin Login | Public |
| `/dashboard` | Student Dashboard | Student |
| `/menu` | Food Menu | Student |
| `/cart` | Cart | Student |
| `/order-confirmation` | Checkout & Payment | Student |
| `/orders` | Order History | Student |
| `/feedback` | Feedback | Student |
| `/admin/dashboard` | Admin Dashboard | Admin |
| `/admin/menu` | Menu Management | Admin |
| `/admin/orders` | Orders Management | Admin |
| `/admin/feedback` | Feedback Viewer | Admin |
| `/admin/payments` | Payment Records | Admin |

---

## 🔒 Security

- Firebase Authentication for login/signup
- Role-based access control (user/admin)
- Firestore Security Rules restrict data access by role
- Admin routes protected on both frontend and backend
- Token-based API authentication (Firebase ID tokens) in backend

---

## 🤖 AI Recommendation Logic

The recommendation engine (`recommendationService.js`) uses rule-based scoring:

1. **Time of Day** — Items from the matching meal category (breakfast/lunch/snacks) get a score boost
2. **Order History** — Frequently ordered items score higher
3. **Price** — Affordable items (≤ ₹60) get a small boost

Top 4 scored items are shown on the student dashboard.

---

## 🛠️ Backend API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | None | Health check |
| GET | `/api/menu` | None | Get all menu items |
| POST | `/api/menu` | Admin | Add menu item |
| PUT | `/api/menu/:id` | Admin | Update menu item |
| DELETE | `/api/menu/:id` | Admin | Delete menu item |
| POST | `/api/orders` | User | Create order |
| GET | `/api/orders/my` | User | My orders |
| GET | `/api/orders` | Admin | All orders |
| PATCH | `/api/orders/:id/status` | Admin | Update order status |
| POST | `/api/payments` | User | Record payment |
| GET | `/api/payments` | Admin | All payments |
| POST | `/api/feedback` | User | Submit feedback |
| GET | `/api/feedback/my` | User | My feedback |
| GET | `/api/feedback` | Admin | All feedback |
| GET | `/api/users/me` | User | My profile |
| GET | `/api/users` | Admin | All users |

---

Built with ❤️ for college students to skip the canteen queue!