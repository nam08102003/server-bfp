/** @format */

function filterTime(arrayTime, duration) {
  const arrayFilterTime = [];
  for (let i = 0; i < arrayTime.length; i++) {
    const timeCurrent = new Date("2023-02-18T" + arrayTime[i]?.time).getTime();
    const timeAfter = new Date(
      "2023-02-18T" + arrayTime[i + 1]?.time
    ).getTime();

    if (timeAfter - timeCurrent < Number(duration) * 60 * 1000) {
      continue;
    }

    arrayFilterTime.push(arrayTime[i]);
  }

  return arrayFilterTime;
}

module.exports = { filterTime };
