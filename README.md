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
- **Hermetic Execution**: Full **Docker** support for deterministic test runs and easy CI integration.
- **Parallel Orchestration**: High-speed execution with `fullyParallel` mode and dedicated **GitLab CI** pipeline.

## 📁 Project structure

- `pages/`: Page Object Classes (Locators isolated from methods).
- `tests/`: Feature-based test suites with semantic naming.
- `fixtures/`: Custom Playwright fixtures for automated PO injection.
- `data/`: Centralized test data management (users, products).
- `.husky/`: Git hooks for pre-commit linting.

## 🚀 Getting Started

### 1. Installation

```bash
npm install
npx playwright install --with-deps
```

### 2. Environment Setup

Create a `.env` file (see `.env.example`):

```bash
BASE_URL=https://www.saucedemo.com
```

### 3. Running Tests

```bash
# Run all tests (headless)
npm test

# Run with Allure report
npm run test:allure && npm run allure:report

# Run specific suite
npx playwright test tests/purchase_flow.spec.ts
```

## 📈 CI/CD Pipeline

The project includes a robust `.gitlab-ci.yml` that:

1.  **Lints** the code for quality violations.
2.  **Executes** tests in parallel across Chromium, Firefox, and Webkit.
3.  **Generates** and archives the Allure Report as a job artifact.

## 🐳 Docker Deployment

To run tests in a hermetic container:

```bash
docker build -t sauce-demo-tests .
docker run sauce-demo-tests
```

## 🛠 Quality Oversight

This project is linted using:

- `eslint-plugin-playwright`: To prevent anti-patterns like `waitForTimeout`.
- `Husky`: To ensure no unformatted or bug-prone code is ever committed.
