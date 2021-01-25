---
layout: post
title:  "Stubbing third party services"
date:   2019-05-02 17:00:00 +02:00
tags:
---

When you connect third party web services to your application,
you'd like convenient way to work with them during development.

# The external service

Let's assume our application calls a REST API to validate user addresses.

```
GET https://imaginary-address-validation.com/api?address=Jungfernstieg%201,20095%20Hamburg

HTTP/1.1 200 OK
{valid:true}
```

# The problem

In my current project, they've decided to choose a mechanism like this:

```java
public boolean validate(Address address) {
    if (isOnLocalServer()) {
        return true;
    }

    return callRestApi(System.getProperty("ADDRESS_VALIDATION_API_ENDPOINT"), address);
}
```

This way, you can easily develop, while still having a working address validation on your production and testing systems, right?  
Well, not really. The problem with this code snippet is: **You can't reproduce an invalid address on your local system**.

In order to test a failing address validation locally, you'd have to bloat this code to something like this:

```java
public boolean validate(Address address) {
    if (isOnLocalServer()) {
        if ("invalidaddress".equals(address.getStreetName())) {
            return false;
        }
        return true;
    }

    return callRestApi(System.getProperty("ADDRESS_VALIDATION_API_ENDPOINT"), address);
}
```

So whenever you type in "invalidaddress" in the street name field, the validation will fail on your local development server.
This can be handy for manual testing.

So what's the problem with this solution?  
It is not **automatically testable**!

Yes, you can write a test which calls the method and tests the happy und unhappy path.
But:

- if you test with your local environment, the code which runs in production is never tested.
- And if you test with the testing environment, the test will make a real API request to a third party provider.
You'd like to avoid this, see below.

# A better approach

My goal is to have:

- Different URLs per environment (production, testing, development, ..)
- Testable code
  - Unit tests can mock API responses if needed
  - End-to-end tests should use the same logic as production code -> no if/else depending on your environment
- Offline: You should be able to work without the requirement for an internet connection. Your tests shouldn't depend on the third party:
  - If you ever worked in a train, where it's likely to have slow and dropping internet connection, you will appreciate an application which can run 100% on your development machine.
  - Reproducibility: Tests shouldn't fail, just because a third-party responses in a different way than you expected.
  - They might have outages from time to time, this shouldn't block you from development.

To achieve this, you can write a very simple, lightweight stub, which just provides predefined responses for your requests.
You start it in your local environment and the CI, and point the endpoint url to it (in this example ADDRESS_VALIDATION_API_ENDPOINT can point to e.g. http://localhost:8080/stubs/address-validation/api).  
The stub can even be written using a different technology than your main application.  
You can move the "invalidaddress" logic for successful and non-successful responses into the stub.

The production code will be cleaner, too, as it doesn't have to differentiate between your environment anymore:

```java
public boolean validate(Address address) {
    return callRestApi(System.getProperty("ADDRESS_VALIDATION_API_ENDPOINT"), address);
}
```

Of course, you need to maintain the stub accordingly to the real API. However, to me that's not a real downside because you need to maintain the real API calls in your application anyway. This way, you even make sure your application works fine after an API has changed.

# Example stub using kscript and ktor

For the simple API in this example, please find below a stub written in [kscript](https://github.com/holgerbrandl/kscript) and [ktor](https://ktor.io/).
Ramp-up time is <2sec, and as you can see it's not much code and pretty straight-forward.  
To run it, execute `kscript stub.kscript`, and it will start listening on port 8080. Example URL: http://0.0.0.0:8080/api?address=invalidaddress

*stub.kscript*
```kotlin
@file:DependsOn("io.ktor:ktor-server-core:1.1.4")
@file:DependsOn("io.ktor:ktor-server-netty:1.1.4")
@file:DependsOn("ch.qos.logback:logback-classic:1.2.3")

import ch.qos.logback.classic.Logger
import ch.qos.logback.classic.Logger.*
import ch.qos.logback.classic.Level.*
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import java.io.File
import org.slf4j.LoggerFactory

(LoggerFactory.getLogger(ROOT_LOGGER_NAME) as Logger).setLevel(INFO)

fun responseFilename(address: String): String {
    if (address == "invalidaddress") {
        return "failure.json"
    }
    return "success.json"
}

val server = embeddedServer(Netty, port = 8080) {
    routing {
        get("/api") {
            val address = call.request.queryParameters["address"]
            call.respondFile(File(responseFilename(address!!)))
        }
    }
}
server.start(wait = true)
```

*success.json*
```
{valid:true}
```

*failure.json*
```
{valid:false}
```

# Alternatives using mock servers

The approach above shows you the one with the greatest flexibiliy.
In many cases, it is easier and faster to use static data.

My favorite mock server is: [https://github.com/sinedied/smoke](https://github.com/sinedied/smoke)

For Java, I've used this in the past: [https://www.mock-server.com](https://www.mock-server.com)
