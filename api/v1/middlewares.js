const jwt = require("jsonwebtoken");
const { ROLE_OPTIONS } = require("../../models/userSchema");

const validateLoggedInUserMiddleware = (req, res, next) => {
    try {
        console.log("-----🟢 inside validateLoggedInUserMiddleware-------");

        const { authorization } = req.cookies;

        if (!authorization) {
            console.log("🟠 Token not present !!!");
            res.status(401).json({
                isSuccess: false,
                message: "User not logged in!",
            });
            return;
        }

        jwt.verify(authorization, process.env.JWT_SECRET, (err, data) => {
            if (err) {
                console.log("🔴 Invalid token... may be hacking attempt!");

                res.status(401).json({
                    isSuccess: false,
                    message: "User not logged in!",
                });
                return;
            } else {
                console.log("✅ Valid user", data);
                req.currentUser = data;
                next();
            }
            req.currentUser = data;
            next();
        });
    } catch (err) {
        console.log("-----🔴 Error in validateLoggedInUserMiddleware--------");

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const validateIsAdminMiddleware = (req, res, next) => {
    try {
        console.log("-----🟢 inside validateIsAdminMiddleware-------");

        const { roles } = req.currentUser;

        if (roles && roles.includes(ROLE_OPTIONS.ADMIN)) {
            req.currentAdmin = req.currentUser;
            next();
        } else {
            return res.status(403).json({
                isSuccess: false,
                message: "User is not an admin",
            });
        }
    } catch (err) {
        console.log("-----🔴 Error in validateIsAdminMiddleware--------");

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const validatePatientRole = (req, res, next) => {
    try {
        console.log("-----🟢 inside validatePatientRole-------");

        const { roles } = req.currentUser;

        if (roles && roles.includes(ROLE_OPTIONS.PATIENT)) {
            req.currentPatient = req.currentUser;
            next();
        } else {
            return res.status(403).json({
                isSuccess: false,
                message: "Patient access only",
            });
        }
    } catch (err) {
        console.log("-----🔴 Error in validatePatientRole--------");

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const validateDoctorRole = (req, res, next) => {
    try {
        console.log("-----🟢 inside validateDoctorRole-------");

        const { roles } = req.currentUser;

        if (roles && roles.includes(ROLE_OPTIONS.DOCTOR)) {
            req.currentDoctor = req.currentUser;
            next();
        } else {
            return res.status(403).json({
                isSuccess: false,
                message: "Doctor access only",
            });
        }
    } catch (err) {
        console.log("-----🔴 Error in validateDoctorRole--------");

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    validateLoggedInUserMiddleware,
    validateIsAdminMiddleware,
    validatePatientRole,
    validateDoctorRole,
};
