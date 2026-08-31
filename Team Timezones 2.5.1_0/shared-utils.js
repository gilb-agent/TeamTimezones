/**
 * Shared Utilities for Team Timezones Extension
 * This file contains functions and data used by both popup.js and options.js
 */

// Timezone to city name mapping
const TIMEZONE_TO_CITY = {
  // Americas
  'America/Los_Angeles': 'San Francisco',
  'America/New_York': 'New York',
  'America/Chicago': 'Chicago',
  'America/Denver': 'Denver',
  'America/Phoenix': 'Phoenix',
  'America/Anchorage': 'Anchorage',
  'Pacific/Honolulu': 'Honolulu',
  'America/Toronto': 'Toronto',
  'America/Vancouver': 'Vancouver',
  'America/Montreal': 'Montreal',
  'America/Edmonton': 'Calgary',
  'America/Mexico_City': 'Mexico City',
  'America/Sao_Paulo': 'São Paulo',
  'America/Buenos_Aires': 'Buenos Aires',
  'America/Santiago': 'Santiago',
  'America/Lima': 'Lima',
  'America/Bogota': 'Bogota',
  // Europe - Western & Central
  'Europe/London': 'London',
  'Europe/Dublin': 'Dublin',
  'Europe/Amsterdam': 'Amsterdam',
  'Europe/Brussels': 'Brussels',
  'Europe/Paris': 'Paris',
  'Europe/Berlin': 'Berlin',
  'Europe/Zurich': 'Zurich',
  'Europe/Vienna': 'Vienna',
  'Europe/Madrid': 'Madrid',
  'Europe/Lisbon': 'Lisbon',
  'Europe/Rome': 'Rome',
  // Europe - Northern
  'Europe/Helsinki': 'Helsinki',
  'Europe/Stockholm': 'Stockholm',
  'Europe/Oslo': 'Oslo',
  'Europe/Copenhagen': 'Copenhagen',
  // Europe - Eastern
  'Europe/Warsaw': 'Warsaw',
  'Europe/Prague': 'Prague',
  'Europe/Budapest': 'Budapest',
  'Europe/Athens': 'Athens',
  'Europe/Istanbul': 'Istanbul',
  // Middle East & Africa
  'Asia/Dubai': 'Dubai',
  'Asia/Riyadh': 'Riyadh',
  'Asia/Jerusalem': 'Tel Aviv',
  'Africa/Johannesburg': 'Johannesburg',
  'Africa/Cairo': 'Cairo',
  'Africa/Lagos': 'Lagos',
  'Africa/Nairobi': 'Nairobi',
  // Asia - South & Southeast
  'Asia/Kolkata': 'Mumbai',
  'Asia/Singapore': 'Singapore',
  'Asia/Kuala_Lumpur': 'Kuala Lumpur',
  'Asia/Jakarta': 'Jakarta',
  'Asia/Bangkok': 'Bangkok',
  'Asia/Manila': 'Manila',
  'Asia/Ho_Chi_Minh': 'Ho Chi Minh City',
  // Asia - East
  'Asia/Hong_Kong': 'Hong Kong',
  'Asia/Shanghai': 'Shanghai',
  'Asia/Taipei': 'Taipei',
  'Asia/Seoul': 'Seoul',
  'Asia/Tokyo': 'Tokyo',
  // Oceania
  'Australia/Sydney': 'Sydney',
  'Australia/Melbourne': 'Melbourne',
  'Australia/Brisbane': 'Brisbane',
  'Australia/Perth': 'Perth',
  'Pacific/Auckland': 'Auckland'
};

// Common timezones for dropdown
const COMMON_TIMEZONES = [
  // Americas - US & Canada
  { label: 'Los Angeles, USA', value: 'America/Los_Angeles' },
  { label: 'San Francisco, USA', value: 'America/Los_Angeles' },
  { label: 'Seattle, USA', value: 'America/Los_Angeles' },
  { label: 'Portland, USA', value: 'America/Los_Angeles' },
  { label: 'San Diego, USA', value: 'America/Los_Angeles' },
  { label: 'Las Vegas, USA', value: 'America/Los_Angeles' },
  { label: 'Denver, USA', value: 'America/Denver' },
  { label: 'Salt Lake City, USA', value: 'America/Denver' },
  { label: 'Phoenix, USA', value: 'America/Phoenix' },
  { label: 'Chicago, USA', value: 'America/Chicago' },
  { label: 'Dallas, USA', value: 'America/Chicago' },
  { label: 'Houston, USA', value: 'America/Chicago' },
  { label: 'Austin, USA', value: 'America/Chicago' },
  { label: 'Minneapolis, USA', value: 'America/Chicago' },
  { label: 'New Orleans, USA', value: 'America/Chicago' },
  { label: 'New York, USA', value: 'America/New_York' },
  { label: 'Washington DC, USA', value: 'America/New_York' },
  { label: 'Boston, USA', value: 'America/New_York' },
  { label: 'Philadelphia, USA', value: 'America/New_York' },
  { label: 'Atlanta, USA', value: 'America/New_York' },
  { label: 'Miami, USA', value: 'America/New_York' },
  { label: 'Detroit, USA', value: 'America/New_York' },
  { label: 'Charlotte, USA', value: 'America/New_York' },
  { label: 'Honolulu, USA', value: 'Pacific/Honolulu' },
  { label: 'Anchorage, USA', value: 'America/Anchorage' },
  { label: 'Toronto, Canada', value: 'America/Toronto' },
  { label: 'Vancouver, Canada', value: 'America/Vancouver' },
  { label: 'Montreal, Canada', value: 'America/Montreal' },
  { label: 'Calgary, Canada', value: 'America/Edmonton' },
  // Americas - Latin America
  { label: 'Mexico City, Mexico', value: 'America/Mexico_City' },
  { label: 'São Paulo, Brazil', value: 'America/Sao_Paulo' },
  { label: 'Buenos Aires, Argentina', value: 'America/Buenos_Aires' },
  { label: 'Santiago, Chile', value: 'America/Santiago' },
  { label: 'Lima, Peru', value: 'America/Lima' },
  { label: 'Bogota, Colombia', value: 'America/Bogota' },
  // Europe - Western & Central
  { label: 'London, UK', value: 'Europe/London' },
  { label: 'Dublin, Ireland', value: 'Europe/Dublin' },
  { label: 'Amsterdam, Netherlands', value: 'Europe/Amsterdam' },
  { label: 'Brussels, Belgium', value: 'Europe/Brussels' },
  { label: 'Paris, France', value: 'Europe/Paris' },
  { label: 'Berlin, Germany', value: 'Europe/Berlin' },
  { label: 'Frankfurt, Germany', value: 'Europe/Berlin' },
  { label: 'Zurich, Switzerland', value: 'Europe/Zurich' },
  { label: 'Vienna, Austria', value: 'Europe/Vienna' },
  { label: 'Madrid, Spain', value: 'Europe/Madrid' },
  { label: 'Barcelona, Spain', value: 'Europe/Madrid' },
  { label: 'Lisbon, Portugal', value: 'Europe/Lisbon' },
  { label: 'Rome, Italy', value: 'Europe/Rome' },
  { label: 'Milan, Italy', value: 'Europe/Rome' },
  // Europe - Northern
  { label: 'Helsinki, Finland', value: 'Europe/Helsinki' },
  { label: 'Stockholm, Sweden', value: 'Europe/Stockholm' },
  { label: 'Oslo, Norway', value: 'Europe/Oslo' },
  { label: 'Copenhagen, Denmark', value: 'Europe/Copenhagen' },
  // Europe - Eastern
  { label: 'Warsaw, Poland', value: 'Europe/Warsaw' },
  { label: 'Prague, Czech Republic', value: 'Europe/Prague' },
  { label: 'Budapest, Hungary', value: 'Europe/Budapest' },
  { label: 'Athens, Greece', value: 'Europe/Athens' },
  { label: 'Istanbul, Turkey', value: 'Europe/Istanbul' },
  // Middle East & Africa
  { label: 'Dubai, UAE', value: 'Asia/Dubai' },
  { label: 'Riyadh, Saudi Arabia', value: 'Asia/Riyadh' },
  { label: 'Tel Aviv, Israel', value: 'Asia/Jerusalem' },
  { label: 'Johannesburg, South Africa', value: 'Africa/Johannesburg' },
  { label: 'Cairo, Egypt', value: 'Africa/Cairo' },
  { label: 'Lagos, Nigeria', value: 'Africa/Lagos' },
  { label: 'Nairobi, Kenya', value: 'Africa/Nairobi' },
  // Asia - South & Southeast
  { label: 'Mumbai, India', value: 'Asia/Kolkata' },
  { label: 'Bangalore, India', value: 'Asia/Kolkata' },
  { label: 'New Delhi, India', value: 'Asia/Kolkata' },
  { label: 'Singapore', value: 'Asia/Singapore' },
  { label: 'Kuala Lumpur, Malaysia', value: 'Asia/Kuala_Lumpur' },
  { label: 'Jakarta, Indonesia', value: 'Asia/Jakarta' },
  { label: 'Bangkok, Thailand', value: 'Asia/Bangkok' },
  { label: 'Manila, Philippines', value: 'Asia/Manila' },
  { label: 'Ho Chi Minh City, Vietnam', value: 'Asia/Ho_Chi_Minh' },
  // Asia - East
  { label: 'Hong Kong', value: 'Asia/Hong_Kong' },
  { label: 'Shanghai, China', value: 'Asia/Shanghai' },
  { label: 'Beijing, China', value: 'Asia/Shanghai' },
  { label: 'Shenzhen, China', value: 'Asia/Shanghai' },
  { label: 'Taipei, Taiwan', value: 'Asia/Taipei' },
  { label: 'Seoul, South Korea', value: 'Asia/Seoul' },
  { label: 'Tokyo, Japan', value: 'Asia/Tokyo' },
  { label: 'Osaka, Japan', value: 'Asia/Tokyo' },
  // Oceania
  { label: 'Sydney, Australia', value: 'Australia/Sydney' },
  { label: 'Melbourne, Australia', value: 'Australia/Melbourne' },
  { label: 'Brisbane, Australia', value: 'Australia/Brisbane' },
  { label: 'Perth, Australia', value: 'Australia/Perth' },
  { label: 'Auckland, New Zealand', value: 'Pacific/Auckland' }
];

/**
 * Get a friendly city name from a timezone identifier
 * @param {string} timezone - IANA timezone identifier (e.g., "America/Los_Angeles")
 * @returns {string} Friendly city name (e.g., "San Francisco")
 */
function getCityNameFromTimezone(timezone) {
  return TIMEZONE_TO_CITY[timezone] || timezone.split('/').pop().replace(/_/g, ' ');
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} HTML-safe text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Validate if a date object is valid
 * @param {Date} date - Date object to validate
 * @returns {boolean} True if valid date
 */
function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate if a timezone string is valid
 * @param {string} timezone - IANA timezone identifier to validate
 * @returns {boolean} True if valid timezone
 */
function isValidTimezone(timezone) {
  if (!timezone || typeof timezone !== 'string') {
    return false;
  }

  try {
    // Try to format a date with this timezone
    new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(new Date());
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Safely parse a date string
 * @param {string} dateString - Date string to parse
 * @param {Date} fallback - Fallback date if parsing fails
 * @returns {Date} Parsed date or fallback
 */
function safeParseDate(dateString, fallback = new Date()) {
  try {
    const parsed = new Date(dateString);
    return isValidDate(parsed) ? parsed : fallback;
  } catch (e) {
    console.warn('Failed to parse date:', dateString, e);
    return fallback;
  }
}

/**
 * Calculate storage size of an object
 * @param {Object} obj - Object to measure
 * @returns {number} Size in bytes
 */
function getStorageSize(obj) {
  try {
    return JSON.stringify(obj).length;
  } catch (e) {
    console.error('Failed to calculate storage size:', e);
    return 0;
  }
}

/**
 * Show user-friendly error message
 * @param {string} message - Error message to display
 * @param {Error} error - Optional error object for logging
 */
function showErrorMessage(message, error = null) {
  if (error) {
    console.error(message, error);
  }

  // Try to show toast if available
  if (typeof showToast === 'function') {
    showToast(message);
  } else {
    // Fallback to alert
    alert(message);
  }
}
