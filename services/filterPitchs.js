/** @format */

const PitchsModel = require("../models/Pitchs.js");

function filterPitchs(data) {
  const day = data?.day;
  const time = data?.time;
  const typePitch = data?.typePitch;
  const duration = data?.duration;

  PitchsModel.aggregate([
    {
      $project: {
        filterPitchs: {
          $map: {
            input: "listPitchs",
            as: "pitchs",
            in: {},
          },
        },
      },
    },
  ]);
}

module.exports = { filterPitchs };
