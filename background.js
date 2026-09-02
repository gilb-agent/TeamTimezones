/**
 * Background service worker.
 * Only job right now: open a short welcome tab on a fresh install, so the
 * extension doesn't quietly land in the hidden overflow menu and get
 * forgotten — this tool only works if the icon is somewhere you'll
 * actually see it.
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== 'install') return; // Never on update — only a true first install
  chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });
});
