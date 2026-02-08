const {
    DoctorApplicationsModel,
} = require("../../../models/doctorApplicationSchema");
const { PatientModel } = require("../../../models/patientSchema");

const patientDashboardController = async (req, res) => {
    try {
        console.log("-----🟢 inside patientDashboardController-------");

        const { userId } = req.currentUser;

        let patient = await PatientModel.findOne({ userId });

        if (!patient) {
            console.log("🟡 Patient profile not found, creating new one");

            patient = await PatientModel.create({
                userId,
                bloodGroup: null,
                medicalHistory: [],
                allergies: [],
                emergencyContact: {},
            });
        }

        res.status(200).json({
            isSuccess: true,
            message: "Patient dashboard loaded successfully",
            data: {
                patientId: patient._id,
                userId: patient.userId,
                bloodGroup: patient.bloodGroup,
                medicalHistory: patient.medicalHistory,
                allergies: patient.allergies,
                emergencyContact: patient.emergencyContact,
                createdAt: patient.createdAt,
            },
        });
    } catch (err) {
        console.error(err);

        // duplicate patient profile (edge case)
        if (err.code === 11000) {
            return res.status(409).json({
                isSuccess: false,
                message: "Patient profile already exists",
            });
        }

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const applyForDoctorRoleController = async (req, res) => {
    try {
        console.log("-----🟢 inside applyForDoctorRoleController-------");

        const { userId } = req.currentPatient;

        const { qualification, specialization, experience, licenseNumber } =
            req.body;

        const existingApplication = await DoctorApplicationsModel.findOne({
            userId,
        });

        if (existingApplication) {
            return res.status(400).json({
                isSuccess: false,
                message:
                    "You have already applied for doctor role. Please wait for admin review.",
            });
        }

        const application = await DoctorApplicationsModel.create({
            userId,
            qualification,
            specialization,
            experience,
            licenseNumber,
        });

        res.status(201).json({
            isSuccess: true,
            message: "Doctor role application submitted successfully",
            data: {
                applicationId: application._id,
                status: application.status,
            },
        });
    } catch (err) {
        console.error("-----🔴 Error in applyForDoctorRoleController--------");
        console.error(err);

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { patientDashboardController, applyForDoctorRoleController };
