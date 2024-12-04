// apps/app.js
const express = require('express');
const app = express();



const userRoutes = require('./apps/routes/userRoutes'); // Đảm bảo đường dẫn đúng
const homestayRoutes = require('./apps/routes/homestayRoutes'); // Đảm bảo đường dẫn đúng

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());  // Để xử lý dữ liệu JSON

// Routes
app.use('/api/users', userRoutes);  // Đảm bảo là /routes/userRoutes
app.use('/api/homestays', homestayRoutes);  // Đảm bảo là /routes/homestayRoutes

// Set views directory (chỉ ra nơi chứa các view)
app.set('views', path.join(__dirname, 'views'));

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
