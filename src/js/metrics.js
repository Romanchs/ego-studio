import { CONFIG } from './config.js';

const STORAGE_KEY = 'ego_studio_metric_id';
const UTM_STORAGE_KEY = 'ego_studio_utm_data';

/**
 * Reads, caches, and returns the tracking ID from query parameters.
 */
export function initMetrics() {
  const urlParams = new URLSearchParams(window.location.search);
  let detectedId = '';

  // 1. Check primary query parameter (e.g. ?id=...)
  if (urlParams.has(CONFIG.QUERY_PARAM_KEY)) {
    detectedId = urlParams.get(CONFIG.QUERY_PARAM_KEY).trim();
  }

  // 2. Fallback to common alternative keys if main key is absent
  if (!detectedId && Array.isArray(CONFIG.FALLBACK_PARAM_KEYS)) {
    for (const key of CONFIG.FALLBACK_PARAM_KEYS) {
      if (urlParams.has(key)) {
        detectedId = urlParams.get(key).trim();
        break;
      }
    }
  }

  // 3. Persist to storage so page refreshes don't lose the ID
  if (detectedId) {
    try {
      sessionStorage.setItem(STORAGE_KEY, detectedId);
      localStorage.setItem(STORAGE_KEY, detectedId);
    } catch (e) {
      console.warn('Storage unavailable:', e);
    }
  } else {
    // Retrieve previously stored ID if current page load has no query
    try {
      detectedId = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY) || '';
    } catch (e) {
      detectedId = '';
    }
  }

  // 4. Capture any UTM tags for detailed analytics
  const utmTags = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((utm) => {
    if (urlParams.has(utm)) {
      utmTags[utm] = urlParams.get(utm);
    }
  });

  if (Object.keys(utmTags).length > 0) {
    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmTags));
    } catch (e) {}
  }

  // Auto-populate hidden input if it exists in DOM
  const hiddenInput = document.getElementById('metric-id-input');
  if (hiddenInput && detectedId) {
    hiddenInput.value = detectedId;
  }

  return detectedId;
}

/**
 * Returns current metric details to bundle with form submission.
 */
export function getMetricPayload() {
  let metricId = '';
  try {
    metricId = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY) || '';
  } catch (e) {}

  let utmData = {};
  try {
    const rawUtm = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (rawUtm) utmData = JSON.parse(rawUtm);
  } catch (e) {}

  return {
    metricId: metricId || 'Не вказано (органічний перехід)',
    pageUrl: window.location.href,
    referrer: document.referrer || 'Прямий перехід',
    deviceTime: new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' }),
    utmData
  };
}
