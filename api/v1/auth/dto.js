const userSignupValidator = (req, res, next) => {
    try {
        console.log("-----🟢 inside userSignupValidator-------");

        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            res.status(400).json({
                isSuccess: false,
                message: "Email, otp and password are required!",
            });
            return;
        }

        //TODO: valid email using regex
        //TODO: valid password (at least 8 chars ...)

        next();
    } catch (err) {
        console.log("-----🔴 Error in userSignupValidator--------");

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const userLoginValidator = (req, res, next) => {
    try {
        console.log("-----🟢 inside userLoginValidator-------");

        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                isSuccess: false,
                message: "Email and password are required!",
            });
            return;
        }

        next();
    } catch (err) {
        console.log("-----🔴 Error in userLoginValidator--------");

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { userSignupValidator, userLoginValidator };
