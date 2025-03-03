import express from 'express';
import { isAuth } from '../middlewares/isAuth.middle.js';
import {
    getAccountDetails,
    updateAccountDetails,
    updateApiKey,
    initiateAccountDeletion,
    cancelAccountDeletion
} from '../controllers/account.controller.js';

const router = express.Router();

// Account routes
router.get('/', isAuth, getAccountDetails);
router.put('/details', isAuth, updateAccountDetails);
router.post('/api-key', isAuth, updateApiKey);
router.post('/delete', isAuth, initiateAccountDeletion);
router.delete('/delete', isAuth, cancelAccountDeletion);

export default router;
