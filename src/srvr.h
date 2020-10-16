#pragma once

#include "WebServer.h"
#include "SPIFFS.h"

#include "old_srvr.h"

class Srvr {
  public:
    Srvr();
    void init();
    void loop();

  private:
    WebServer web;

    void handleData();
};
