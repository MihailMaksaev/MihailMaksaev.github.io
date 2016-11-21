   

    function initShaders(gl) {
		//шейдеры для анимации
		var shaderProgramAnimation =createProgram( "shader-vs", "shader-fs" );
		//для мира с текстурой
		var shaderProgramWorld = createProgram( "shader-vs-world", "shader-fs-world" );
		
		
		//для мира получаем ссылки на переменные в шейдере
	   gl.useProgram(shaderProgramWorld);
	
        shaderProgramWorld.vertexPositionAttribute = gl.getAttribLocation(shaderProgramWorld, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgramWorld.vertexPositionAttribute);

        shaderProgramWorld.textureCoordAttribute = gl.getAttribLocation(shaderProgramWorld, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgramWorld.textureCoordAttribute);

        shaderProgramWorld.pMatrixUniform = gl.getUniformLocation(shaderProgramWorld, "uPMatrix");
        shaderProgramWorld.mvMatrixUniform = gl.getUniformLocation(shaderProgramWorld, "uMVMatrix");
        shaderProgramWorld.samplerUniform = gl.getUniformLocation(shaderProgramWorld, "uSampler");
		
		
		
		
		//для анимации
       gl.useProgram(shaderProgramAnimation);
		
		shaderProgramAnimation.glIteration = gl.getAttribLocation(shaderProgramAnimation, "iteration");

        shaderProgramAnimation.vertexPositionAttribute = gl.getAttribLocation(shaderProgramAnimation, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgramAnimation.vertexPositionAttribute);
		
		shaderProgramAnimation.vertexPositionAttributeNext = gl.getAttribLocation(shaderProgramAnimation, "aVertexPositionNext");
        gl.enableVertexAttribArray(shaderProgramAnimation.vertexPositionAttributeNext);

        shaderProgramAnimation.textureCoordAttribute = gl.getAttribLocation(shaderProgramAnimation, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgramAnimation.textureCoordAttribute);
	   
	  //  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
      //  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgramAnimation.pMatrixUniform = gl.getUniformLocation(shaderProgramAnimation, "uPMatrix");
        shaderProgramAnimation.mvMatrixUniform = gl.getUniformLocation(shaderProgramAnimation, "uMVMatrix");
        shaderProgramAnimation.samplerUniform = gl.getUniformLocation(shaderProgramAnimation, "uSampler");
		
		
		
		return {animation: shaderProgramAnimation, world: shaderProgramWorld} ;
		
		
		function createProgram( vertexShaderID, fragmentShaderID ){
			
			var fragmentShader = getShader(gl, fragmentShaderID);
            var vertexShader = getShader(gl, vertexShaderID);
				//программа для мира 
		   var program = gl.createProgram();
           gl.attachShader(program, vertexShader);
           gl.attachShader(program, fragmentShader);
           gl.linkProgram(program);
		
		   if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
             alert("Could not initialise shaders");
           }
			
	       return program;
		}
    }
	
	
    function initBuffers(gl, model) {
		
        //console.dir(model);
		var vertexPositionBuffer = {};
		var vertexTextureCoordBuffer = [];
		var vertexIndexBuffer = [];
		
		// для каждой анимации(пока что одна) создаем массив с ключевыми кадрами
		for(var key in model){
			vertexPositionBuffer[key+""] = [];
			// создаем буферы для всех ключевых кадров анимации
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


	
	
	
	
	
	
	