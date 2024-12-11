//viewController.js
// Các view public
exports.renderIndex = (req, res) => {
    res.render('public/index', { layout: 'layout/mainLayout'}); 
  };
exports.renderRoomDetail = (req, res) => {
  const roomId = req.params.id; // Lấy ID phòng từ URL
  res.render('public/roomDetail', { roomId  ,layout: 'layout/mainLayout' }); // Render view và truyền ID phòng
};
exports.renderLogin = (req, res) => {
  res.render('public/login', { layout: false  }); // Render trang đăng nhập
};
exports.renderSignup = (req, res) => {
  res.render('public/register', { layout: false }); // Render trang đăng ký
};


//view Host
exports.renderCreateHomestay = (req, res) => {
  res.render('host/createHomestay', {
    layout: 'layout/hostLayout', 
    title: 'Đăng homestay',
  });
};
exports.renderBookingConfirm = (req, res) => {
  res.render('host/bookingConfirm', {
    layout: 'layout/hostLayout', 
    title: 'Xác nhận đặt phòng',
  });
};
exports.renderHostIndex = (req, res) => {
  res.render('host/indexHost', {
    layout: 'layout/hostLayout', 
    title: 'Thống kê',
  });
};
exports.renderMyHomestay = (req, res) => {
  res.render('host/myHomestay', {
    layout: 'layout/hostLayout', 
    title: 'Homestay của tôi',
  });
};
exports.renderProfile = (req, res) => {
  res.render('host/profileHost', {
    layout: 'layout/hostLayout', 
    title: 'Thông tin tài khoản',
  });
};
exports.renderRentHistory = (req, res) => {
  res.render('host/rentalHistory', {
    layout: 'layout/hostLayout', 
    title: 'Lịch sử cho thuê',
  });
};


//view Admin
exports.renderAcceptHomestay = (req, res) => {
  res.render('admin/acceptHomestay', {
    layout: 'layout/adminLayout', 
    title: 'Xác nhận Homestay',
  });
};
exports.renderAdminIndex = (req, res) => {
  res.render('admin/indexAdmin', {
    layout: 'layout/adminLayout', 
    title: 'Tổng quan',
  });
};
exports.renderManageAccount = (req, res) => {
  res.render('admin/manageAccount', {
    layout: 'layout/adminLayout', 
    title: 'Quản lí tài khoản',
  });
};

exports.renderManageBlog = (req, res) => {
  res.render('admin/manageBlog', {
    layout: 'layout/adminLayout', 
    title: 'Quản lí bài đăng',
  });
};
exports.renderManageHomestay = (req, res) => {
  res.render('admin/manageHomestay', {
    layout: 'layout/adminLayout', 
    title: 'Quản lí homestay',
  });
};
exports.renderManageBooking = (req, res) => {
  res.render('admin/manageBooking', {
    layout: 'layout/adminLayout', 
    title: 'Quản lí booking',
  });
};

//view User
exports.renderBooking = (req, res) => {
  res.render('user/booking', {
    layout: 'layout/userLayout', 
    title: 'Đặt phòng',
  });
};
exports.renderBookingHistory = (req, res) => {
  res.render('user/bookingHistory', {
    layout: 'layout/userLayout', 
    title: 'lLịch sử đặt phòng',
  });
};
exports.rendeFavoriteHomestay = (req, res) => {
  res.render('user/favoriteHomestay', {
    layout: 'layout/userLayout', 
    title: 'Danh sách yêu thích',
  });
};
exports.renderPayment = (req, res) => {
  res.render('user/payment', {
    layout: 'layout/userLayout', 
    title: 'Thanh toán booking',
  });
};
exports.renderUserProfile = (req, res) => {
  res.render('user/profile', {
    layout: 'layout/userLayout', 
    title: 'Đặt phòng',
  });
};
