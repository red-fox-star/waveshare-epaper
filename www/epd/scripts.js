var srcBox, srcImg, dstImg;
var epdArr, epdInd, palArr;
var curPal;

function getElm(n) {
  return document.getElementById(n);
}

function setInn(n, i) {
  document.getElementById(n).innerHTML = i;
}

function processFiles(files) {
  var file = files[0];
  var reader = new FileReader();
  srcImg = new Image();
  reader.onload = function(e) {
    setInn('srcBox', '<img id="imgView" class="sourceImage">');
    var img = getElm('imgView');
    img.src = e.target.result;
    srcImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  var files = e.dataTransfer.files;
  processFiles(files);
}

function ignoreDrag(e) {
  e.stopPropagation();
  e.preventDefault();
}

function getNud(nm, vl) {
  return '<td class="comment">' + nm + ':</td>' +
    '<td><input id="nud_' + nm + '" class="nud"type="number" value="' + vl + '"/></td>';
}

function Btn(nm, tx, fn) {
  return '<div><label class="menu_button" for="_' + nm + '">' + tx + '</label>' +
    '<input class="hidden_input" id="_' + nm + '" type="' +
    (nm == 0 ? 'file" onchange="' : 'button" onclick="') + fn + '"/></div>';
}

function RB(vl, tx) {
  return '<input type="radio" name="kind" value="m' + vl +
    '" onclick="rbClick(' + vl + ');"' + (vl == 0 ? 'checked="true"' : '') + '/>' + tx;
}
window.onload = function() {
  srcBox = getElm('srcBox');
  srcBox.ondragenter = ignoreDrag;
  srcBox.ondragover = ignoreDrag;
  srcBox.ondrop = drop;
  srcImg = 0;
  epdInd = 0;
  palArr = [
    [
      [0, 0, 0],
      [255, 255, 255]
    ],
    [
      [0, 0, 0],
      [255, 255, 255],
      [127, 0, 0]
    ],
    [
      [0, 0, 0],
      [255, 255, 255],
      [127, 127, 127]
    ],
    [
      [0, 0, 0],
      [255, 255, 255],
      [127, 127, 127],
      [127, 0, 0]
    ],
    [
      [0, 0, 0],
      [255, 255, 255]
    ],
    [
      [0, 0, 0],
      [255, 255, 255],
      [220, 180, 0]
    ]
  ];
  epdArr = [
    [200, 200, 0],
    [200, 200, 3],
    [152, 152, 5],
    [122, 250, 0],
    [104, 212, 1],
    [104, 212, 5],
    [104, 212, 0],
    [176, 264, 0],
    [176, 264, 1],
    [128, 296, 0],
    [128, 296, 1],
    [128, 296, 5],
    [128, 296, 0],
    [400, 300, 0],
    [400, 300, 1],
    [400, 300, 5],
    [600, 448, 0],
    [600, 448, 1],
    [600, 448, 5],
    [640, 384, 0],
    [640, 384, 1],
    [640, 384, 5],
    [800, 480, 0],
    [800, 480, 1],
    [880, 528, 1]
  ];
  setInn('BT',
    Btn(0, 'Select image file', 'processFiles(this.files);') +
    Btn(1, 'Level: mono', 'procImg(true,false);') +
    Btn(2, 'Level: color', 'procImg(true,true);') +
    Btn(3, 'Dithering: mono', 'procImg(false,false);') +
    Btn(4, 'Dithering: color', 'procImg(false,true);') +
    Btn(5, 'Upload image', 'uploadImage();'));
  setInn('XY', getNud('x', '0') + getNud('y', '0'));
  setInn('WH', getNud('w', '200') + getNud('h', '200'));
  setInn('RB', RB(0, '1.54&ensp;') + RB(1, '1.54b') + RB(2, '1.54c') +
    RB(3, '2.13&ensp;') + RB(4, '2.13b') + RB(5, '2.13c<br>') + RB(6, '2.13d<br>') +
    RB(7, '2.7&ensp;&ensp;') + RB(8, '2.7b&ensp;<br>') +
    RB(9, '2.9&ensp;&ensp;') + RB(10, '2.9b&ensp;') + RB(11, '2.9c&ensp;<br>') + RB(12, '2.9d<br>') +
    RB(13, '4.2&ensp;&ensp;') + RB(14, '4.2b&ensp;') + RB(15, '4.2c&ensp;<br>') +
    RB(16, '5.83&ensp;') + RB(17, '5.83b') + RB(18, '5.83c<br>') +
    RB(19, '7.5&ensp;&ensp;') + RB(20, '7.5b&ensp;') + RB(21, '7.5c&ensp;<br>') +
    RB(22, '7.5 V2') + RB(23, '7.5b V2<br>') + RB(24, '7.5b HD<br>'));
}

function rbClick(index) {
  getElm('nud_w').value = +epdArr[index][0];
  getElm('nud_h').value = +epdArr[index][1];
  epdInd = index;
}


var source;
var dX, dY, dW, dH, sW, sH;

function getVal(p, i) {
  if ((p.data[i] == 0x00) && (p.data[i + 1] == 0x00)) return 0;
  if ((p.data[i] == 0xFF) && (p.data[i + 1] == 0xFF)) return 1;
  if ((p.data[i] == 0x7F) && (p.data[i + 1] == 0x7F)) return 2;
  return 3;
}

function setVal(p, i, c) {
  p.data[i] = curPal[c][0];
  p.data[i + 1] = curPal[c][1];
  p.data[i + 2] = curPal[c][2];
  p.data[i + 3] = 255;
}

function addVal(c, r, g, b, k) {
  return [c[0] + (r * k) / 32, c[1] + (g * k) / 32, c[2] + (b * k) / 32];
}

function getErr(r, g, b, stdCol) {
  r -= stdCol[0];
  g -= stdCol[1];
  b -= stdCol[2];
  return r * r + g * g + b * b;
}

function getNear(r, g, b) {
  var ind = 0;
  var err = getErr(r, g, b, curPal[0]);
  for (var i = 1; i < curPal.length; i++) {
    var cur = getErr(r, g, b, curPal[i]);
    if (cur < err) {
      err = cur;
      ind = i;
    }
  }
  return ind;
}


function procImg(isLvl, isRed) {
  if (document.getElementsByClassName('sourceImage').length == 0) {
    alert('First select image');
    return;
  }
  var palInd = epdArr[epdInd][2];
  if (isRed && ((palInd & 1) == 0)) {
    alert('This white-black display');
    return;
  }
  if (!isRed) palInd = palInd & 0xFE;
  curPal = palArr[palInd];
  getElm('dstBox').innerHTML =
    '<span class="title">Processed image</span><br><canvas id="canvas"></canvas>';
  var canvas = getElm('canvas');
  sW = srcImg.width;
  sH = srcImg.height;
  source = getElm('source');
  source.width = sW;
  source.height = sH;
  source.getContext('2d').drawImage(srcImg, 0, 0, sW, sH);
  dX = parseInt(getElm('nud_x').value);
  dY = parseInt(getElm('nud_y').value);
  dW = parseInt(getElm('nud_w').value);
  dH = parseInt(getElm('nud_h').value);
  if ((dW < 3) || (dH < 3)) {
    alert('Image is too small');
    return;
  }
  canvas.width = dW;
  canvas.height = dH;
  var index = 0;
  var pSrc = source.getContext('2d').getImageData(0, 0, sW, sH);
  var pDst = canvas.getContext('2d').getImageData(0, 0, dW, dH);
  if (isLvl) {
    for (var j = 0; j < dH; j++) {
      var y = dY + j;
      if ((y < 0) || (y >= sH)) {
        for (var i = 0; i < dW; i++, index += 4) setVal(pDst, index, (i + j) % 2 == 0 ? 1 : 0);
        continue;
      }
      for (var i = 0; i < dW; i++) {
        var x = dX + i;
        if ((x < 0) || (x >= sW)) {
          setVal(pDst, index, (i + j) % 2 == 0 ? 1 : 0);
          index += 4;
          continue;
        }
        var pos = (y * sW + x) * 4;
        setVal(pDst, index, getNear(pSrc.data[pos], pSrc.data[pos + 1], pSrc.data[pos + 2]));
        index += 4;
      }
    }
  } else {
    var aInd = 0;
    var bInd = 1;
    var errArr = new Array(2);
    errArr[0] = new Array(dW);
    errArr[1] = new Array(dW);
    for (var i = 0; i < dW; i++)
      errArr[bInd][i] = [0, 0, 0];
    for (var j = 0; j < dH; j++) {
      var y = dY + j;
      if ((y < 0) || (y >= sH)) {
        for (var i = 0; i < dW; i++, index += 4) setVal(pDst, index, (i + j) % 2 == 0 ? 1 : 0);
        continue;
      }
      aInd = ((bInd = aInd) + 1) & 1;
      for (var i = 0; i < dW; i++) errArr[bInd][i] = [0, 0, 0];
      for (var i = 0; i < dW; i++) {
        var x = dX + i;
        if ((x < 0) || (x >= sW)) {
          setVal(pDst, index, (i + j) % 2 == 0 ? 1 : 0);
          index += 4;
          continue;
        }
        var pos = (y * sW + x) * 4;
        var old = errArr[aInd][i];
        var r = pSrc.data[pos] + old[0];
        var g = pSrc.data[pos + 1] + old[1];
        var b = pSrc.data[pos + 2] + old[2];
        var colVal = curPal[getNear(r, g, b)];
        pDst.data[index++] = colVal[0];
        pDst.data[index++] = colVal[1];
        pDst.data[index++] = colVal[2];
        pDst.data[index++] = 255;
        r = (r - colVal[0]);
        g = (g - colVal[1]);
        b = (b - colVal[2]);
        if (i == 0) {
          errArr[bInd][i] = addVal(errArr[bInd][i], r, g, b, 7.0);
          errArr[bInd][i + 1] = addVal(errArr[bInd][i + 1], r, g, b, 2.0);
          errArr[aInd][i + 1] = addVal(errArr[aInd][i + 1], r, g, b, 7.0);
        } else if (i == dW - 1) {
          errArr[bInd][i - 1] = addVal(errArr[bInd][i - 1], r, g, b, 7.0);
          errArr[bInd][i] = addVal(errArr[bInd][i], r, g, b, 9.0);
        } else {
          errArr[bInd][i - 1] = addVal(errArr[bInd][i - 1], r, g, b, 3.0);
          errArr[bInd][i] = addVal(errArr[bInd][i], r, g, b, 5.0);
          errArr[bInd][i + 1] = addVal(errArr[bInd][i + 1], r, g, b, 1.0);
          errArr[aInd][i + 1] = addVal(errArr[aInd][i + 1], r, g, b, 7.0);
        }
      }
    }
  }
  canvas.getContext('2d').putImageData(pDst, 0, 0);
}


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
