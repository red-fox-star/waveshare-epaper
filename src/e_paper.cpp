#include <Arduino.h>

#include "srvr.h"

#include <radiate.h>

Radiate *radiate = new Radiate("My IoT Project");
Srvr *server = new Srvr();

void setup() {
  if (!SPIFFS.begin(false)) {
    Serial.println("SPIFFS Mount Failed");
  }

  Serial.begin(115200);
  radiate->connectOrPortalize();
  server->init();

  EPD_initSPI();

  Serial.println("Initialization is complete.");
}

void loop() {
  server->loop();
}
