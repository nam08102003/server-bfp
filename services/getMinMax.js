/** @format */

const PitchsModel = require("../models/Pitchs.js");

const getMinMaxPricePitchs = async () => {
  let data = [];
  await PitchsModel.aggregate([
    {
      $project: {
        minPrice: {
          $min: {
            $reduce: {
              input: {
                $map: {
                  input: "$listPitchs",
                  as: "listPitch",
                  in: {
                    $map: {
                      input: "$$listPitch.infoPitchs",
                      as: "infoPitch",
                      in: {
                        $toInt: "$$infoPitch.price",
                      },
                    },
                  },
                },
              },
              initialValue: [],
              in: {
                $concatArrays: ["$$value", "$$this"],
              },
            },
          },
        },
        maxPrice: {
          $max: {
            $reduce: {
              input: {
                $map: {
                  input: "$listPitchs",
                  as: "listPitch",
                  in: {
                    $map: {
                      input: "$$listPitch.infoPitchs",
                      as: "infoPitch",
                      in: {
                        $toInt: "$$infoPitch.price",
                      },
                    },
                  },
                },
              },
              initialValue: [],
              in: {
                $concatArrays: ["$$value", "$$this"],
              },
            },
          },
        },
      },
    },
  ])
    .then((result) => {
      data = result;
    })
    .catch((err) => {
      data = err;
    });

  return data;
};

module.exports = { getMinMaxPricePitchs };
