---
layout: cheatsheet
tags: search
section:
  - name: Search file contents
    commands:
      Find string in files: grep -iR --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude=package-lock.json "<your string>" .
---
