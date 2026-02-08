const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const doctorApplicationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
            unique: true,
        },

        qualification: String,
        specialization: String,
        experience: Number,
        licenseNumber: String,

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "user", // admin
        },
    },
    { timestamps: true },
);

const DoctorApplicationsModel = model(
    "doctor-applications",
    doctorApplicationSchema,
);
module.exports = { DoctorApplicationsModel };
