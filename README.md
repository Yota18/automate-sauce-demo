# MAANG-Standard Playwright Portfolio: SauceDemo

![Playwright](https://img.shields.io/badge/Playwright-v1.57.0-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Allure](https://img.shields.io/badge/Allure-v3.4-F28E2B?style=for-the-badge&logo=allure&logoColor=white)

A high-performance, scalable, and resilient End-to-End automation framework built for the **SauceDemo** application. This project demonstrates industry-best practices in modern web automation, focusing on **POM Integrity**, **Observability**, and **Enterprise-Grade Quality Gates**.

## 🌟 Key Features

- **Advanced POM Architecture**: Leverages Dependency Injection via Playwright Fixtures to isolate locators and actions.
- **Superior Observability**: Deep integration with **Allure @step** decorators, providing stakeholder-ready reports with screenshots/videos on failure.
- **Enterprise Quality Gates**: Enforced code standards using **ESLint (Playwright-specific rules)**, **Prettier**, and **Husky** pre-commit hooks.
- **Environmental Awareness**: Robust `.env` management with support for multi-environment execution (Dev/Staging/Prod).
- **Parallel Orchestration**: High-speed execution with `fullyParallel` mode and dedicated **GitLab CI** and **GitHub Actions** pipelines.
- **Multi-Browser Testing**: Automated testing across Chromium, Firefox, and WebKit.
- **Authentication Management**: Reusable authentication state for faster test execution.

## 📁 Project Structure

```
sauce-demo/
├── pages/              # Page Object Model classes
│   ├── basePage.ts            # Base class with common methods
│   ├── authenticatedPage.ts   # Shared authenticated page elements
│   ├── loginPage.ts           # Login page object
│   ├── inventoryPages.ts      # Inventory and product details pages
│   └── checkoutPages.ts       # Cart and checkout flow pages
├── tests/              # Test suites organized by feature
│   ├── auth/                  # Authentication tests
│   ├── inventory/             # Product listing and sorting tests
│   ├── checkout/              # Checkout flow tests
│   ├── navigation/            # Navigation tests
│   └── setup/                 # Test setup and authentication
├── fixtures/           # Playwright fixtures for dependency injection
│   └── fixtures.ts            # Custom test fixtures
├── data/               # Centralized test data
│   └── testData.ts            # Users, products, error messages
├── .github/            # GitHub Actions workflows
│   └── workflows/
│       └── playwright.yml    # GitHub Actions CI/CD (manual trigger)
├── .gitlab-ci.yml      # GitLab CI/CD pipeline configuration
├── playwright.config.ts # Playwright configuration
└── package.json        # Project dependencies and scripts
```

## 🧪 Test Coverage

The framework includes comprehensive test coverage:

- **Authentication Tests** (`tests/auth/`)
  - Login with valid/invalid credentials
  - Locked out user handling
  - Empty field validation
  - Logout functionality

- **Inventory Tests** (`tests/inventory/`)
  - Product listing verification
  - Product sorting (name, price)
  - Product details navigation
  - Add/remove from cart

- **Checkout Tests** (`tests/checkout/`)
  - Complete checkout flow
  - Personal information validation
  - Cart management
  - Order completion

- **Navigation Tests** (`tests/navigation/`)
  - Sidebar menu navigation
  - Page transitions

## 🚀 Getting Started

### 1. Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps
```

### 2. Environment Setup

Create a `.env` file in the project root (see `.env.example` for reference):

```bash
BASE_URL=https://www.saucedemo.com
```

### 3. Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests in headed mode
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run with Allure report
npm run test:allure && npm run allure:report

# Run specific test file
npx playwright test tests/auth/login.spec.ts

# Run specific browser
npx playwright test --project=chromium
```

### 4. Available Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests in headless mode |
| `npm run test:headed` | Run tests in headed mode |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:allure` | Run tests with Allure reporter |
| `npm run allure:report` | Generate and open Allure report |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code with Prettier |

## 📈 CI/CD Pipeline

The project includes CI/CD integration for both **GitHub Actions** and **GitLab CI**:

### GitHub Actions (`.github/workflows/playwright.yml`)
- **Manual Trigger**: Run tests on-demand via `workflow_dispatch`
- **Browser Selection**: Choose to run on all browsers or specific one (Chromium/Firefox/WebKit)
- **Artifact Storage**: Playwright reports stored for 30 days

### GitLab CI (`.gitlab-ci.yml`)
1. **Lints** the code for quality violations
2. **Executes** tests in parallel across Chromium, Firefox, and WebKit
3. **Generates** and archives the Allure Report as a job artifact

## 🛠 Quality Oversight

This project enforces code quality through:

- **ESLint**: Playwright-specific rules to prevent anti-patterns like `waitForTimeout`
- **Prettier**: Consistent code formatting across the project
- **Husky**: Pre-commit hooks to ensure no unformatted or bug-prone code is committed
- **TypeScript**: Strong typing for better IDE support and fewer runtime errors

## 🔍 Test Execution Flow

1. **Setup Phase**: Authentication state is created once and reused across tests
2. **Test Execution**: Tests run in parallel across different browsers
3. **Reporting**: Allure generates detailed reports with screenshots and videos on failure
4. **Artifacts**: Test results are stored in CI/CD (30 days for GitHub, 7 days for GitLab)

## 📊 Reporting

The framework provides multiple reporting options:

- **Allure Report**: Rich, interactive reports with step-by-step execution details
- **HTML Report**: Built-in Playwright HTML report
- **Console Output**: Real-time test execution feedback

To view the Allure report after test execution:

```bash
npm run allure:report
```

## 🐛 Troubleshooting

### Tests failing on first run
- Ensure you've run `npx playwright install --with-deps`
- Check that `.env` file exists with correct `BASE_URL`

### Authentication errors
- Delete `.auth.json` and run tests again to regenerate auth state
- Verify credentials in `data/testData.ts` are correct

### Linting errors
- Run `npm run format` to auto-fix formatting issues
- Check `eslint.config.mjs` for custom rules

### CI/CD failures
- Verify GitLab Runner has sufficient resources
- Check that all dependencies are correctly specified in `package.json`

## 📝 Best Practices Demonstrated

✅ **Page Object Model** with proper inheritance hierarchy  
✅ **Dependency Injection** via Playwright Fixtures  
✅ **Centralized Test Data** management  
✅ **Allure Reporting** with granular step visibility  
✅ **Web-First Assertions** using Playwright's auto-wait  
✅ **Negative Testing** for edge cases and error handling  
✅ **Multi-Browser** parallel execution  
✅ **Reusable Authentication** state for performance  

