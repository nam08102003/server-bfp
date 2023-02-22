/** @format */

const PitchsModel = require("../models/Pitchs.js");
const BookingModel = require("../models/Booking.js");

async function updateInfoPitch(id) {
  const infoBooking = await BookingModel.findById(id);

  const dataUpdatePitch = {
    hour: [infoBooking?.timeStart, infoBooking?.timeEnd],
    day: infoBooking?.day,
  };

  await PitchsModel.findByIdAndUpdate(
    infoBooking?.keyMainPitch,
    {
      $addToSet: {
        "listPitchs.$[x].children.$[y].timeBooking": dataUpdatePitch,
      },
    },
    {
      arrayFilters: [
        { "x.id": infoBooking?.idParentPitch },
        { "y.id": infoBooking?.idChildPitch },
      ],
      new: true,
    }
  );
}

module.exports = { updateInfoPitch };
