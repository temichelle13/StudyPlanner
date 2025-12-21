const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: 'Authentication is not configured on the server.' });
        }

        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        const token = authorizationHeader.split(' ')[1];
        const payload = jwt.verify(token, secret);
        const user = await User.findById(payload.sub).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid authentication token.' });
        }

        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed. Please sign in again.' });
    }
};

module.exports = authMiddleware;
