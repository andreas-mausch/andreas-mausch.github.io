Jekyll project for my [website](https://andreas-mausch.de/).

If you have [trouble](https://stackoverflow.com/questions/65539326/is-the-pathutil-ruby-gem-compatible-with-jekyll-v3-9-0-and-ruby-v3-0-0)
to [run](https://github.com/envygeeks/pathutil/pull/5) this, e.g. you are using Ruby 3.0, then you can run it via docker:

```bash
docker run -it --rm --volume="$PWD:/srv/jekyll" -p 4000:4000 jekyll/jekyll:3.8 jekyll serve
```
