const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const doctorSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
            unique: true,
        },

        specialization: {
            type: String,
            required: true,
        },

        qualification: {
            type: String,
            required: true,
        },

        experience: {
            type: Number,
            required: true,
            min: 0,
        },

        consultationFee: {
            type: Number,
        },

        availableModes: {
            type: [String],
            enum: ["offline", "online"],
            default: [],
        },

        // -------- Admin-controlled --------
        isVerified: {
            type: Boolean,
            default: false,
        },

        verifiedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const DoctorModel = model("doctor", doctorSchema);

module.exports = { DoctorModel };
