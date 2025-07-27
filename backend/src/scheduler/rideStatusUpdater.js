const cron = require('node-cron');
const { updateExpiredRides } = require('../service/rideOffer.service');

/**
 * Scheduler that automatically updates ride statuses from Active to Completed
 * when their scheduled time has passed.
 */
const scheduleRideStatusUpdates = () => {
  try {
    // Schedule job to run every 2 minutes
    // Format: second(optional) minute hour day month weekday
    cron.schedule('*/2 * * * *', async () => {
      try {
        console.log('[Scheduler] Running scheduled ride status update job at:', new Date().toISOString());
        await updateExpiredRides();
        console.log('[Scheduler] Completed ride status update job');
      } catch (error) {
        console.error('[Scheduler] Error in scheduled ride status update:', error);
        // Log error but don't crash the scheduler
      }
    });
    
    console.log('Ride status update scheduler initialized');
    
    // Also run once immediately on server start
    try {
      updateExpiredRides();
    } catch (initialError) {
      console.error('[Scheduler] Error in initial ride status update:', initialError);
    }
  } catch (error) {
    console.error('[Scheduler] Failed to initialize ride status scheduler:', error);
  }
};

module.exports = { scheduleRideStatusUpdates };
