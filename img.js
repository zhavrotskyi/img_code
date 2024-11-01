 function openFile (file) {
    let input = file.target;
    let reader = new FileReader();
    
    reader.onload = function(){
      let dataURL = reader.result;
      let inImg = document.getElementById('input_img');
      inImg.src = dataURL;
      let outImg = document.getElementById('output_img');
      outImg.clientWidth = inImg.clientWidth;
      outImg.clientHeight = inImg.clientHeight;
    //   console.log (output.clientWidth);
    //   console.log (output.clientHeight);
        moveImgLines (inImg, outImg);
      
    };

    reader.readAsDataURL(input.files[0]);
  };

  function moveImgLines (inImg, outImg, step = 1) {
    console.log (step);
  }

  