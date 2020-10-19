#include "Arduino.h"
#include "epd.h"
/**
  ******************************************************************************
  * @file    edp7in5_HD.h
  * @author  Waveshare Team
  * @version V1.0.0
  * @date    23-January-2018
  * @brief   This file describes initialisation of 7.5 and 7.5b e-Papers
  *
  ******************************************************************************
  */

/*****************************************************************************
                      EPD_7IN5B_HD
******************************************************************************/

void EPD_7IN5B_HD_Readbusy(void);
void EPD_7IN5B_HD_Show(void);
int EPD_7IN5B_HD_init();
