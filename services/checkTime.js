/** @format */

function checkTime(arrayTime, timeCheck) {
  for (let i = 1; i <= arrayTime.length; i++) {
    if (arrayTime[i - 1].time === timeCheck) {
      return i;
    }
  }

  return 0;
}

module.exports = { checkTime };
