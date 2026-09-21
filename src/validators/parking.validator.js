import {body, validationResult} from "express-validator";

export const validateParkingEntry = [
    body("vehicleNumber")
        .trim()
        .notEmpty()
        .withMessage("Vehicle number is required")
        .isString()
        .withMessage("Vehicle number must be a string"),
    body("vehicleType")
        .trim()
        .notEmpty()
        .withMessage("Vehicle type is required")
        .isIn(["bike", "car", "bus"])
        .withMessage("Vehicle type must be either 'bike', 'car', or 'bus'"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export const validateParkingExit= [
    body("vehicleNumber")
        .trim()
        .notEmpty()
        .withMessage("Vehicle number is required")
        .isString()
        .withMessage("Vehicle number must be a string"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];