export const calculateFare = (vehicleType, parkedAt,exitTime,) => {
    const duration = exitTime - parkedAt;
    const hours = Math.ceil(
        duration / (1000 * 60 )
    );
    console.log("vehicleType:", vehicleType);
    console.log("hours:", hours);

    let rate;
    let additionalHourRate;
    switch (vehicleType) {
        case "bike":
            rate = 20;
            additionalHourRate=15;
            break;
        case "car":
            rate = 50;
            additionalHourRate=30;
            break;
        case "bus":
            rate = 100;
            additionalHourRate=70;
            break;
        default:
            rate = 0;
    }
    if (hours <= 0) {
        return rate;
    }
    return rate + (hours-1)*additionalHourRate;
}