var pxInd, stInd;
var dispW, dispH;
var xhReq, dispX;
var rqPrf, rqMsg;

function byteToStr(v) {
  return String.fromCharCode((v & 0xF) + 97, ((v >> 4) & 0xF) + 97);
}

function wordToStr(v) {
  return byteToStr(v & 0xFF) + byteToStr((v >> 8) & 0xFF);
}

function u_send(cmd, next) {
  xhReq.open('POST', rqPrf + cmd, true);
  xhReq.send('');

  if (next) stInd++;
  return 0;
}

function u_next() {
  lnInd = 0;
  pxInd = 0;
  u_send('NEXT_', true);
}

function u_done() {
  setInn('logTag', 'Complete!');
  return u_send('SHOW_', true);
}

function u_show(a, k1, k2) {
  var x = '' + (k1 + k2 * pxInd / a.length);
  if (x.length > 5) x = x.substring(0, 5);
  setInn('logTag', 'Progress: ' + x + '%');
  return u_send(rqMsg + wordToStr(rqMsg.length) + 'LOAD_', pxInd >= a.length);
}

function u_data(a, c, k1, k2) {
  rqMsg = '';

  if (c == -1) {
    while ((pxInd < a.length) && (rqMsg.length < 1000)) {
      var v = 0;
      for (var i = 0; i < 16; i += 2)
        if (pxInd < a.length) v |= (a[pxInd++] << i);
      rqMsg += wordToStr(v);
    }
  } else {
    while ((pxInd < a.length) && (rqMsg.length < 1000)) {
      var v = 0;
      for (var i = 0; i < 8; i++)
        if ((pxInd < a.length) && (a[pxInd++] != c)) v |= (128 >> i);
      rqMsg += byteToStr(v);
    }
  }

  return u_show(a, k1, k2);
}

function u_line(a, k1, k2) {
  var x;
  rqMsg = '';
  while (rqMsg.length < 1000) {
    x = 0;
    while (x < 122) {
      var v = 0;
      for (var i = 0;
        (i < 8) && (x < 122); i++, x++)
        if (a[pxInd++] != 0) v |= (128 >> i);
      rqMsg += byteToStr(v);
    }
  }
  return u_show(a, k1, k2);
}

function uploadImage() {
  var c = getElm('canvas');
  var w = dispW = c.width;
  var h = dispH = c.height;
  var p = c.getContext('2d').getImageData(0, 0, w, h);
  var a = new Array(w * h);
  var i = 0;
  for (var y = 0; y < h; y++)
    for (var x = 0; x < w; x++, i++) a[i] = getVal(p, i << 2);
  dispX = 0;
  pxInd = 0;
  stInd = 0;
  xhReq = new XMLHttpRequest();
  rqPrf = 'http://' + getElm('ip_addr').value + '/';

  if (epdInd == 3) {
    xhReq.onload = xhReq.onerror = function() {
      if (stInd == 0) return u_line(a, 0, 100);
      if (stInd == 1) return u_done();
    };

    return u_send('EPDd_', false);
  }

  if ((epdInd == 0) || (epdInd == 3) || (epdInd == 6) || (epdInd == 7) || (epdInd == 9) || (epdInd == 12) || (epdInd == 16) || (epdInd == 19) || (epdInd == 22)) {
    xhReq.onload = xhReq.onerror = function() {
      if (stInd == 0) return u_data(a, 0, 0, 100);
      if (stInd == 1) return u_done();
    };

    return u_send('EPD' + String.fromCharCode(epdInd + 97) + '_', false);
  }

  if (epdInd > 15 && epdInd < 22) {
    xhReq.onload = xhReq.onerror = function() {
      if (stInd == 0) return u_data(a, -1, 0, 100);
      if (stInd == 1) return u_done();
    };

    return u_send('EPD' + String.fromCharCode(epdInd + 97) + '_', false);
  } else {
    xhReq.onload = xhReq.onerror = function() {
      if (stInd == 0 && epdInd == 23) return u_data(a, 0, 0, 100);
      if (stInd == 0) return u_data(a, ((epdInd == 1) || (epdInd == 12)) ? -1 : 0, 0, 50);
      if (stInd == 1) return u_next();
      if (stInd == 2) return u_data(a, 3, 50, 50);
      if (stInd == 3) return u_done();
    };
    return u_send('EPD' + String.fromCharCode(epdInd + 97) + '_', false);
  }
}
