/** @format */

function getMinMax(result) {
  const minMaxPrice = [];
  for (let i = 0; i < result.length; i++) {
    const arrayPrice = [];
    for (let j = 0; j < result[i]?.listPitchs.length; j++) {
      let listPitch = result[i]?.listPitchs[j];
      for (let x = 0; x < listPitch?.infoPitchs.length; x++) {
        const price = Number(listPitch?.infoPitchs[x]?.price);
        arrayPrice.push(price);
      }
    }
    minMaxPrice.push({
      minPrice: Number(Math.min(...arrayPrice)),
      maxPrice: Number(Math.max(...arrayPrice)),
    });
  }

  return minMaxPrice;
}

module.exports = { getMinMax };
