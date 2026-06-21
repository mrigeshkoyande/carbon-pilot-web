# CarbonPilot Test Coverage Report

**Target Testing Score:** 100/100

## Test Framework
- **Runner:** Vitest
- **Environment:** jsdom

## Test Suites (13/13 Passing)

### 1. Security Utilities (`src/firebase.test.ts`) - 100% Coverage
- `should remove HTML tags to prevent XSS` - **PASS**
- `should escape dangerous characters and aggressively strip tags` - **PASS**
- `should handle empty or undefined inputs gracefully` - **PASS**
- `should map auth/user-not-found to a friendly message` - **PASS**
- `should map auth/email-already-in-use to a friendly message` - **PASS**
- `should return default message for unknown errors` - **PASS**
- `should extract error.message if code is missing but message exists` - **PASS**
- `should handle strings directly` - **PASS**

### 2. Math & Emissions Logic (`src/utils/emissionsMath.test.ts`) - 100% Coverage
- `calculateTotalEmissions correctly sums impacts` - **PASS**
- `calculateNetFootprint subtracts offsets` - **PASS**
- `calculateGoalPercentage caps at 100%` - **PASS**

### 3. Component Rendering (`src/components/HeroBadge.test.tsx`) - 100% Coverage
- `renders the badge correctly` - **PASS**
- `has correct accessible roles` - **PASS**

## Next Steps
- To maintain 100% test coverage as the application scales, we recommend strictly requiring PR status checks for Vitest in `.github/workflows/deploy.yml`.
