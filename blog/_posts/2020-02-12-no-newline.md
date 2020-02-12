---
layout: post
title:  "No newline at end of file"
date:   2020-02-12 11:00:00 +01:00
tags:
---

![]({{ site.baseurl }}/images/2020-02-12-no-newline/no-newline.png)

tl;dr: Please put an empty line at the end of each text/source file (if you want to be POSIX compliant).

## Reason

[This.](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_206)

See also: [here](https://stackoverflow.com/questions/729692/why-should-text-files-end-with-a-newline/729795#729795)

![]({{ site.baseurl }}/images/2020-02-12-no-newline/posix.png)

## How tools show it

### git diff

![]({{ site.baseurl }}/images/2020-02-12-no-newline/git-diff.png)

Note: `4b825dc642cb6eb9a060e54bf8d69288fbee4904` is a hash for the empty tree of git (see [here](https://stackoverflow.com/questions/9765453/is-gits-semi-secret-empty-tree-object-reliable-and-why-is-there-not-a-symbolic)).

### cat

![]({{ site.baseurl }}/images/2020-02-12-no-newline/cat.png)

### git gui

![]({{ site.baseurl }}/images/2020-02-12-no-newline/git-gui.png)

### Github

![]({{ site.baseurl }}/images/2020-02-12-no-newline/github.png)

### Gitlab

![]({{ site.baseurl }}/images/2020-02-12-no-newline/gitlab.png)

### Sourcetree

![]({{ site.baseurl }}/images/2020-02-12-no-newline/sourcetree.png)

### VS Code setting

..to automatically at a newline, if missing:

![]({{ site.baseurl }}/images/2020-02-12-no-newline/vscode-setting.png)

### ESLint rule

![]({{ site.baseurl }}/images/2020-02-12-no-newline/eslint.png)
