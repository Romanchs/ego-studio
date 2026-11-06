import {
  createIcons,
  GraduationCap,
  Calendar,
  BarChart3,
  User,
  Cake,
  MapPin,
  Phone,
  ArrowRight,
  Heart,
  Check
} from 'lucide';
import { siTelegram, siViber, siWhatsapp } from 'simple-icons';

/**
 * Initializes Lucide UI icons and Simple Icons for brand logos.
 */
export function initIcons() {
  // 1. Render Lucide icons for semantic UI elements
  createIcons({
    icons: {
      GraduationCap,
      Calendar,
      BarChart3,
      User,
      Cake,
      MapPin,
      Phone,
      ArrowRight,
      Heart,
      Check
    },
    attrs: {
      'stroke-width': 1.6,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }
  });

  // 2. Render Simple Icons for social/brand elements
  const brandIcons = {
    telegram: siTelegram.svg,
    viber: siViber.svg,
    whatsapp: siWhatsapp.svg
  };

  document.querySelectorAll('[data-simple-icon]').forEach((el) => {
    const iconName = el.dataset.simpleIcon;
    if (brandIcons[iconName]) {
      el.innerHTML = brandIcons[iconName];
    }
  });
}
