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

const RIDE_REQUEST_STATUS = Object.freeze({
  SENT: "Sent",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected"
});

export type RideType = keyof typeof RIDE_TYPE;
export type RideRequestType = 'Accepted' | 'Rejected';

export {
  CONSTANTS,
  RIDE_OFFER_STATUS,
  RIDE_TYPE,
  RIDE_REQUEST_STATUS
}