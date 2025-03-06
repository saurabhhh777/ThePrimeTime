import accountModel from "../models/account.model.js";
import { createApiKey } from "../utils/ApiKey.js";

// Get account details for a user
export const getAccountDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const accountDetails = await accountModel.findOne({ user: userId });
        
        if (!accountDetails) {
            return res.status(404).json({
                success: false,
                message: "Account details not found"
            });
        }

        res.status(200).json({
            success: true,
            data: accountDetails
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updatePrimaryEmail = async (req,res)=>{
    try {

        const userId = req.user._id;
        const { primary_email } = req.body;

        const updatedAccount = await accountModel.findOneAndUpdate(
            {user:userId},
            {$set:{"emails.primary_email":primary_email}},
            {new:true}
        );

        
        if(!updatedAccount){
            return res.status(404).json({
                success:false,
                message:"Account details not found"
            });
        }


        const updateUser = await userModel.findOneAndUpdate(
            {user:req.user._id},
            {$set:{"email":primary_email}},
            {new:true}
        );


        if(!updateUser){
            return res.status(404).json({
                success:false,
                message:"User details not found"
            });

         }



        res.status(200).json({
            success:true,
            message:"Primary email updated successfully"
        });
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }


}


export const updateBackupEmail = async (req,res)=>{

    try {

        const userId = req.user._id;
        const { backup_email } = req.body;

        const updatedAccount = await accountModel.findOneAndUpdate(
            {user:userId},
            {$set:{"emails.backup_email":primary_email}},
            {new:true}
        );

        
        if(!updatedAccount){
            return res.status(404).json({
                success:false,
                message:"Account details not found"
            });
        }


        return res.status(200).json({
            success:true,
            message:"Primary email updated successfully"
        });
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }

}


export const updateGithubUserId = async (req,res)=>{
    try {

        const userId = req.user._id;
        const { github_user_id } = req.body;

        const updatedAccount = await accountModel.findOneAndUpdate(
            {user:userId},
            {$set:{"emails.github_user_id":github_user_id}},
            {new:true}
        );

        
        if(!updatedAccount){
            return res.status(404).json({
                success:false,
                message:"Account details not found"
            });
        }

        return res.status(200).json({
            success:true,
            message:"Github user id updated successfully"
        });
    }
    catch {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        });

    }

}



// Update API key
export const updateApiKey = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const newApiKey = createApiKey();

        const updatedAccount = await accountModel.findOneAndUpdate(
            { user: userId },
            { secret_api_key:newApiKey},
            { new: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account details not found"
            });
        }

        //only sending account id , user id and secret api key to the frontend User.
        const newUpdatedAccount = {
            _id: updatedAccount._id,
            user: updatedAccount.user,
            secret_api_key: updatedAccount.secret_api_key,
        }

        res.status(200).json({
            success: true,
            data: newUpdatedAccount,
            message:"API key updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Initiate account deletion
export const initiateAccountDeletion = async (req, res) => {
    try {
        const userId = req.user._id;
        const deletionDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

        const updatedAccount = await accountModel.findOneAndUpdate(
            { user: userId },
            {
                'danger_zone.delete_account': true,
                'danger_zone.delete_account_date': deletionDate
            },
            { new: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account details not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Account will be deleted on ${deletionDate.toISOString()}`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cancel account deletion
export const cancelAccountDeletion = async (req, res) => {
    try {
        const userId = req.user._id;

        const updatedAccount = await accountModel.findOneAndUpdate(
            { user: userId },
            {
                'danger_zone.delete_account': false,
                'danger_zone.delete_account_date': null
            },
            { new: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account details not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedAccount,
            message: "Account deletion has been cancelled"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
