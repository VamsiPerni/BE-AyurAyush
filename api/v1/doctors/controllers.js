const { DoctorModel } = require("../../../models/doctorSchema");

const doctorDashboardController = async (req, res) => {
    try {
        console.log("-----🟢 inside doctorDashboardController-------");

        const { userId } = req.currentDoctor;

        let doctor = await DoctorModel.findOne({ userId });

        if (!doctor) {
            console.log("🟡 Doctor profile not found, creating new one");

            doctor = await DoctorModel.create({
                userId,
                specialization: null,
                experience: null,
                isVerified: false, // admin approval later
            });
        }

        res.status(200).json({
            isSuccess: true,
            message: "Doctor dashboard loaded successfully",
            data: {
                doctorId: doctor._id,
                userId: doctor.userId,
                specialization: doctor.specialization,
                experience: doctor.experience,
                isVerified: doctor.isVerified,
                createdAt: doctor.createdAt,
            },
        });
    } catch (err) {
        console.error("-----🔴 Error in doctorDashboardController--------");
        console.error(err);

        if (err.code === 11000) {
            return res.status(409).json({
                isSuccess: false,
                message: "Doctor profile already exists",
            });
        }

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { doctorDashboardController };
