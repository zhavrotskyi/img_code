const mm = 2;
const defVal = 1;
const direct = true;

function copySize(inEl, outEl) {
  //console.log ("in " +  outEl.width + " * " + outEl.height+ " (" + inEl.width+ " * " + inEl.height + ")");
  outEl.width = inEl.width;
  outEl.height = inEl.height;
}

// function colorAdd (color1, color2) {

// }

function colorsAdd(toColor, adColor) {
  console.log(adColor);
  for (let index = 0; index < 3; index++) {
    toColor.data[index] ^= adColor[index];
    //toColor.data  [index] ^= adColor [index];
    //toColor.data [index] = toColor.data [index] ^ adColor [index] ;
  }
}

function openFile(file) {
  let input = file.target;
  let reader = new FileReader();

  reader.onload = function () {
    let dataURL = reader.result;
    //let inImg = document.getElementById('input_img');
    let inImg = new Image();
    inImg.src = dataURL;
    inImg.onload = function () {
      let inCanvas = document.getElementById("input_canvas");
      let outCanvas = document.getElementById("output_canvas");
      let testCanvas = document.getElementById("test_canvas");
      inCanvas.willbereaded;
      //console.log (inImg.height);
      //console.log (inImg.width);

      let inCanvasContex = inCanvas.getContext("2d");

      //inCanvasContex.height = inImg.height;
      //inCanvasContex.width = inImg.height;

      copySize(inImg, inCanvas);
      copySize(inImg, outCanvas);
      copySize(inImg, testCanvas);

      inCanvasContex.drawImage(inImg, 0, 0);

      //console.log ("after draw " +  inCanvasContex.width + " * " + inCanvasContex.height);

      outCanvas = document.getElementById("output_canvas");

      // moveImgLines(inCanvas, outCanvas);
      // moveImgLines(outCanvas, testCanvas, -1);

      const m = mm;
      const steps = 0;

      flTest = false;
      if (flTest == 3) {
        let a = 0;
        let b = 0;
        let roots = getRoots(m);
        console.log(roots);
        let batch = getBatch(a, b, roots);
        console.log(batch);
      } else if (flTest == true) {
        let qC = new 
        QuasiCrystal (3);
        console.log(qC.roots);
        let batch = qC.getBatch (3);
      }  else {
        moveImgLines(inCanvas, outCanvas, steps, m);
        moveImgLines(outCanvas, testCanvas, -steps, m);
      }
    };
  };

  reader.readAsDataURL(input.files[0]);
}

class QuasiCrystal {
  constructor(m = 3) {
    this.a = 0;
    this.b = 0;
    this.roots = QuasiCrystal.getRoots (m);
  }

  getBit (defVal = 1) {
    this.b ++;
    const candidate = this.a + this.roots[0] * this.b;
    //console.log(candidate);
    // console.log("a:");
    // console.log(this.a);
    // console.log("b:");
    // console.log(this.b);
    let res;
    if (candidate >= 0 && candidate < 1) {
      res = defVal - 0;
    } else {
      this.a ++;
      res = defVal - 1;
    }
    // console.log("a:");
    // console.log(this.a);
    // console.log("b:");
    // console.log(this.b);
    // console.log("res:");
    // console.log(res);
    return res;
  }

  getByte (flDirect = true, defVal = 1) {
    const bitsPerByte = 8;
    let biNum = "";
    //const flInv = false;
    for (let index = 0; index < bitsPerByte; index++) {
      if (flInv && index % 2 == 0) {
        biNum += 1 - this.getBit ();
      } else {
        biNum += this.getBit ();
      }
    }
    console.log (biNum);
    return parseInt(biNum, 2);
  }
  
  getBatch (flDirect = true, defVal = 1, bytes = 3) {
    let batch = [];
    for (let index = 0; index < bytes; index++) {
      batch.push (this.getByte (flDirect, defVal));
    }
  
    return batch;
  }

  static getRoots(m = 3) {
    const D = Math.sqrt(m * m + 4);
    const roots = [(m - D) / 2, (m + D) / 2];
    return roots;
  }
}

function _getRoots(m = 3) {
  const D = Math.sqrt(m * m + 4);
  const roots = [(m - D) / 2, (m + D) / 2];
  return roots;
}

function _getBit(a, b, roots) {
  b = b + 1;
  const candidate = a + roots[0] * b;
  console.log(candidate);
  console.log("a:");
  console.log(a);
  console.log("b:");
  console.log(b);
  let res;
  if (candidate >= 0 && candidate < 1) {
    res = 0;
  } else {
    a = a + 1;
    res = 1;
  }
  console.log("a:");
  console.log(a);
  console.log("b:");
  console.log(b);
  console.log("res:");
  console.log(res);
}

function _getByte(a, b, roots) {
  const bitsPerByte = 8;
  let biNum = "";
  for (let index = 0; index < bitsPerByte; index++) {
    biNum += getBit(a, b, roots);
  }
  return parseInt(biNum, 2);
}

function _getBatch(a, b, roots, bytes = 3) {
  let batch = [];
  for (let index = 0; index < bytes; index++) {
    batch.push(getByte(a, b, roots));
  }
  //console.log (batch);

  return batch;
}

function moveImgLines(inCanvas, outCanvas, step = 1, m = 0) {
  const imHeight = inCanvas.height;
  const imWidth = outCanvas.width;
  inCContext = inCanvas.getContext("2d");
  inCContext.willReadFrequently = true;
  outCContext = outCanvas.getContext("2d");

  let addForNegative = 0;
  if (imWidth > 0 && step < 0) {
    addForNegative = Math.ceil(imHeight / imWidth + 2) * imWidth;
    console.log(addForNegative);
  }

  let colorAdd;

  // let roots = getRoots(m);
  // let a = 0;
  // let b = 0;
  let myQC;

  if (m == 0) {
    colorAdd = [100, 150, 200];
  } else {
    myQC = new QuasiCrystal (m)
  }

  const flTest = false;

  //console.log (getRoots ());

  // let logsCount = 0;

  for (let y = 0; y < imHeight; y++) {
    for (let x = 0; x < imWidth; x++) {
      pixelColor = inCContext.getImageData(x, y, 1, 1);

      if (flTest) {
        console.log(x + " / " + y);
        console.log(pixelColor);
      }
      if (m != 0) {
        // if (logsCount < 23) {
        //   logsCount++;
        //   console.log("ribbit");
        // }
        //colorAdd = getBatch(a, b, roots);
        colorAdd = myQC.getBatch (direct, defVal);
      }
      // if (logsCount < 23) {
      //   logsCount++;
      //   console.log(colorAdd);
      // }

      colorsAdd(pixelColor, colorAdd);

      if (flTest) {
        console.log(pixelColor);
      }

      xNew = (x + addForNegative + y * step) % imWidth;
      outCContext.putImageData(pixelColor, xNew, y);
      if (flTest) {
        if (x > 2 || y > 2) {
          return;
        }
      }
    }
  }
}
