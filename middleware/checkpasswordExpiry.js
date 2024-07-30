const checkPasswordExpiry = (req, res, next) => {
    const { user } = req;
    const passwordAgeLimit = 80 * 24 * 60 * 60 * 1000; // 80 days in milliseconds
    const currentTime = Date.now();
  
    if (user && (currentTime - user.passwordCreated.getTime() > passwordAgeLimit)) {
      return res.status(403).json({
        success: false,
        message: "Your password has expired. Please change your password.",
      });
    }
  
    next();
  };
  
  module.exports = checkPasswordExpiry;
  