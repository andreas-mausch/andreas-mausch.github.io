11ty project for my [website](https://andreas-mausch.de/).

Based on [eleventy-sample](https://github.com/andreas-mausch/eleventy-sample).

# Development

## Install dependencies

```
npm install
```

## Run local development server

```
npm run dev
```

## Production build

```
npm run build
```

## Linting

```
npm run lint
```

## Type checking (via tsc)

```
npm run check
```

## Pre-commit hook

Linting and type checking is also done by the npm package `pre-commit`.
It does this checks when a git commit is triggered.

You can bypass the checks by passing `--no-verify` to git commit.
See [here](https://github.com/observing/pre-commit).
