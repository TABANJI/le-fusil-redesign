(function notFoundPage() {
  'use strict';
  const container = document.querySelector('.page-hero .container');
  if (!container) return;
  const path = document.createElement('p'); path.className = 'attempted-path'; path.dir = 'ltr';
  path.append('Requested path: '); const code = document.createElement('code'); code.textContent = location.pathname + location.search; path.append(code);
  container.querySelector('.actions')?.before(path);
  const appointment = document.createElement('a'); appointment.className = 'btn btn-outline'; appointment.href = 'appointment.html'; appointment.textContent = 'Book an Appointment';
  container.querySelector('.actions')?.append(appointment);
})();
