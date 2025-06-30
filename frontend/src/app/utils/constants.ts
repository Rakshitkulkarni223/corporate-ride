const CONSTANTS = Object.freeze({
  AUTH_STATUS: {
    IDLE: 'IDLE',
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAIL: 'FAIL',
  },
  STORAGE_NAME: 'AccessToken'
});

const RIDE_OFFER_STATUS = Object.freeze({
  ACTIVE: "Active",
  COMPLETED: "Completed"
});

const RIDE_TYPE = Object.freeze({
  DEPARTURE: "Departure",
  RETURN: "Return",
});

export type RideType = keyof typeof RIDE_TYPE;

export {
  CONSTANTS,
  RIDE_OFFER_STATUS,
  RIDE_TYPE
}