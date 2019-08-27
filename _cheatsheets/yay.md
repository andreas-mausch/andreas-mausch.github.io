---
layout: cheatsheet
tags: pacman manjaro
section:
  - name: Install
    commands:
      install: yay -S <package>
      "uninstall (-n: no backup files; -s: remove dependencies)": yay -Rns <package>
      system update: yay -Syyu
  - name: Search repo
    commands:
      search package: yay -Ss <package>
      package details: yay -Si <package>
      list files: yay -Fl <package>
  - name: Installed packages
    commands:
      search package: yay -Qs <package>
      package details: yay -Qii <package>
      list files: yay -Ql <package>
      orphans: yay -Qdt
  - name: Official repo vs. AUR
    commands:
      repo: yay -[...] --repo
      aur: yay -[...] --aur
---
