import { Temporal, toTemporalInstant } from '@js-temporal/polyfill';
Date.prototype.toTemporalInstant = toTemporalInstant;
window.Temporal = Temporal;

import Component from './components/Component.vue';

document.addEventListener('taskday:init', () => {
  Taskday.register('date', {
    field: Component
  });
})

