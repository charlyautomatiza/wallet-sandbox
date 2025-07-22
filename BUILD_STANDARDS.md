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

**Enhanced Task Discovery Process**:

1. **First**: Check BACKLOG.md file for existing tasks
2. **If not found**: Automatically retrieve and search through GitHub Issues
3. **Task ID Confirmation**:
   - If tasks are found in GitHub Issues: Ask user to confirm which task to work on
   - If no tasks are found in either source: Create new task ID based on context without requiring confirmation
4. **Related Task Selection**: Present similar existing tasks for user selection when available
5. **New Task Creation**: Guide through GitHub Issue creation when no related tasks exist

**IMPORTANT**: The AI assistant will handle task discovery and ID generation automatically, requiring user confirmation only when selecting from existing GitHub Issues.

### 2. Git Workflow

1. **Base Branch**: Always start from an updated `main` branch
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Working Branch Creation**:
   - Name following the pattern: `type/US-XXX-brief-description`
   - Types: `feature`, `bugfix`, `hotfix`, `refactor`, `chore`
   ```bash
   git checkout -b feature/US-201-savings-goals
   ```

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
- **Prioritize Playwright MCP Tools**: Always use MCP tools when available for test automation
- Follow the Page Object Model pattern
- Ensure tests are independent and deterministic
- **Pre-Publication Validation**: Always validate tests execute successfully before publishing changes
- **Bug Detection**: Create GitHub Issues for application errors detected during testing
- Include comprehensive bug reports with logs, screenshots, and Playwright execution reports

### 5. Documentation and Rules Synchronization

⚠️ **CRITICAL REQUIREMENT FOR DOCUMENTATION CHANGES** ⚠️

When making changes to AI assistant instructions or development rules:

1. **Simultaneous Updates Required**:
   - ALWAYS update both `.cursorrules` and `.github/copilot-instructions.md` simultaneously
   - Ensure consistency between both files
   - Maintain the same standards and processes in both documents

2. **Documentation Chain Updates**:
   - Update `BUILD_STANDARDS.md` to reflect any process changes
   - Update `PLAYWRIGHT_STANDARDS.md` for test-related changes
   - Update `README.md` if the changes affect the development workflow

3. **Version Control Requirements**:
   - Include all updated files in the same commit
   - Reference the documentation changes in commit messages
   - Use format: `[TT-XXX] Update development rules and documentation`

4. **Validation Process**:
   - Verify both AI assistants can follow the updated rules
   - Test the workflows described in the documentation
   - Ensure examples and code snippets are accurate and up-to-date

### 6. Code Review

- All PRs must be reviewed before being merged
- Always include GitHub Copilot as a reviewer
- Prioritize and address Copilot's suggestions
- Ensure compliance with code standards
- **For documentation changes**: Verify that both AI assistant rule files are updated and synchronized

### 7. Integration and Deployment

- Approved PRs are merged into `main`
- Deployment to environments is done from `main`
- Automated tests are run before deployment
- **Documentation consistency**: Ensure all rule files remain synchronized across environments

## Appendices

For more details, consult:

- [Playwright Test Standards](./PLAYWRIGHT_STANDARDS.md)
- [GitHub Copilot Instructions](./.github/copilot-instructions.md)
- [Cursor Rules](./.cursorrules)
- [Project Backlog](./BACKLOG.md)

**Note**: The GitHub Copilot Instructions and Cursor Rules files must always be kept in sync. Any changes to development processes, standards, or AI assistant behavior must be reflected in both files simultaneously.
