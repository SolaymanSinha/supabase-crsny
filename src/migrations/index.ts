import * as migration_20250906_141504 from './20250906_141504';

export const migrations = [
  {
    up: migration_20250906_141504.up,
    down: migration_20250906_141504.down,
    name: '20250906_141504'
  },
];
