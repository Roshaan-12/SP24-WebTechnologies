module.exports = (paths) => {
    return (req, res, next) => {
        if (paths.includes(req.path)) {
            return next();
        }
    };
};
