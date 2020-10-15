#include "srvr.h"

Srvr::Srvr() {
  WebServer web(80);
}

void Srvr::init() {

  web.serveStatic("/index.html", SPIFFS, "/epd/index.html");
  web.serveStatic("/scripts.js", SPIFFS, "/epd/scripts.js");
  web.serveStatic("/styles.css", SPIFFS, "/epd/styles.css");

  web.on("/favicon.ico", [this]() {
    web.send(404, "text/plain", "icon");
  });

  web.onNotFound([this]() {
    Serial.printf(
        "404 %s -> (redirect to index)\n",
        web.uri().c_str()
    );

    web.sendHeader("Location", "/index.html", true);
    web.send(301, "text/plain", web.uri().c_str());
  });

  web.begin();

  Serial.printf("Portal server started at %s\n", WiFi.localIP().toString().c_str());
}

void Srvr::loop() {
  web.handleClient();
}
