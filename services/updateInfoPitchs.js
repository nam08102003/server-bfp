/** @format */

const PitchsModel = require("../models/Pitchs.js");
const BookingModel = require("../models/Booking.js");

async function updateTimeBooked(data) {
  const dataUpdatePitch = {
    hour: [data?.timeStart, data?.timeEnd],
    day: data?.day,
  };

  await PitchsModel.findByIdAndUpdate(
    data?.keyMainPitch,
    {
      $addToSet: {
        "listPitchs.$[x].children.$[y].timeBooking": dataUpdatePitch,
      },
    },
    {
      arrayFilters: [
        { "x.id": data?.idParentPitch },
        { "y.id": data?.idChildPitch },
      ],
      new: true,
    }
  );
}

async function deleteTimeBooked(id, timeBooked) {
  const infoBooking = await BookingModel.findById(id);

  await PitchsModel.findByIdAndUpdate(
    infoBooking?.keyMainPitch,
    {
      $pull: {
        "listPitchs.$[x].children.$[y].timeBooking": timeBooked,
      },
    },
    {
      arrayFilters: [
        { "x.id": infoBooking?.idParentPitch },
        { "y.id": infoBooking?.idChildPitch },
      ],
      new: true,
      multi: true,
    }
  );
}

module.exports = { updateTimeBooked, deleteTimeBooked };
