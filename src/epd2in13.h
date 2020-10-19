#include "Arduino.h"
#include "epd.h"
/**
  ******************************************************************************
  * @file    edp2in13.h
  * @author  Waveshare Team
  * @version V1.0.0
  * @date    23-January-2018
  * @brief   This file describes initialisation of e-Papers:
  *              2.13,
  *              2.13b and 2.13c,
  *              2.13d.
  *
  ******************************************************************************
  */

int EPD_Init_2in13();
int EPD_Init_2in13b();
int EPD_Init_2in13d();

// data structure constants from the epaper displays that for some reason need global scope
extern const unsigned char lut_vcomDC_2in13d[44];
extern const unsigned char lut_ww_2in13d[];
extern const unsigned char lut_bw_2in13d[];
extern const unsigned char lut_wb_2in13d[];
extern const unsigned char lut_bb_2in13d[];

