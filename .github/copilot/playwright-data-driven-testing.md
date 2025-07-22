# Data-Driven Testing with Playwright

## Overview

Data-driven testing allows you to run the same test with different inputs, making your test suite more efficient and maintainable. Instead of creating multiple similar tests, you create a single test that runs with different test data.

## Benefits

- Reduces code duplication by reusing test logic with different data sets
- Makes tests more maintainable - changes to the test flow only need to be made in one place
- Improves test coverage by making it easier to test more scenarios
- Preserves single responsibility principle while testing multiple scenarios

## Implementation Patterns

### Using Dynamic Data Generation with Faker

\`\`\`typescript
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('User login with different roles', () => {
  const roles = ['admin', 'editor', 'viewer'];
  
  // Create a test for each user role with dynamically generated data
  for (const role of roles) {
    test(`${role} login works correctly`, async ({ page }) => {
      // Generate unique test data for each run
      const user = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        role: role,
        email: faker.internet.email()
      };
      await page.goto('/login');
      
      // Fill login form
      await page.getByLabel('Username').fill(user.username);
      await page.getByLabel('Password').fill(user.password);
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Assert successful login
      await expect(page.getByText(`Welcome, ${user.username}`)).toBeVisible();
      
      // Assert role-specific element visibility
      if (user.role === 'admin') {
        await expect(page.getByRole('link', { name: 'Admin Panel' })).toBeVisible();
      } else if (user.role === 'editor') {
        await expect(page.getByRole('link', { name: 'Edit Content' })).toBeVisible();
      } else {
        await expect(page.getByRole('link', { name: 'View Reports' })).toBeVisible();
      }
    });
  }
});
\`\`\`

### Loading Test Data from JSON Files

\`\`\`typescript
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

// Load test data from a JSON file in the data folder
const testUsers = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8')
);

test.describe('User authentication flows', () => {
  for (const userData of testUsers) {
    test(`Login as ${userData.role}`, async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      const homePage = new HomePage(page);
      await loginPage.goto();
      
      // Act
      await loginPage.login(userData.username, userData.password);
      
      // Assert
      await expect(homePage.welcomeMessage).toContainText(userData.username);
      await expect(homePage.roleSpecificElement(userData.role)).toBeVisible();
    });
  }
});
\`\`\`

### Combining Faker with JSON Templates

\`\`\`typescript
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import { UserPage } from '../pages/UserPage';

// Load base templates from JSON
const userTemplates = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/user-templates.json'), 'utf-8')
);

// Enhance templates with dynamic data
const users = userTemplates.map(template => ({
  ...template,
  username: faker.internet.userName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress()
}));

test.describe('User profile management', () => {
  for (const user of users) {
    test(`Can update profile for user with ${user.role} permissions`, async ({ page }) => {
      const userPage = new UserPage(page);
      // Test implementation using dynamically generated user data
    });
  }
});
\`\`\`

### Using Generated Product Data with Faker

\`\`\`typescript
// product-listing.spec.ts
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import * as fs from 'fs';

// Import product categories from a JSON file
const productCategories = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/product-categories.json'), 'utf-8')
);

// Generate dynamic product data
const generateProductData = (category) => {
  return {
    id: faker.string.uuid(),
    name: `${faker.commerce.productAdjective()} ${category.type}`,
    price: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
    category: category.name,
    inStock: faker.datatype.boolean(),
    description: faker.commerce.productDescription(),
    // Calculate expected tax based on price (simplified example)
    get expectedTax() { 
      return parseFloat((this.price * 0.08).toFixed(2));
    }
  };
};

// Generate a product for each category
const productData = productCategories.map(category => generateProductData(category));

test.describe('Product pricing displays correctly', () => {
  for (const product of productData) {
    test(`Correctly displays price and tax for ${product.name}`, async ({ page }) => {
      await page.goto(`/products/${product.id}`);
      
      // Check product details
      await expect(page.getByTestId('product-name')).toContainText(product.name);
      await expect(page.getByTestId('product-price')).toContainText(`$${product.price}`);
      await expect(page.getByTestId('product-tax')).toContainText(`$${product.expectedTax}`);
      
      // Check stock status
      if (product.inStock) {
        await expect(page.getByText('In Stock')).toBeVisible();
      } else {
        await expect(page.getByText('Out of Stock')).toBeVisible();
      }
    });
  }
});
\`\`\`

## Best Practices

1. **Dynamic Data Generation**
   - Always use dynamic data generation libraries like Faker or test data from JSON files
   - Never hardcode test data directly in test specs
   - Example: `faker.internet.userName()` instead of `'user1'`
   
   \`\`\`typescript
   // ❌ BAD: Hardcoded test data in the spec
   const users = [
     { username: 'user1', password: 'pass1', role: 'admin' },
     { username: 'user2', password: 'pass2', role: 'editor' }
   ];
   
   // ✅ GOOD: Dynamic data generation with Faker
   const users = Array.from({ length: 2 }).map((_, i) => ({
     username: faker.internet.userName(),
     password: faker.internet.password(),
     role: ['admin', 'editor'][i]
   }));
   
   // ✅ ALSO GOOD: Data from JSON file
   const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));
   \`\`\`

2. **Descriptive Test Names**
   - Include data variations in test names for clear reports
   - NEVER use numeric prefixes in test names
   - Example: `test('Login as ${userData.role}', async ({ page }) => {...}`
   
   \`\`\`typescript
   // ❌ BAD: Using numeric prefixes
   test(`TC${index}: Transfer ${amount} to ${recipient}`, async ({ page }) => {...});
   
   // ✅ GOOD: Descriptive without ordering
   test(`Transfer ${amount} to ${recipient} should succeed`, async ({ page }) => {...});
   \`\`\`

3. **Organize Test Data**
   - Store test data templates in a dedicated `/data` folder
   - Structure JSON files logically by feature or test type
   - Combine static data from JSON with dynamic values from Faker

4. **Limit Data Variations**
   - Include enough variations to cover important scenarios
   - Avoid excessive combinations that increase test time without adding value

5. **Handle Different Assertions**
   - Use conditional assertions based on data values
   - Keep the test flow consistent while varying assertions based on data

6. **Independent Test Data**
   - Each data set should be self-contained and not rely on other tests
   - Include all necessary setup data for each test case
   
7. **Seed Faker for Reproducibility**
   - Set a seed when needed for reproducible tests
   - Example: `faker.seed(123)` to get the same random values each run

## Sample Data Folder Structure

\`\`\`
project-root/
├── tests/
│   └── example.spec.ts
├── data/
│   ├── users.json
│   ├── products.json
│   ├── transactions.json
│   └── test-scenarios/
│       ├── login-scenarios.json
│       ├── payment-scenarios.json
│       └── transfer-scenarios.json
└── ...
\`\`\`

## When to Use Data-Driven Testing

- When testing the same workflow with different inputs
- When testing boundary values (min, max, valid, invalid)
- When testing with different user roles or permissions
- When testing internationalization or localization features

## When NOT to Use Data-Driven Testing

- When test flows differ significantly between scenarios
- When tests have different setup requirements
- When combining unrelated test cases (violates single responsibility)

## Example Data/Faker Setup

\`\`\`typescript
// File: test-setup/data-helpers.ts
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

faker.locale = 'es'; // Example: Set locale to Spanish

// Generate locale-specific user data for testing
export const generateLocalizedUser = (locale = 'en', role = 'user') => {
  faker.locale = locale; // Set the desired locale
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    role,
    createdAt: faker.date.recent().toISOString()
  };
};

export const loadTestData = <T>(filename: string): T[] => {
  const filePath = path.join(__dirname, '../data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

export const generateUser = (role = 'user') => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    role,
    createdAt: faker.date.recent().toISOString()
  };
};

export const generateTransaction = (options = {}) => {
  const amount = faker.finance.amount({ min: 100, max: 10000 });
  return {
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(['transfer', 'payment', 'deposit']),
    amount: parseFloat(amount),
    currency: faker.finance.currencyCode(),
    date: faker.date.recent().toISOString(),
    status: faker.helpers.arrayElement(['completed', 'pending', 'failed']),
    description: faker.finance.transactionDescription(),
    ...options
  };
};
\`\`\`
