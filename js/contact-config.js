(function contactConfiguration(global) {
  'use strict';
  const config = global.LEFUSIL_SITE_CONFIG;
  const target = document.querySelector('.contact-visit-copy .contact-actions');
  if (!target || !config) return;

  const configured = (value) => config.isConfigured(value);
  const links = [
    configured(config.phone) && ['tel:' + config.phone, 'Call', 'phone_clicked'],
    configured(config.email) && ['mailto:' + config.email, 'Email', 'email_clicked'],
    configured(config.whatsapp) && ['https://wa.me/' + config.whatsapp.replace(/\D/g, ''), 'WhatsApp', 'whatsapp_clicked'],
    configured(config.mapsUrl) && [config.mapsUrl, 'Directions', 'map_clicked']
  ].filter(Boolean);
  links.forEach(([href, label, eventName]) => {
    const link = document.createElement('a'); link.className = 'text-link'; link.href = href; link.textContent = label;
    if (/^https?:/.test(href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    link.addEventListener('click', () => global.lefusilAnalytics?.track(eventName, { locale: global.LEFUSIL_LOCALE?.current, sourcePage: 'contact' }));
    target.append(link);
  });
  const appointment = document.createElement('a'); appointment.className = 'btn btn-outline'; appointment.href = 'appointment.html'; appointment.textContent = 'Book a Private Consultation'; target.append(appointment);

  const hours = document.createElement('div'); hours.className = 'opening-hours'; hours.setAttribute('aria-label', 'Opening hours');
  if (!config.openingHours.configured || !config.openingHours.days.length) {
    hours.innerHTML = '<strong>Opening hours</strong><p>Hours to be confirmed. Please request an appointment before visiting.</p>';
  } else {
    const rows = config.openingHours.days.map((day) => `<div><span>${day.label}</span><span>${day.closed ? 'Closed' : day.intervals.join(', ')}</span></div>`).join('');
    hours.innerHTML = `<strong>Opening hours</strong>${rows}<small>${config.openingHours.timezone}</small>`;
  }
  target.insertAdjacentElement('afterend', hours);
  global.lefusilI18n?.apply(document);
})(window);
