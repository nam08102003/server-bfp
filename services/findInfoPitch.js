/** @format */

const PitchsModel = require("../models/Pitchs.js");
async function findInfoPitch(arrayBooking) {
  try {
    const arrayInfoPitch = [];

    for (let i = 0; i < arrayBooking.length; i++) {
      const mainPitch = await PitchsModel.findById(
        arrayBooking[i]?.keyMainPitch
      );
      const parentPitch = mainPitch?.listPitchs.find(
        (element) => element?.id === arrayBooking[i]?.idParentPitch
      );
      const childPitch = parentPitch?.children.find(
        (element) => element?.id === arrayBooking[i]?.idChildPitch
      );
      arrayInfoPitch.push({
        ...arrayBooking[i]._doc,
        namePitch: mainPitch?.title,
        typePitch: parentPitch?.pitch,
        childPitch: childPitch?.title,
      });
    }

    return arrayInfoPitch;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { findInfoPitch };
