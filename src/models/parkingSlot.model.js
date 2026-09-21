import mongoose from "mongoose";

const parkingSlotSchema = new mongoose.Schema({
    slotId: {
        type: String,
        required: true,
        unique: true
    },

    vehicleType: {
        type: String,
        enum: ["bike", "car", "bus"],
        required: true
    },

    status: {
        type: String,
        enum: ["available", "occupied"],
        default: "available"
    }
});

const parkingSlotModel = mongoose.model(
    "ParkingSlot",
    parkingSlotSchema
);

export default parkingSlotModel;