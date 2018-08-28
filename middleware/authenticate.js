const authenticate = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } 

    res.redirect('/');
};

const guest = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    }

    return next();
};

module.exports = { authenticate, guest };