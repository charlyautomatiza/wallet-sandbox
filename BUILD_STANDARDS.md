# Build Standards for Wallet Sandbox

This document defines the standards and processes for development, building, and deployment of the Wallet Sandbox application.

## Technologies and Frameworks

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: Redux Toolkit
- **Testing**: Playwright for automated tests
- **Code Management**: GitHub + GitHub Copilot

## Development Process

### 1. Task and Requirements Management

All code modifications must be associated with a backlog item:

- **User Story (US)**: Functionality from the user's perspective
- **Technical Task (TT)**: Technical improvements, refactoring, etc.
- **Bug (BG)**: Correction of identified errors

**IMPORTANT**: Before starting any change, always verify that a corresponding US/TT/BG exists in the GitHub Issues backlog.

### 2. Git Workflow

1. **Base Branch**: Always start from an updated `main` branch
   \`\`\`bash
   git checkout main
   git pull origin main
   \`\`\`

2. **Working Branch Creation**:
   - Name following the pattern: `type/US-XXX-brief-description`
   - Types: `feature`, `bugfix`, `hotfix`, `refactor`, `chore`
   \`\`\`bash
   git checkout -b feature/US-201-savings-goals
   \`\`\`

3. **Commits**:
   - Use descriptive messages that reference the US/TT/BG
   - Format: `[US-XXX] Concise description of the change`
   - Make small and frequent commits

4. **Push and Pull Request**:
   - Publish branch and create PR when changes are complete
   - Always include GitHub Copilot as a reviewer

### 3. Code Standards

#### Next.js 15 App Router

- Use Server Components by default
- Use Client Components only when necessary (`'use client'`)
- Implement Server Actions for data operations
- Properly structure dynamic routes and route groups

#### TypeScript

- Use strict typing at all times
- Define interfaces for component Props
- Avoid using `any`

#### Components

- Organize components according to their purpose:
  - `components/ui/`: Basic UI components (shadcn/ui)
  - `components/layout/`: Structure components
  - `components/features/`: Feature-specific components

#### State Management

- Use Redux Toolkit for global state
- Organize slices by domain (auth, account, transfer, etc.)

### 4. Testing

- Create automated tests with Playwright for new features
- Follow the Page Object Model pattern
- Ensure tests are independent and deterministic

### 5. Code Review

- All PRs must be reviewed before being merged
- Always include GitHub Copilot as a reviewer
- Prioritize and address Copilot's suggestions
- Ensure compliance with code standards

### 6. Integration and Deployment

- Approved PRs are merged into `main`
- Deployment to environments is done from `main`
- Automated tests are run before deployment

## Appendices

For more details, consult:

- [Playwright Test Standards](./PLAYWRIGHT_STANDARDS.md)
- [GitHub Copilot Instructions](./.github/copilot-instructions.md)
- [Project Backlog](./BACKLOG.md)
