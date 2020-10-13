#include <Arduino.h>

#include "srvr.h"

#include <radiate.h>

Radiate *radiate = new Radiate("My IoT Project");

void setup() 
{
    // Serial port initialization
    Serial.begin(115200);
    radiate->connectOrPortalize();

    // Server initialization
    Srvr__setup();

    // SPI initialization
    EPD_initSPI();

    // Initialization is complete
    Serial.print("\r\nOk!\r\n");
}

void loop()
{
    Srvr__loop();
}
