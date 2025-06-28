const checkUserAccess = (requestedUserId, loggedInUserId) => {
  if (requestedUserId !== loggedInUserId) {
    throw {
      status: 403,
      message: "You are not authorized to access this user's data.",
    };
  }
};

module.exports = checkUserAccess;