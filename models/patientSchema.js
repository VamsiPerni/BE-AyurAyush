const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const patientSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
            unique: true,
        },

        bloodGroup: {
            type: String,
        },

        medicalHistory: {
            type: [String],
            default: [],
        },

        allergies: {
            type: [String],
            default: [],
        },

        emergencyContact: {
            name: String,
            phone: String,
            relation: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const PatientModel = model("patient", patientSchema);

module.exports = { PatientModel };
