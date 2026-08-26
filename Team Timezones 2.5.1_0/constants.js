/**
 * Constants for Team Timezones Extension
 * All magic numbers and configuration values in one place
 */

const CONSTANTS = {
  // Time calculations
  MINUTES_PER_DAY: 1440,
  MINUTES_PER_HOUR: 60,
  SECONDS_PER_MINUTE: 60,
  MILLISECONDS_PER_SECOND: 1000,
  MILLISECONDS_PER_MINUTE: 60000,

  // Update intervals
  UPDATE_INTERVAL_MS: 60000, // Update every 1 minute

  // Slider settings
  SLIDER_STEP_MINUTES: 30,
  SLIDER_MIN: 0,
  SLIDER_MAX: 1440, // 24 hours in minutes

  // Debounce timings
  DEBOUNCE_CLICK_MS: 100,
  DEBOUNCE_RENDER_MS: 50,
  DEBOUNCE_SAVE_MS: 500,

  // UI feedback timings
  TOAST_DURATION_MS: 2000,
  LOADING_DURATION_MS: 400,
  SUCCESS_DURATION_MS: 1600,

  // Work hours definition
  WORK_HOURS_START: 9,  // 9 AM
  WORK_HOURS_END: 18,    // 6 PM
  NIGHT_HOURS_START: 22, // 10 PM
  NIGHT_HOURS_END: 6,    // 6 AM

  // Storage limits (Chrome sync storage)
  MAX_SYNC_STORAGE_BYTES: 102400, // 100KB total
  MAX_SYNC_ITEMS: 512,
  MAX_ITEM_SIZE_BYTES: 8192, // 8KB per item

  // Display limits
  MAX_TEAM_MEMBERS: 50, // Reasonable limit for display performance
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONSTANTS;
}
