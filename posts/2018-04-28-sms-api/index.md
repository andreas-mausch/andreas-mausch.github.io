---
title: Self-made SMS receiver API
date: 2018-04-28T18:00:00+02:00
tags: ['sms', 'python', 'surfstick', 'raspberrypi', 'single board computer']
thumbnail: setup.jpg
---

Update: I've uploaded the sources [https://github.com/andreas-mausch/sms-receiver](https://github.com/andreas-mausch/sms-receiver).

{% image "website.jpg" %}

This week we had problems with our SMS provider, which offers us virtual phone numbers we can send SMS to.
We use it as SMS verification service via [Authy](https://authy.com/) on our staging system.
If you register a new account with our app, Authy sends a SMS with a code to verify your phone number.

On our staging system we use two virtual phone numbers, and when a SMS is sent to them, we can query the text via an API.
Our automated test then reads the SMS code and continues with the registration.

I wondered if I could develop a similar service by myself.  
Also, it was a good chance to make use of my old surf stick (see here: [Surfstick Huawei E173 on Linux]({% link-post "2017-05-31-surfstick-huawei-e173-on-linux" %}).  
Whenever an SMS is sent to the phone number of the SIM in the surf stick, it should be visible on a website and via a json API.

My hardware setup: The surf stick, a Raspberry Pi Zero W, a USB OTG cable and a power bank.

For the software I used gammu-smsd, MongoDB and Flask for API and website.
The MongoDB is hosted at [Atlas](https://www.mongodb.com/cloud/atlas), they offer a free clustered database, as long as it doesn't exceed 512 MB in size.

For gammu-smsd, I followed [instructions here](http://www.mattiasnorell.com/send-sms-from-a-raspberry-pi/) by Mattias Norell and [this Gist](https://gist.github.com/rcoup/93460ea39b05e957e884) by [Robert Coup](https://github.com/rcoup).

Surprisingly, I didn't have to set up usb_modeswitch. I believe this was done automatically by Raspbian.

Unfortunately, when I boot up the Pi the first time, the modem is bound to `/dev/ttyUSB1`. After restarting, it changes to `/dev/ttyUSB0` tho!
For me, I could fix it by pointing to `/dev/serial/by-id/usb-HUAWEI_Technology_HUAWEI_Mobile-if00-port0` in `/etc/gammu-smsdrc` instead (see [Gammu FAQ](https://wammu.eu/docs/manual/faq/general.html)).

Now, everytime a SMS arrives at my phone number, gammu-smsd triggers the receive.py script.
It writes the phone number, the timestamp and the text to the MongoDB hosted at Atlas.  
Then, a consumer can access the database directly, poll the API at /json or visit the website to see the latest SMS.

This is all at minimal costs. The SIM card itself doesn't have any credit on it (receiving SMS doesn't cost anything), and the Raspberry Pi almost eats no power.
I haven't tested it, but according to some guys on the internet the Pi takes ~100mA, the stick about ~150mA. So 250mA@5V = 1.25 W.  
1.25W * 720h = 0,9 kWh a month.

{% image "huawei-e173-modem.jpg" %}

{% image "raspberry-pi-zero-w.jpg" %}

{% image "setup.jpg" %}

{% image "json-api.jpg" %}

Source files (make sure you install pymongo, dnspython and Flask):

```python {data-filename=receive.py}
#!/usr/bin/env python

import os
from pymongo import MongoClient
from datetime import datetime

def main():
    mongo = MongoClient('mongodb+srv://sms:lalalalala@cluster0-xxxxx.mongodb.net/sms')
    database = mongo.get_default_database()
    messages = database.messages

    number = os.environ['SMS_1_NUMBER']
    text = os.environ['SMS_1_TEXT']
    
    messages.insert_one({
        'number': number,
        'text': text,
        'timestamp': datetime.now()
    })

if __name__ == "__main__":
    main()
```

```python {data-filename=website.py}
from bson import json_util
from flask import Flask, render_template, Response
from pymongo import MongoClient, DESCENDING

app = Flask(__name__)

mongo = MongoClient('mongodb+srv://sms:lalalalala@cluster0-xxxxx.mongodb.net/sms')
database = mongo.get_default_database()
messages = database.messages

def findLastMessages():
    return list(messages.find().limit(50).sort('timestamp', DESCENDING))

@app.route("/")
def showMessages():
    return render_template('messages.html', lastMessages=findLastMessages())

@app.route("/json")
def showMessagesJson():
    lastMessages = findLastMessages()
    for message in lastMessages:
        del message['_id']

    return Response(
        json_util.dumps(lastMessages,
            json_options=json_util.JSONOptions(
                datetime_representation=json_util.DatetimeRepresentation.ISO8601
            )
        ),
        mimetype='application/json'
    )

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
```

```html {data-filename=templates/messages.html}
{% raw %}<!DOCTYPE html>
<html>
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Last received SMS messages</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" rel="stylesheet" media="screen">
  </head>
  <body>
    <div class="container">
      <div class="jumbotron text-center">
        <h1>Last received SMS messages</h1>
        <p>For phone number +491xxxxxxx.</p> 
      </div>
      <table class="table table-hover">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Phone number</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            {% for message in lastMessages %}
            <tr>
              <td>{{message.timestamp}}</td>
              <td>{{message.number}}</td>
              <td>{{message.text}}</td>
            </tr>
            {% endfor %}
          </tbody>
      </table>
    </div>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"></script>
  </body>
</html>{% endraw %}
```
