import mongoose from 'mongoose';

const parkingSchema = new mongoose.Schema({
    vehicleType: {
        type: String,
        required: true,
        enum: ['car', 'bike', 'bus']
    },
    vehicleNumber: {
        type: String,
        required: true,
    },
    slotId: {
        type: String,
        required: true,
    },
    parkedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Parking', parkingSchema);
