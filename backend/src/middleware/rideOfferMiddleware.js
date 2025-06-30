const User = require("../model/User");


const checkOfferingStatus = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!user.isOfferingRides) {
            return res.status(403).json({
                message: "You must enable ride offering first.",
            });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

module.exports = checkOfferingStatus;
