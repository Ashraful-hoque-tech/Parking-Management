import parkingSlotModel from "../models/parkingSlot.model.js";
import parkingModel from "../models/parking.model.js";

export const getParkingStatus = async () => {
    // Overall parking statistics
    const totalSlots = await parkingSlotModel.countDocuments();
    const occupiedSlots = await parkingSlotModel.countDocuments({
        status: "occupied"
    });
    const availableSlots = totalSlots - occupiedSlots;

    // Bike statistics
    const totalBikeSlots = await parkingSlotModel.countDocuments({
        vehicleType: "bike"
    });
    const occupiedBikeSlots = await parkingSlotModel.countDocuments({
        vehicleType: "bike",
        status: "occupied"
    });
    const availableBikeSlots = totalBikeSlots - occupiedBikeSlots;

    // Car statistics
    const totalCarSlots = await parkingSlotModel.countDocuments({
        vehicleType: "car"
    });
    const occupiedCarSlots = await parkingSlotModel.countDocuments({
        vehicleType: "car",
        status: "occupied"
    });
    const availableCarSlots = totalCarSlots - occupiedCarSlots;

    // Bus statistics
    const totalBusSlots = await parkingSlotModel.countDocuments({
        vehicleType: "bus"
    });
    const occupiedBusSlots = await parkingSlotModel.countDocuments({
        vehicleType: "bus",
        status: "occupied"
    });
    const availableBusSlots = totalBusSlots - occupiedBusSlots;

    return {
        totalSlots,
        occupiedSlots,
        availableSlots,

        byVehicleType: {
            bike: {
                total: totalBikeSlots,
                occupied: occupiedBikeSlots,
                available: availableBikeSlots
            },

            car: {
                total: totalCarSlots,
                occupied: occupiedCarSlots,
                available: availableCarSlots
            },

            bus: {
                total: totalBusSlots,
                occupied: occupiedBusSlots,
                available: availableBusSlots
            }
        }
    };
};
export const findVehicle = async (vehicleNumber) => {

    const vehicle = await parkingModel.findOne({
        vehicleNumber
    });

    if (!vehicle) {
        return null;
    }

    const currentTime = new Date();

    const duration = currentTime - vehicle.parkedAt;

    const hours = Math.floor(
        duration / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (duration % (1000 * 60 * 60)) / (1000 * 60)
    );

    return {
        vehicleNumber: vehicle.vehicleNumber,
        vehicleType: vehicle.vehicleType,
        slotId: vehicle.slotId,
        parkedAt: vehicle.parkedAt,
        duration: {
            hours,
            minutes
        }
    };
};