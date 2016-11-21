function loadTextures(gl, srcTexture, calback) {
	var eventHendler = iter(calback, srcTexture.length);
	
	for(var i=0; i<srcTexture.length; i++){
        var image = new Image();
		imageArray.push(image);
		
        image.onload = eventHendler;

        image.src = srcTexture[i];
	}

    function iter(calback, iteration){
		//вызываем калбак только после загрузки всех текстур
		var numCalback = 1;
		return function(e){
			//console.log(numCalback);
		    if(numCalback == iteration){
				calback();
			}else{
				numCalback++;
			}
			
		}
		
	}	
}



function handleLoadedTexture(gl, imageArray, textureArray) {
		
		for(var i=0; i<imageArray.length; i++){
			
		    var img =  imageArray[i];   
			//var texture; 
			textureArray[i] = gl.createTexture();
			//console.dir(textureArray[0]);
			textureArray[i].image = img	;	
			gl.bindTexture(gl.TEXTURE_2D, textureArray[i]);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureArray[i].image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.bindTexture(gl.TEXTURE_2D, null);
			//textureArray[0] = texture;			
		}		
		
}