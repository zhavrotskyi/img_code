const mm = 5;
const defVal = 0;
const direct = true;
const evenInverted = false;

function copySize(inEl, outEl) {
  outEl.width = inEl.width;
  outEl.height = inEl.height;
}

function colorsAdd(toColor, adColor) {
  //console.log(adColor);
  for (let index = 0; index < 3; index++) {
    toColor.data[index] ^= adColor[index];
  }
}


function codeImage (inCanvas, outCanvas, testCanvas) {
  outCanvas = document.getElementById("output_canvas");

  const m = document.getElementById ("mm").value;
  console.log (m);
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
    let qC = new QuasiCrystal(3);
    console.log(qC.roots);
    let batch = qC.getBatch(3);
  } else {
    moveImgLines(inCanvas, outCanvas, steps, m);
    moveImgLines(outCanvas, testCanvas, -steps, m);
  }

}

function toggleButton (mode = true) {
  let btn = document.getElementById ("selectFile");
  btn.disabled = mode;
  btn = document.getElementById ("recode");
  btn.disabled = mode;
}

function recode () {
  toggleButton (true);
  let inCanvas = document.getElementById("input_canvas");
  let outCanvas = document.getElementById("output_canvas");
  let testCanvas = document.getElementById("test_canvas");
  codeImage (inCanvas, outCanvas, testCanvas);
  toggleButton (false);
}

function openFile(file) {

  let input = file.target;
  let reader = new FileReader();
  if (input.files.length > 0) {
    toggleButton (true);
  }

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
      codeImage (inCanvas, outCanvas, testCanvas);
      toggleButton (false);

    };
  };

  reader.readAsDataURL(input.files[0]);
}

class QuasiCrystal {
  constructor(m = 3) {
    this.a = 0;
    this.b = 0;
    this.roots = QuasiCrystal.getRoots(m);
  }

  getBit(defVal = 1) {
    this.b++;
    const candidate = this.a + this.roots[0] * this.b;
    let res;
    if (candidate >= 0 && candidate < 1) {
      res = defVal;
    } else {
      this.a++;
      res = 1 - defVal;
    }
    return res;
  }

  getByte(flDirect = true, defVal = 1, flInv = false) {
    const bitsPerByte = 8;
    let biNum = "";
    //const flInv = false;
    if (flDirect == true) {
      for (let index = 0; index < bitsPerByte; index++) {
        if (flInv && index % 2 == 0) {
          biNum += 1 - this.getBit(defVal);
        } else {
          biNum += this.getBit(defVal);
        }
      }
    } else {
      let curQty = 0;
      let curLength = 0;
      while (curLength < bitsPerByte) {
        if (this.getBit() == 1) {
          const bitValue = curQty % 2 == 0 ? 1 : 0;
          if (flInv && index % 2 == 0) {
            biNum += 1 - bitValue;
          } else {
            biNum += bitValue;
          }
          curLength++;
          curQty = 0;
        } else {
          curQty++;
        }
      }
    }
    //console.log(biNum);
    return parseInt(biNum, 2);
  }

  getBatch(flDirect = true, defVal = 1, flInv = false, bytes = 3) {
    let batch = [];

    for (let index = 0; index < bytes; index++) {
      batch.push(this.getByte(flDirect, defVal, flInv));
    }

    return batch;
  }

  static getRoots(m = 3) {
    const D = Math.sqrt(m * m + 4);
    const roots = [(m - D) / 2, (m + D) / 2];
    return roots;
  }
}

function moveImgLines(inCanvas, outCanvas, step = 1, m = 0) {
  const showProgress = false;
  const elProgress = document.getElementById("myBar");
  const imHeight = inCanvas.height;
  const imWidth = outCanvas.width;
  inCContext = inCanvas.getContext("2d");
  inCContext.willReadFrequently = true;
  outCContext = outCanvas.getContext("2d");

  let addForNegative = 0;
  if (imWidth > 0 && step < 0) {
    addForNegative = Math.ceil(imHeight / imWidth + 2) * imWidth;
    //console.log(addForNegative);
  }

  let colorAdd;

  let myQC;

  if (m == 0) {
    colorAdd = [100, 150, 200];
  } else {
    myQC = new QuasiCrystal(m);
  }

  const flTest = false;
  let prevTime = new Date();
  let totalProgress = imHeight * imWidth;
  let currentProgress = 0;
  let currentProgressShown = 0;
  elProgress.style.width = currentProgressShown + "%";

  for (let y = 0; y < imHeight; y++) {
    for (let x = 0; x < imWidth; x++) {
      pixelColor = inCContext.getImageData(x, y, 1, 1);

      if (flTest) {
        console.log(x + " / " + y);
        console.log(pixelColor);
      }

      if (m != 0) {
        colorAdd = myQC.getBatch(direct, defVal, evenInverted);
      }

      colorsAdd(pixelColor, colorAdd);

      if (flTest) {
        console.log(pixelColor);
      }

      xNew = (x + addForNegative + y * step) % imWidth;
      outCContext.putImageData(pixelColor, xNew, y);
      if (showProgress) {
        currentProgress = Math.trunc(((y * imWidth + x) / totalProgress) * 100);

        if (currentProgress - currentProgressShown > 7) {
          let curTime = new Date();
          // console.log ("@@@@@@@@@@");
          // console.log(curTime - prevTime);

          if (curTime - prevTime > 150) {
            prevTime = curTime;
            console.log(currentProgress);
            console.log(currentProgress);
            currentProgressShown = currentProgress;
            elProgress.style.width = currentProgressShown + "%";
            console.log(elProgress.style.width);
            setTimeout(1000);
          }
        }
      }

      if (flTest) {
        if (x > 2 || y > 2) {
          return;
        }
      }
    }
  }
  if (showProgress) {
    currentProgressShown = 100;
    elProgress.style.width = currentProgressShown + "%";
  }
}
