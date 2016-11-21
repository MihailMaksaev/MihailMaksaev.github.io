   

    function initShaders(gl) {
		
		var shaderProgram;
		var shaderProgramWorld;
		//шейдеры для анимации
		
		//для мира с текстурой
		var fragmentShaderWorld = getShader(gl, "shader-fs-world");
        var vertexShaderWorld = getShader(gl, "shader-vs-world");
		
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");
		
   
       	//программа для мира 
		shaderProgramWorld = gl.createProgram();
        gl.attachShader(shaderProgramWorld, vertexShaderWorld);
        gl.attachShader(shaderProgramWorld, fragmentShaderWorld);
        gl.linkProgram(shaderProgramWorld);
   
        
		//для анимации
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
		


		
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
		
		if (!gl.getProgramParameter(shaderProgramWorld, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
		

		

		
		
	   gl.useProgram(shaderProgramWorld);
	
        shaderProgramWorld.vertexPositionAttribute = gl.getAttribLocation(shaderProgramWorld, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgramWorld.vertexPositionAttribute);

        shaderProgramWorld.textureCoordAttribute = gl.getAttribLocation(shaderProgramWorld, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgramWorld.textureCoordAttribute);

        shaderProgramWorld.pMatrixUniform = gl.getUniformLocation(shaderProgramWorld, "uPMatrix");
        shaderProgramWorld.mvMatrixUniform = gl.getUniformLocation(shaderProgramWorld, "uMVMatrix");
        shaderProgramWorld.samplerUniform = gl.getUniformLocation(shaderProgramWorld, "uSampler");
		
		
		
		
		        //для анимации
       gl.useProgram(shaderProgram);
		
		shaderProgram.glIteration = gl.getAttribLocation(shaderProgram, "iteration");

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		
		shaderProgram.vertexPositionAttributeNext = gl.getAttribLocation(shaderProgram, "aVertexPositionNext");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttributeNext);

        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
	   
	  //  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
      //  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
		
		
		
		return {animation: shaderProgram, world: shaderProgramWorld} ;
    }
	
	
    function initBuffers(gl, model) {
		
        //console.dir(model);
		var vertexPositionBuffer = {};
		var vertexTextureCoordBuffer = [];
		var vertexIndexBuffer = [];
		
		// для каждой анимации(пока что одна) создаем массив с ключевыми кадрами
		for(var key in model){
			vertexPositionBuffer[key+""] = [];
			
			model[key].vertices.forEach(function(item, i){
				//console.log("ll");
				
			    vertexPositionBuffer[key].push(initPositionBufer(gl, item));
			});	
			
			if(model[key].textures){
				// console.dir("istexture");
			      vertexTextureCoordBuffer.push(initTextureCoordBuffer(gl, model[key].textures));
			}	  
			
			if(model[key].indices){
			      vertexIndexBuffer.push(initIndexBuffer(gl, model[key].indices));
			}
		}	
			
	
				
		return { vertexPositionBuffer: vertexPositionBuffer,   vertexTextureCoordBuffer: vertexTextureCoordBuffer,  vertexIndexBuffer: vertexIndexBuffer  };
    }
	
	
	function initTextureCoordBuffer(gl, textures){
		
		var vertexTextureCoordBuffer;
        vertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
        var textureCoords = textures;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
        vertexTextureCoordBuffer.itemSize = 2;
        vertexTextureCoordBuffer.numItems = textures.length;
         return 	vertexTextureCoordBuffer;	
	}
	
	function initPositionBufer(gl, vertices){
		//console.dir(vertices);
		var vertexPositionBuffer;//
        vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        var vertices = vertices;		
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        vertexPositionBuffer.itemSize = 3;
        vertexPositionBuffer.numItems = vertices.length;
        return 	vertexPositionBuffer;	
	}
	
	function initIndexBuffer(gl, indices){
		
		//console.log(indices);
		
		var vertexIndexBuffer;
        vertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
        var vertexIndices = indices;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
        vertexIndexBuffer.itemSize = 1;
        vertexIndexBuffer.numItems = indices.length;
		
		return vertexIndexBuffer;
		
	}
	

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }

   // передаем вариант шейдера 
    function setMatrixUniforms(shaderVariant) {
		//console.dir(shaderProgram[shaderVariant]);
        gl.uniformMatrix4fv(shaderProgram[shaderVariant].pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram[shaderVariant].mvMatrixUniform, false, mvMatrix);
    }


    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }


	
	
	
	
	
	
	