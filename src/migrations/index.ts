import * as migration_20250907_165515 from './20250907_165515';
import * as migration_20250907_213415 from './20250907_213415';
import * as migration_20250909_134321 from './20250909_134321';

export const migrations = [
  {
    up: migration_20250907_165515.up,
    down: migration_20250907_165515.down,
    name: '20250907_165515',
  },
  {
    up: migration_20250907_213415.up,
    down: migration_20250907_213415.down,
    name: '20250907_213415',
  },
  {
    up: migration_20250909_134321.up,
    down: migration_20250909_134321.down,
    name: '20250909_134321'
  },
];
