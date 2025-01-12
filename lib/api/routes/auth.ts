import { Router } from 'express';
import { validateRequest } from '../middleware/request-validator';

const router = Router();

// TODO: Implement auth routes
// router.post('/login', validateRequest, loginHandler);
// router.post('/register', validateRequest, registerHandler);
// router.post('/logout', validateRequest, logoutHandler);

export const authRoutes = router; 