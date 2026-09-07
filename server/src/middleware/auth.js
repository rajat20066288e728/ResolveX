import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const createAuth = (User) => (roles = []) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = await User.findById(payload.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Please sign in' });
    if (roles.length && !roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  } catch {
    res.status(401).json({ message: 'Please sign in' });
  }
};
