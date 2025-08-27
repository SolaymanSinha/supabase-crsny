import type { SanitizedConfig } from 'payload'
import payload from 'payload'

export const script = async (config: SanitizedConfig) => {
  await payload.init({ config })

  // Seed Admin User
  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@admin.com',
      password: 'admin',
    },
  })
  payload.logger.info('✅Successfully admin user seeded!')

  process.exit(0)
}
