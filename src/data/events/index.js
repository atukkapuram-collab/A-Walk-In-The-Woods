// All events by id, from every act file.
import act1 from './act1.js';
import act2 from './act2.js';
import act3 from './act3.js';

export const EVENTS = Object.fromEntries([...act1, ...act2, ...act3].map((event) => [event.id, event]));
