import type { BetterAuthPluginDBSchema } from 'better-auth'

export const solanaAuthSchema = {
  walletAddress: {
    fields: {
      userId: {
        type: 'string',
        required: true,
        references: {
          model: 'user',
          field: 'id',
        },
      },
      address: {
        type: 'string',
        required: true,
      },
      cluster: {
        type: 'string',
        required: true,
      },
      isPrimary: {
        type: 'boolean',
        required: true,
      },
    },
  },
} satisfies BetterAuthPluginDBSchema
