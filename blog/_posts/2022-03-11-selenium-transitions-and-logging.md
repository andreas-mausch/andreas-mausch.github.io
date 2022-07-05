---
layout: post
title: "Selenium: Disable CSS transitions and fail on JavaScript errors"
date: 2022-03-11 16:00:00 +01:00
tags: tdd testing browser chrome kotlin kotest testcontainers
---

I've done both steps for a second time (in a different project) now, so I thought it is worth a blog post.

# CSS transitions

If you use CSS animations, you have three choices for your tests:

1. Sleep for a specific amount of time and hope the animation has finished after
2. Introduce wait statements to make sure the animation ended
3. Disable animations

Option 1. was out of the question, sleep statements are just not reliable and bad practice.

I stepped away from 2., because it might be a) a lot of statements which clutter your test
and b) there's no out-of-the-box solution provided by Selenium.
You'd have to write [your own hacky one](https://stackoverflow.com/questions/39245064/wait-for-animated-button-to-stop).

So I tried 3.

Some helpful links:

- [https://www.lambdatest.com/blog/java-event-listeners/](https://www.lambdatest.com/blog/java-event-listeners/)
- [https://stackoverflow.com/questions/57481903/run-javascript-after-every-page-load](https://stackoverflow.com/questions/57481903/run-javascript-after-every-page-load)
- [https://stackoverflow.com/questions/51007542/how-to-turn-off-css-for-faster-automation-tests-execution](https://stackoverflow.com/questions/51007542/how-to-turn-off-css-for-faster-automation-tests-execution)

I ended up with this in Kotlin (kotest) using the [Testcontainers Selenium solution](https://www.testcontainers.org/modules/webdriver_containers/).
Still hacky, but my tests run reliably without the sleep statements now. :)

(`chrome` is a [BrowserWebDriverContainer](https://github.com/testcontainers/testcontainers-java/blob/40341d3912a2fe623adb83651c52a490734f3ab9/modules/selenium/src/main/java/org/testcontainers/containers/BrowserWebDriverContainer.java))

Selenium 3 (with kotest 4):

```kotlin
  override fun beforeTest(testCase: TestCase) {
    super.beforeTest(testCase)
    driver = EventFiringWebDriver(chrome.webDriver)
    driver.register(object : AbstractWebDriverEventListener() {
      override fun afterNavigateTo(url: String, driver: WebDriver) {
        val disableTransitions =
          "const styleElement = document.createElement('style');styleElement.setAttribute('id','disable-transitions');const styleTagCSSes = document.createTextNode('*,:after,:before{-webkit-transition:none!important;-moz-transition:none!important;-ms-transition:none!important;-o-transition:none!important;transition:none!important;-webkit-transform:none!important;-moz-transform:none!important;-ms-transform:none!important;-o-transform:none!important;transform:none!important}');styleElement.appendChild(styleTagCSSes);document.head.appendChild(styleElement);"
        (driver as JavascriptExecutor).executeScript(disableTransitions)
        super.afterNavigateTo(url, driver)
      }
    })
  }
```

Selenium 4 (with kotest 5):

```kotlin
  override suspend fun beforeTest(testCase: TestCase) {
    super.beforeTest(testCase)
    val disableAnimationsListener = object : WebDriverListener {
      override fun afterGet(driver: WebDriver, url: String) {
        applyStyle("*,:after,:before{-webkit-transition:none!important;-moz-transition:none!important;-ms-transition:none!important;-o-transition:none!important;transition:none!important;-webkit-transform:none!important;-moz-transform:none!important;-ms-transform:none!important;-o-transform:none!important;transform:none!important}")
        super.afterGet(driver, url)
      }
    }
    driver = EventFiringDecorator(disableAnimationsListener).decorate(chrome.webDriver)
  }
```

# JavaScript console logging errors

Second thing I wanted to check is that no JavaScript errors occured during the test.

Step one: I enabled logging of all levels, just in case I want to inspect non-errors also:

```kotlin
val loggingPreferences = LoggingPreferences()
loggingPreferences.enable(BROWSER, ALL)

val options = ChromeOptions()
options.setCapability(LOGGING_PREFS, loggingPreferences)
options.setCapability("goog:loggingPrefs", loggingPreferences)
```

The `goog:loggingPrefs` is for Google Chrome only, see [here](https://stackoverflow.com/questions/56507652/selenium-chrome-cant-see-browser-logs-invalidargumentexception).

Update: With Selenium 4 there is now a constant: *org.openqa.selenium.chrome.ChromeOptions#LOGGING_PREFS*.
The previous LOGGING_PREFS from *org.openqa.selenium.remote.CapabilityType.LOGGING_PREFS* is now deprecated.

Step two: Assert the logs (via kotest again):

```kotlin
fun assertBrowserLogs() {
    val entries = driver.manage().logs().get(BROWSER)
    val warningsAndHigher = entries.filter { it.level.intValue() >= WARNING.intValue() }

    withClue("Browser logs") { warningsAndHigher.shouldBeEmpty() }
}
```
