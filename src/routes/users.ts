import { Router } from 'express';
import { createUser, getUserById, getUsers, updateUser, updateAvatar } from '../controllers/users';

const router = Router();

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.post('/', createUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

export default router;
