const express = require("express");
const {
    userSignupController,
    userLoginController,
    userLogoutController,
    getCurrentUserController,
    checkEmailExistsController,
} = require("./controllers");

const { userSignupValidator, userLoginValidator } = require("./dto");
const { validateOtpMiddleware } = require("../otps/middlewares");
const { validateLoggedInUserMiddleware } = require("../middlewares");

const authRouter = express.Router();

authRouter.post(
    "/signup",
    userSignupValidator,
    validateOtpMiddleware,
    userSignupController,
);
authRouter.post("/login", userLoginValidator, userLoginController);
authRouter.get("/me", validateLoggedInUserMiddleware, getCurrentUserController);
authRouter.get("/logout", userLogoutController);
authRouter.get("/check-email", checkEmailExistsController);

module.exports = { authRouter };
