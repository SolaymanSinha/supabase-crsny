import * as migration_20250907_165515 from './20250907_165515';
import * as migration_20250907_213415 from './20250907_213415';

export const migrations = [
  {
    up: migration_20250907_165515.up,
    down: migration_20250907_165515.down,
    name: '20250907_165515',
  },
  {
    up: migration_20250907_213415.up,
    down: migration_20250907_213415.down,
    name: '20250907_213415'
  },
];
