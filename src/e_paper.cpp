#include <Arduino.h>

#include "old_srvr.h"
#include "srvr.h"

#include <radiate.h>

Radiate *radiate = new Radiate("My IoT Project");
Srvr *server = new Srvr();

void setup() {
  Serial.begin(115200);
  delay(1000);

  if (!SPIFFS.begin(false)) {
    Serial.println("SPIFFS Mount Failed");
  }

  radiate->connectOrPortalize();
  server->init();

  EPD_initSPI();

  Serial.println("Initialization is complete.");
}

void loop() {
  server->loop();
}
