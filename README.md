# waveshare-epaper
A working and remodeled demo libary for the waveshare esp32 epaper driver board.

Originally based off of the Oct-2020 [sample code](https://www.waveshare.com/wiki/E-Paper_ESP32_Driver_Board), this fork:

- Adds a captive portal WiFi utility, to make unnecessary to re-compile the code to join an access point.
- Moves the web inteface code (html/js/css) over to SPIFFS, and provide helper utilites to make that usable.
- Reorganizes the driver libraries into .h/.cpp files.
- Replaces the custom webserver with the ESP core WebServer implementation.
- Notably _doesn't touch_ the low level epaper driver routines.

## Getting it running

Should you feel the need to do so, this project should run under these parameters.

### Hardware
- [This is the Waveshare ESP32 EPD](https://www.waveshare.com/wiki/E-Paper_ESP32_Driver_Board).
- [This is a big e-paper display](https://www.waveshare.com/7.5inch-e-paper-c.htm) also from Waveshare.

### Software environment
- Use some presence of [Platformio](http://platformio.org) and hit "upload."
- The [Radiate](https://github.com/tumblerlock/radiate) captive portal requires `brew install tdewolff/tap/minify` to be installed.
- Run `scripts/compress_www && scripts/upload_www` after clone to minify and send the web assets to the onboard filesystem.

### Getting started
- The serial monitor will communicate the state of the onboard WiFi. Connect to the access point to enter wifi configuration if necessary.
- The serial monitor will show an ip address where the web interface will be made available.

### Navigating the web UI
- Select your e-Paper display from the scattershot of radio buttons at the bottom left.
- Add an image.
- Push a "Level" or "Dithering" button.
- Push "Upload."
- Hope for the best. Be patient. The display won't show anything until the upload is complete, and it'll take several seconds to fully render an image thereafter.

## Personal notes on the project

### Web interface
The web interface for the project implements a custom image format which is URL safe. The images are "uploaded" by breaking the image data into 1000 character chunks and then sent via POST to the root URL (http://0.0.0.0/imgDataRightHereInTheURL). With the ESP WebServer code this is implemented on the notFound route, and then handed over to the lower level driver routine. It seems like an easy refactor to change this into an actual series of declared routes, but the js code is difficult enough to follow that enhancing it on the front end doesn't seem like it's worth the time.

The web interface code is a custom microframework and has been minified, either by painstaking attempts to save bytes, or some other form of masochism. The web interface was broken up into 4 separate script files and uploaded as raw strings in the binary. I took some rudamentary attempts to clean it up, but it's pretty rough code to follow.

The web interface handles all the image processing before upload to the board, which is a clever way to save space on the chip but may make it difficult to configure the chip to fetch an image from the internet and display it without an intermediate processor doing the heavy lifting.

### Display driver
The display performance isn't great. It takes about a minute for the browser to upload the image and another 30s for the display to render (and re-render) itself a coulpe dozen times at varying refresh rates in order to make the image viewable. This could be deliberate, accidental, or a bug I introduced.

Sometimes the display will render the image off center. Sometimes it will render the image correctly, except one chunk of the image will be misplaced. Sometimes the coloring will be strange where colors "overlap."
