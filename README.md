# Solana Mobile Monorepo

A full-stack starter kit for building mobile apps on Solana. Built with Expo, React Native, and modern TypeScript tooling.

## What's Included

- **Mobile App** — React Native with Expo, wallet integration via Mobile Wallet Adapter
- **Web App** — React with TanStack Start for SSR
- **Backend** — Hono server with oRPC for type-safe APIs
- **Database** — SQLite/Turso with Drizzle ORM
- **Auth** — Better-Auth with Sign in with Solana
- **AI Chat** — Optional Google Gemini integration

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Bun |
| Mobile | React Native, Expo |
| Web | React, TanStack Start |
| Server | Hono, oRPC |
| Database | SQLite/Turso, Drizzle |
| Solana | @solana/kit, @wallet-ui/react-native-kit |
| Styling | TailwindCSS, heroui-native |
| Monorepo | Turborepo |

## Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- [Docker](https://docker.com) (for local database)
- Android Studio with an emulator, or a physical Android device

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/beeman/solana-mobile-monorepo.git
cd solana-mobile-monorepo
bun install
```

### 2. Set Up the Database

Start the local database:

```bash
bun run db:up
```

This starts a LibSQL server on port 8080. Add `-d` to run in the background: `bun run db:up -- -d`

Copy the environment file:

```bash
cp apps/server/.env.example apps/server/.env
```

Generate a secure auth secret and update the `.env` file:

```bash
openssl rand -hex 32
```

Push the schema:

```bash
bun run db:push
```

### 3. Start the Server and Web App

```bash
bun run dev
```

This starts:
- Web app at http://localhost:3001
- API server at http://localhost:3000

### 4. Build and Run the Mobile App

The mobile app requires a native build (it won't run in Expo Go due to native dependencies).

In a separate terminal:

```bash
cd apps/native
bun run android
```

This builds the app and installs it on your connected device or emulator. Subsequent runs will be faster as they use the cached build.

## Wallet Support

The app uses Mobile Wallet Adapter to connect to Solana wallets. Supported wallets include:

- **Seeker Wallet** (built-in on Solana Seeker devices)
- Phantom
- Solflare
- Backpack
- Jupiter

On the emulator, install a wallet app from the Play Store to test wallet connections.

## Project Structure

```
solana-mobile-monorepo/
├── apps/
│   ├── native/      # Mobile app (React Native, Expo)
│   ├── web/         # Web app (React, TanStack Start)
│   └── server/      # API server (Hono, oRPC)
├── packages/
│   ├── api/         # Shared API routes and business logic
│   ├── auth/        # Authentication configuration
│   ├── db/          # Database schema and queries
│   ├── env/         # Environment variable validation
│   └── solana-client/  # Solana RPC client utilities
```

## Environment Variables

Edit `apps/server/.env` to configure the server:

| Variable                       | Description | Default                         |
|--------------------------------|-------------|---------------------------------|
| `BETTER_AUTH_SECRET`           | Auth secret (min 32 chars). Generate with `openssl rand -hex 32` | —                               |
| `BETTER_AUTH_URL`              | Server URL for auth callbacks | `http://localhost:3000`         |
| `CORS_ORIGINS`                 | Comma-separated list of allowed origins for CORS | `http://localhost:3001,solana-mobile-monorepo://`        |
| `DATABASE_URL`                 | Database connection URL | `http://localhost:8080`         |
| `DATABASE_AUTH_TOKEN`          | Database auth token | `local`                         |
| `SOLANA_ENDPOINT`              | Solana RPC endpoint | `https://api.devnet.solana.com` |
| `SOLANA_CLUSTER`               | Solana cluster (devnet, mainnet, etc) | `devnet`                        |
| `SOLANA_EMAIL_DOMAIN`          | Default domain for generated emails | `example.com`                   |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Optional. Enables AI chat feature | —                               |

## Enabling AI Chat (Optional)

The app includes an AI chat feature powered by Google Gemini. To enable it:

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the key and add it to `apps/server/.env`:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here
   ```
4. Restart the server

## Available Scripts

From the project root:

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps in development mode |
| `bun run dev:native` | Start only the mobile app dev server |
| `bun run dev:web` | Start only the web app |
| `bun run dev:server` | Start only the API server |
| `bun run build` | Build all apps |
| `bun run check-types` | TypeScript type checking |
| `bun run lint` | Run linting and formatting checks |
| `bun run lint:fix` | Fix linting and formatting issues |
| `bun run db:up` | Start the local database |
| `bun run db:down` | Stop the local database |
| `bun run db:push` | Push schema changes |
| `bun run db:studio` | Open database UI |
| `bun run ruler:apply` | Regenerate AI agent config files |

## AI Agent Configuration (Ruler)

This project uses [Ruler](https://github.com/AugmentedReality-Danny/ruler) to manage AI coding assistant configurations. Ruler generates agent-specific config files (`CLAUDE.md`, `COPILOT.md`, etc.) from a single source of truth.

### How it works

```
.ruler/
├── ruler.toml      # Configuration (MCP servers, target agents)
├── project.md      # Project instructions (edit this file)
└── skills/         # Best practice rules for agents
```

1. Edit `.ruler/project.md` to update project instructions
2. Run `bun run ruler:apply` to regenerate all agent config files
3. The generated files (like `CLAUDE.md`) are committed to the repo

### Configured MCP servers

Ruler configures these MCP servers for AI agents:

| Server | Purpose |
|--------|---------|
| context7 | Up-to-date library documentation |
| shadcn | Component registry access |
| better-auth | Auth framework assistance |

## Troubleshooting

### Mobile app won't start

Make sure you've run `bun run android` at least once from `apps/native/` to create the native build. The app requires native modules that aren't available in Expo Go.

### Wallet not connecting

- Ensure you have a compatible wallet app installed on your device/emulator
- Check that the wallet app is up to date
- On emulator, you may need to install a wallet from the Play Store

### Database connection errors

- Verify Docker is running: `docker ps`
- Check that the database is up: `bun run db:up`
- Ensure `DATABASE_URL` in `.env` matches your setup

## License

MIT
