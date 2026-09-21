import parkingSlotModel from "./models/parkingSlot.model.js";
import connectDB from "./config/database.js";

await connectDB();

await parkingSlotModel.insertMany([
    {
        slotId: "B1",
        vehicleType: "bike",
        status: "available"
    },
    {
        slotId: "B2",
        vehicleType: "bike",
        status: "available"
    },
    {
        slotId: "B3",
        vehicleType: "bike",
        status: "available"
    },
    {
        slotId: "C1",
        vehicleType: "car",
        status: "available"
    },
    {
        slotId: "C2",
        vehicleType: "car",
        status: "available"
    },
    {
        slotId: "BU1",
        vehicleType: "bus",
        status: "available"
    },
    {
        slotId: "BU2",
        vehicleType: "bus",
        status: "available"
    }
]);

console.log("Parking slots stored");

process.exit();