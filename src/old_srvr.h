#pragma once

#include "buff.h" // POST request data accumulator
#include "epd.h"  // e-Paper driver

bool Srvr__loop() {
    // Set buffer's index to zero
    // It means the buffer is empty initially
    Buff__bufInd = 0;

    // e-Paper driver initialization
    if (Buff__signature(Buff__bufInd - 4, "EPD")) {
        Serial.print("\r\nEPD\r\n");
        // Getting of e-Paper's type
        EPD_dispIndex = (int)Buff__bufArr[Buff__bufInd - 1] - (int)'a';

        // Print log message: initialization of e-Paper (e-Paper's type)
        Serial.printf("EPD %s", EPD_dispMass[EPD_dispIndex].title);

        // Initialization
        EPD_dispInit();
    }

    // Image loading
    if (Buff__signature(Buff__bufInd - 4, "LOAD")) {
        // Print log message: image loading
        Serial.print("LOAD");

        // Load data into the e-Paper
        // if there is loading function for current channel (black or red)
        if (EPD_dispLoad != 0)
            EPD_dispLoad();
    }

    // Select the next data channel
    if (Buff__signature(Buff__bufInd - 4, "NEXT")) {
        // Print log message: next data channel
        Serial.print("NEXT");

        // Instruction code for for writting data into
        // e-Paper's memory
        int code = EPD_dispMass[EPD_dispIndex].next;

        // If the instruction code isn't '-1', then...
        if (code != -1) {
            // Print log message: instruction code
            Serial.printf(" %d", code);

            // Do the selection of the next data channel
            EPD_SendCommand(code);
            delay(2);
        }

        // Setup the function for loading choosen channel's data
        EPD_dispLoad = EPD_dispMass[EPD_dispIndex].chRd;
    }

    // If the loading is complete, then...
    if (Buff__signature(Buff__bufInd - 4, "SHOW")) {
        // Show results and Sleep
        EPD_dispMass[EPD_dispIndex].show();

        //Print log message: show
        Serial.print("\r\nSHOW");
    }

    return true;
}
