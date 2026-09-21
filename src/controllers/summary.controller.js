import parkingModel from "../models/parking.model.js";
import parkingSlotModel from "../models/parkingSlot.model.js";
import { getParkingStatus } from "../services/parking.service.js";
export const parkingSummary = async (req, res) => {
   const summary = await getParkingStatus()
   res.send(summary)
}