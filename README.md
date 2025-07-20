# Wallet Sandbox

Wallet Sandbox is a digital wallet application that allows users to manage their personal finances, make transfers, manage cards, request money, and access various financial services from a web interface.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/charlyautomatizas-projects/v0-open-source-banking-sandbox)
[![Built with Next.js 15](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

## Technologies

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Redux Toolkit
- **Testing**: Playwright

## Project Structure

```
app/                    # Next.js App (App Router)
├── (auth)/             # Authenticated routes
├── layout.tsx          # Main layout
└── page.tsx            # Main page
components/             # React components
├── ui/                 # UI components (shadcn)
└── layout/             # Layout components
store/                  # Redux state
├── store.ts            # Store configuration
└── slices/             # Slices by functionality
lib/                    # Utilities and helpers
tests/                  # Automated tests
├── fixtures/           # Test fixtures
├── pages/              # Page Object Models
└── specs/              # Test specifications
```

## Standards and Documentation

The project follows strict development and testing standards. Check these resources for more information:

- [Build Standards](./BUILD_STANDARDS.md) - Standards for application development and building
- [Playwright Test Standards](./PLAYWRIGHT_STANDARDS.md) - Standards for automated testing
- [Project Backlog](./BACKLOG.md) - User stories and pending tasks

## Development Process

1. **Backlog Verification**:
   - Confirm that a US/TT/BG exists for the task to be implemented
   - If it doesn't exist, create a new one following the standard format

2. **Git Workflow**:
   - Start from updated main: `git checkout main && git pull origin main`
   - Create branch: `git checkout -b feature/US-XXX-short-description`
   - Make changes following the standards
   - Commit: `git commit -m "[US-XXX] Concise description"`
   - Push: `git push origin feature/US-XXX-short-description`
   - Create PR and include GitHub Copilot as reviewer

3. **Code Review**:
   - Prioritize and address Copilot's suggestions
   - Ensure that all standards are followed

## Development Environment Setup

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Run tests**:
   ```bash
   npm run test
   # or
   pnpm test
   ```

## Deployment

The project is deployed at:

**[https://vercel.com/charlyautomatizas-projects/v0-open-source-banking-sandbox](https://vercel.com/charlyautomatizas-projects/v0-open-source-banking-sandbox)**

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Playwright Documentation](https://playwright.dev)
