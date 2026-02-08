const {
    DoctorApplicationsModel,
} = require("../../../models/doctorApplicationSchema");
const { DoctorModel } = require("../../../models/doctorSchema");
const { UserModel, ROLE_OPTIONS } = require("../../../models/userSchema");

const adminDashboardController = async (req, res) => {
    try {
        console.log("-----🟢 inside adminDashboardController-------");

        const totalUsers = await UserModel.countDocuments();
        const totalDoctors = await UserModel.countDocuments({
            roles: "doctor",
        });
        const totalPatients = await UserModel.countDocuments({
            roles: "patient",
        });

        res.status(200).json({
            isSuccess: true,
            message: "Admin dashboard loaded successfully",
            data: {
                stats: {
                    totalUsers,
                    totalDoctors,
                    totalPatients,
                },
            },
        });
    } catch (err) {
        console.error("-----🔴 Error in adminDashboardController--------");
        console.error(err);

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const reviewDoctorApplicationsController = async (req, res) => {
    try {
        console.log("-----🟢 inside reviewDoctorApplicationsController-------");

        const applications = await DoctorApplicationsModel.find({
            status: "pending",
        }).populate("userId", "email");

        res.status(200).json({
            isSuccess: true,
            message: "Pending doctor applications fetched",
            data: {
                applications,
            },
        });
    } catch (err) {
        console.error(
            "-----🔴 Error in reviewDoctorApplicationsController--------",
        );

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const approveDoctorApplicationController = async (req, res) => {
    try {
        console.log("-----🟢 inside approveDoctorApplicationController-------");

        const { applicationId } = req.params;

        const application =
            await DoctorApplicationsModel.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                isSuccess: false,
                message: "Doctor application not found",
            });
        }

        if (application.status !== "pending") {
            return res.status(400).json({
                isSuccess: false,
                message: "Application already processed",
            });
        }

        application.status = "approved";
        application.reviewedBy = req.currentAdmin.userId;
        await application.save();

        await UserModel.findByIdAndUpdate(application.userId, {
            $addToSet: { roles: ROLE_OPTIONS.DOCTOR },
        });

        // create doctor profile
        await DoctorModel.create({
            userId: application.userId,
            specialization: application.specialization,
            experience: application.experience,
            qualification: application.qualification,
            isVerified: true,
        });

        res.status(200).json({
            isSuccess: true,
            message: "Doctor application approved successfully",
        });
    } catch (err) {
        console.error(
            "-----🔴 Error in approveDoctorApplicationController--------",
            err.message,
        );

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const rejectDoctorApplicationController = async (req, res) => {
    try {
        console.log("-----🟢 inside rejectDoctorApplicationController-------");

        const { applicationId } = req.params;

        const application =
            await DoctorApplicationModel.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                isSuccess: false,
                message: "Doctor application not found",
            });
        }

        application.status = "rejected";
        application.reviewedBy = req.currentAdmin.userId;
        await application.save();

        res.status(200).json({
            isSuccess: true,
            message: "Doctor application rejected",
        });
    } catch (err) {
        console.error(
            "-----🔴 Error in rejectDoctorApplicationController--------",
        );

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    adminDashboardController,
    reviewDoctorApplicationsController,
    approveDoctorApplicationController,
    rejectDoctorApplicationController,
};
