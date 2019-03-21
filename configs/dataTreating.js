module.exports.hotelConfig = (brandName, data) => {
  let newData = [];
  for(let i = 0, len = data.length; i < len; i ++) {
    if(data[i].brand === brandName) {
      newData.push(data[i]);
    }
  }
  return newData;
}
module.exports.orderConfig = (hotel, hotelArr) => {
  let tarIndex = hotelArr.findIndex(item => {
    return item.hotel === hotel;
  });
  hotelArr.splice(tarIndex, 1);
  return tarIndex >= 0 ? hotelArr
                       : tarIndex;
}