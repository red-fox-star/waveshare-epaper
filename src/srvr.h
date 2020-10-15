#pragma once

#include <WebServer.h>
#include <SPIFFS.h>


class Srvr {
  public:
    Srvr();
    void init();
    void loop();

  private:
    WebServer web;
};
