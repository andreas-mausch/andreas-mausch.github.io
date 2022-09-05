11ty project for my [website](https://andreas-mausch.de/).

Based on [eleventy-sample](https://github.com/andreas-mausch/eleventy-sample).

# Navigation

To add a navigation page, add a front matter key `navigationWeight` to the page.
It will automatically show up in the navigation.
The navigation is sorted by the weights.

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

## Generate Icon Font

This project uses [icon-font-buildr](https://github.com/fabiospampinato/icon-font-buildr) to strip down fontawesomes
big icon library.

```
npm run generate:font
```

Tool for checking the file:

```
ttx -t cmap -o - ./_site/styles/icons/icons.ttf
ttx -t cmap -o - ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf
font-manager ./_site/styles/icons/icons.ttf
```

## Pre-commit hook

Linting and type checking is also done by the npm package `pre-commit`.
It does this checks when a git commit is triggered.

You can bypass the checks by passing `--no-verify` to git commit.
See [here](https://github.com/observing/pre-commit).
