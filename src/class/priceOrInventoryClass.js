const INVENTORY = function(
  hotelId,
  roomTypeId,
  startDate,
  endDate,
  roomTypeName,
  count,
  soldOut,
  weekDayOf,
  checkAll
) {
  this.hotelId = hotelId || null; //"eddf1478667e162ac67d77b17060faa4",
  this.roomTypeId = roomTypeId || null; //"e659e48d97d3bc2d6bc0a18547f81873",
  this.startDate = startDate || null; //"2020-08-01",
  this.endDate = endDate || null; //"2020-08-20",
  this.roomTypeName = roomTypeName || null;
  this.count = count || ""; //1,
  this.soldOut = soldOut || false; //true,
  this.weekDayOf = weekDayOf || [0, 1, 2, 3, 4, 5, 6]; //["0-7"]
  this.checkAll = checkAll || true;

  this.timeStamp = new Date(this.startDate).getTime();
};

const SELLRATES = function(type, sellRate, sellRateTax) {
  this.type = type || ""; //"double"
  this.sellRate = sellRate || null; // 12221,
  this.sellRateTax = sellRateTax || ""; // 1
};

const PRICE = function(
  roomTypeId,
  ratePlanId,
  sellRates,
  startDate,
  endDate,
  roomTypeName,
  ratePlanType,
  blackout,
  weekDayOf,
  checkAll,
  commission,
  extraAdultPrice,
  extraChildPrice,
  checked
) {
  this.roomTypeId = roomTypeId || null; //"e659e48d97d3bc2d6bc0a18547f81873",
  this.ratePlanId = ratePlanId || null;
  this.sellRates = sellRates || [];
  this.startDate = startDate || null; //"2020-08-01",
  this.endDate = endDate || null; //"2020-08-20",
  this.roomTypeName = roomTypeName || null;
  this.ratePlanType = ratePlanType || null;
  this.blackout = blackout || 0;
  this.weekDayOf = weekDayOf || [0, 1, 2, 3, 4, 5, 6]; //["0-7"]
  this.checkAll = checkAll || true;
  this.commission = commission === 0 ? "0" : commission > 0 ? commission : null;
  this.extraAdultPrice = extraAdultPrice === 0 ? "0" : extraAdultPrice > 0 ? extraAdultPrice : null;
  this.extraChildPrice = extraChildPrice === 0 ? "0" : extraChildPrice > 0 ? extraChildPrice : null;
  this.timeStamp = new Date(this.startDate).getTime();
  this.checked = this.commission === "0" || this.commission > 0 ? true : false;
};

export { INVENTORY, PRICE, SELLRATES };
