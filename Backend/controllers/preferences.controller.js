import preferencesModel from '../models/preferences.model.js';

export const AddingPreferences = async (req, res) => {
    try {

        const { TimeZone, Theme, defaulRange, start_of_week, dateformat } = req.body;
        const preferences = new preferencesModel({
            TimeZone,
            Theme,
            defaulRange,
            start_of_week,
            dateformat,
        });


        await preferences.save();

        return res.status(200).json({
            message:"Preferences Added Successfully",
            success:false,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message:"Internal Server Error",
            success:false,
        });
    }
}