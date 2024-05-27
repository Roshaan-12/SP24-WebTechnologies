module.exports = (req, res, next) => {
    console.log("Session ID:", req.session.id);
    console.log("Checking authentication:", req.session.adminId);
    if (req.session.adminId) {
        return next();
    }
    res.redirect('/landingPage/admin');
};
