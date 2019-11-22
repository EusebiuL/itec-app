const User = require('../models/User');

const AuthenticationMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];
    const user = await User.findOne({ token });
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(403).json({ message: "Wrong authentication token" });
    }
}

module.exports = AuthenticationMiddleware;