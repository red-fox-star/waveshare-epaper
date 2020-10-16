#pragma once
#include "Arduino.h"
#include "buff.h"

/* SPI pin definition --------------------------------------------------------*/

#define PIN_SPI_SCK  13
#define PIN_SPI_DIN  14
#define PIN_SPI_CS   15
#define PIN_SPI_BUSY 25//19
#define PIN_SPI_RST  26//21
#define PIN_SPI_DC   27//22

#define GPIO_PIN_SET   1
#define GPIO_PIN_RESET 0

void EPD_initSPI();

/* Lut mono ------------------------------------------------------------------*/
extern byte lut_full_mono[30];

extern byte lut_partial_mono[30];


/* The procedure of sending a byte to e-Paper by SPI -------------------------*/
void EpdSpiTransferCallback(byte data);

extern byte lut_vcom0[16];
extern byte lut_w    [16];
extern byte lut_b    [16];
extern byte lut_g1   [16];
extern byte lut_g2   [16];
extern byte lut_vcom1[16];
extern byte lut_red0 [16];
extern byte lut_red1 [16];

/* Sending a byte as a command -----------------------------------------------*/
void EPD_SendCommand(byte command);

/* Sending a byte as a data --------------------------------------------------*/
void EPD_SendData(byte data);

/* Waiting the e-Paper is ready for further instructions ---------------------*/
void EPD_WaitUntilIdle() ;

/* Send a one-argument command -----------------------------------------------*/
void EPD_Send_1(byte c, byte v1);

/* Send a two-arguments command ----------------------------------------------*/
void EPD_Send_2(byte c, byte v1, byte v2);

/* Send a three-arguments command --------------------------------------------*/
void EPD_Send_3(byte c, byte v1, byte v2, byte v3);

/* Send a four-arguments command ---------------------------------------------*/
void EPD_Send_4(byte c, byte v1, byte v2, byte v3, byte v4);

/* Send a five-arguments command ---------------------------------------------*/
void EPD_Send_5(byte c, byte v1, byte v2, byte v3, byte v4, byte v5);

/* Writting lut-data into the e-Paper ----------------------------------------*/
void EPD_lut(byte c, byte l, byte*p);

/* Writting lut-data of the black-white channel ------------------------------*/
void EPD_SetLutBw(byte*c20, byte*c21, byte*c22, byte*c23, byte*c24) ;

/* Writting lut-data of the red channel --------------------------------------*/
void EPD_SetLutRed(byte*c25, byte*c26, byte*c27) ;

/* This function is used to 'wake up" the e-Paper from the deep sleep mode ---*/
void EPD_Reset() ;

/* e-Paper initialization functions ------------------------------------------*/ 
extern bool EPD_invert;           // If true, then image data bits must be inverted
extern int  EPD_dispIndex;        // The index of the e-Paper's type
extern int  EPD_dispX, EPD_dispY; // Current pixel's coordinates (for 2.13 only)
extern void(*EPD_dispLoad)();     // Pointer on a image data writting function

/* Image data loading function for a-type e-Paper ----------------------------*/ 
void EPD_loadA();

void EPD_loadAFilp();

/* Image data loading function for b-type e-Paper ----------------------------*/
void EPD_loadB();

/* Image data loading function for 2.13 e-Paper ------------------------------*/
void EPD_loadC();

/* Image data loading function for 7.5 e-Paper -------------------------------*/
void EPD_loadD();

/* Image data loading function for 7.5b e-Paper ------------------------------*/
void EPD_loadE();

/* Image data loading function for 5.83b e-Paper -----------------------------*/
void EPD_loadF();

/* Show image and turn to deep sleep mode (a-type, 4.2 and 2.7 e-Paper) ------*/
void EPD_showA() ;

/* Show image and turn to deep sleep mode (b-type, e-Paper) ------------------*/
void EPD_showB() ;

/* Show image and turn to deep sleep mode (7.5 and 7.5b e-Paper) -------------*/
void EPD_showC() ;

void EPD_showD();

/* The set of pointers on 'init', 'load' and 'show' functions, title and code */
struct EPD_dispInfo
{
    int(*init)(); // Initialization
    void(*chBk)();// Black channel loading
    int next;     // Change channel code
    void(*chRd)();// Red channel loading
    void(*show)();// Show and sleep
    char*title;   // Title of an e-Paper
};


/* Initialization of an e-Paper ----------------------------------------------*/
void EPD_dispInit();

// definitions and function headers for all the bespoke display functions
#define UBYTE   uint8_t
#define UWORD   uint16_t
#define UDOUBLE uint32_t

#define EPD_2IN9D_WIDTH   128
#define EPD_2IN9D_HEIGHT  296
int EPD_Init_1in54();
int EPD_Init_1in54b();
int EPD_Init_1in54c();
int EPD_Init_2in13();
int EPD_Init_2in13b();
int EPD_Init_2in13d();
int EPD_Init_2in7() ;
int EPD_Init_2in7b() ;
int EPD_Init_2in9() ;
void EPD_SetFullReg(void);
void EPD_2IN9D_ReadBusy(void);
void EPD_2IN9D_Show(void);
void EPD_2IN9D_Clear(void);
int EPD_Init_2in9d();
int EPD_Init_2in9b();
int EPD_Init_4in2();
int EPD_Init_4in2b();
int EPD_5in83__init();
int EPD_5in83b__init();
int EPD_7in5__init();
void EPD_7in5_V2_Readbusy(void);
void EPD_7IN5_V2_Show(void);
int EPD_7in5_V2_init();
int EPD_7in5B_V2_Init(void);
void EPD_7IN5B_HD_Readbusy(void);
void EPD_7IN5B_HD_Show(void);
int EPD_7IN5B_HD_init();

// data structure constants from the epaper displays that for some reason need global scope
extern const unsigned char lut_vcomDC_2in13d[];
extern const unsigned char lut_ww_2in13d[];
extern const unsigned char lut_bw_2in13d[];
extern const unsigned char lut_wb_2in13d[];
extern const unsigned char lut_bb_2in13d[];

/* Array of sets describing the usage of e-Papers ----------------------------*/
extern EPD_dispInfo EPD_dispMass[25];
