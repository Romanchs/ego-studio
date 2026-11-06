import { CONFIG } from './config.js';

/**
 * Sends structured lead submission data to the configured email or endpoint.
 * 
 * @param {Object} data 
 * @param {string} data.name - Client name
 * @param {string|number} data.age - Client age
 * @param {string} data.city - Client city
 * @param {string} data.phone - Client formatted phone
 * @param {Object} data.metricDetails - Analytics and query ID payload
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function sendLeadToEmail(data) {
  const { name, age, city, phone, metricDetails } = data;

  const payload = {
    _subject: `✨ Нова заявка EGO STUDIO [ID: ${metricDetails?.metricId || 'Без ID'}]`,
    _template: 'table',
    _captcha: 'false',
    "Ім'я": name,
    "Вік": String(age),
    "Місто": city,
    "Телефон": phone,
    "Query ID (Метрика)": metricDetails?.metricId || 'Не вказано',
    "Час заявки": metricDetails?.deviceTime || new Date().toLocaleString('uk-UA'),
    "Сторінка переходу": metricDetails?.pageUrl || window.location.href,
    "Джерело (Referrer)": metricDetails?.referrer || 'Прямий вхід'
  };

  // Add UTM tags to email if available
  if (metricDetails?.utmData && Object.keys(metricDetails.utmData).length > 0) {
    for (const [k, v] of Object.entries(metricDetails.utmData)) {
      payload[`UTM: ${k}`] = v;
    }
  }

  let endpoint = '';
  let requestOptions = {};

  if (CONFIG.PROVIDER === 'web3forms') {
    if (!CONFIG.WEB3FORMS_ACCESS_KEY || CONFIG.WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
      console.warn('Web3Forms Access Key is not set in config.js');
      return {
        success: false,
        message: 'Вкажіть Web3Forms Access Key у src/js/config.js (отримайте на web3forms.com)'
      };
    }

    endpoint = 'https://api.web3forms.com/submit';
    payload.access_key = CONFIG.WEB3FORMS_ACCESS_KEY;
    payload.subject = `✨ Нова заявка EGO STUDIO [ID: ${metricDetails?.metricId || 'Без ID'}]`;
    payload.from_name = 'EGO STUDIO';

    requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    };
  } else if (CONFIG.PROVIDER === 'formsubmit') {
    const email = CONFIG.RECIPIENT_EMAIL || 'example@gmail.com';
    endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(email)}`;
    requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    };
  } else if (CONFIG.PROVIDER === 'php') {
    endpoint = './send.php';
    requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
  } else if (CONFIG.PROVIDER === 'custom' && CONFIG.CUSTOM_ENDPOINT) {
    endpoint = CONFIG.CUSTOM_ENDPOINT;
    requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
  } else {
    // Fallback default
    endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(CONFIG.RECIPIENT_EMAIL || 'example@gmail.com')}`;
    requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    };
  }

  // Set 12-second timeout to prevent UI hanging indefinitely
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  requestOptions.signal = controller.signal;

  try {
    const response = await fetch(endpoint, requestOptions);
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json().catch(() => ({}));
      if (json.success === false) {
        return { success: false, message: json.message || 'Помилка надсилання через Web3Forms.' };
      }
      return { success: true, message: json.message || 'Заявку успішно відправлено!' };
    } else {
      const json = await response.json().catch(() => null);
      const errMsg = json?.message || 'Помилка надсилання. Спробуйте пізніше або звʼяжіться з нами в месенджерах.';
      console.warn('Submission response error:', response.status, errMsg);
      return { 
        success: false, 
        message: errMsg 
      };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Fetch submission error:', error);
    return {
      success: false,
      message: 'Не вдалося надіслати. Перевірте підключення до Інтернету.'
    };
  }
}
