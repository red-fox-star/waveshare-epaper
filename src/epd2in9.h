#include "epd.h"
#include "Arduino.h"
/**
  ******************************************************************************
  * @file    edp2in9.h
  * @author  Waveshare Team
  * @version V1.0.0
  * @date    23-January-2018
  * @brief   This file describes initialisation of 2.9 and 2.9b e-Papers
  *
  ******************************************************************************
  */

#define EPD_2IN9D_WIDTH   128
#define EPD_2IN9D_HEIGHT  296

int EPD_Init_2in9();
int EPD_Init_2in9b();
int EPD_Init_2in9d();

void EPD_SetFullReg(void);
void EPD_2IN9D_ReadBusy(void);
void EPD_2IN9D_Show(void);
void EPD_2IN9D_Clear(void);
