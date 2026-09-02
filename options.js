/**
 * Options page for managing home base and team members
 * Uses shared-utils.js for common functions and data
 */

// Predefined cities with their timezones
const PREDEFINED_CITIES = [
  { name: 'Sydney', timezone: 'Australia/Sydney' },
  { name: 'Singapore', timezone: 'Asia/Singapore' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata' },
  { name: 'Amsterdam', timezone: 'Europe/Amsterdam' },
  { name: 'London', timezone: 'Europe/London' },
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'San Francisco', timezone: 'America/Los_Angeles' }
];

// COMMON_TIMEZONES and getCityNameFromTimezone are now available from shared-utils.js

let team = [];
let homeBase = null;
let draggedIndex = null;

// Status-based color logic removed - Settings stays neutral
// Color coding belongs only in popup.js

// Toast notification
function showToast(message = 'Saved') {
  if (!toast || !toastMessage) return;
  
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}


// DOM elements
const homeCityInput = document.getElementById('homeCity');
const homeTimezoneSelect = document.getElementById('homeTimezone');
const homeHoursStartSelect = document.getElementById('homeHoursStart');
const homeHoursEndSelect = document.getElementById('homeHoursEnd');
const homeTzSearch = document.getElementById('homeTzSearch');
const newNameInput = document.getElementById('newName');
const newMembersInput = document.getElementById('newMembers');
const newTzSelect = document.getElementById('newTz');
const newHoursStartSelect = document.getElementById('newHoursStart');
const newHoursEndSelect = document.getElementById('newHoursEnd');
const addBtn = document.getElementById('addBtn');
const teamList = document.getElementById('teamList');
const calendarProviderSelect = document.getElementById('calendarProviderSelect');
const scheduleSignatureToggle = document.getElementById('scheduleSignatureToggle');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

/**
 * Initialize the options page
 */
function init() {
  populateTimezoneSelect(homeTimezoneSelect);
  populateTimezoneSelect(newTzSelect);
  if (homeHoursStartSelect) homeHoursStartSelect.innerHTML = buildHourOptions(CONSTANTS.WORK_HOURS_START);
  if (homeHoursEndSelect) homeHoursEndSelect.innerHTML = buildHourOptions(CONSTANTS.WORK_HOURS_END);
  if (newHoursStartSelect) newHoursStartSelect.innerHTML = buildHourOptions(CONSTANTS.WORK_HOURS_START);
  if (newHoursEndSelect) newHoursEndSelect.innerHTML = buildHourOptions(CONSTANTS.WORK_HOURS_END);

  // Initialize dark mode
  let isDarkMode = null;
  
  function applyDarkMode() {
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
      document.documentElement.classList.remove('dark-mode', 'light-mode');
      document.body.classList.remove('dark-mode', 'light-mode');
    }
  }
  
  // Load saved data with error handling
  chrome.storage.sync.get(['team', 'homeBase', 'isDarkMode', 'calendarProvider', 'scheduleSignatureEnabled'], (result) => {
    // Check for Chrome runtime errors
    if (chrome.runtime.lastError) {
      console.error('Storage error:', chrome.runtime.lastError);
      showToast('Failed to load settings. Please refresh the page.');
      return;
    }

    // Validate and load team data
    if (result.team && Array.isArray(result.team) && result.team.length > 0) {
      // Validate each team member
      team = result.team.filter(member => {
        if (!member || typeof member !== 'object') return false;
        if (!member.name || !member.timezone) return false;
        if (!isValidTimezone(member.timezone)) {
          console.warn('Removing member with invalid timezone:', member);
          return false;
        }
        return true;
      });
    } else {
      // Pre-populate with default cities
      team = PREDEFINED_CITIES.map(city => ({
        name: city.name,
        city: city.name,
        timezone: city.timezone,
        members: [],
        order: 0
      }));
      // Initial stack ranking by timezone (east to west)
      team.forEach((member, index) => {
        member.order = index;
      });
      saveTeam();
    }

    // If no explicit order set yet, initialize based on current order
    if (!team.some(member => typeof member.order === 'number')) {
      team.forEach((member, index) => {
        member.order = index;
      });
      saveTeam();
    }
    
    // Validate and load home base
    if (result.homeBase && result.homeBase.timezone) {
      if (isValidTimezone(result.homeBase.timezone)) {
        homeBase = result.homeBase;
        homeCityInput.value = homeBase.city || '';
        homeTimezoneSelect.value = homeBase.timezone || '';
        if (homeHoursStartSelect && typeof homeBase.workHoursStart === 'number') {
          homeHoursStartSelect.value = homeBase.workHoursStart;
        }
        if (homeHoursEndSelect && typeof homeBase.workHoursEnd === 'number') {
          homeHoursEndSelect.value = homeBase.workHoursEnd;
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
        const cityName = getCityNameFromTimezone(userTimezone);
        homeBase = {
          city: cityName,
          timezone: userTimezone
        };
        homeCityInput.value = homeBase.city;
        homeTimezoneSelect.value = homeBase.timezone;
        saveHomeBase(false); // Don't show toast for auto-save
      } catch (e) {
        console.error('Failed to set default home base:', e);
        // Fallback to UTC
        homeBase = {
          city: 'UTC',
          timezone: 'UTC'
        };
        homeCityInput.value = 'UTC';
        homeTimezoneSelect.value = 'UTC';
      }
    }
    
    // Load dark mode preference
    if (result.isDarkMode !== undefined) {
      isDarkMode = result.isDarkMode;
    }
    applyDarkMode();

    // Load calendar provider preference (empty value = ask each time)
    if (calendarProviderSelect) {
      calendarProviderSelect.value = result.calendarProvider || '';
    }

    // Default on — undefined (never set) is treated as enabled
    if (scheduleSignatureToggle) {
      scheduleSignatureToggle.checked = result.scheduleSignatureEnabled !== false;
    }

    // Listen for dark mode changes from popup
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.isDarkMode !== undefined) {
        isDarkMode = changes.isDarkMode.newValue;
        applyDarkMode();
      }
    });
    
    renderTeamList();
  });

  // Event listeners

  // Home base autosave: text on blur, selects on change (same pattern
  // as the team list) — Home Base is edited rarely enough that a toast
  // per save is still a welcome confirmation rather than noise.
  if (homeCityInput) {
    homeCityInput.addEventListener('blur', () => saveHomeBase(true));
  }
  [homeTimezoneSelect, homeHoursStartSelect, homeHoursEndSelect].forEach(el => {
    if (el) el.addEventListener('change', () => saveHomeBase(true));
  });

  // Timezone search for Home Base, mirroring the Team "add" field
  if (homeTzSearch) {
    homeTzSearch.addEventListener('input', (e) => {
      filterTimezoneDropdown(e.target.value, homeTimezoneSelect);
    });
    homeTimezoneSelect.addEventListener('focus', () => {
      if (homeTzSearch.value) {
        homeTzSearch.value = '';
        filterTimezoneDropdown('', homeTimezoneSelect);
      }
    });
  }


  if (calendarProviderSelect) {
    calendarProviderSelect.addEventListener('change', () => {
      const value = calendarProviderSelect.value; // '', 'google', or 'outlook'
      chrome.storage.sync.set({ calendarProvider: value || null }, () => {
        if (chrome.runtime.lastError) {
          console.error('Failed to save calendar provider:', chrome.runtime.lastError);
          showToast('Failed to save. Please try again.');
          return;
        }
        showToast('Saved');
      });
    });
  }

  if (scheduleSignatureToggle) {
    scheduleSignatureToggle.addEventListener('change', () => {
      chrome.storage.sync.set({ scheduleSignatureEnabled: scheduleSignatureToggle.checked }, () => {
        if (chrome.runtime.lastError) {
          console.error('Failed to save schedule signature preference:', chrome.runtime.lastError);
          showToast('Failed to save. Please try again.');
          return;
        }
        showToast('Saved');
      });
    });
  }

  addBtn.addEventListener('click', addTeamMember);
  newNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTeamMember();
  });

  // Timezone search functionality
  const newTzSearch = document.getElementById('newTzSearch');
  if (newTzSearch) {
    newTzSearch.addEventListener('input', (e) => {
      filterTimezoneDropdown(e.target.value, newTzSelect);
    });

    // Clear search when dropdown is focused
    newTzSelect.addEventListener('focus', () => {
      if (newTzSearch.value) {
        newTzSearch.value = '';
        filterTimezoneDropdown('', newTzSelect);
      }
    });
  }

  // Star rating functionality
  initStarRating();
  
  // Auto-update city name when timezone changes (removed - using auto-save instead)
}

function populateTimezoneSelect(select) {
  select.innerHTML = '';
  COMMON_TIMEZONES.forEach(tz => {
    const option = document.createElement('option');
    option.value = tz.value;
    option.textContent = tz.label;
    select.appendChild(option);
  });
}

function filterTimezoneDropdown(searchQuery, select) {
  try {
    // Validate inputs
    if (!select || !(select instanceof HTMLSelectElement)) {
      console.error('Invalid select element in filterTimezoneDropdown');
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    // If search is empty, show all timezones
    if (!query) {
      populateTimezoneSelect(select);
      return;
    }

    // Filter timezones based on search query
    const filtered = COMMON_TIMEZONES.filter(tz => {
      if (!tz || !tz.label || !tz.value) return false;
      return tz.label.toLowerCase().includes(query) ||
             tz.value.toLowerCase().includes(query);
    });

    // Update dropdown with filtered results
    select.innerHTML = '';

    if (filtered.length === 0) {
      const option = document.createElement('option');
      option.textContent = 'No matches found - try a different search';
      option.disabled = true;
      select.appendChild(option);
    } else {
      filtered.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz.value;
        option.textContent = tz.label;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error filtering timezone dropdown:', error);
    // Fallback to showing all timezones
    populateTimezoneSelect(select);
  }
}

function saveHomeBase(showToastFeedback = true) {
  const city = homeCityInput ? homeCityInput.value.trim() : '';
  const timezone = homeTimezoneSelect.value;

  // Validate timezone
  if (!timezone) {
    showToast('Please select a timezone');
    return;
  }

  if (!isValidTimezone(timezone)) {
    console.error('Invalid timezone selected:', timezone);
    showToast('Invalid timezone. Please select a different one.');
    return;
  }

  // Use provided city name, or auto-generate from timezone if empty
  const cityName = city || getCityNameFromTimezone(timezone);

  // Validate city name
  if (!cityName || cityName.length > 100) {
    showToast('Invalid city name');
    return;
  }

  const workHoursStart = homeHoursStartSelect ? parseInt(homeHoursStartSelect.value, 10) : CONSTANTS.WORK_HOURS_START;
  const workHoursEnd = homeHoursEndSelect ? parseInt(homeHoursEndSelect.value, 10) : CONSTANTS.WORK_HOURS_END;

  if (workHoursEnd <= workHoursStart) {
    showToast('Business hours end must be after the start');
    return;
  }

  homeBase = { city: cityName, timezone, workHoursStart, workHoursEnd };

  // Save to storage with error handling
  chrome.storage.sync.set({ homeBase }, () => {
    if (chrome.runtime.lastError) {
      console.error('Failed to save home base:', chrome.runtime.lastError);
      showToast('Failed to save. Please try again.');
      return;
    }

    if (showToastFeedback) {
      showToast('Saved');
    }
  });
}

function addTeamMember() {
  const name = newNameInput.value.trim();
  const membersRaw = newMembersInput.value.trim();
  const timezone = newTzSelect.value;

  // Validate inputs
  if (!name || !timezone) {
    showToast('Please fill in both city name and timezone');
    return;
  }

  // Validate name length
  if (name.length > 100) {
    showToast('City name is too long (max 100 characters)');
    return;
  }

  // Validate timezone
  if (!isValidTimezone(timezone)) {
    console.error('Invalid timezone:', timezone);
    showToast('Invalid timezone selected. Please try again.');
    return;
  }

  // Check for duplicates
  if (team.some(member => member.name.toLowerCase() === name.toLowerCase())) {
    showToast('This city is already in your team list');
    return;
  }

  // Check team size limit
  if (team.length >= CONSTANTS.MAX_TEAM_MEMBERS) {
    showToast(`Maximum of ${CONSTANTS.MAX_TEAM_MEMBERS} team members allowed`);
    return;
  }

  // Parse team members
  const members = membersRaw
    ? membersRaw.split(',').map(part => part.trim()).filter(Boolean)
    : [];

  // Validate members array
  if (members.length > 50) {
    showToast('Too many team member names (max 50)');
    return;
  }

  const workHoursStart = newHoursStartSelect ? parseInt(newHoursStartSelect.value, 10) : CONSTANTS.WORK_HOURS_START;
  const workHoursEnd = newHoursEndSelect ? parseInt(newHoursEndSelect.value, 10) : CONSTANTS.WORK_HOURS_END;

  if (workHoursEnd <= workHoursStart) {
    showToast('Business hours end must be after the start');
    return;
  }

  // Add new team member
  team.push({
    name: name,
    city: name,
    timezone: timezone,
    members: members,
    workHoursStart: workHoursStart,
    workHoursEnd: workHoursEnd,
    order: team.length
  });

  saveTeam();
  renderTeamList();

  // Clear inputs
  newNameInput.value = '';
  newMembersInput.value = '';
  newTzSelect.selectedIndex = 0;
  if (newHoursStartSelect) newHoursStartSelect.value = CONSTANTS.WORK_HOURS_START;
  if (newHoursEndSelect) newHoursEndSelect.value = CONSTANTS.WORK_HOURS_END;
  newNameInput.focus();

  showToast('City added successfully');
}

function removeTeamMember(index) {
  team.splice(index, 1);
  saveTeam();
  renderTeamList();
  showToast('Removed');
}

function saveTeam() {
  // Validate team data before saving
  if (!Array.isArray(team)) {
    console.error('Invalid team data: not an array');
    showToast('Error: Invalid team data');
    return;
  }

  // Check storage size
  const dataSize = getStorageSize({ team });
  if (dataSize > CONSTANTS.MAX_SYNC_STORAGE_BYTES) {
    const message = 'Team list is too large. Please remove some members.';
    console.error('Storage size exceeded:', dataSize, 'bytes');
    showToast(message);
    alert(message + '\n\nMaximum size: 100KB\nCurrent size: ' + Math.round(dataSize / 1024) + 'KB');
    return;
  }

  // Check number of team members
  if (team.length > CONSTANTS.MAX_TEAM_MEMBERS) {
    const message = `Too many team members (max ${CONSTANTS.MAX_TEAM_MEMBERS})`;
    showToast(message);
    return;
  }

  // Save to storage
  chrome.storage.sync.set({ team }, () => {
    if (chrome.runtime.lastError) {
      console.error('Failed to save team:', chrome.runtime.lastError);
      showToast('Failed to save. Please try again.');
    }
  });
}

function renderTeamList() {
  try {
    if (team.length === 0) {
      teamList.innerHTML = `
        <div class="empty-team">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.4; margin-bottom: 12px;">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <p style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">No cities added yet</p>
          <p style="font-size: 12px; opacity: 0.7;">Use the form above to add your first team location</p>
        </div>
      `;
      return;
    }

  // Sort by explicit order value
  const orderedTeam = [...team].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : 0;
    const orderB = typeof b.order === 'number' ? b.order : 0;
    return orderA - orderB;
  });
  
  teamList.innerHTML = orderedTeam.map((member, index) => {
    const membersText = member.members && member.members.length
      ? member.members.join(', ')
      : '';
    
    const timezoneOptions = COMMON_TIMEZONES.map(tz => `
      <option value="${tz.value}" ${tz.value === member.timezone ? 'selected' : ''}>
        ${tz.label}
      </option>
    `).join('');

    const workHoursStart = typeof member.workHoursStart === 'number'
      ? member.workHoursStart
      : CONSTANTS.WORK_HOURS_START;
    const workHoursEnd = typeof member.workHoursEnd === 'number'
      ? member.workHoursEnd
      : CONSTANTS.WORK_HOURS_END;

    return `
      <div class="team-item" data-index="${index}">
        <div class="drag-handle" draggable="true" data-index="${index}" aria-label="Drag to reorder">
          <svg viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="1.5" fill="currentColor"/>
            <circle cx="4" cy="10" r="1.5" fill="currentColor"/>
            <circle cx="4" cy="16" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="16" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        <div class="grid-field city-field">
          <input
            type="text"
            class="team-city-input"
            data-index="${index}"
            value="${escapeHtml(member.name)}"
            placeholder="City name"
          />
        </div>
        <div class="grid-field members-field">
          <input
            type="text"
            class="team-members-input"
            data-index="${index}"
            placeholder="Team names"
            value="${escapeHtml(membersText)}"
          />
        </div>
        <div class="grid-field">
          <select class="team-tz-select" data-index="${index}">
            ${timezoneOptions}
          </select>
        </div>
        <div class="grid-field hours-pair">
          <select class="team-hours-select team-hours-start-select" data-index="${index}" aria-label="Business hours start for ${escapeHtml(member.name)}" title="Business hours start">
            ${buildHourOptions(workHoursStart)}
          </select>
          <span class="hours-sep" aria-hidden="true">&ndash;</span>
          <select class="team-hours-select team-hours-end-select" data-index="${index}" aria-label="Business hours end for ${escapeHtml(member.name)}" title="Business hours end">
            ${buildHourOptions(workHoursEnd)}
          </select>
        </div>
        <div class="remove-cell">
          <button class="remove-btn" data-index="${index}" aria-label="Remove ${escapeHtml(member.name)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // escapeHtml is now available from shared-utils.js

  // Autosave: text fields save on blur (once you've finished typing and
  // moved on), selects save on change (they only fire on an actual pick,
  // never mid-keystroke) — no button, no per-row toast, just quietly kept
  // in sync. saveEditedTeamMember resolves the actual team-array index
  // itself when only orderedIndex is given.
  teamList.querySelectorAll('.team-city-input, .team-members-input').forEach(input => {
    input.addEventListener('blur', () => {
      saveEditedTeamMember(parseInt(input.dataset.index, 10), undefined, false);
    });
  });
  teamList.querySelectorAll('.team-tz-select, .team-hours-start-select, .team-hours-end-select').forEach(select => {
    select.addEventListener('change', () => {
      saveEditedTeamMember(parseInt(select.dataset.index, 10), undefined, false);
    });
  });

  // Add event listeners for remove buttons with confirmation
  teamList.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const orderedIndex = parseInt(btn.dataset.index, 10);
      
      // Get the ordered team to find the member at this position
      const orderedTeam = [...team].sort((a, b) => {
        const orderA = typeof a.order === 'number' ? a.order : 0;
        const orderB = typeof b.order === 'number' ? b.order : 0;
        return orderA - orderB;
      });
      
      const memberToRemove = orderedTeam[orderedIndex];
      if (!memberToRemove) return;
      
      // Find the actual index in the original team array
      const actualIndex = team.findIndex(m => 
        m.timezone === memberToRemove.timezone && 
        m.name === memberToRemove.name
      );
      
      if (actualIndex === -1) return;
      
      removeTeamMember(actualIndex);
    });
  });

  // Drag & drop reordering - only on drag handle
  teamList.querySelectorAll('.drag-handle').forEach(handle => {
    handle.addEventListener('dragstart', handleDragStart);
  });
  
    teamList.querySelectorAll('.team-item').forEach(row => {
      row.addEventListener('dragover', handleDragOver);
      row.addEventListener('drop', handleDrop);
      row.addEventListener('dragend', handleDragEnd);
    });
  } catch (error) {
    console.error('Error rendering team list:', error);
    teamList.innerHTML = `
      <div class="empty-team">
        <p style="color: var(--md-sys-color-error);">⚠️ Error displaying team list</p>
        <p style="font-size: 12px; margin-top: 8px;">Please refresh the page or contact support if this persists.</p>
      </div>
    `;
  }
}

// escapeHtml is now available from shared-utils.js

// Drag & drop handlers
function handleDragStart(e) {
  // Get index from drag handle, find parent team-item
  const handle = e.currentTarget;
  const index = parseInt(handle.dataset.index, 10);
  draggedIndex = index;
  
  // Add dragging class to the parent team-item
  const teamItem = handle.closest('.team-item');
  if (teamItem) {
    teamItem.classList.add('dragging');
  }
  
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const target = e.currentTarget;
  target.classList.add('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  const targetIndex = parseInt(e.currentTarget.dataset.index, 10);
  if (draggedIndex === null || draggedIndex === targetIndex) {
    return;
  }

  // Reorder team array based on visual order
  const orderedTeam = [...team].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : 0;
    const orderB = typeof b.order === 'number' ? b.order : 0;
    return orderA - orderB;
  });

  const [moved] = orderedTeam.splice(draggedIndex, 1);
  orderedTeam.splice(targetIndex, 0, moved);

  // Re-assign order indices
  orderedTeam.forEach((member, idx) => {
    member.order = idx;
  });

  team = orderedTeam;
  saveTeam();
  renderTeamList();
}

function handleDragEnd(e) {
  draggedIndex = null;
  teamList.querySelectorAll('.team-item').forEach(row => {
    row.classList.remove('dragging', 'drag-over');
  });
}

function saveEditedTeamMember(orderedIndex, actualIndex, showFeedback = true) {
  // orderedIndex is the index in the rendered/sorted list (used for DOM queries)
  // actualIndex is the index in the original team array (used for updates)
  // If actualIndex is not provided, we need to find it
  let domIndex = orderedIndex;
  let teamIndex = actualIndex;
  
  // If actualIndex wasn't provided, find it from the ordered team
  if (actualIndex === undefined) {
    const orderedTeam = [...team].sort((a, b) => {
      const orderA = typeof a.order === 'number' ? a.order : 0;
      const orderB = typeof b.order === 'number' ? b.order : 0;
      return orderA - orderB;
    });
    
    const memberToUpdate = orderedTeam[orderedIndex];
    if (memberToUpdate) {
      teamIndex = team.findIndex(m => 
        m.timezone === memberToUpdate.timezone && 
        m.name === memberToUpdate.name
      );
    }
  }
  
  const cityInput = teamList.querySelector(`.team-city-input[data-index="${domIndex}"]`);
  const membersInput = teamList.querySelector(`.team-members-input[data-index="${domIndex}"]`);
  const tzSelect = teamList.querySelector(`.team-tz-select[data-index="${domIndex}"]`);
  const hoursStartSelect = teamList.querySelector(`.team-hours-start-select[data-index="${domIndex}"]`);
  const hoursEndSelect = teamList.querySelector(`.team-hours-end-select[data-index="${domIndex}"]`);

  if (!cityInput || !tzSelect || teamIndex === -1 || !team[teamIndex]) {
    return;
  }

  const city = cityInput.value.trim();
  const timezone = tzSelect.value;
  const membersRaw = membersInput ? membersInput.value.trim() : '';
  const workHoursStart = hoursStartSelect ? parseInt(hoursStartSelect.value, 10) : CONSTANTS.WORK_HOURS_START;
  const workHoursEnd = hoursEndSelect ? parseInt(hoursEndSelect.value, 10) : CONSTANTS.WORK_HOURS_END;

  if (workHoursEnd <= workHoursStart) {
    showToast('Business hours end must be after the start');
    return;
  }

  // Validate inputs
  if (!city || !timezone) {
    return; // Silently fail - user is still typing
  }

  // Validate city name length
  if (city.length > 100) {
    showToast('City name is too long (max 100 characters)');
    return;
  }

  // Validate timezone
  if (!isValidTimezone(timezone)) {
    console.error('Invalid timezone in edit:', timezone);
    showToast('Invalid timezone. Please select a valid one.');
    return;
  }

  // Parse and validate members
  const members = membersRaw
    ? membersRaw.split(',').map(part => part.trim()).filter(Boolean)
    : [];

  if (members.length > 50) {
    showToast('Too many team member names (max 50)');
    return;
  }

  // Update team member data using the actual index
  team[teamIndex].name = city;
  team[teamIndex].city = city;
  team[teamIndex].timezone = timezone;
  team[teamIndex].members = members;
  team[teamIndex].workHoursStart = workHoursStart;
  team[teamIndex].workHoursEnd = workHoursEnd;

  saveTeam();

  // No re-render here on purpose: this fires on blur/change while the
  // user may already be tabbing into the next field, and rebuilding the
  // list's HTML would yank focus out from under them. The DOM already
  // reflects what was just typed — nothing needs to change visually.
  if (showFeedback) {
    showToast('Saved');
  }
}

function formatHour(hour) {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

/**
 * Build <option> markup for an hour-of-day select (0-23).
 * @param {number} selectedHour
 * @returns {string}
 */
function buildHourOptions(selectedHour) {
  let options = '';
  for (let h = 0; h < 24; h++) {
    options += `<option value="${h}" ${h === selectedHour ? 'selected' : ''}>${formatHour(h)}</option>`;
  }
  return options;
}

// Star rating functionality
function initStarRating() {
  const starRating = document.getElementById('starRating');
  if (!starRating) return;
  
  const stars = starRating.querySelectorAll('.star');
  const REVIEWS_URL = 'https://chromewebstore.google.com/detail/team-timezones/makileokchiliacehpmkecgcehebflbb/reviews';
  
  // Load saved rating if exists
  chrome.storage.sync.get(['userRating'], (result) => {
    if (result.userRating) {
      fillStars(result.userRating);
    }
  });
  
  stars.forEach((star, index) => {
    const rating = index + 1;
    
    star.addEventListener('click', () => {
      // Save the rating
      chrome.storage.sync.set({ userRating: rating });
      
      // Fill stars up to the clicked rating
      fillStars(rating);
      
      // Open reviews page in a new tab
      window.open(REVIEWS_URL, '_blank', 'noopener,noreferrer');
    });
    
    // Hover effect to preview rating
    star.addEventListener('mouseenter', () => {
      fillStars(rating);
    });
  });
  
  // Reset to saved rating when mouse leaves
  starRating.addEventListener('mouseleave', () => {
    chrome.storage.sync.get(['userRating'], (result) => {
      fillStars(result.userRating || 0);
    });
  });
  
  function fillStars(rating) {
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('filled');
      } else {
        star.classList.remove('filled');
      }
    });
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

