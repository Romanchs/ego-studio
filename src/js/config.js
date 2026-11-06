/**
 * Configuration for EGO STUDIO Landing Page
 * 
 * Вкажіть тут вашу електронну пошту, на яку мають надходити заявки.
 */
export const CONFIG = {
  // ✉️ Адреса електронної пошти для отримання заявок
  // Замініть на вашу реальну пошту (наприклад: 'info@egostudio.com' або 'yourname@gmail.com')
  RECIPIENT_EMAIL: 'Strevgeniy95@gmail.com',

  // ⚙️ Провайдер відправки:
  // - 'formsubmit' : надійний безкоштовний сервіс для статичного хостингу (Vercel, Netlify, GitHub Pages тощо)
  // - 'php'        : використання файлу send.php (якщо у вас традиційний хостинг з підтримкою PHP)
  // - 'custom'     : власний вебхук або API-ендпоінт
  PROVIDER: 'formsubmit',

  // 🔗 Власний API-ендпоінт (використовується тільки якщо PROVIDER = 'custom')
  CUSTOM_ENDPOINT: '',

  // 🔍 Ключ query-параметра в URL для відстеження метрики (наприклад: ?id=123 або ?sub_id=123)
  QUERY_PARAM_KEY: 'id',

  // Додаткові ключі, які автоматично перевіряються, якщо основний id порожній
  FALLBACK_PARAM_KEYS: ['sub_id', 'utm_id', 'click_id', 'lead_id']
};
