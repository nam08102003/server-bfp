/** @format */

const PitchsModel = require("../models/Pitchs.js");

async function filterPitchs(criteriaFilter) {
  const day = criteriaFilter?.day;
  const time = criteriaFilter?.time;
  const typePitch = criteriaFilter?.typePitch;
  const duration = criteriaFilter?.duration;

  const arrayResult = [];
  const arrayCheck = [];
  const arrayCheck2 = [];

  if (day && time) {
    const resultDate = await PitchsModel.find({ isActive: true });

    for (let i = 0; i < resultDate.length; i++) {
      if (checkDate(resultDate[i], { day, time })) {
        arrayCheck.push(resultDate[i]);
      }
    }

    if (duration || typePitch) {
      if (duration) {
        const resultDuration = await PitchsModel.find({
          duration: { $in: [duration] },
          isActive: true,
        });

        for (let i = 0; i < resultDuration.length; i++) {
          if (checkDate(resultDuration[i], { day, time })) {
            if (checkHaveItem(arrayCheck, resultDuration[i]?._id)) {
              arrayCheck2.push(resultDuration[i]);
            }
          }
        }
      }

      const arrayCheck3 = duration ? arrayCheck2 : arrayCheck;

      if (typePitch) {
        const resultTypePitch = await PitchsModel.find({
          listPitchs: { $elemMatch: { pitch: typePitch } },
          isActive: true,
        });

        for (let i = 0; i < resultTypePitch.length; i++) {
          if (checkDate(resultTypePitch[i], { day, time })) {
            if (checkHaveItem(arrayCheck3, resultTypePitch[i]?._id)) {
              arrayResult.push(resultTypePitch[i]);
            }
          }
        }
      } else {
        arrayResult = arrayCheck2;
      }
    } else {
      arrayResult = arrayCheck;
    }
  }

  return arrayResult;
}

const checkDate = (pitch, date) => {
  const dayCompare = new Date(date?.day);
  const timeCompare = new Date("2023-02-18T" + date?.time).getTime();
  for (let i = 0; i < pitch?.listPitchs.length; i++) {
    for (let j = 0; j < pitch?.listPitchs[i]?.infoPitchs.length; j++) {
      const dayStart = new Date(pitch?.listPitchs[i]?.infoPitchs[j].day[0]);
      const dayEnd = new Date(pitch?.listPitchs[i]?.infoPitchs[j].day[1]);
      const timeStart = new Date(
        "2023-02-18T" + pitch?.listPitchs[i]?.infoPitchs[j].hour[0]
      ).getTime();
      const timeEnd = new Date(
        "2023-02-18T" + pitch?.listPitchs[i]?.infoPitchs[j].hour[1]
      ).getTime();

      if (dayCompare && timeCompare) {
        if (
          dayStart <= dayCompare &&
          dayCompare <= dayEnd &&
          timeStart <= timeCompare &&
          timeCompare <= timeEnd
        ) {
          return 1;
        }
      }
    }
  }

  return 0;
};

const checkHaveItem = (arrayResult, keyCheck) => {
  for (let i = 0; i < arrayResult.length; i++) {
    if (arrayResult[i]?._id.equals(keyCheck)) {
      return true;
    }
  }

  return false;
};

module.exports = { filterPitchs };
