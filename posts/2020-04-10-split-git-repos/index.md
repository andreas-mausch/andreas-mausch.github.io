---
title: Split Git Repos
date: 2020-04-10T15:00:00+02:00
tags: ['git', 'repos', 'split']
---

My website has grown over time.

First, I just had a site for the WhatsApp Viewer.  
Then, I've added a blog.  
Then, I've added my landing page to present myself as a software professional.  
Then, I've added a gallery.  
Then, I've added my resume.  
Then, I've added a site about things I like.  
Then, I've added cheatsheets.

I've noticed the repo was getting too big for my likes.

So I'd rather like to have subdomains with separated repos, like [cheatsheets.andreas-mausch.de](https://cheatsheets.andreas-mausch.de).

Here are some commands which were useful to me:

```bash
# Create a new copy of the existing repo
git clone <original_repo>

# This command keeps all files with this pattern: gallery.html gallery images/gallery _layouts/gallery.html
# All other files are deleted, and all commits which do not touch these files are dropped.
git filter-branch --index-filter 'git rm --cached -qr --ignore-unmatch -- . && git reset -q $GIT_COMMIT -- gallery.html gallery images/gallery _layouts/gallery.html' --prune-empty -- --all

# Now, this repo only contains files related to gallery stuff.
# But, there are still references in the .git folder to all the other files.
# We don't need them any longer and can save some space by shrinking the .git folder:
rm -Rf .git/refs/original
rm -Rf .git/logs/
git gc --aggressive --prune=now
git prune --expire now
```

Once we have created a new repo with only gallery-files inside,
we can delete those files in the original repo.

```bash
cd <original_repo>
# This deletes all gallery related files from the repo
git filter-branch --index-filter 'git rm -rf --cached --ignore-unmatch gallery.html gallery images/gallery _layouts/gallery.html' --prune-empty --tag-name-filter cat -- --all

# Now, run the same cleanup commands from above
```

Note: You need to **force-push** after the changes. Do this with care and be aware what the consequences of a force-push are!
