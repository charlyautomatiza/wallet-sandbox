# Playwright Test Automation Standards

This directory contains a set of instruction files that define the standards and best practices for using Playwright in test automation within this project.

## Available Instruction Files

1. [General Guidelines](playwright-general.md) - Overall project structure and general testing guidelines
2. [Locator Strategies](playwright-locators.md) - How to select and interact with elements
3. [Page Object Model](playwright-pom.md) - Implementing the Page Object Model pattern
4. [Assertions and Test Structure](playwright-assertions.md) - How to structure tests and make assertions
5. [Data-Driven Testing](playwright-data-driven-testing.md) - Implementing data-driven tests for efficient test coverage
6. [API Testing](playwright-api-testing.md) - Standards for API testing with Playwright
7. [API Mocking](playwright-api-mocking.md) - Strategies for mocking API responses
8. [Model Context Protocol (MCP)](playwright-mcp.md) - Guidelines for using Playwright with AI-assisted testing
9. [Configuration and Best Practices](playwright-config.md) - Configuration options and advanced practices

## Key Principles

- **Reliability**: Tests should be stable and not produce flaky results
- **Maintainability**: Code should be easy to understand and modify
- **Efficiency**: Tests should run as quickly as possible without sacrificing reliability
- **Isolation**: Tests should be independent and not affect each other
- **Readability**: Test code should clearly express the intent and behavior being tested

## Getting Started

To set up Playwright in this project:

\`\`\`bash
# Install Playwright
npm init playwright@latest

# Note: If AI-assisted testing tools are required, refer to the `.github/copilot/` directory for GitHub Copilot setup or the `.cursor/rules/` directory for Cursor AI setup. Detailed instructions can also be found in the `README.md` file in the root directory.

# Run tests
npx playwright test

# Show report
npx playwright show-report
\`\`\`

## Integration with GitHub Actions

Playwright tests are automatically run on pull requests and merges to main branches. See the CI configuration in `.github/workflows/playwright.yml`.

## Additional Resources

- [Playwright Official Documentation](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright MCP Documentation](https://playwright.dev/docs/mcp)
- [Test Automation Patterns](https://martinfowler.com/articles/practical-test-pyramid.html)
