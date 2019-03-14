module.exports.hotelConfig = (brandName, data) => {
  let newData = [];
  for(let i = 0, len = data.length; i < len; i ++) {
    if(data[i].brand === brandName) {
      newData.push(data[i]);
    }
  }
  return newData;
}