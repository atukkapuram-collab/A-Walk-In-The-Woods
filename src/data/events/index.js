// All events by id, from every act file.
// act1: Prologue and Georgia. act2: the Smokies and Shenandoah. act3: Alone
// (Pennsylvania, New England). act4: Maine (still the old story until Milestone 13).
import act1 from './act1.js';
import act2 from './act2.js';
import act3 from './act3.js';
import act4 from './act4.js';

export const EVENTS = Object.fromEntries([...act1, ...act2, ...act3, ...act4].map((event) => [event.id, event]));
