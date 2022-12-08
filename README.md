11ty project for my [website](https://andreas-mausch.de/).

Based on [eleventy-sample](https://github.com/andreas-mausch/eleventy-sample).

# Development

## Install dependencies

```bash
npm install
```

## Run local development server

```bash
npm run dev
```

## Production build

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## Type checking (via tsc)

```bash
npm run check:types
```

## Check for broken links

Run `build` first.

```bash
npm run check:links
```

## Generate Icon Font

This project uses [icon-font-buildr](https://github.com/fabiospampinato/icon-font-buildr) to strip down fontawesomes
big icon library.

It runs automatically with the eleventy build, but you can also call it manually:

```bash
npm run generate:font
```

Tool for checking the file:

```bash
ttx -t cmap -o - ./_site/styles/icons/icons.ttf
ttx -t cmap -o - ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf
font-manager ./_site/styles/icons/icons.ttf
```

### Add new icon

Find codepoint by name:

Open `./node_modules/@fortawesome/fontawesome-free/scss/_variables.scss` and search for the name of the icon, for example for *copy*:

```
$fa-var-copy: \f0c5;
```

Then, add an entry to `./icon-font.json`:

```json
    {
      "icon": "copy",
      "name": "copy",
      "codepoints": [
        "\uf0c5"
      ]
    }
```

Next, add the icon to the `$icons` section in `styles/_icons.scss`:

```
$icons: (
  "copy": \f0c5
}
```

Last, use your icon in the HTML:

```html
<i class="icon icon-copy"></i>
```

## Navigation

To add a navigation page, add a front matter key `navigationWeight` to the page.
It will automatically show up in the navigation.
The navigation is sorted by the weights.

## Pre-commit hook

Linting and type checking is also done by the npm package `pre-commit`.
It does this checks when a git commit is triggered.

You can bypass the checks by passing `--no-verify` to git commit.
See [here](https://github.com/observing/pre-commit).
