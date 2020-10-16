#include "srvr.h"

Srvr::Srvr() {
  WebServer web(80);
  LoggingHandler logger();
}

void Srvr::init() {
  web.addHandler(&this->logger);

  web.serveStatic("/index.html", SPIFFS, "/epd/index.html");
  web.serveStatic("/scripts.js", SPIFFS, "/epd/scripts.js");
  web.serveStatic("/styles.css", SPIFFS, "/epd/styles.css");

  web.on("/favicon.ico", [this]() {
    web.send(404, "text/plain", "icon");
  });


  web.onNotFound([this]() {
    // this->buffer.set(std::string(web.uri().c_str()));
    this->handleData();
  });

  web.begin();

  Serial.printf("Portal server started at %s\n", WiFi.localIP().toString().c_str());
}

void Srvr::loop() {
  web.handleClient();
}

void Srvr::handleData() {
}

  /*
void Srvr::handleData() {
    // e-Paper driver initialization
    if (this->buffer.signature("EPD")) {
        Serial.print("\r\nEPD\r\n");
        // Getting of e-Paper's type
        //EPD_dispIndex = (int)Buff__bufArr[Buff__bufInd - 1] - (int)'a';

        // Print log message: initialization of e-Paper (e-Paper's type)
        Serial.printf("EPD %s", "ohai" );
        // EPD_dispMass[EPD_dispIndex].title

        // Initialization
        //EPD_dispInit();
    }

    // Image loading
    if (this->buffer.signature("LOAD")) {
        // Print log message: image loading
        Serial.print("LOAD");

        // Load data into the e-Paper
        // if there is loading function for current channel (black or red)
        // if (EPD_dispLoad != 0)
        //     EPD_dispLoad();
    }

    // Select the next data channel
    if (this->buffer.signature("NEXT")) {
        // Print log message: next data channel
        Serial.print("NEXT");

        // Instruction code for for writting data into
        // e-Paper's memory
        int code = 0;
        // code = EPD_dispMass[EPD_dispIndex].next;

        // If the instruction code isn't '-1', then...
        if (code != -1) {
            // Print log message: instruction code
            Serial.printf(" %d", code);

            // Do the selection of the next data channel
        //    EPD_SendCommand(code);
            delay(2);
        }

        // Setup the function for loading choosen channel's data
        //EPD_dispLoad = EPD_dispMass[EPD_dispIndex].chRd;
    }

    // If the loading is complete, then...
    if (this->buffer.signature("SHOW")) {
        // Show results and Sleep
        //EPD_dispMass[EPD_dispIndex].show();

        //Print log message: show
        Serial.print("\r\nSHOW");
    }
}
  */
