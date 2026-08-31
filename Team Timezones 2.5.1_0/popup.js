/**
 * Popup script for displaying team timezones
 * Uses shared-utils.js for common functions
 */

// Map timezones to countries for holiday checking
function getCountryFromTimezone(timezone) {
  const timezoneToCountry = {
    // US timezones
    'America/Los_Angeles': 'US',
    'America/Denver': 'US',
    'America/Chicago': 'US',
    'America/New_York': 'US',
    'America/Phoenix': 'US',
    'America/Anchorage': 'US',
    // Canada
    'America/Toronto': 'CA',
    'America/Vancouver': 'CA',
    'America/Montreal': 'CA',
    'America/Edmonton': 'CA',
    // Latin America
    'America/Mexico_City': 'MX',
    'America/Sao_Paulo': 'BR',
    'America/Buenos_Aires': 'AR',
    'America/Santiago': 'CL',
    'America/Lima': 'PE',
    'America/Bogota': 'CO',
    // Europe
    'Europe/London': 'GB',
    'Europe/Dublin': 'IE',
    'Europe/Amsterdam': 'NL',
    'Europe/Brussels': 'BE',
    'Europe/Paris': 'FR',
    'Europe/Berlin': 'DE',
    'Europe/Zurich': 'CH',
    'Europe/Vienna': 'AT',
    'Europe/Madrid': 'ES',
    'Europe/Lisbon': 'PT',
    'Europe/Rome': 'IT',
    'Europe/Helsinki': 'FI',
    'Europe/Stockholm': 'SE',
    'Europe/Oslo': 'NO',
    'Europe/Copenhagen': 'DK',
    'Europe/Warsaw': 'PL',
    'Europe/Prague': 'CZ',
    'Europe/Budapest': 'HU',
    'Europe/Athens': 'GR',
    'Europe/Istanbul': 'TR',
    // Middle East & Africa
    'Asia/Dubai': 'AE',
    'Asia/Riyadh': 'SA',
    'Asia/Jerusalem': 'IL',
    'Africa/Johannesburg': 'ZA',
    'Africa/Cairo': 'EG',
    'Africa/Lagos': 'NG',
    'Africa/Nairobi': 'KE',
    // Asia
    'Asia/Kolkata': 'IN',
    'Asia/Singapore': 'SG',
    'Asia/Kuala_Lumpur': 'MY',
    'Asia/Jakarta': 'ID',
    'Asia/Bangkok': 'TH',
    'Asia/Manila': 'PH',
    'Asia/Ho_Chi_Minh': 'VN',
    'Asia/Hong_Kong': 'HK',
    'Asia/Shanghai': 'CN',
    'Asia/Taipei': 'TW',
    'Asia/Seoul': 'KR',
    'Asia/Tokyo': 'JP',
    // Oceania
    'Australia/Sydney': 'AU',
    'Australia/Melbourne': 'AU',
    'Australia/Brisbane': 'AU',
    'Australia/Perth': 'AU',
    'Pacific/Auckland': 'NZ'
  };
  
  return timezoneToCountry[timezone] || null;
}

// Holiday database for major countries
function getHolidaysForCountry(country, year) {
  const holidays = {
    US: [
      { name: "New Year's Day", month: 0, date: 1, fixed: true },
      { name: "Martin Luther King Jr. Day", month: 0, week: 3, weekday: 1 }, // 3rd Monday of January
      { name: "Presidents' Day", month: 1, week: 3, weekday: 1 }, // 3rd Monday of February
      { name: "Memorial Day", month: 4, week: -1, weekday: 1 }, // Last Monday of May
      { name: "Independence Day", month: 6, date: 4, fixed: true },
      { name: "Labor Day", month: 8, week: 1, weekday: 1 }, // 1st Monday of September
      { name: "Columbus Day", month: 9, week: 2, weekday: 1 }, // 2nd Monday of October
      { name: "Veterans Day", month: 10, date: 11, fixed: true },
      { name: "Thanksgiving", month: 10, week: 4, weekday: 4 }, // 4th Thursday of November
      { name: "Christmas Day", month: 11, date: 25, fixed: true }
    ],
    CA: [
      { name: "New Year's Day", month: 0, date: 1, fixed: true },
      { name: "Family Day", month: 1, week: 3, weekday: 1 }, // 3rd Monday of February
      { name: "Good Friday", month: 2, easterOffset: -2 },
      { name: "Victoria Day", month: 4, week: -1, weekday: 1, before: 24 }, // Monday before May 24
      { name: "Canada Day", month: 6, date: 1, fixed: true },
      { name: "Civic Holiday", month: 7, week: 1, weekday: 1 }, // 1st Monday of August
      { name: "Labour Day", month: 8, week: 1, weekday: 1 }, // 1st Monday of September
      { name: "Thanksgiving", month: 9, week: 2, weekday: 1 }, // 2nd Monday of October
      { name: "Remembrance Day", month: 10, date: 11, fixed: true },
      { name: "Christmas Day", month: 11, date: 25, fixed: true },
      { name: "Boxing Day", month: 11, date: 26, fixed: true }
    ],
    GB: [
      { name: "New Year's Day", month: 0, date: 1, fixed: true },
      { name: "Good Friday", month: 2, easterOffset: -2 },
      { name: "Easter Monday", month: 2, easterOffset: 1 },
      { name: "Early May Bank Holiday", month: 4, week: 1, weekday: 1 }, // 1st Monday of May
      { name: "Spring Bank Holiday", month: 4, week: -1, weekday: 1 }, // Last Monday of May
      { name: "Summer Bank Holiday", month: 7, week: -1, weekday: 1 }, // Last Monday of August
      { name: "Christmas Day", month: 11, date: 25, fixed: true },
      { name: "Boxing Day", month: 11, date: 26, fixed: true }
    ],
    AU: [
      { name: "New Year's Day", month: 0, date: 1, fixed: true },
      { name: "Australia Day", month: 0, date: 26, fixed: true },
      { name: "Good Friday", month: 2, easterOffset: -2 },
      { name: "Easter Monday", month: 2, easterOffset: 1 },
      { name: "ANZAC Day", month: 3, date: 25, fixed: true },
      { name: "Queen's Birthday", month: 5, week: 2, weekday: 1 }, // 2nd Monday of June
      { name: "Christmas Day", month: 11, date: 25, fixed: true },
      { name: "Boxing Day", month: 11, date: 26, fixed: true }
    ],
    DE: [
      { name: "New Year's Day", month: 0, date: 1, fixed: true },
      { name: "Good Friday", month: 2, easterOffset: -2 },
      { name: "Easter Monday", month: 2, easterOffset: 1 },
      { name: "Labour Day", month: 4, date: 1, fixed: true },
      { name: "Ascension Day", month: 4, easterOffset: 39 },
      { name: "Whit Monday", month: 4, easterOffset: 50 },
      { name: "German Unity Day", month: 9, date: 3, fixed: true },
      { name: "Christmas Day", month: 11, date: 25, fixed: true },
      { name: "Boxing Day", month: 11, date: 26, fixed: true }
    ],
    FR: [
      { name: "New Year's Day", month: 0, date: 1, fixed: true },
      { name: "Easter Monday", month: 2, easterOffset: 1 },
      { name: "Labour Day", month: 4, date: 1, fixed: true },
      { name: "Victory in Europe Day", month: 4, date: 8, fixed: true },
      { name: "Ascension Day", month: 4, easterOffset: 39 },
      { name: "Whit Monday", month: 4, easterOffset: 50 },
      { name: "Bastille Day", month: 6, date: 14, fixed: true },
      { name: "Assumption Day", month: 7, date: 15, fixed: true },
      { name: "All Saints' Day", month: 10, date: 1, fixed: true },
      { name: "Armistice Day", month: 10, date: 11, fixed: true },
      { name: "Christmas Day", month: 11, date: 25, fixed: true }
    ],
    JP: [
      { name: "New Year's Day", month: 0, date: 1, fixed: true },
      { name: "Coming of Age Day", month: 0, week: 2, weekday: 1 }, // 2nd Monday of January
      { name: "National Foundation Day", month: 1, date: 11, fixed: true },
      { name: "Emperor's Birthday", month: 1, date: 23, fixed: true },
      { name: "Vernal Equinox Day", month: 2, date: 20, approx: true }, // Approximate
      { name: "Showa Day", month: 3, date: 29, fixed: true },
      { name: "Constitution Memorial Day", month: 4, date: 3, fixed: true },
      { name: "Greenery Day", month: 4, date: 4, fixed: true },
      { name: "Children's Day", month: 4, date: 5, fixed: true },
      { name: "Marine Day", month: 6, week: 3, weekday: 1 }, // 3rd Monday of July
      { name: "Mountain Day", month: 7, date: 11, fixed: true },
      { name: "Respect for the Aged Day", month: 8, week: 3, weekday: 1 }, // 3rd Monday of September
      { name: "Autumnal Equinox Day", month: 8, date: 23, approx: true }, // Approximate
      { name: "Health and Sports Day", month: 9, week: 2, weekday: 1 }, // 2nd Monday of October
      { name: "Culture Day", month: 10, date: 3, fixed: true },
      { name: "Labor Thanksgiving Day", month: 10, date: 23, fixed: true },
      { name: "Christmas Day", month: 11, date: 25, fixed: true } // Not a public holiday but widely observed
    ],
    IN: [
      { name: "Republic Day", month: 0, date: 26, fixed: true },
      { name: "Holi", month: 2, date: 25, approx: true }, // Approximate - varies by year
      { name: "Independence Day", month: 7, date: 15, fixed: true },
      { name: "Gandhi Jayanti", month: 9, date: 2, fixed: true },
      { name: "Diwali", month: 10, date: 12, approx: true } // Approximate - varies by year
    ],
    SG: [
      { name: "New Year's Day", month: 0, date: 1, fixed: true },
      { name: "Chinese New Year", month: 1, date: 10, approx: true }, // Approximate
      { name: "Good Friday", month: 2, easterOffset: -2 },
      { name: "Labour Day", month: 4, date: 1, fixed: true },
      { name: "Vesak Day", month: 4, date: 23, approx: true }, // Approximate
      { name: "Hari Raya Puasa", month: 3, date: 10, approx: true }, // Approximate
      { name: "National Day", month: 7, date: 9, fixed: true },
      { name: "Hari Raya Haji", month: 6, date: 17, approx: true }, // Approximate
      { name: "Deepavali", month: 10, date: 1, approx: true }, // Approximate
      { name: "Christmas Day", month: 11, date: 25, fixed: true }
    ]
  };
  
  return holidays[country] || [];
}

// Calculate Easter date (simplified - works for 1900-2099)
function calculateEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

// Get date for nth weekday of month (e.g., 3rd Monday)
function getNthWeekday(year, month, week, weekday) {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  let day = 1 + (weekday - firstWeekday + 7) % 7;
  if (week > 0) {
    day += (week - 1) * 7;
  } else {
    // Last week - find last occurrence
    const lastDay = new Date(year, month + 1, 0);
    const lastWeekday = lastDay.getDay();
    day = lastDay.getDate() - (lastWeekday - weekday + 7) % 7;
  }
  return new Date(year, month, day);
}

// Check if a date is a holiday in a country
function isHoliday(date, country) {
  if (!country) return null;
  
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const holidays = getHolidaysForCountry(country, year);
  
  // Calculate Easter for this year if needed
  let easter = null;
  const needsEaster = holidays.some(h => h.easterOffset !== undefined);
  if (needsEaster) {
    easter = calculateEaster(year);
  }
  
  for (const holiday of holidays) {
    let holidayDate;
    
    if (holiday.fixed && holiday.date) {
      holidayDate = new Date(year, holiday.month, holiday.date);
    } else if (holiday.easterOffset !== undefined && easter) {
      holidayDate = new Date(easter);
      holidayDate.setDate(holidayDate.getDate() + holiday.easterOffset);
    } else if (holiday.week !== undefined && holiday.weekday !== undefined) {
      holidayDate = getNthWeekday(year, holiday.month, holiday.week, holiday.weekday);
    } else {
      continue; // Skip holidays we can't calculate
    }
    
    // Compare dates (ignore time)
    if (holidayDate.getFullYear() === year &&
        holidayDate.getMonth() === month &&
        holidayDate.getDate() === day) {
      return holiday.name;
    }
  }
  
  return null;
}

function formatHour(hour) {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

/**
 * Resolve the effective work-hours window for a team member, falling back
 * to the global default when the member has no override set.
 * @param {Object} member - Team member object
 * @returns {{start: number, end: number}}
 */
function getEffectiveWorkHours(member) {
  const start = typeof member.workHoursStart === 'number'
    ? member.workHoursStart
    : CONSTANTS.WORK_HOURS_START;
  const end = typeof member.workHoursEnd === 'number'
    ? member.workHoursEnd
    : CONSTANTS.WORK_HOURS_END;
  return { start, end };
}

/**
 * Join a list of names into a readable phrase, capping how many are
 * spelled out so the summary line never runs on for large teams.
 * @param {string[]} names
 * @param {number} cap - Max names to spell out before switching to "and N more"
 * @returns {string}
 */
function joinNames(names, cap = 2) {
  if (names.length <= cap) {
    if (names.length === 1) return names[0];
    return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  }
  const shown = names.slice(0, cap);
  const remaining = names.length - cap;
  return `${shown.join(', ')} and ${remaining} more`;
}

/**
 * Build the one-line "who's in business hours right now" summary.
 * Always names the smaller/more useful side (the minority in business
 * hours, or the exceptions when most people are) so it stays a short,
 * readable sentence regardless of team size or which way it tips.
 * @param {string[]} businessNames - Names currently in business hours
 * @param {string[]} otherNames - Names currently outside business hours
 * @returns {string}
 */
function buildStatusSummary(businessNames, otherNames) {
  const total = businessNames.length + otherNames.length;
  if (total === 0) return '';
  if (businessNames.length === total) return "Everyone's in business hours right now";
  if (businessNames.length === 0) return 'Nobody\'s in business hours right now';

  if (businessNames.length <= otherNames.length) {
    const verb = businessNames.length === 1 ? 'is' : 'are';
    return `${joinNames(businessNames)} ${verb} in business hours`;
  }

  const verb = otherNames.length === 1 ? 'is' : 'are';
  return `Everyone except ${joinNames(otherNames)} ${verb} in business hours`;
}

/**
 * Format a Date as the compact UTC basic-format string Google Calendar's
 * quick-add link expects, e.g. "20260830T140000Z".
 * @param {Date} date
 * @returns {string}
 */
function formatDateForGoogleCalendar(date) {
  return date.toISOString().replace(/[-:]|\.\d{3}/g, '');
}

/**
 * Build a "quick add" calendar URL that opens a pre-filled event draft in
 * the browser — no OAuth, no extension permissions, the user just reviews
 * and saves it in whichever Google/Microsoft account is already signed in.
 * @param {'google'|'outlook'} provider
 * @param {{title: string, start: Date, end: Date, description: string}} event
 * @returns {string}
 */
function buildCalendarUrl(provider, { title, start, end, description }) {
  const encodedTitle = encodeURIComponent(title);
  const encodedDetails = encodeURIComponent(description);

  if (provider === 'outlook') {
    const startdt = encodeURIComponent(start.toISOString());
    const enddt = encodeURIComponent(end.toISOString());
    return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodedTitle}&startdt=${startdt}&enddt=${enddt}&body=${encodedDetails}`;
  }

  const dates = `${formatDateForGoogleCalendar(start)}/${formatDateForGoogleCalendar(end)}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${dates}&details=${encodedDetails}`;
}

function formatDateShort(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('list');
  const customControls = document.getElementById('customControls');
  const settingsBtn = document.getElementById('settingsBtn');
  const homeBaseEl = document.getElementById('homeBase');
  const homeTimeEl = document.getElementById('homeTime');
  const statusSummaryRowEl = document.getElementById('statusSummaryRow');
  const statusSummaryEl = document.getElementById('statusSummary');
  const copyMessageBtnEl = document.getElementById('copyMessageBtn');
  const scheduleBtnEl = document.getElementById('scheduleBtn');
  const scheduleMenuEl = document.getElementById('scheduleMenu');

  // Selection: a sticky subset of cities that scopes the summary/copy line
  // and unlocks "Suggest a time". Selection mode itself is a pure picker.
  const normalHeaderEl = document.getElementById('normalHeader');
  const selectModeHeaderEl = document.getElementById('selectModeHeader');
  const selectModeBtn = document.getElementById('selectModeBtn');
  const cancelSelectBtn = document.getElementById('cancelSelectBtn');
  const doneSelectBtn = document.getElementById('doneSelectBtn');
  const selectedCountEl = document.getElementById('selectedCount');
  const selectionFooterEl = document.getElementById('selectionFooter');
  const notSelectedNoteEl = document.getElementById('notSelectedNote');

  // Slider DOM references
  const timeSlider = document.getElementById('timeSlider');
  const sliderTimeDisplay = document.getElementById('sliderTimeDisplay');
  const sliderDateLabel = document.getElementById('sliderDateLabel');
  const sliderCityName = document.getElementById('sliderCityName');
  const decreaseTimeBtn = document.getElementById('decreaseTimeBtn');
  const increaseTimeBtn = document.getElementById('increaseTimeBtn');
  const sliderDatePicker = document.getElementById('sliderDatePicker');
  const datePickerLabel = document.getElementById('datePickerLabel');
  
  let team = [];
  let homeBase = null;
  let isCustomMode = false;
  let customDate = new Date();
  let sliderDate = new Date(); // Tracks the date for slider navigation
  let updateInterval = null;
  // State management
  let expandedIndex = null; // Currently expanded row index (null if none)
  let expandedRowDates = new Map(); // Custom dates keyed by timezone
  let quickTimes = [9, 12, 15, 18];
  let isRendering = false;
  let lastClickTime = 0;
  let pendingRender = null;
  let draggedSlider = null; // Track which slider is being dragged (outside render to persist)
  let currentShareMessage = ''; // Text the copy-message button will put on the clipboard
  let copyFeedbackTimeout = null;
  let calendarProvider = null; // null = ask which calendar; otherwise 'google' or 'outlook'
  let currentScheduleDate = null; // The moment currently shown, used as the event start
  let currentScheduleLines = []; // "8:02 AM in New York" style lines, one per line, for the event description
  let selectionMode = false; // Actively picking (checkboxes showing)
  let selectedTimezones = new Set(); // Committed/sticky selection, persisted to storage
  let pendingSelection = new Set(); // Working copy edited while selectionMode is on
  // Toggle settings
  let isDarkMode = null; // null = use system preference, true/false = override
  let use24HourFormat = false; // 24-hour time format (false = 12-hour)
  // Keyboard navigation
  let focusedRowIndex = null; // Currently focused row index (null = no focus, -1 = home base focus)

  // Load data with error handling
  chrome.storage.sync.get(['team', 'homeBase', 'quickTimes', 'isDarkMode', 'use24HourFormat', 'calendarProvider'], (result) => {
    // Check for Chrome runtime errors
    if (chrome.runtime.lastError) {
      console.error('Storage error:', chrome.runtime.lastError);
      showErrorMessage('Failed to load settings. Please try reopening the extension.');
      return;
    }

    // Validate and load team data
    if (result.team && Array.isArray(result.team) && result.team.length > 0) {
      // Validate each team member
      team = result.team.filter(member => {
        if (!member || typeof member !== 'object') return false;
        if (!member.name || !member.timezone) return false;
        if (!isValidTimezone(member.timezone)) {
          console.warn('Invalid timezone for member:', member);
          return false;
        }
        return true;
      });
    }
    
    // Validate and load home base
    if (result.homeBase && result.homeBase.timezone) {
      if (isValidTimezone(result.homeBase.timezone)) {
        homeBase = result.homeBase;
        // Ensure city name is set if missing
        if (!homeBase.city || homeBase.city === 'My Location') {
          homeBase.city = getCityNameFromTimezone(homeBase.timezone);
          chrome.storage.sync.set({ homeBase }, () => {
            if (chrome.runtime.lastError) {
              console.error('Failed to save home base:', chrome.runtime.lastError);
            }
          });
        }
      } else {
        console.warn('Invalid home base timezone:', result.homeBase.timezone);
        homeBase = null;
      }
    }

    // Set default home base if none exists or invalid
    if (!homeBase) {
      try {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        homeBase = {
          city: getCityNameFromTimezone(userTimezone),
          timezone: userTimezone
        };
        chrome.storage.sync.set({ homeBase }, () => {
          if (chrome.runtime.lastError) {
            console.error('Failed to save default home base:', chrome.runtime.lastError);
          }
        });
      } catch (e) {
        console.error('Failed to get user timezone:', e);
        // Fallback to UTC if all else fails
        homeBase = {
          city: 'UTC',
          timezone: 'UTC'
        };
      }
    }
    
    // Load quick times (kept for compatibility, not used in slider UI)
    if (result.quickTimes && Array.isArray(result.quickTimes) && result.quickTimes.length > 0) {
      quickTimes = result.quickTimes;
    }
    
    // Load toggle settings
    if (result.isDarkMode !== undefined) {
      isDarkMode = result.isDarkMode;
    }
    
    if (result.use24HourFormat !== undefined) {
      use24HourFormat = result.use24HourFormat;
    }

    if (result.calendarProvider) {
      calendarProvider = result.calendarProvider;
    }

    // Initialize toggles
    initializeToggles(result);
    applyDarkMode();

    // Load the sticky city selection (if any) before the first render, so
    // the summary/copy scope to it from the start rather than flashing
    // "everyone" first.
    chrome.storage.local.get(['selectedTimezones'], (localResult) => {
      if (!chrome.runtime.lastError && Array.isArray(localResult.selectedTimezones)) {
        selectedTimezones = new Set(localResult.selectedTimezones);
        reconcileSelection(team);
      }
      render();
    });

    // Update every minute
    updateInterval = setInterval(() => {
      if (!isCustomMode) {
      render();
      }
    }, CONSTANTS.UPDATE_INTERVAL_MS);
  });

  // Initialize toggle switches
  function initializeToggles(storageResult) {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const timeFormatToggle = document.getElementById('timeFormatToggle');
    
    if (darkModeToggle) {
      // If dark mode preference is not set, check system preference for initial toggle state
      // Toggle: checked (sun) = light mode, unchecked (moon) = dark mode
      // isDarkMode: true = dark mode, false = light mode
      // So: toggle.checked = !isDarkMode
      if (isDarkMode === null) {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        darkModeToggle.checked = !prefersDark; // Invert: sun (checked) = light, moon (unchecked) = dark
      } else {
        darkModeToggle.checked = !isDarkMode; // Invert: sun (checked) = light, moon (unchecked) = dark
      }
      
      darkModeToggle.addEventListener('change', (e) => {
        // Always override system preference when toggle is used
        // Invert: checked (sun) = light mode = isDarkMode false, unchecked (moon) = dark mode = isDarkMode true
        isDarkMode = !e.target.checked;
        chrome.storage.sync.set({ isDarkMode });
        applyDarkMode();
      });
    }
    
    if (timeFormatToggle) {
      timeFormatToggle.checked = use24HourFormat;
      timeFormatToggle.addEventListener('change', (e) => {
        use24HourFormat = e.target.checked;
        chrome.storage.sync.set({ use24HourFormat });
        render(); // Re-render to update all time displays
      });
    }
  }
  
  // Apply dark mode class to body
  function applyDarkMode() {
    // Always override system preference when isDarkMode is explicitly set
    if (isDarkMode === true) {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
      document.body.classList.remove('light-mode');
    } else if (isDarkMode === false) {
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
      document.body.classList.add('light-mode');
    } else {
      // If null, remove both classes and let CSS media query handle it
      document.documentElement.classList.remove('dark-mode', 'light-mode');
      document.body.classList.remove('dark-mode', 'light-mode');
    }
  }

  // Listen for storage changes (when options page updates)
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.team) {
      team = changes.team.newValue || [];
      reconcileSelection(team);
      render();
    }
    if (changes.homeBase) {
      homeBase = changes.homeBase.newValue;
      render();
    }
    if (changes.quickTimes) {
      quickTimes = changes.quickTimes.newValue || [9, 12, 15, 18];
      render();
    }
    if (changes.isDarkMode !== undefined) {
      isDarkMode = changes.isDarkMode.newValue;
      const darkModeToggle = document.getElementById('darkModeToggle');
      if (darkModeToggle) {
        // Toggle: checked (sun) = light mode, unchecked (moon) = dark mode
        // isDarkMode: true = dark mode, false = light mode
        // So: toggle.checked = !isDarkMode
        if (isDarkMode === null) {
          const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          darkModeToggle.checked = !prefersDark; // Invert: sun (checked) = light, moon (unchecked) = dark
        } else {
          darkModeToggle.checked = !isDarkMode; // Invert: sun (checked) = light, moon (unchecked) = dark
        }
      }
      applyDarkMode();
    }
    if (changes.use24HourFormat !== undefined) {
      use24HourFormat = changes.use24HourFormat.newValue;
      const timeFormatToggle = document.getElementById('timeFormatToggle');
      if (timeFormatToggle) {
        timeFormatToggle.checked = use24HourFormat;
      }
      render(); // Re-render to update all time displays
    }
    if (changes.calendarProvider !== undefined) {
      calendarProvider = changes.calendarProvider.newValue || null;
    }
  });

  // Event listeners
  settingsBtn.addEventListener('click', () => chrome.runtime.openOptionsPage());

  // Copy the current times as a plain-text message, e.g.
  // "It's 10:00 AM for me (Amsterdam), 9:00 AM in London, ..."
  if (copyMessageBtnEl) {
    copyMessageBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!currentShareMessage) return;

      navigator.clipboard.writeText(currentShareMessage).then(() => {
        copyMessageBtnEl.classList.add('copied');
        clearTimeout(copyFeedbackTimeout);
        copyFeedbackTimeout = setTimeout(() => {
          copyMessageBtnEl.classList.remove('copied');
        }, CONSTANTS.SUCCESS_DURATION_MS);
      }).catch((err) => {
        showErrorMessage('Could not copy to clipboard', err);
      });
    });
  }

  function closeScheduleMenu() {
    if (!scheduleMenuEl) return;
    scheduleMenuEl.classList.add('hidden');
    if (scheduleBtnEl) scheduleBtnEl.setAttribute('aria-expanded', 'false');
  }

  /**
   * Open a pre-filled "quick add" draft for the currently displayed moment
   * (real-time, a manually set slider time, or a "Suggest a time" result)
   * in the given calendar provider. No sign-in from the extension — the
   * user reviews and saves the draft in their own Google/Outlook tab.
   * @param {'google'|'outlook'} provider
   */
  function scheduleEvent(provider) {
    if (!currentScheduleDate || !currentScheduleLines.length) return;
    const start = new Date(currentScheduleDate);
    const end = new Date(start.getTime() + CONSTANTS.SCHEDULE_EVENT_DURATION_MINUTES * CONSTANTS.MILLISECONDS_PER_MINUTE);
    const url = buildCalendarUrl(provider, {
      title: 'Team Meeting',
      start,
      end,
      description: currentScheduleLines.join('\n')
    });
    chrome.tabs.create({ url });
  }

  if (scheduleBtnEl) {
    scheduleBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (calendarProvider) {
        scheduleEvent(calendarProvider);
        return;
      }
      // No preference saved yet — ask once, then remember the choice.
      // (Changing it later happens from Settings, not here.)
      if (!scheduleMenuEl) return;
      const isOpen = !scheduleMenuEl.classList.contains('hidden');
      if (isOpen) {
        closeScheduleMenu();
      } else {
        scheduleMenuEl.classList.remove('hidden');
        scheduleBtnEl.setAttribute('aria-expanded', 'true');
      }
    });
  }

  if (scheduleMenuEl) {
    scheduleMenuEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = e.target.closest('.schedule-menu-item');
      if (!item) return;
      const provider = item.dataset.provider;
      closeScheduleMenu();
      calendarProvider = provider;
      chrome.storage.sync.set({ calendarProvider: provider }, () => {
        if (chrome.runtime.lastError) {
          console.error('Failed to save calendar provider:', chrome.runtime.lastError);
        }
      });
      scheduleEvent(provider);
    });
  }

  // Close the provider popover on any click outside it
  document.addEventListener('click', closeScheduleMenu);

  /**
   * Drop any selected timezones that no longer belong to any current team
   * member (e.g. that city was deleted in Options). Without this, a stale
   * entry can silently persist forever — including, if every selected city
   * gets removed, hiding the entire row list with no visible cause.
   * @param {Object[]} currentTeam
   */
  function reconcileSelection(currentTeam) {
    if (!selectedTimezones.size) return;
    const validTimezones = new Set(currentTeam.map(m => m.timezone));
    const next = new Set([...selectedTimezones].filter(tz => validTimezones.has(tz)));
    if (next.size === selectedTimezones.size) return; // Nothing stale, nothing to save

    selectedTimezones = next;
    chrome.storage.local.set({ selectedTimezones: [...selectedTimezones] }, () => {
      if (chrome.runtime.lastError) {
        console.error('Failed to save reconciled selection:', chrome.runtime.lastError);
      }
    });
  }

  /** Refresh the "N selected" label while actively picking. */
  function updateSelectionUI() {
    if (selectedCountEl) {
      selectedCountEl.textContent = `${pendingSelection.size} selected`;
    }
  }

  /**
   * Open the picker. Pre-checks whatever's currently selected, so
   * reopening to tweak a selection doesn't lose it, and Cancel can
   * discard changes without touching the committed selection.
   */
  function enterSelectionMode() {
    if (!team.length) return;
    selectionMode = true;
    pendingSelection = new Set(selectedTimezones);
    // Collapse any expanded row/slider — the picker replaces it
    expandedIndex = null;
    if (isCustomMode) {
      isCustomMode = false;
      customControls.classList.add('hidden');
      homeBaseEl.classList.remove('expanded');
      customDate = new Date();
    }
    normalHeaderEl.classList.add('hidden');
    selectModeHeaderEl.classList.remove('hidden');
    updateSelectionUI();
    render();
  }

  function closeSelectionMode() {
    selectionMode = false;
    normalHeaderEl.classList.remove('hidden');
    selectModeHeaderEl.classList.add('hidden');
    render();
  }

  /** Discard any changes made while picking; the committed selection stands. */
  function cancelSelection() {
    pendingSelection = new Set();
    closeSelectionMode();
  }

  /** Commit the picker's choices as the new sticky selection. */
  function commitSelection() {
    selectedTimezones = new Set(pendingSelection);
    pendingSelection = new Set();
    chrome.storage.local.set({ selectedTimezones: [...selectedTimezones] }, () => {
      if (chrome.runtime.lastError) {
        console.error('Failed to save selection:', chrome.runtime.lastError);
      }
    });
    closeSelectionMode();
  }

  if (selectModeBtn) {
    selectModeBtn.addEventListener('click', enterSelectionMode);
  }
  if (cancelSelectBtn) {
    cancelSelectBtn.addEventListener('click', cancelSelection);
  }
  if (doneSelectBtn) {
    doneSelectBtn.addEventListener('click', commitSelection);
  }

  if (notSelectedNoteEl) {
    notSelectedNoteEl.addEventListener('click', enterSelectionMode);
    notSelectedNoteEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enterSelectionMode();
      }
    });
  }

  // Toggle custom time picker when clicking on home base
  homeBaseEl.addEventListener('click', () => {
    if (homeBaseEl.classList.contains('hidden') || isRendering) return;
    
    const wasExpanded = isCustomMode;
    
    // Collapse any expanded city row
    expandedIndex = null;
    
    isCustomMode = !wasExpanded;
    
    if (isCustomMode) {
      // Expand: set slider to current time
    const now = new Date();
      setSliderFromTime(now);
      customControls.classList.remove('hidden');
      homeBaseEl.classList.add('expanded');
      
      // Update city name in label
      if (homeBase && sliderCityName) {
        sliderCityName.textContent = homeBase.city || getCityNameFromTimezone(homeBase.timezone);
      }
    } else {
      // Collapse: reset to now
      customControls.classList.add('hidden');
      homeBaseEl.classList.remove('expanded');
      customDate = new Date();
    }
    
    render();
    
    // Scroll "Your Time" controls into view if expanded
    if (isCustomMode) {
      setTimeout(() => {
        if (customControls && !customControls.classList.contains('hidden')) {
          customControls.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
    }
  });
  
  // Prevent clicks on custom controls from triggering home base click
  customControls.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Keyboard navigation
  function handleKeyboardNavigation(e) {
    // Don't handle keyboard events if user is typing in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') {
      // Allow navigation if focused on a row (tabindex=0)
      if (!e.target.closest('.row') && !e.target.closest('.home-base')) {
        return;
      }
    }
    
    // Handle slider controls (left/right arrows) when slider is open
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Check if home base slider is open
      if (isCustomMode && customControls && !customControls.classList.contains('hidden')) {
        e.preventDefault();
        const step = CONSTANTS.SLIDER_STEP_MINUTES;
        if (!timeSlider) return;

        let value = parseInt(timeSlider.value, 10);
        value = e.key === 'ArrowLeft' ? value - step : value + step;

        // Handle day boundaries
        if (value < 0) {
          value = CONSTANTS.MINUTES_PER_DAY + value;
          sliderDate.setDate(sliderDate.getDate() - 1);
        } else if (value >= CONSTANTS.MINUTES_PER_DAY) {
          value = value - CONSTANTS.MINUTES_PER_DAY;
          sliderDate.setDate(sliderDate.getDate() + 1);
        }
        
        timeSlider.value = value;
        updateFromSlider();
        return;
      }
      
      // Check if a city slider is open
      if (expandedIndex !== null && expandedIndex >= 0 && expandedIndex < team.length) {
        e.preventDefault();
        const sortedTeam = [...team].sort((a, b) => {
          const hasOrderA = typeof a.order === 'number';
          const hasOrderB = typeof b.order === 'number';
          if (hasOrderA && hasOrderB) return a.order - b.order;
          if (hasOrderA) return -1;
          if (hasOrderB) return 1;
          const baseDate = isCustomMode ? customDate : new Date();
          const offsetA = getTimezoneOffset(baseDate, a.timezone);
          const offsetB = getTimezoneOffset(baseDate, b.timezone);
          return offsetA - offsetB;
        });

        const expandedMember = sortedTeam[expandedIndex];
        if (expandedMember) {
          const citySlider = listEl.querySelector(`.city-time-slider[data-timezone="${expandedMember.timezone}"]`);
          if (citySlider) {
            const step = CONSTANTS.SLIDER_STEP_MINUTES;
            let value = parseInt(citySlider.value, 10);
            value = e.key === 'ArrowLeft' ? value - step : value + step;

            // Handle day boundaries
            let dateTracker = expandedRowDates.get(expandedMember.timezone) || new Date();
            if (value < 0) {
              value = CONSTANTS.MINUTES_PER_DAY + value;
              dateTracker.setDate(dateTracker.getDate() - 1);
              expandedRowDates.set(expandedMember.timezone, dateTracker);
            } else if (value >= CONSTANTS.MINUTES_PER_DAY) {
              value = value - CONSTANTS.MINUTES_PER_DAY;
              dateTracker.setDate(dateTracker.getDate() + 1);
              expandedRowDates.set(expandedMember.timezone, dateTracker);
            }
            
            citySlider.value = value;
            updateCityTimeFromSlider(expandedMember.timezone);
            return;
          }
        }
      }
    }
    
    const sortedTeam = [...team].sort((a, b) => {
      const hasOrderA = typeof a.order === 'number';
      const hasOrderB = typeof b.order === 'number';
      if (hasOrderA && hasOrderB) return a.order - b.order;
      if (hasOrderA) return -1;
      if (hasOrderB) return 1;
      const baseDate = isCustomMode ? customDate : new Date();
      const offsetA = getTimezoneOffset(baseDate, a.timezone);
      const offsetB = getTimezoneOffset(baseDate, b.timezone);
      return offsetA - offsetB;
    });

    // Only indices that actually have a rendered row right now — a sticky
    // selection hides the rest, and focus must skip over them too, or it
    // silently gets stuck on a row that isn't there.
    const visibleIndices = sortedTeam
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => selectionMode || !selectedTimezones.size || selectedTimezones.has(m.timezone))
      .map(({ i }) => i);

    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (focusedRowIndex === null || focusedRowIndex === -1) {
          // Start from first visible row or home base
          if (visibleIndices.length > 0) {
            focusedRowIndex = visibleIndices[0];
          } else if (homeBase && !homeBaseEl.classList.contains('hidden')) {
            focusedRowIndex = -1;
          }
        } else {
          const pos = visibleIndices.indexOf(focusedRowIndex);
          if (pos === -1) {
            // Focus was on a row that's no longer visible — recover to the first one
            if (visibleIndices.length > 0) focusedRowIndex = visibleIndices[0];
          } else if (pos < visibleIndices.length - 1) {
            focusedRowIndex = visibleIndices[pos + 1];
          }
        }
        updateKeyboardFocus();
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (focusedRowIndex === null) {
          // Start from last visible row
          if (visibleIndices.length > 0) {
            focusedRowIndex = visibleIndices[visibleIndices.length - 1];
          } else if (homeBase && !homeBaseEl.classList.contains('hidden')) {
            focusedRowIndex = -1;
          }
        } else {
          const pos = visibleIndices.indexOf(focusedRowIndex);
          if (pos === -1) {
            // Focus was on a row that's no longer visible — recover to the last one
            if (visibleIndices.length > 0) focusedRowIndex = visibleIndices[visibleIndices.length - 1];
          } else if (pos > 0) {
            focusedRowIndex = visibleIndices[pos - 1];
          } else if (pos === 0 && homeBase && !homeBaseEl.classList.contains('hidden')) {
            focusedRowIndex = -1; // Move to home base
          }
        }
        updateKeyboardFocus();
        break;
        
      case 'Enter':
        e.preventDefault();
        if (focusedRowIndex === -1) {
          // Toggle home base expansion
          homeBaseEl.click();
        } else if (focusedRowIndex !== null && focusedRowIndex >= 0 && focusedRowIndex < sortedTeam.length) {
          // Toggle row expansion - find the row and trigger click
          const row = listEl.querySelector(`.row[data-index="${focusedRowIndex}"]`);
          if (row) {
            row.click();
          }
        }
        break;
        
      case ' ':
        e.preventDefault();
        if (focusedRowIndex === -1) {
          // Toggle home base expansion
          homeBaseEl.click();
        } else if (focusedRowIndex !== null && focusedRowIndex >= 0 && focusedRowIndex < sortedTeam.length) {
          // Toggle row expansion
          const row = listEl.querySelector(`.row[data-index="${focusedRowIndex}"]`);
          if (row) {
            row.click();
          }
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        // If the selection picker is open, Escape backs out of it the same
        // way Cancel does — same as every other open panel in this popup.
        if (selectionMode) {
          cancelSelection();
          break;
        }
        // Clear focus and collapse any expanded rows
        focusedRowIndex = null;
        if (expandedIndex !== null) {
          expandedIndex = null;
        }
        if (isCustomMode) {
          isCustomMode = false;
          customControls.classList.add('hidden');
          homeBaseEl.classList.remove('expanded');
          customDate = new Date();
        }
        updateKeyboardFocus();
        render();
        break;
    }
  }
  
  function updateKeyboardFocus() {
    // Scroll focused element into view
    if (focusedRowIndex === -1) {
      homeBaseEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (focusedRowIndex !== null && focusedRowIndex >= 0) {
      const row = listEl.querySelector(`.row[data-index="${focusedRowIndex}"]`);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    render();
  }
  
  // Add global keyboard listener
  document.addEventListener('keydown', handleKeyboardNavigation);
  
  // Clear focus when clicking with mouse
  document.addEventListener('mousedown', () => {
    if (focusedRowIndex !== null) {
      focusedRowIndex = null;
      render();
    }
  });
  
  // Slider event listeners - add null checks
  if (timeSlider) {
    timeSlider.addEventListener('input', () => {
      updateSliderDisplay();
    });

    timeSlider.addEventListener('change', () => {
      updateFromSlider();
    });
    
    // Ensure slider change fires on mouseup/touchend for "Your Time" slider
    timeSlider.addEventListener('mouseup', () => {
      updateFromSlider();
    });
    
    timeSlider.addEventListener('touchend', () => {
      updateFromSlider();
    });
  }

  if (decreaseTimeBtn) {
    decreaseTimeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!timeSlider) return;
      let value = parseInt(timeSlider.value, 10) - CONSTANTS.SLIDER_STEP_MINUTES;
      if (value < 0) {
        // Go to previous day
        value = CONSTANTS.MINUTES_PER_DAY + value;
        sliderDate.setDate(sliderDate.getDate() - 1);
      }
      timeSlider.value = value;
      updateFromSlider();
    });
  }

  if (increaseTimeBtn) {
    increaseTimeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!timeSlider) return;
      let value = parseInt(timeSlider.value, 10) + CONSTANTS.SLIDER_STEP_MINUTES;
      if (value >= CONSTANTS.MINUTES_PER_DAY) {
        // Go to next day
        value = value - CONSTANTS.MINUTES_PER_DAY;
        sliderDate.setDate(sliderDate.getDate() + 1);
      }
      timeSlider.value = value;
      updateFromSlider();
    });
  }

  // FIX #2: Date picker change handler (replaces "Today" button)
  if (sliderDatePicker) {
    sliderDatePicker.addEventListener('change', (e) => {
      e.stopPropagation();
      const selectedDate = new Date(e.target.value + 'T12:00:00');
      
      // Keep current time, change only date
      if (timeSlider) {
        const currentMinutes = parseInt(timeSlider.value, 10);
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;
        
        selectedDate.setHours(hours, minutes, 0, 0);
        sliderDate = selectedDate;
        customDate = new Date(sliderDate);
        
        updateSliderDisplay();
        render();
      }
    });
  }

  // Click on label opens date picker
  if (datePickerLabel && sliderDatePicker) {
    datePickerLabel.addEventListener('click', (e) => {
      e.stopPropagation();
      sliderDatePicker.showPicker();
    });
  }

  function showEmptyState() {
    listEl.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.5; margin-bottom: 16px;">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <h3 style="font-size: 16px; font-weight: 500; margin: 0 0 8px 0; color: var(--md-sys-color-on-surface);">Welcome to Team Timezones!</h3>
        <p style="margin: 0 0 20px 0;">Track time across your global team</p>
        <button id="addTeamBtn" class="primary-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Your First City
        </button>
        <p style="font-size: 11px; margin-top: 12px; opacity: 0.6;">💡 Tip: Try starting with New York, London, or Tokyo</p>
      </div>
    `;
    const btn = document.getElementById('addTeamBtn');
    if (btn) {
      btn.addEventListener('click', () => chrome.runtime.openOptionsPage());
    }
  }

  function updateFromSlider() {
    if (!timeSlider) return;

    const totalMinutes = parseInt(timeSlider.value, 10);
    const hours = Math.floor(totalMinutes / CONSTANTS.MINUTES_PER_HOUR);
    const minutes = totalMinutes % CONSTANTS.MINUTES_PER_HOUR;
    
    // Update sliderDate with new time
    sliderDate.setHours(hours, minutes, 0, 0);
    customDate = new Date(sliderDate);
    
    // Update display
    updateSliderDisplay();
    render();
  }

  function updateSliderDisplay() {
    if (!timeSlider || !sliderTimeDisplay) return;

    const totalMinutes = parseInt(timeSlider.value, 10);
    const hours = Math.floor(totalMinutes / CONSTANTS.MINUTES_PER_HOUR);
    const minutes = totalMinutes % CONSTANTS.MINUTES_PER_HOUR;
    
    // Format time (e.g., "3:00 PM")
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    sliderTimeDisplay.textContent = `${displayHour}:${displayMinutes} ${period}`;
    
    // Update date label
    const today = new Date();
    const isToday = sliderDate.toDateString() === today.toDateString();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = sliderDate.toDateString() === tomorrow.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = sliderDate.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      if (sliderDateLabel) sliderDateLabel.textContent = 'Today';
      if (datePickerLabel) datePickerLabel.textContent = 'Today ›';
    } else if (isTomorrow) {
      if (sliderDateLabel) sliderDateLabel.textContent = 'Tomorrow';
      if (datePickerLabel) datePickerLabel.textContent = 'Tomorrow ›';
    } else if (isYesterday) {
      if (sliderDateLabel) sliderDateLabel.textContent = 'Yesterday';
      if (datePickerLabel) datePickerLabel.textContent = 'Yesterday ›';
    } else {
      const dateStr = sliderDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      if (sliderDateLabel) sliderDateLabel.textContent = dateStr;
      if (datePickerLabel) datePickerLabel.textContent = dateStr + ' ›';
    }
    
    // FIX #2: Update the hidden date picker value
    if (sliderDatePicker) {
      sliderDatePicker.value = sliderDate.toISOString().split('T')[0];
    }
  }

  function setSliderFromTime(date) {
    if (!timeSlider) return;

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * CONSTANTS.MINUTES_PER_HOUR + minutes;
    timeSlider.value = totalMinutes;
    sliderDate = new Date(date);
    updateSliderDisplay();
  }
  
  function formatSliderTime(hours, minutes) {
    if (use24HourFormat) {
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${hours.toString().padStart(2, '0')}:${displayMinutes}`;
    } else {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHour}:${displayMinutes} ${period}`;
    }
  }
  
  function updateCityTimeFromSlider(timezone) {
    const slider = listEl.querySelector(`.city-time-slider[data-timezone="${timezone}"]`);
    if (!slider) return;

    const totalMinutes = parseInt(slider.value, 10);
    const hours = Math.floor(totalMinutes / CONSTANTS.MINUTES_PER_HOUR);
    const minutes = totalMinutes % CONSTANTS.MINUTES_PER_HOUR;
    
    // Get current date for timezone (or use expandedRowDates if tracking dates)
    let baseDate = expandedRowDates.get(timezone) || new Date();
    
    // Create date string in YYYY-MM-DD format
    const dateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(baseDate);
    
    const [year, month, day] = dateStr.split('-').map(Number);
    
    // Build the target date in that timezone
    let guessDate = new Date(year, month - 1, day, hours, minutes);
    
    // Adjust for timezone offset (same logic as updateCityCustomDate)
    let formattedTime = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(guessDate);
    
    let [formattedH, formattedM] = formattedTime.split(':').map(Number);
    let formattedMinutes = formattedH * CONSTANTS.MINUTES_PER_HOUR + formattedM;
    let desiredMinutes = hours * CONSTANTS.MINUTES_PER_HOUR + minutes;
    let diff = desiredMinutes - formattedMinutes;

    if (diff > CONSTANTS.MINUTES_PER_DAY / 2) diff -= CONSTANTS.MINUTES_PER_DAY;
    if (diff < -CONSTANTS.MINUTES_PER_DAY / 2) diff += CONSTANTS.MINUTES_PER_DAY;

    let adjustedDate = new Date(guessDate.getTime() + diff * CONSTANTS.MILLISECONDS_PER_MINUTE);
    
    // Fine-tune to handle DST edge cases
    formattedTime = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(adjustedDate);
    
    [formattedH, formattedM] = formattedTime.split(':').map(Number);
    formattedMinutes = formattedH * CONSTANTS.MINUTES_PER_HOUR + formattedM;
    diff = desiredMinutes - formattedMinutes;

    if (Math.abs(diff) > 1) {
      if (diff > CONSTANTS.MINUTES_PER_DAY / 2) diff -= CONSTANTS.MINUTES_PER_DAY;
      if (diff < -CONSTANTS.MINUTES_PER_DAY / 2) diff += CONSTANTS.MINUTES_PER_DAY;
      adjustedDate = new Date(adjustedDate.getTime() + diff * CONSTANTS.MILLISECONDS_PER_MINUTE);
    }
    
    expandedRowDates.set(timezone, adjustedDate);
    
    // FIX #4: CRITICAL - Set customDate so ALL cities recalculate their times
    customDate = adjustedDate;
    isCustomMode = true;
    
    // This re-renders ALL city times based on the new customDate
    render();
  }

  function render() {
    if (isRendering) return; // Prevent concurrent renders
    isRendering = true;

    try {
      if (!team.length) {
        showEmptyState();
        homeBaseEl.classList.add('hidden');
        if (statusSummaryRowEl) statusSummaryRowEl.classList.add('hidden');
        if (selectionFooterEl) selectionFooterEl.classList.add('hidden');
        if (selectModeBtn) selectModeBtn.disabled = true;
        currentScheduleDate = null;
        currentScheduleLines = [];
        isRendering = false;
        return;
      }

    // Calculate base date and sort team
    let baseDate = isCustomMode ? customDate : new Date();
    const sortedTeam = [...team].sort((a, b) => {
      const hasOrderA = typeof a.order === 'number';
      const hasOrderB = typeof b.order === 'number';

      if (hasOrderA && hasOrderB) {
        return a.order - b.order;
      }
      if (hasOrderA) return -1;
      if (hasOrderB) return 1;

      const offsetA = getTimezoneOffset(baseDate, a.timezone);
      const offsetB = getTimezoneOffset(baseDate, b.timezone);
      return offsetA - offsetB;
    });
    
    // Check if expanded city has a custom date set (get timezone from expanded index)
    // When a city is expanded and has a custom date, use it as the base date
    // This allows city-specific time adjustments to affect all other cities
    if (expandedIndex !== null && expandedIndex >= 0 && expandedIndex < sortedTeam.length) {
      const expandedMember = sortedTeam[expandedIndex];
      if (expandedMember && expandedRowDates.has(expandedMember.timezone)) {
        const expandedDate = expandedRowDates.get(expandedMember.timezone);
        // Use expanded date if it's set (it becomes the global reference time)
        baseDate = expandedDate;
        // Also update customDate to keep them in sync
        customDate = new Date(expandedDate);
        isCustomMode = true;
      }
    }
    
    // Show home base
    if (selectModeBtn) selectModeBtn.disabled = false;
    let homeSharePart = '';
    if (homeBase) {
      homeBaseEl.classList.remove('hidden');
      const homeTime = formatTime(baseDate, homeBase.timezone);
      homeTimeEl.textContent = homeTime;
      const homeCityEl = document.getElementById('homeCity');
      if (homeCityEl) {
        // Use stored city name, or derive from timezone if missing
        const cityName = homeBase.city && homeBase.city !== 'My Location'
          ? homeBase.city
          : getCityNameFromTimezone(homeBase.timezone);
        homeSharePart = `${homeTime} for me (${cityName})`;

        // Check for holiday in the home base country
        const country = getCountryFromTimezone(homeBase.timezone);
        const localDateStr = new Intl.DateTimeFormat('en-CA', {
          timeZone: homeBase.timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(baseDate);
        const [year, month, day] = localDateStr.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);
        const holidayName = country ? isHoliday(localDate, country) : null;
        const holidayIndicator = holidayName 
          ? '<span class="holiday-indicator" data-holiday="' + escapeHtml(holidayName) + '">🎉</span>' 
          : '';
        
        homeCityEl.innerHTML = escapeHtml(cityName) + holidayIndicator;
        
        // Add tooltip to home base if holiday exists
        if (holidayName) {
          const existingTooltip = homeBaseEl.querySelector('.holiday-tooltip');
          if (existingTooltip) {
            existingTooltip.remove();
          }
          const tooltip = document.createElement('span');
          tooltip.className = 'holiday-tooltip';
          tooltip.textContent = holidayName;
          homeBaseEl.insertBefore(tooltip, homeBaseEl.firstChild);
        } else {
          const existingTooltip = homeBaseEl.querySelector('.holiday-tooltip');
          if (existingTooltip) {
            existingTooltip.remove();
          }
        }
      }
      // Add keyboard focus class to home base
      if (focusedRowIndex === -1) {
        homeBaseEl.classList.add('keyboard-focused');
        homeBaseEl.setAttribute('tabindex', '0');
      } else {
        homeBaseEl.classList.remove('keyboard-focused');
        homeBaseEl.setAttribute('tabindex', '-1');
      }
    } else {
      homeBaseEl.classList.add('hidden');
    }

    let html = '';
    const businessHoursNames = [];
    const otherNames = [];
    const memberShareParts = [];

    sortedTeam.forEach((member, index) => {
      const isExpanded = expandedIndex === index;
      
      // For expanded rows, always use the stored date if available (which should be current time when opened)
      // If not available, use current time
      let rowDate;
      if (isExpanded) {
        if (expandedRowDates.has(member.timezone)) {
          rowDate = expandedRowDates.get(member.timezone);
        } else {
          // If no stored date, use current time
          const now = new Date();
          rowDate = now;
          // Store it for consistency
          expandedRowDates.set(member.timezone, now);
        }
      } else {
        rowDate = baseDate;
      }
      
      const timeString = formatTime(rowDate, member.timezone);
      const hour = getHourInTimezone(rowDate, member.timezone);
      const { start: workHoursStart, end: workHoursEnd } = getEffectiveWorkHours(member);
      const isWorkHours = hour >= workHoursStart && hour < workHoursEnd;
      const isNight = hour >= CONSTANTS.NIGHT_HOURS_START || hour < CONSTANTS.NIGHT_HOURS_END;

      // Use the moment reflected in this row (real-time or the currently
      // selected slider time) for the "who's in business hours" summary,
      // and for the shareable message (so copy always matches what's shown).
      // When a sticky selection is active, only selected cities count
      // toward the summary/copy.
      const isIncludedInSummary = !selectedTimezones.size || selectedTimezones.has(member.timezone);
      if (isIncludedInSummary) {
        (isWorkHours ? businessHoursNames : otherNames).push(member.name || member.city);
        memberShareParts.push(`${timeString} in ${member.name || member.city}`);
      }

      // While actively picking, every row must stay visible so it can be
      // checked/unchecked. Otherwise, an active selection hides the rest.
      const isRowVisible = selectionMode || isIncludedInSummary;
      
      // Calculate offset from home base (use baseDate for offset calculation)
      const offsetStr = getOffsetFromHomeBase(baseDate, member.timezone);
      
      // Get timezone abbreviation
      const namesLine = member.members && member.members.length
        ? member.members.join(', ')
        : member.city;
      
      const statusClass = isWorkHours ? 'work-hours' : isNight ? 'night' : 'off-hours';
      const isFocused = focusedRowIndex === index;
      const focusClass = isFocused ? 'keyboard-focused' : '';
      
      // Check for holiday in the country for this timezone
      const country = getCountryFromTimezone(member.timezone);
      // Get date in the timezone's local date (important for international date line)
      const localDateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: member.timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(rowDate);
      const [year, month, day] = localDateStr.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      const holidayName = country ? isHoliday(localDate, country) : null;
      const holidayIndicator = holidayName 
        ? '<span class="holiday-indicator" data-holiday="' + escapeHtml(holidayName) + '">🎉</span>' 
        : '';
      
      if (!isRowVisible) return;

      const isChecked = pendingSelection.has(member.timezone);
      html += `
        <div class="row ${statusClass} ${selectionMode ? 'selection-mode' : (isExpanded ? 'expanded clickable' : 'clickable')} ${focusClass}" data-timezone="${escapeHtml(member.timezone)}" data-index="${index}" tabindex="${isFocused ? '0' : '-1'}">
          ${holidayName ? '<span class="holiday-tooltip">' + escapeHtml(holidayName) + '</span>' : ''}
          ${selectionMode ? `<input type="checkbox" class="row-select-checkbox" data-timezone="${escapeHtml(member.timezone)}" aria-label="Select ${escapeHtml(member.name)}" ${isChecked ? 'checked' : ''}>` : ''}
          <div class="person">
            <span class="name">${escapeHtml(member.name)}${holidayIndicator}</span>
            <span class="sub">${escapeHtml(namesLine)}</span>
          </div>
          <div class="time-data">
            <div class="time">${timeString}</div>
            <div class="diff">${offsetStr}</div>
          </div>
        </div>
        ${isExpanded ? (() => {
          // Get time in target timezone
          const tzTimeStr = new Intl.DateTimeFormat('en-US', {
            timeZone: member.timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).format(rowDate);
          const [tzHours, tzMinutes] = tzTimeStr.split(':').map(Number);
          const totalMinutes = tzHours * 60 + tzMinutes;
          
          // Format date label
          const today = new Date();
          const isToday = rowDate.toDateString() === today.toDateString();
          const dateLabel = isToday ? 'Today' : formatDateShort(rowDate);
          
          // Get date string for date picker
          const dateStr = new Intl.DateTimeFormat('en-CA', {
            timeZone: member.timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(rowDate);
          
          return `
        <div class="city-slider-controls ${statusClass}" data-timezone="${escapeHtml(member.timezone)}">
          <div class="slider-time-label">Set Time in <span>${escapeHtml(member.city || member.name)}</span></div>
          <div class="slider-wrapper">
            <button class="slider-btn city-decrease-btn" data-timezone="${escapeHtml(member.timezone)}" aria-label="Decrease time">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <input type="range" class="time-slider city-time-slider" data-timezone="${escapeHtml(member.timezone)}" min="0" max="1440" step="30" value="${totalMinutes}">
            <button class="slider-btn city-increase-btn" data-timezone="${escapeHtml(member.timezone)}" aria-label="Increase time">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          <div class="slider-time-display">
            <div class="slider-current-time city-slider-display" data-timezone="${escapeHtml(member.timezone)}">${formatSliderTime(tzHours, tzMinutes)}</div>
            <div class="slider-date-control">
              <input type="date" class="slider-date-picker city-date-picker" data-timezone="${escapeHtml(member.timezone)}" value="${dateStr}">
              <label class="date-picker-link city-date-picker-label" data-timezone="${escapeHtml(member.timezone)}">${dateLabel} ›</label>
            </div>
          </div>
        </div>
        `;
        })() : ''}
      `;
    });

    listEl.innerHTML = html;

    if (statusSummaryEl) {
      const summaryText = buildStatusSummary(businessHoursNames, otherNames);
      statusSummaryEl.textContent = summaryText;
    }
    if (statusSummaryRowEl) {
      statusSummaryRowEl.classList.toggle('hidden', !memberShareParts.length);
    }

    // Build the shareable message from the same data just rendered, so
    // what gets copied always matches what's on screen.
    const shareParts = homeSharePart ? [homeSharePart, ...memberShareParts] : memberShareParts;
    currentShareMessage = shareParts.length ? `It's ${shareParts.join(', ')}` : '';
    currentScheduleDate = baseDate;
    currentScheduleLines = shareParts;
    if (copyMessageBtnEl) {
      copyMessageBtnEl.title = currentShareMessage
        ? `Copy: "${currentShareMessage}"`
        : 'Copy times as a message';
    }

    // Sticky-selection footer: only exists at all once a selection is set.
    if (selectionFooterEl) {
      const hasSelection = selectedTimezones.size > 0 && !selectionMode;
      selectionFooterEl.classList.toggle('hidden', !hasSelection);

      if (hasSelection) {
        const notSelectedNames = team
          .filter(m => !selectedTimezones.has(m.timezone))
          .map(m => m.name || m.city);

        if (notSelectedNoteEl) {
          notSelectedNoteEl.classList.toggle('hidden', !notSelectedNames.length);
          if (notSelectedNames.length) {
            const verb = notSelectedNames.length === 1 ? 'is' : 'are';
            notSelectedNoteEl.textContent = `${joinNames(notSelectedNames)} ${verb} not selected`;
          }
        }
      }
    }

    // Prevent clicks on holiday indicator from triggering row expansion
    listEl.querySelectorAll('.holiday-indicator').forEach(indicator => {
      indicator.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      indicator.addEventListener('mousedown', (e) => {
        e.stopPropagation();
      });
    });
    
    // Use event delegation - remove existing handler if present
    if (listEl._rowClickHandler) {
      listEl.removeEventListener('click', listEl._rowClickHandler);
    }
    
    // Create a single click handler for all rows
    listEl._rowClickHandler = (e) => {
      // In selection mode, a row click toggles that city instead of
      // expanding it — handled entirely separately from the normal flow.
      const selectionRow = e.target.closest('.row.selection-mode');
      if (selectionRow) {
        const timezone = selectionRow.dataset.timezone;
        if (!timezone) return;
        const checkbox = selectionRow.querySelector('.row-select-checkbox');

        if (e.target === checkbox) {
          // The checkbox already toggled itself natively — just sync our
          // state to it. Calling preventDefault() here would make the
          // browser revert the native toggle, which is what caused
          // clicks to silently not register.
          if (checkbox.checked) {
            pendingSelection.add(timezone);
          } else {
            pendingSelection.delete(timezone);
          }
        } else {
          // Clicked elsewhere on the row — toggle manually.
          e.preventDefault();
          if (pendingSelection.has(timezone)) {
            pendingSelection.delete(timezone);
          } else {
            pendingSelection.add(timezone);
          }
          if (checkbox) checkbox.checked = pendingSelection.has(timezone);
        }
        updateSelectionUI();
        return;
      }

      // Don't trigger if clicking on inputs/buttons inside slider controls
      if (e.target.closest('.city-slider-controls')) return;
      if (isRendering) return; // Prevent concurrent actions

      // Debounce rapid clicks
      const now = Date.now();
      if (now - lastClickTime < CONSTANTS.DEBOUNCE_CLICK_MS) return;
      lastClickTime = now;

      // Find the clicked row
      const row = e.target.closest('.row.clickable');
      if (!row) return;
      
      const timezone = row.dataset.timezone;
      if (!timezone) return;
      
      // Prevent default and stop propagation
      e.preventDefault();
      e.stopPropagation();
      
      // Cancel any pending render
      if (pendingRender) {
        clearTimeout(pendingRender);
        pendingRender = null;
      }
      
      // Get the row index from data-index attribute
      const clickedIndex = parseInt(row.dataset.index, 10);
      if (isNaN(clickedIndex)) return;
      
      const wasExpanded = expandedIndex === clickedIndex;
      
      // Collapse "Your Time" if it's expanded
      if (isCustomMode) {
        isCustomMode = false;
        customControls.classList.add('hidden');
        homeBaseEl.classList.remove('expanded');
        customDate = new Date();
      }
      
      // Toggle expansion
      if (wasExpanded) {
        expandedIndex = null;
        // Clear the stored date when collapsing so it resets to current time next time
        expandedRowDates.delete(timezone);
      } else {
        expandedIndex = clickedIndex;
        // Always set to current time when opening - store the current Date object
        // The Date object will be formatted using the target timezone when rendering
        const now = new Date();
        // Always reset to current time when opening (overwrite any previous value)
        expandedRowDates.set(timezone, now);
      }
      
      // Debounce render and scroll expanded row into view
      pendingRender = setTimeout(() => {
        pendingRender = null;
        render();
        setTimeout(() => {
          const expandedRow = listEl.querySelector('.row.expanded');
          if (expandedRow) {
            expandedRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, CONSTANTS.DEBOUNCE_RENDER_MS);
      }, CONSTANTS.DEBOUNCE_RENDER_MS);
    };
    
    // Attach the single event listener to the container
    listEl.addEventListener('click', listEl._rowClickHandler);
    
    // City slider controls event delegation
    if (listEl._sliderHandler) {
      listEl.removeEventListener('input', listEl._sliderHandler);
      listEl.removeEventListener('change', listEl._sliderHandler);
      listEl.removeEventListener('click', listEl._sliderHandler);
    }
    
    listEl._sliderHandler = (e) => {
      if (isRendering) return;
      
      const timezone = e.target.dataset.timezone || e.target.closest('[data-timezone]')?.dataset.timezone;
      if (!timezone) return;
      
      e.stopPropagation();
      
      // Handle slider input (real-time preview)
      if (e.target.classList.contains('city-time-slider') && e.type === 'input') {
        const slider = e.target;
        const totalMinutes = parseInt(slider.value, 10);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        // Update display only (preview)
        const display = listEl.querySelector(`.city-slider-display[data-timezone="${timezone}"]`);
        if (display) {
          display.textContent = formatSliderTime(hours, minutes);
        }
        return;
      }
      
      // Handle slider change (commit and sync all cities)
      // Note: city-date-picker changes are handled by _datePickerChangeHandler
      if (e.target.classList.contains('city-time-slider') && e.type === 'change') {
        updateCityTimeFromSlider(timezone);
        return;
      }
      
      // Handle decrease/increase buttons
      if (e.target.closest('.city-decrease-btn') || e.target.closest('.city-increase-btn')) {
        const btn = e.target.closest('.slider-btn');
        const slider = listEl.querySelector(`.city-time-slider[data-timezone="${timezone}"]`);
        if (!slider) return;

        let value = parseInt(slider.value, 10);
        const isIncrease = btn.classList.contains('city-increase-btn');
        value = isIncrease ? value + CONSTANTS.SLIDER_STEP_MINUTES : value - CONSTANTS.SLIDER_STEP_MINUTES;

        // Handle day boundaries
        const dateTracker = expandedRowDates.get(timezone) || new Date();
        if (value < 0) {
          value = CONSTANTS.MINUTES_PER_DAY + value;
          dateTracker.setDate(dateTracker.getDate() - 1);
          expandedRowDates.set(timezone, dateTracker);
        }
        if (value >= CONSTANTS.MINUTES_PER_DAY) {
          value = value - CONSTANTS.MINUTES_PER_DAY;
          dateTracker.setDate(dateTracker.getDate() + 1);
          expandedRowDates.set(timezone, dateTracker);
        }
        
        slider.value = value;
        
        // Update display immediately
        const hours = Math.floor(value / 60);
        const minutes = value % 60;
        const display = listEl.querySelector(`.city-slider-display[data-timezone="${timezone}"]`);
        if (display) {
          display.textContent = formatSliderTime(hours, minutes);
        }
        
        // FIX #4: Trigger change to update ALL cities
        updateCityTimeFromSlider(timezone);
        return;
      }
      
      // Handle date picker label click
      if (e.target.closest('.city-date-picker-label')) {
        e.stopPropagation();
        const label = e.target.closest('.city-date-picker-label');
        const picker = listEl.querySelector(`.city-date-picker[data-timezone="${label.dataset.timezone}"]`);
        if (picker) {
          picker.showPicker();
        }
        return;
      }
    };
    
    // Remove old event listeners before adding new ones
    if (listEl._mousedownHandler) {
      listEl.removeEventListener('mousedown', listEl._mousedownHandler);
    }
    if (listEl._touchstartHandler) {
      listEl.removeEventListener('touchstart', listEl._touchstartHandler);
    }
    if (listEl._mouseupHandler) {
      listEl.removeEventListener('mouseup', listEl._mouseupHandler);
    }
    if (listEl._touchendHandler) {
      listEl.removeEventListener('touchend', listEl._touchendHandler);
    }
    if (listEl._mouseleaveHandler) {
      listEl.removeEventListener('mouseleave', listEl._mouseleaveHandler);
    }
    if (listEl._datePickerChangeHandler) {
      listEl.removeEventListener('change', listEl._datePickerChangeHandler);
    }
    
    // Add slider event handlers
    listEl.addEventListener('input', listEl._sliderHandler);
    listEl.addEventListener('change', listEl._sliderHandler);
    listEl.addEventListener('click', listEl._sliderHandler);
    
    // Track which slider is being dragged for mouseup/touchend
    listEl._mousedownHandler = (e) => {
      if (e.target.classList.contains('city-time-slider')) {
        draggedSlider = e.target;
      }
    };
    
    listEl._touchstartHandler = (e) => {
      if (e.target.classList.contains('city-time-slider')) {
        draggedSlider = e.target;
      }
    };
    
    // Ensure slider change fires on mouseup/touchend for proper synchronization
    listEl._mouseupHandler = (e) => {
      if (draggedSlider && draggedSlider.classList.contains('city-time-slider')) {
        const timezone = draggedSlider.dataset.timezone;
        if (timezone) {
          // Trigger synchronization to update all cities
          updateCityTimeFromSlider(timezone);
        }
        draggedSlider = null;
      }
    };
    
    listEl._touchendHandler = (e) => {
      if (draggedSlider && draggedSlider.classList.contains('city-time-slider')) {
        const timezone = draggedSlider.dataset.timezone;
        if (timezone) {
          // Trigger synchronization to update all cities
          updateCityTimeFromSlider(timezone);
        }
        draggedSlider = null;
      }
    };
    
    // Also handle mouseleave in case user drags outside
    listEl._mouseleaveHandler = () => {
      if (draggedSlider && draggedSlider.classList.contains('city-time-slider')) {
        const timezone = draggedSlider.dataset.timezone;
        if (timezone) {
          updateCityTimeFromSlider(timezone);
        }
        draggedSlider = null;
      }
    };
    
    // City date picker change handler (merged into single handler)
    listEl._datePickerChangeHandler = (e) => {
      if (e.target.classList.contains('city-date-picker')) {
        e.stopPropagation();
        const timezone = e.target.dataset.timezone;
        const selectedDate = new Date(e.target.value + 'T12:00:00');
        
        // Get current slider time
        const slider = listEl.querySelector(`.city-time-slider[data-timezone="${timezone}"]`);
        if (slider) {
          const currentMinutes = parseInt(slider.value, 10);
          const hours = Math.floor(currentMinutes / 60);
          const minutes = currentMinutes % 60;
          
          selectedDate.setHours(hours, minutes, 0, 0);
          expandedRowDates.set(timezone, selectedDate);
          
          // Update date label
          const label = listEl.querySelector(`.city-date-picker-label[data-timezone="${timezone}"]`);
          const dateLabel = listEl.querySelector(`.city-date-label[data-timezone="${timezone}"]`);
          const today = new Date();
          const isToday = selectedDate.toDateString() === today.toDateString();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const isTomorrow = selectedDate.toDateString() === tomorrow.toDateString();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const isYesterday = selectedDate.toDateString() === yesterday.toDateString();
          
          let dateStr;
          if (isToday) {
            dateStr = 'Today';
          } else if (isTomorrow) {
            dateStr = 'Tomorrow';
          } else if (isYesterday) {
            dateStr = 'Yesterday';
          } else {
            dateStr = selectedDate.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            });
          }
          
          if (label) label.textContent = dateStr + ' ›';
          if (dateLabel) dateLabel.textContent = dateStr;
          
          // FIX #4: Update ALL cities
          updateCityTimeFromSlider(timezone);
        }
      }
    };
    
      // Attach all event listeners
      listEl.addEventListener('mousedown', listEl._mousedownHandler);
      listEl.addEventListener('touchstart', listEl._touchstartHandler);
      listEl.addEventListener('mouseup', listEl._mouseupHandler);
      listEl.addEventListener('touchend', listEl._touchendHandler);
      listEl.addEventListener('mouseleave', listEl._mouseleaveHandler);
      listEl.addEventListener('change', listEl._datePickerChangeHandler);

      isRendering = false;
    } catch (error) {
      console.error('Error during render:', error);
      isRendering = false;

      // Show error message to user
      listEl.innerHTML = `
        <div class="empty-state">
          <p style="color: var(--md-sys-color-error);">⚠️ Something went wrong</p>
          <p style="font-size: 11px; margin-bottom: 16px;">Unable to display timezones. Please try reloading the extension.</p>
          <button id="reloadBtn" class="primary-btn">Reload Extension</button>
        </div>
      `;

      const reloadBtn = document.getElementById('reloadBtn');
      if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
          window.location.reload();
        });
      }
    }
  }

  function formatTime(date, timezone) {
    try {
      // Validate inputs
      if (!isValidDate(date)) {
        console.warn('Invalid date in formatTime:', date);
        return '--:--';
      }

      if (!isValidTimezone(timezone)) {
        console.warn('Invalid timezone in formatTime:', timezone);
        return '--:--';
      }

      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: !use24HourFormat
      }).format(date);
    } catch (e) {
      console.error('Error formatting time:', e, { date, timezone });
      return '--:--';
    }
  }

  function getHourInTimezone(date, timezone) {
    try {
      // Validate inputs
      if (!isValidDate(date)) {
        console.warn('Invalid date in getHourInTimezone:', date);
        return 12; // Default to noon
      }

      if (!isValidTimezone(timezone)) {
        console.warn('Invalid timezone in getHourInTimezone:', timezone);
        return 12;
      }

      const hourStr = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        hour12: false
      }).format(date);
      const hour = parseInt(hourStr, 10);

      // Validate result
      if (isNaN(hour) || hour < 0 || hour > 23) {
        console.warn('Invalid hour result:', hour);
        return 12;
      }

      return hour;
    } catch (e) {
      console.error('Error getting hour in timezone:', e, { date, timezone });
      return 12;
    }
  }

  function getTimezoneOffset(date, timezone) {
    try {
      // Validate inputs
      if (!isValidDate(date)) {
        console.warn('Invalid date in getTimezoneOffset:', date);
        return 0;
      }

      if (!isValidTimezone(timezone)) {
        console.warn('Invalid timezone in getTimezoneOffset:', timezone);
        return 0;
      }

      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));

      if (!isValidDate(utcDate) || !isValidDate(tzDate)) {
        console.warn('Failed to convert dates for offset calculation');
        return 0;
      }

      return tzDate.getTime() - utcDate.getTime();
    } catch (e) {
      console.error('Error calculating timezone offset:', e, { date, timezone });
      return 0;
    }
  }

  function getOffsetFromHomeBase(date, timezone) {
    if (!homeBase) {
      return getOffsetString(timezone);
    }
    
    try {
      const homeHour = getHourInTimezone(date, homeBase.timezone);
      const tzHour = getHourInTimezone(date, timezone);
      
      // Get date strings in both timezones to check if it's tomorrow
      const homeDateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: homeBase.timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
      
      const tzDateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
      
      // Parse dates for comparison
      const [homeYear, homeMonth, homeDay] = homeDateStr.split('-').map(Number);
      const [tzYear, tzMonth, tzDay] = tzDateStr.split('-').map(Number);
      const homeDate = new Date(homeYear, homeMonth - 1, homeDay);
      const tzDate = new Date(tzYear, tzMonth - 1, tzDay);
      
      // Check if target timezone is tomorrow
      const tomorrow = new Date(homeDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isTomorrow = tzDate.getTime() === tomorrow.getTime();
      
      let diff = tzHour - homeHour;
      
      // Handle day boundaries
      if (diff > 12) diff -= 24;
      if (diff < -12) diff += 24;
      
      if (diff === 0) return 'Same time';
      
      const sign = diff > 0 ? '+' : '';
      const offsetStr = `${sign}${diff}h`;
      
      // Append "tomorrow" if the date is tomorrow
      return isTomorrow ? `${offsetStr} tomorrow` : offsetStr;
    } catch (e) {
      return '';
    }
  }

  function getOffsetString(timezone) {
    try {
        const now = new Date();
      const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
      const diffMs = tzDate.getTime() - utcDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
        const roundedDiff = Math.round(diffHours * 2) / 2;
        
      if (roundedDiff === 0) return 'UTC';
        const sign = roundedDiff > 0 ? '+' : '';
      return `UTC${sign}${roundedDiff}`;
    } catch (e) {
      return '';
    }
  }

  function getTimezoneAbbreviation(date, timezone) {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short'
      }).formatToParts(date).find(part => part.type === 'timeZoneName')?.value || '';
    } catch (e) {
        return '';
    }
  }

  // escapeHtml is now available from shared-utils.js
});
