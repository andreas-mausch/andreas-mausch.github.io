---
layout: cheatsheet
tags: filetypes
section:
  - name: File types
    commands:
      Find file types in directory: find . -type f | perl -ne 'print $1 if m/\.([^.\/]+)$/' | sort -ub
---
