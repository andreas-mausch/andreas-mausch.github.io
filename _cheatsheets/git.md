---
layout: cheatsheet
section:
  - name: Sign commits
    commands:
      Set your key (obtain by gpg --list-secret-keys --keyid-format LONG): "git config user.signingkey <key>"
      Tell git to sign all of your commits: git config commit.gpgsign true
  - name: git gui
    shortcuts:
      Stage file: <kbd>CTRL</kbd>+<kbd>T</kbd>
      Unstage file: <kbd>CTRL</kbd>+<kbd>U</kbd>
      Revert file: <kbd>CTRL</kbd>+<kbd>J</kbd>
---
