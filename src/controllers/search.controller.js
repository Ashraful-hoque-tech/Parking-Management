import { findVehicle } from "../services/parking.service.js";

export const getVehicle = async (req, res) => {
    try {
        const { vehicleNumber } = req.params;
        const parkingRecord = await findVehicle(vehicleNumber);
        console.log("Vehicle number:", vehicleNumber);
        if (!parkingRecord) {
            return res.status(404).json({
                message: "Vehicle is not currently parked"
            });
        }
        return res.status(200).json({
            message: "Vehicle found",
            data: parkingRecord
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};