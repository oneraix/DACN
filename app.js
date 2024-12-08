// apps/app.js
const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');


const viewRoutes = require('./apps/routes/viewRoutes');  // Đường dẫn tới viewRoutes
const apiRoutes = require('./apps/routes/apiRoutes');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'apps' ,'views'));// Set views directory (chỉ ra nơi chứa các view)
// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Để xử lý dữ liệu JSON
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));//cấu hình file tĩnh cho admin
app.use('/user', express.static(path.join(__dirname, 'public', 'user')));//cấu hình file tĩnh cho user
app.use('/global', express.static(path.join(__dirname, 'public', 'global')));//cấu hình file tinh dùng chung

// Routes
app.use(expressLayouts);
app.use('/api', apiRoutes);  
app.use('/',viewRoutes);//render view



// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
