# MOAA - Mother of All (Coding) Agents

> An AI-powered platform that transforms natural language change requests into production-ready code, automatically deployed through preview environments.

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

MOAA is a platform that enables non-technical users and developers alike to request code changes using natural language. The system leverages AI (Claude by Anthropic) to understand requests, generate production-grade code changes, and deploy them through an automated CI/CD pipeline with preview environments for testing before production.

### Key Features

- **Natural Language Requests**: Describe what you want in plain English
- **AI-Powered Code Generation**: Claude analyzes your codebase and generates minimal, safe changes
- **Automated Branching**: Feature branches are created automatically for each change request
- **Preview Environments**: Test changes in isolated environments before merging
- **Approval Workflow**: Review and approve changes before they hit production
- **Multi-Project Support**: Manage multiple projects from a single dashboard
- **Role-Based Access**: Client and SuperUser roles with appropriate permissions

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           MOAA Platform Flow                            │
└─────────────────────────────────────────────────────────────────────────┘

  1. REQUEST                2. PROCESS               3. REVIEW
  ─────────                 ─────────               ─────────
  ┌──────────┐             ┌──────────┐            ┌──────────┐
  │  User    │  ────────►  │  Worker  │  ───────►  │  Preview │
  │ Dashboard│  "Add a     │  + Claude│  Creates   │   Env    │
  │          │  dark mode" │          │  branch +  │          │
  └──────────┘             └──────────┘  deploys   └──────────┘
                                                         │
  4. APPROVE               5. MERGE                      │
  ─────────                ─────────                     ▼
  ┌──────────┐             ┌──────────┐            ┌──────────┐
  │   User   │  ────────►  │   Main   │  ◄─────── │   User   │
  │ Approves │  Merges to  │  Branch  │  Tests &  │  Tests   │
  │          │  production │          │  Approves │          │
  └──────────┘             └──────────┘            └──────────┘
```

### Step-by-Step Flow

1. **Submit Request**: User selects a project and describes the desired change in natural language
2. **Queue Processing**: The request is queued and picked up by a worker
3. **AI Analysis**: Claude analyzes the codebase and generates a unified diff
4. **Branch Creation**: A feature branch is created and the changes are applied
5. **CI/CD Pipeline**: Tests run automatically; if passing, a preview environment is deployed
6. **User Testing**: User tests the changes in the preview environment
7. **Approval**: User approves (or requests modifications)
8. **Production Deploy**: Approved changes are merged to main and deployed to production

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Architecture                               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │     │   Backend   │     │   Worker    │     │  External   │
│  (Next.js)  │────►│  (NestJS)   │────►│  (BullMQ)   │────►│  Services   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
  ┌─────────┐        ┌──────────┐        ┌──────────┐       ┌──────────┐
  │  React  │        │PostgreSQL│        │  Redis   │       │  GitHub  │
  │   UI    │        │ (Prisma) │        │  Queue   │       │   API    │
  └─────────┘        └──────────┘        └──────────┘       └──────────┘
                                                             ┌──────────┐
                                                             │ Anthropic│
                                                             │   API    │
                                                             └──────────┘
                                                             ┌──────────┐
                                                             │  Render/ │
                                                             │  Vercel  │
                                                             └──────────┘
```

### Components

| Component | Description |
|-----------|-------------|
| **Frontend** | Next.js dashboard for project management, change requests, and approvals |
| **Backend** | NestJS API handling authentication, project CRUD, and request orchestration |
| **Worker** | BullMQ-powered background processor for handling change requests |
| **Database** | PostgreSQL for persistent storage (users, projects, requests, etc.) |
| **Queue** | Redis-backed BullMQ for reliable job processing |
| **External APIs** | GitHub (repos), Anthropic (Claude AI), Render/Vercel (deployments) |

---

## Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Queue**: BullMQ (Redis)
- **Validation**: class-validator / Zod

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React hooks / Context (or Zustand if needed)

### Infrastructure
- **CI/CD**: GitHub Actions
- **Hosting**: Render / Vercel
- **Preview Environments**: Auto-deployed per feature branch

### AI
- **Model**: Claude (Anthropic)
- **Usage**: Code analysis, change generation, diff creation

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- pnpm (recommended) or npm
- PostgreSQL 14+
- Redis 6+
- GitHub account with API access
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/moaa.git
cd moaa

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up the database
pnpm prisma generate
pnpm prisma migrate dev

# Start development servers
pnpm dev
```

### Quick Start

1. **Start the backend**:
   ```bash
   pnpm --filter backend dev
   ```

2. **Start the worker**:
   ```bash
   pnpm --filter worker dev
   ```

3. **Start the frontend**:
   ```bash
   pnpm --filter frontend dev
   ```

4. Open `http://localhost:3000` in your browser

---

## Project Structure

```
moaa/
├── apps/
│   ├── frontend/          # Next.js dashboard application
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and API clients
│   │   └── styles/        # Global styles
│   │
│   ├── backend/           # NestJS API server
│   │   ├── src/
│   │   │   ├── modules/   # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── projects/
│   │   │   │   ├── change-requests/
│   │   │   │   └── users/
│   │   │   ├── common/    # Shared utilities, guards, pipes
│   │   │   └── main.ts
│   │   └── prisma/        # Database schema and migrations
│   │
│   └── worker/            # BullMQ background job processor
│       ├── src/
│       │   ├── jobs/      # Job handlers
│       │   ├── services/  # Business logic (git, AI, deploy)
│       │   └── main.ts
│       └── ...
│
├── packages/
│   └── shared/            # Shared types, DTOs, utilities
│
├── .github/
│   └── workflows/         # CI/CD pipelines
│
├── CLAUDE.md              # AI agent instructions
├── README.md              # This file
└── package.json           # Root package.json (workspace)
```

---

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/moaa"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-jwt-secret-here"
JWT_EXPIRES_IN="7d"

# GitHub
GITHUB_APP_ID="your-github-app-id"
GITHUB_PRIVATE_KEY="your-github-private-key"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Anthropic (Claude AI)
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Deployment (Render/Vercel)
RENDER_API_KEY="your-render-api-key"
# or
VERCEL_TOKEN="your-vercel-token"

# Application
NODE_ENV="development"
PORT="3001"
FRONTEND_URL="http://localhost:3000"
```

---

## Development

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run tests in watch mode
pnpm test:watch
```

### Linting and Formatting

```bash
# Lint all files
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

### Database Operations

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Open Prisma Studio
pnpm prisma studio

# Reset database
pnpm prisma migrate reset
```

### Working with Queues

```bash
# Monitor BullMQ jobs (if using Bull Board)
# Visit http://localhost:3001/admin/queues
```

---

## Deployment

### Preview Environments

Preview environments are automatically created for each feature branch:

1. Push a feature branch to GitHub
2. GitHub Actions runs tests
3. If tests pass, a preview environment is deployed
4. The preview URL is posted as a comment on the PR

### Production Deployment

Production deployments happen automatically when changes are merged to `main`:

1. Merge PR to `main`
2. GitHub Actions runs the full test suite
3. If passing, deploys to production
4. Database migrations run automatically

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## API Reference

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | Authenticate user |
| `/auth/register` | POST | Register new user |
| `/auth/refresh` | POST | Refresh access token |

### Projects

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/projects` | GET | List all projects |
| `/projects` | POST | Create new project |
| `/projects/:id` | GET | Get project details |
| `/projects/:id` | PATCH | Update project |
| `/projects/:id` | DELETE | Delete project |

### Change Requests

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/change-requests` | GET | List change requests |
| `/change-requests` | POST | Create change request |
| `/change-requests/:id` | GET | Get request details |
| `/change-requests/:id/approve` | POST | Approve request |
| `/change-requests/:id/reject` | POST | Reject request |

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests

### Code Review Guidelines

- Keep changes small and focused
- Ensure tests pass
- Follow existing code patterns
- Update documentation as needed

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/your-org/moaa/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/moaa/discussions)

---

Built with AI, for AI-assisted development.
