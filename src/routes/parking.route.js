import * as parkingController from '../controllers/parking.controller.js';
import express from 'express';
const parkingRoutes = express.Router();
import { validateParkingEntry,validateParkingExit } from '../validators/parking.validator.js';

parkingRoutes.post('/parkings', validateParkingEntry, parkingController.getParkings);
parkingRoutes.delete('/parkings', validateParkingExit, parkingController.removeParking);

export default parkingRoutes;