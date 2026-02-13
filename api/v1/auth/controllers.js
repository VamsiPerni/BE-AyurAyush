const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../../../models/userSchema");

const userSignupController = async (req, res) => {
    try {
        console.log("-----🟢 inside userSignupController-------");

        const { name, email, phone, gender, dob, password } = req.body;

        // We will verfiy through OTP verification through OTP controllers

        const newUser = await UserModel.create({
            name,
            email,
            phone,
            gender,
            dob,
            password,
        });

        res.status(201).json({
            isSuccess: true,
            message: "User Created!",
            data: {
                user: {
                    email: newUser.email,
                    _id: newUser._id,
                },
            },
        });
    } catch (err) {
        console.log("-----🔴 Error in userSignupController--------");

        if (err.code == 11000) {
            res.status(409).json({
                isSuccess: false,
                message: "User account already exists!",
                data: {},
            });
            return;
        } else if (err.name === "ValidationError") {
            res.status(400).json({
                isSuccess: false,
                message: err.message,
                data: {},
            });
            return;
        }

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const userLoginController = async (req, res) => {
    try {
        console.log("-----🟢 inside userLoginController-------");

        const { email, password } = req.body;

        // i will check if any user exists with the given email
        const userDoc = await UserModel.findOne({
            email: email,
        }).lean();

        if (userDoc == null) {
            res.status(400).json({
                isSuccess: false,
                message: "User account doesn't exists! Please signup first...",
            });
            return;
        }

        // i will check if the given password matches the hashed-password of the saved user
        const { password: hashedPassword } = userDoc;
        const isCorrect = await bcrypt.compare(
            password.toString(),
            hashedPassword,
        );

        if (!isCorrect) {
            res.status(400).json({
                isSuccess: false,
                message: "Incorrect password! Please try again...",
            });
            // have some logic for max attempt or max tries a user can do
            // when ever there is error, increase attempt count
            // after the threshold limit is reached, then block the activity for few hours
            return;
        }

        const token = jwt.sign(
            {
                userId: userDoc._id,
                email: userDoc.email,
                roles: userDoc.roles, // ["patient", "doctor"]
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );

        res.cookie("authorization", token, {
            httpOnly: true,
            sameSite: "none", // prod: STRICT
            secure: true, // do you want to send it only on HTTPS connection?
            maxAge: 1 * 24 * 60 * 60 * 1000, // seconds
        });

        res.status(200).json({
            isSuccess: true,
            message: "User logged in!",
            data: {
                roles: userDoc.roles,
            },
        });
    } catch (err) {
        console.log("-----🔴 Error in userLoginController--------");

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const userLogoutController = async (req, res) => {
    try {
        console.log("-----🟢 inside userLogoutController-------");

        // remove the cookie ('authorization')
        res.cookie("authorization", "", {
            httpOnly: true,
            sameSite: "None", // prod: STRICT
            secure: true, // do you want to send it only on HTTPS connection?
            maxAge: 0, // seconds
        });

        res.status(200).json({
            isSuccess: true,
            message: "User logged out!",
        });
    } catch (err) {
        console.log("-----🔴 Error in userLogoutController--------");

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const getCurrentUserController = (req, res) => {
    try {
        const user = req.currentUser;

        res.status(200).json({
            isSuccess: true,
            data: {
                userId: user.userId,
                roles: user.roles,
            },
        });
    } catch (err) {
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const checkEmailExistsController = async (req, res) => {
    try {
        const { email } = req.query;

        const user = await UserModel.findOne({ email });

        if (user) {
            return res.status(200).json({
                exists: true,
            });
        }

        res.status(200).json({
            exists: false,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    userSignupController,
    userLoginController,
    userLogoutController,
    getCurrentUserController,
    checkEmailExistsController,
};
