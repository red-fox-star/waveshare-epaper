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
