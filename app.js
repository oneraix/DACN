// apps/app.js
const express = require('express');
const app = express();
const path = require('path');


const viewRoutes = require('./apps/routes/viewRoutes');  // Đường dẫn tới viewRoutes
const userRoutes = require('./apps/routes/userRoutes'); // Đảm bảo đường dẫn đúng
const homestayRoutes = require('./apps/routes/homestayRoutes'); // Đảm bảo đường dẫn đúng

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'apps' ,'views'));// Set views directory (chỉ ra nơi chứa các view)

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Để xử lý dữ liệu JSON
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));//cấu hình file tĩnh cho admin
app.use('/user', express.static(path.join(__dirname, 'public', 'user')));//cấu hình file tĩnh cho user
app.use('/global', express.static(path.join(__dirname, 'public', 'global')));//cấu hình file tinh4 dùng chung

// Routes
app.use('/api/users', userRoutes);  // Đảm bảo là /routes/userRoutes
app.use('/api/homestays', homestayRoutes);  // Đảm bảo là /routes/homestayRoutes
app.use('/',viewRoutes);



// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
