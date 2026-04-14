# Contributing to SubTracker

Thanks for your interest in contributing!

## Development Setup

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
npm run dev
```

## Running Tests

```bash
npm test          # All packages
npm run build     # Type-check + build
```

## Adding a Bank Parser

Bank parsers live in `packages/parsers/src/banks/`. To add a new parser:

1. Create `packages/parsers/src/banks/your-bank.ts`
2. Implement the `BankParser` interface:
   ```typescript
   export const yourBankParser: BankParser = {
     id: 'your-bank',
     name: 'Your Bank',
     country: 'XX',
     dateFormat: 'YYYY-MM-DD',
     detect(headers, sampleRows) {
       // Return 0-100 confidence score
     },
     parse(headers, rows) {
       // Return ParsedTransaction[]
     },
   };
   ```
3. Register it in `packages/parsers/src/detect.ts`
4. Add tests in `packages/parsers/src/__tests__/`

## Pull Request Guidelines

- Run `npm test` and `npm run build` before submitting
- One feature/fix per PR
- Write tests for new functionality
- Keep the existing code style

## Reporting Issues

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS info if relevant
