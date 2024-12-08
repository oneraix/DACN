//viewController.js
// Các view dùng chung
exports.renderIndex = (req, res) => {
    res.render('public/index'); 
  };

// Trang chi tiết phòng
exports.renderRoomDetail = (req, res) => {
  const roomId = req.params.id; // Lấy ID phòng từ URL
  res.render('public/roomDetail', { roomId }); // Render view và truyền ID phòng
};


exports.renderLogin = (req, res) => {
  res.render('public/login'); // Render trang đăng nhập
};
exports.renderSignup = (req, res) => {
  res.render('public/register'); // Render trang đăng ký
};


//host
// exports.renderIndexHost = (req,res) => {
//   res.render('host/layoutHost/hostLayout');
// }

exports.rederCreateHomestay = (req, res) => {
  res.render('host/createHomestay', {
    layout: 'layout/hostLayout', 
    title: 'Create Homestay',
  });
};
