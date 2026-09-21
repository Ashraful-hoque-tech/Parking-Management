import * as parkingController from '../controllers/parking.controller.js';
import { parkingSummary } from '../controllers/summary.controller.js';
import { getVehicle } from '../controllers/search.controller.js';
import express from 'express';
const parkingRoutes = express.Router();
import { validateParkingEntry,validateParkingExit } from '../validators/parking.validator.js';

parkingRoutes.post('/parkings', validateParkingEntry, parkingController.getParkings);
parkingRoutes.delete('/parkings', validateParkingExit, parkingController.removeParking);
parkingRoutes.get("/summary",parkingSummary)
parkingRoutes.get("/vehicle/:vehicleNumber", getVehicle)
export default parkingRoutes;