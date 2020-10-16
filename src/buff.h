#pragma once

/* Size, current position index and byte array of the buffer -----------------*/
#define Buff__SIZE 2050
extern int     Buff__bufInd;
extern char    Buff__bufArr[Buff__SIZE];

/* Reads a word from the buffer at specified position ------------------------*/
int Buff__getByte(int index);

/* Reads a byte from the buffer at specified position ------------------------*/
int Buff__getWord(int index);

/* Checks if the buffer's data ends with specified string --------------------*/
int Buff__signature(int index, char*str);
