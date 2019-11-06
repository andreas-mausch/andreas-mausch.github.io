---
layout: cheatsheet
tags: filetypes
section:
  - name: File types
    commands:
      Find file types in directory: find . -type f | perl -ne 'print $1 if m/\.([^.\/]+)$/' | sort -ub
      List file count and sizes grouped by extension: find . -name '?*.*' -type f -print0 | perl -0ne 'if (@s = stat$_){ ($ext = $_) =~ s/.*\.//s; $s{$ext} += $s[12]; $n{$ext}++; } END { for (sort{$s{$a} <=> $s{$b}} keys %s) { printf "%15d %6d %s\n",  $s{$_}<<9, $n{$_}, $_; } }' | numfmt --to=iec-i --suffix=B
---
