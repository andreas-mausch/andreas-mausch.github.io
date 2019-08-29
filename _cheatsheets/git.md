---
layout: cheatsheet
section:
  - name: Sign commits
    commands:
      Set your key (obtain by 'gpg --list-secret-keys --keyid-format LONG'): "git config user.signingkey <key>"
      Tell git to sign all of your commits: git config commit.gpgsign true
  - name: git gui
    shortcuts:
      Stage file: <kbd>CTRL</kbd>+<kbd>T</kbd>
      Unstage file: <kbd>CTRL</kbd>+<kbd>U</kbd>
      Revert file: <kbd>CTRL</kbd>+<kbd>J</kbd>
---

**Replace wrong email after commits have been pushed**

```bash
git filter-branch --env-filter '
WRONG_EMAIL="wrong@example.com"
NEW_NAME="New Name Value"
NEW_EMAIL="correct@example.com"

if [ "$GIT_COMMITTER_EMAIL" = "$WRONG_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$NEW_NAME"
    export GIT_COMMITTER_EMAIL="$NEW_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$WRONG_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$NEW_NAME"
    export GIT_AUTHOR_EMAIL="$NEW_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

Keep in mind you might need to `git push --force` afterwards.
Please be aware of all the consequences of a force push.

**Push local repo to a remote url**

```bash
git remote -v # List remotes
git remote add origin <ssh-url> # e.g. git@gitlab.com:andreas-mausch/repo.git
git push -u origin --all
```
