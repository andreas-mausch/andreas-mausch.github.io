---
layout: post
title:  "Protractor: Geolocation in Google Chrome"
date:   2015-12-14 06:00:00
tags:
---
I am currently developing a hybrid app using Ionic.
[http://ionicframework.com](http://ionicframework.com)  
For end-to-end tests, they recommend Protractor. [http://www.protractortest.org](http://www.protractortest.org)  
Furthermore, I use a [Selenium docker container](https://github.com/SeleniumHQ/docker-selenium).

As many other apps, I make use of geolocation to receive the users position.
However, when I tried to run a test with geolocation, it failed. I then used VNC to see if there is any error message, and I discovered Google Chrome prompts the user to allow or disallow geolocation. I searched the internet for answers, but couldn't find any. [This](http://stackoverflow.com/questions/23431059/how-to-mock-call-to-navigator-geolocation-in-protractor-tests) didn't work for me.

On the Selenium website they describe a way to change the preferences passed to the GoogleDriver using the ChromeOptions. After some more experimenting I found there is an option "**profile.default_content_setting_values.geolocation**". If this is set to 1, the browser will no longer ask the user for permission.  
Happy testing!

protractor.conf.js:
{% highlight javascript %}
exports.config = {
  capabilities: {
    browserName: "chrome",
    chromeOptions: {
      prefs: {
        "profile.default_content_setting_values.geolocation": 1,
      }
    }
  },
  // ... rest of your configuration
{% endhighlight %}

Oh, and now I found there is an issue about this topic with the same answer [here](https://github.com/angular/protractor/issues/2626).

#### UPDATE
Ok, the reason why the mocked version of stackoverflow.com (see above) didn't work for me was the timing. My app immediately tries to get the location, right after page load. The execution of browser.executeScript() just takes too long to have any effect, the geolocation has already been processed. After inserting a manual setTimeout(..., 1000) it worked. BUT: I do not want to have any artificial delay just to get my tests right. Ummm...have to think about that...

At some point there will be a locate-me-now-button, so I will probably make my tests click that button after executeScript(fakeGps). It is not exactly what happens at user's end, but I think it will be good enough for the test. :|
