require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // e.g. Postman/server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-guest-token',
    ],
  })
);

// ==========================================
// GENERAL MIDDLEWARE
// ==========================================

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// Paystack webhook needs raw body for signature verification
app.use(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' })
);

app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

const productRoutes = require('./modules/products/product.routes');
const categoryRoutes = require('./modules/categories/category.routes');
const cartRoutes = require('./modules/cart/cart.routes');
const orderRoutes = require('./modules/orders/order.routes');
const shippingRoutes = require('./modules/shipping/shipping.routes');
const paymentRoutes = require('./modules/payments/payment.routes');
const contentRoutes = require('./modules/content/content.routes');
const uploadRoutes = require('./modules/uploads/upload.routes');
const authRoutes = require('./modules/auth/auth.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/shipping', shippingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/uploads', uploadRoutes);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res, next) => {
  const error = new (require('./utils/AppError'))(
    `Route ${req.originalUrl} not found`,
    404,
    'NOT_FOUND'
  );

  next(error);
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(errorHandler);

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(`Sela Backend running on port ${PORT}`);
  console.log('Allowed CORS origins:', allowedOrigins);
});