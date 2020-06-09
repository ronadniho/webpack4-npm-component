import request from '@/assets/js/request'

//  blackout
export function BlackOutTable(hotelId, pageNum, pageSize) {
  return request({
    method: 'GET',
    url: `hotels/${hotelId}/black_out?pageNum=${pageNum}&pageSize=${pageSize}`
  });
}

// add
export function BlackOutAdd(hotelId, ratePlanId, param) {
  return request({
    method: 'PUT',
    url: `hotels/${hotelId}/rate_plans/${ratePlanId}`,
    data: param
  });
}

export function getRatePlan(hotelId) {
  return request({
    method: 'GET',
    url: `hotels/${hotelId}/rate_plans`,
  });
}

//edit
export function BlackOutEdit(hotelId, ratePlanId, blackOutId, param) {
  return request({
    method: 'PUT',
    url: `hotels/${hotelId}/rate_plans/${ratePlanId}/black_out/${blackOutId}`,
    data: param
  });
}

// delete
export function BlackOutDelete(hotelId, blackOutId) {
  return request({
    method: 'DELETE',
    url: `hotels/${hotelId}/black_out/${blackOutId}`,
  });
}

//cancel

//tablle
export function CancelTable(hotelId, pageNum, pageSize) {
  return request({
    method: 'GET',
    url: `hotels/${hotelId}/cancel_policy?pageNum=${pageNum}&pageSize=${pageSize}`
  });
}

// add
export function CancelAdd(hotelId, ratePlanId, param) {
  return request({
    method: 'PUT',
    url: `hotels/${hotelId}/rate_plans/${ratePlanId}/cancel_policy`,
    data: param
  });
}

// edit
export function CancelEdit(hotelId, ratePlanId, param) {
  return request({
    method: 'PUT',
    url: `hotels/${hotelId}/rate_plans/${ratePlanId}/cancel_policy/edit`,
    data: param
  });
}

//delete
export function CancelDelete(hotelId, policyId) {
  return request({
    method: 'DELETE',
    url: `hotels/${hotelId}/policy/${policyId}`,
  });
}


//  --------------- Rate & Inventory
export function RateInventoryTable(hotelId, pageNum, pageSize) {
  return request({
    method: 'GET',
    url: `hotels/${hotelId}/sell_rate?pageNum=${pageNum}&pageSize=${pageSize}`
  });
}

// inventory
export function AddInventory(hotelId, roomTypeId, param) {
  return request({
    method: 'PUT',
    url: `hotel/${hotelId}/room_type/${roomTypeId}/inventory`,
    data: param
  });
}

//delete
export function InventoryDelete(hotelId, sellRateId) {
  return request({
    method: 'DELETE',
    url: `hotels/${hotelId}/sell_rates/${sellRateId}`,
  });
}

//  Log
export function HotelListLog(hotelId) {
  return request({
    method: 'GET',
    url: `/operate_logs?hotelId=${hotelId}&appName=ebkCm`,
  });
}

export function queryRateInventory(hotelId, params) {
  return request({
    method: 'GET',
    url: `hotels/${hotelId}/ebk_rate_inventory`,
    params: params
  });
}

// ----------calendar inventory
export function AddCalendarInventory(hotelId, params) {
  return request({
    method: 'PUT',
    url: `hotels/${hotelId}/ebk_inventory`,
    data:params
  });
}

export function editSingleInventory(hotelId, params) {
  return request({
    method: 'PUT',
    url: `/hotels/${hotelId}/ebk_rate_inventory/single`,
    data: params
  })
}

export function editCalendarPrice(hotelId, params) {
  return request({
    method: 'PUT',
    url: `/hotels/${hotelId}/ebk_rate`,
    data: params
  })
}
