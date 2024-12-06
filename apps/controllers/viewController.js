exports.renderIndex = (req, res) => {
    res.render('index'); 
  };

  exports.renderLogin = (req, res) => {
    res.render('shared/login'); 
  };

  exports.renderSignup = (req, res) => {
    res.render('shared/register');  
  };

