/**
 * Configuration for EGO STUDIO Landing Page
 * 
 * Вкажіть тут вашу електронну пошту, на яку мають надходити заявки.
 */
export const CONFIG = {
  // ✉️ Адреса електронної пошти для отримання заявок
  RECIPIENT_EMAIL: 'Strevgeniy95@gmail.com',

  // 🔑 Web3Forms Access Key
  // Отримайте безкоштовно за 10 секунд на https://web3forms.com/
  // (просто введіть Strevgeniy95@gmail.com на сайті, вам на пошту прийде ключ і вставте його сюди)
  WEB3FORMS_ACCESS_KEY: '96af98e6-4380-4b76-85c1-9dafefd2d6eb',

  // ⚙️ Провайдер відправки:
  // - 'web3forms'  : ідеально для Cloudflare Workers / Pages (без бекенду, надійно, без помилки 405)
  // - 'formsubmit' : відправка через formsubmit.co
  // - 'php'        : використання send.php (тільки якщо хостинг підтримує PHP)
  // - 'custom'     : власний вебхук або API-ендпоінт
  PROVIDER: 'web3forms',

  // 🔗 Власний API-ендпоінт (використовується тільки якщо PROVIDER = 'custom')
  CUSTOM_ENDPOINT: '',

  // 🔍 Ключ query-параметра в URL для відстеження метрики (наприклад: ?id=123 або ?sub_id=123)
  QUERY_PARAM_KEY: 'id',

  // Додаткові ключі, які автоматично перевіряються, якщо основний id порожній
  FALLBACK_PARAM_KEYS: ['sub_id', 'utm_id', 'click_id', 'lead_id']
};
