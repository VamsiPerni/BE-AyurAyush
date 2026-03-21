const {
    getPatientDashboard,
    applyForDoctorRole,
    getAvailableSlots,
    bookAppointment,
    getPatientAppointments,
    getAppointmentDetails,
    cancelAppointment,
    getVerifiedDoctors,
    getPatientProfile,
    updatePatientProfile,
} = require("./services");

const patientDashboardController = async (req, res, next) => {
    try {
        console.log("-----🟢 inside patientDashboardController-------");
        const data = await getPatientDashboard(req.currentUser.userId);
        res.status(200).json({
            isSuccess: true,
            message: "Patient dashboard loaded successfully",
            data,
        });
    } catch (err) {
        console.log("-----🔴 Error in patientDashboardController--------");
        console.log(err.message);
        next(err);
    }
};

const applyForDoctorRoleController = async (req, res, next) => {
    try {
        console.log("-----🟢 inside applyForDoctorRoleController-------");
        const data = await applyForDoctorRole(
            req.currentPatient.userId,
            req.body,
        );
        res.status(201).json({
            isSuccess: true,
            message: "Doctor role application submitted successfully",
            data,
        });
    } catch (err) {
        console.log("-----🔴 Error in applyForDoctorRoleController--------");
        console.log(err.message);
        next(err);
    }
};

const getAvailableSlotsController = async (req, res, next) => {
    try {
        console.log("-----🟢 inside getAvailableSlotsController-------");
        const { doctorId, date } = req.query;
        const data = await getAvailableSlots(doctorId, date);
        res.status(200).json({
            isSuccess: true,
            message: "Available slots retrieved",
            data,
        });
    } catch (err) {
        console.log("-----🔴 Error in getAvailableSlotsController--------");
        console.log(err.message);
        next(err);
    }
};

const bookAppointmentController = async (req, res, next) => {
    try {
        console.log("-----🟢 inside bookAppointmentController-------");
        const data = await bookAppointment(req.currentPatient.userId, req.body);
        const message =
            data.urgencyLevel === "emergency"
                ? "Emergency appointment created! Waiting for admin approval."
                : "Appointment booked successfully! Waiting for admin approval.";
        res.status(201).json({ isSuccess: true, message, data });
    } catch (err) {
        console.log("-----🔴 Error in bookAppointmentController--------");
        console.log(err.message);
        next(err);
    }
};

const getPatientAppointmentsController = async (req, res, next) => {
    try {
        console.log("-----🟢 inside getPatientAppointmentsController-------");
        const data = await getPatientAppointments(
            req.currentPatient.userId,
            req.query.status,
            req.query,
        );
        res.status(200).json({
            isSuccess: true,
            message: "Appointments retrieved successfully",
            data,
        });
    } catch (err) {
        console.log(
            "-----🔴 Error in getPatientAppointmentsController--------",
        );
        console.log(err.message);
        next(err);
    }
};

const getAppointmentDetailsController = async (req, res, next) => {
    try {
        console.log("-----🟢 inside getAppointmentDetailsController-------");
        const data = await getAppointmentDetails(
            req.currentPatient.userId,
            req.params.appointmentId,
        );
        res.status(200).json({
            isSuccess: true,
            message: "Appointment details retrieved",
            data,
        });
    } catch (err) {
        console.log("-----🔴 Error in getAppointmentDetailsController--------");
        console.log(err.message);
        next(err);
    }
};

const cancelAppointmentController = async (req, res, next) => {
    try {
        console.log("-----🟢 inside cancelAppointmentController-------");
        await cancelAppointment(
            req.currentPatient.userId,
            req.params.appointmentId,
        );
        res.status(200).json({
            isSuccess: true,
            message: "Appointment cancelled successfully",
        });
    } catch (err) {
        console.log("-----🔴 Error in cancelAppointmentController--------");
        console.log(err.message);
        next(err);
    }
};

const getVerifiedDoctorsController = async (req, res, next) => {
    try {
        console.log("-----🟢 inside getVerifiedDoctorsController-------");
        const data = await getVerifiedDoctors(
            req.query.specialization,
            req.query,
        );
        res.status(200).json({
            isSuccess: true,
            message: "Verified doctors retrieved",
            data,
        });
    } catch (err) {
        console.log("-----🔴 Error in getVerifiedDoctorsController--------");
        console.log(err.message);
        next(err);
    }
};

const getPatientProfileController = async (req, res, next) => {
    try {
        console.log("-----🟢 inside getPatientProfileController-------");
        const data = await getPatientProfile(req.currentPatient.userId);
        res.status(200).json({
            isSuccess: true,
            message: "Patient profile retrieved",
            data,
        });
    } catch (err) {
        console.log("-----🔴 Error in getPatientProfileController--------");
        console.log(err.message);
        next(err);
    }
};

const updatePatientProfileController = async (req, res, next) => {
    try {
        console.log("-----🟢 inside updatePatientProfileController-------");
        const data = await updatePatientProfile(
            req.currentPatient.userId,
            req.body,
        );
        res.status(200).json({
            isSuccess: true,
            message: "Patient profile updated successfully",
            data,
        });
    } catch (err) {
        console.log("-----🔴 Error in updatePatientProfileController--------");
        console.log(err.message);
        next(err);
    }
};

module.exports = {
    patientDashboardController,
    applyForDoctorRoleController,
    getAvailableSlotsController,
    bookAppointmentController,
    getPatientAppointmentsController,
    getAppointmentDetailsController,
    cancelAppointmentController,
    getVerifiedDoctorsController,
    getPatientProfileController,
    updatePatientProfileController,
};
