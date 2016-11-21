
    var pitch = 0;
    var pitchRate = 0;

    var yaw = 0;
    var yawRate = 0;

    var xPos = 0;
    var yPos = 0.4;
    var zPos = 0;

    var speed = 0;




var ModelWorldState ={};

var canvId = "canvas-game";

var gl;

var shaderProgram;

var srcTexture = ["textures/boxman.png", "textures/trava.jpg"]; 

//масссив с изображениями и массив с текстурами из них
var imageArray = [];
var textureArray = [];

//обьект содержит все буферы
var bufers ={};

ModelWorldState.boxmanGo ={}; 
ModelWorldState.staticWorld ={}; 




var modelUrl = 	'blender-files/boxman-json/boxman-texturi-animation-hodba.js';

var rotationStateObj = {
	                     xRot: 0,
                         yRot: 0,
                         zRot: 0
                        }

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

//загрузка модели и вызов следующей функции
loadModel(modelUrl, test);

function test(obj){

ModelWorldState.boxmanGo.animation1 = obj;

ModelWorldState.staticWorld.animation1 = createStaticWorld();

//console.dir(ModelWorldState.boxmanGo.animation1);
//console.dir(ModelWorldState.staticWorld.animation1);

console.dir(ModelWorldState);

loadTextures(gl, srcTexture, webGLStart.bind(null, canvId) );  
}



function webGLStart(canvId) {
        var canvas = document.getElementById(canvId);
        gl = initGL(canvas);
        shaderProgram = initShaders(gl);
		
        //console.log("webgl-start");
        handleLoadedTexture(gl, imageArray , textureArray);
		//gl.useProgram(shaderProgram.animation);
		bufers.player = initBuffers(gl, ModelWorldState.boxmanGo);
		//gl.useProgram(shaderProgram.world);
		bufers.staticWorld = initBuffers(gl, ModelWorldState.staticWorld);
		//console.dir(bufers);
		
		//console.dir(bufers.player.vertexIndexBuffer[0]);
		bufers.player.animation = 0;
		bufers.player.animationNext = 1;
		//console.dir(bufers);
		//initTexture();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
		
		document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;


        tick();
}


 function tick() {
        requestAnimFrame(tick);
		handleKeys();
		animate();
        drawScene();
       
    }
	
var lastTime = 0;
var iteration = 1.0;

// Used to make us "jog" up and down as we move forward.
    var joggingAngle = 0;
    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;
			iteration++;
			//iteration = parseFloat(iteration);
			
			if(iteration > 5.0){
				bufers.player.animation++;
			bufers.player.animationNext++;
				iteration = 1.0;
			}
			if(bufers.player.animation > 4)bufers.player.animation = 0;
			if(bufers.player.animationNext > 4)bufers.player.animationNext = 0;

         //  rotationStateObj.xRot += (90 * elapsed) / 1000.0;
            rotationStateObj.yRot += (90 * elapsed) / 1000.0;
           // rotationStateObj.zRot += (90 * elapsed) / 1000.0;
		   
		   
		    if (speed != 0) {
                xPos -= Math.sin(degToRad(yaw)) * speed * elapsed;
                zPos -= Math.cos(degToRad(yaw)) * speed * elapsed;

                joggingAngle += elapsed * 0.6; // 0.6 "fiddle factor" - makes it feel more realistic :-)
                yPos = Math.sin(degToRad(joggingAngle)) / 20 + 0.4
            }

            yaw += yawRate * elapsed;
            pitch += pitchRate * elapsed;
        }
        lastTime = timeNow;
    }

	

  
    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

        mat4.identity(mvMatrix);
		//обработка движения камеры при ходьбе и поворотах
		mat4.rotate(mvMatrix, degToRad(20-pitch), [1, 0, 0]);
        //mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
        mat4.translate(mvMatrix, [-xPos, (-5.0-yPos), (-5.0-zPos)]);
		
		drawBoxman([xPos, (yPos+0.7), (zPos-10.0)], { xRot: 0, yRot: (180+yaw), zRot: 0});
		
//отрисовка мира			
		
		
		drawWorld([0.0, -3.0, -25.0]);

      
//отрисовка моделей
		drawBoxman([0.0, 0.7, -25.0], { xRot: 0, yRot: 160, zRot: 0});

		
		drawBoxman( [5.0, 0.7, -32.0], { xRot: 0, yRot: 40, zRot: 0});

		
		drawBoxman([-3.0, 0.75, -12.0] ,rotationStateObj);
	
    }	



   function drawBoxman(translateArray, rotationStateObj){
	   mvPushMatrix();
	   		//перемещение обьекта
        mat4.translate(mvMatrix, translateArray);
		
		
        // вращение обьекта
        mat4.rotate(mvMatrix, degToRad(rotationStateObj.xRot), [1, 0, 0]);
        mat4.rotate(mvMatrix, degToRad(rotationStateObj.yRot), [0, 1, 0]);
        mat4.rotate(mvMatrix, degToRad(rotationStateObj.zRot), [0, 0, 1]);
	   
	   
	   gl.useProgram(shaderProgram["animation"]);
		
		//номер итерации для создания анимации на основе интерполяции из ключевых кадров тольео
		gl.vertexAttrib1f(shaderProgram.animation.glIteration, iteration);
		//console.dir(bufers.player.vertexPositionBuffer.animation1);
		
		//следующий ключевой кадр
		gl.bindBuffer(gl.ARRAY_BUFFER, bufers.player.vertexPositionBuffer.animation1[bufers.player.animationNext]);
       gl.vertexAttribPointer(shaderProgram.animation.vertexPositionAttributeNext, 3, gl.FLOAT, false, 0, 0);
		
		//текущий ключевой кадр
        gl.bindBuffer(gl.ARRAY_BUFFER, bufers.player.vertexPositionBuffer.animation1[bufers.player.animation]);
        gl.vertexAttribPointer(shaderProgram.animation.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		
		//текстура
       gl.bindBuffer(gl.ARRAY_BUFFER, bufers.player.vertexTextureCoordBuffer[0]);
       gl.vertexAttribPointer(shaderProgram.animation.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[0]);
        gl.uniform1i(shaderProgram.animation.samplerUniform, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufers.player.vertexIndexBuffer[0]);
        setMatrixUniforms("animation");
       // gl.drawElements(gl.TRIANGLES, bufers.player.vertexIndexBuffer[0].numItems, gl.UNSIGNED_SHORT, 0);
		gl.drawArrays(gl.TRIANGLES, 0, bufers.player.vertexIndexBuffer[0].numItems);
		
		mvPopMatrix();
	     
   }
   
   
   function drawWorld(translateArray){
	   mvPushMatrix();
		
		mat4.translate(mvMatrix, translateArray);
	   
	   
	    gl.useProgram(shaderProgram["world"]);
		
		
        gl.bindBuffer(gl.ARRAY_BUFFER, bufers.staticWorld.vertexPositionBuffer.animation1[0]);
        gl.vertexAttribPointer(shaderProgram.world.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		
		
		//gl.bindBuffer(gl.ARRAY_BUFFER, bufers.staticWorld.vertexPositionBuffer.animation1[0]);
        //gl.vertexAttribPointer(shaderProgram.world.vertexPositionAttributeNext, 3, gl.FLOAT, false, 0, 0);
        //console.dir( bufers.staticWorld.vertexTextureCoordBuffer[0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufers.staticWorld.vertexTextureCoordBuffer[0]);
        gl.vertexAttribPointer(shaderProgram.world.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
		
		
		
		
		gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[1]);
        gl.uniform1i(shaderProgram.world.samplerUniform, 1);
		

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufers.staticWorld.vertexIndexBuffer[0]);
		
		//console.dir(shaderProgram.world.textureCoordAttribute);
		//console.dir(bufers.staticWorld.vertexIndexBuffer[0]);
        setMatrixUniforms("world");
        gl.drawElements(gl.TRIANGLES, bufers.staticWorld.vertexIndexBuffer[0].numItems, gl.UNSIGNED_SHORT, 0);
		
		
	   mvPopMatrix();
	   
   }
	

	


	
	
	var currentlyPressedKeys = {};

    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
    }


    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }


	
	   function handleKeys() {
        if (currentlyPressedKeys[33]) {
            // Page Up
            pitchRate = 0.1;
        } else if (currentlyPressedKeys[34]) {
            // Page Down
            pitchRate = -0.1;
        } else {
            pitchRate = 0;
        }

        if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
            // Left cursor key or A
            yawRate = 0.1;
        } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
            // Right cursor key or D
            yawRate = -0.1;
        } else {
            yawRate = 0;
        }

        if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
            // Up cursor key or W
			//console.log("w-pressed");
            speed = 0.003;
        } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
            // Down cursor key
            speed = -0.003;
        } else {
            speed = 0;
        }

    }









