import parkingModel from "../models/parking.model.js";
import parkingSlotModel from "../models/parkingSlot.model.js";
import { calculateFare } from "../services/fare.services.js";

export const getParkings = async (req, res) => {
    const { vehicleType, vehicleNumber } = req.body;
    try {
        const alreadyExists = await parkingModel.findOne({
            vehicleNumber
        });
        if (alreadyExists) {
            return res.status(400).json({
                message: "Vehicle already parked",
                data: alreadyExists
            });
        }
        const availableSlot = await parkingSlotModel.findOne({
            vehicleType,
            status: "available"
        });
        if (!availableSlot) {
            return res.status(400).json({
                message: "No available parking slot for this vehicle type"
            });
        }
        availableSlot.status = "occupied";
        await availableSlot.save();

        const newParking = await parkingModel.create({
            vehicleType,
            vehicleNumber,
            slotId: availableSlot.slotId
        });
        return res.status(201).json({
            message: "Vehicle parked successfully",
            data: newParking
        });

    } catch (error) {
        console.error("error is ",error);
        
        return res.status(500).json({
        message: "Internal server error"
        });

    }
};

export const removeParking = async (req, res) => {
    const { vehicleNumber } = req.body;
    try {
        const parkingRecord = await parkingModel.findOneAndDelete({
            vehicleNumber
        });
        if (!parkingRecord) {
            return res.status(404).json({
                message: "Parking record not found"
            });
        }
        const exitTime = new Date();

        const fare = calculateFare(
            parkingRecord.vehicleType,
            parkingRecord.parkedAt,
            exitTime
        );
        const allotedSlot = await  parkingSlotModel.findOne({
            vehicleType: parkingRecord.vehicleType,
            slotId: parkingRecord.slotId
        });
        if(!allotedSlot){
            return res.status(500).json({
                message:"parking slot associsted with vehicle not found"
            })
        }
        if (allotedSlot) {
            allotedSlot.status = "available";
            await allotedSlot.save();
        }
        return res.status(200).json({
            message: "Vehicle removed successfully",
            data: {
                vehicleNumber: parkingRecord.vehicleNumber,
                vehicleType: parkingRecord.vehicleType,
                slotId: parkingRecord.slotId,
                parkedAt: parkingRecord.parkedAt,
                exitTime,
                fare
            }
        });

    } catch (error) {
        console.error("error is ",error);
        
        return res.status(500).json({
        message: "Internal server error"
        });
    }
}