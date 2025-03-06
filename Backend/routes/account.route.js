import express from 'express';
import { isAuth } from '../middlewares/isAuth.middle.js';
import {
    getAccountDetails,
    updatePrimaryEmail,
    updateBackupEmail,
    updateGithubUserId,
    updateApiKey,
    initiateAccountDeletion,
    cancelAccountDeletion
} from '../controllers/account.controller.js';
import { sendOTPToMail} from '../middlewares/SendOTPToMail.js';
import { VerifyOTP } from '../middlewares/verifyotp.middle.js';
const router = express.Router();

// Account routes
router.get('/', isAuth, getAccountDetails);

// route for primary email change !
router.put('/update/primary-email', isAuth,sendOTPToMail,VerifyOTP, updatePrimaryEmail);

//route for backup email chagne !
router.put('/update/backup-email', isAuth,sendOTPToMail,VerifyOTP, updateBackupEmail);

//route for github user id change !
router.put('/update/github-user-id', isAuth,sendOTPToMail,VerifyOTP, updateGithubUserId);

router.post('/api-key', isAuth, updateApiKey);
router.post('/delete', isAuth, initiateAccountDeletion);
router.delete('/delete', isAuth, cancelAccountDeletion);

export default router;
