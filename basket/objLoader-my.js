
function loadObjModel(modelURL, callb){
   
   fetch(modelURL)
   .then(function(response) {
     //console.log(response.headers.get('Content-Type')); // application/json; charset=utf-8
     //console.log(response.status); // 200
	 //console.dir(response);
    return response.text();
   })
   .then(function(text) {
     //console.log(text); 
	
	 
	return  OBJparser(text);
	 
   })
   
   .then(function(mod) {
     console.dir(mod); 

	 
	 
	 callb(mod);
	 
   })
  .catch(function(err){
    console.log("произошла ошибка при загрузке модели - "+modelURL);
    console.dir(err);
  });

}









function OBJparser(str){

//найти совпадение v после ктоорой пробел после которого любые 25 или больше символов g- все совпадения

var regexpVertices = /v\s.{25,}/g;
var regexpFaces = /f\s.{12,}/g;
var regexpTextures = /vt\s.{12,}/g;



function parseVertices(regexp){

       var vertices = [];
	   
       var atributesArr = str.match(regexp);
	   
       for(var i =0; i<atributesArr.length; i++){
	
	     var stroka = atributesArr[i].split(" ");
		 
		 stroka.shift();
		 
		 for(var j=0; j< stroka.length; j++){
			    
             vertices.push(parseFloat(stroka[j]));				
		 }	 
       }
	   
	   return vertices;
}

function parseTextures(regexp){

       var textures = [];
	   
       var atributesArr = str.match(regexp);
	   
       for(var i =0; i<atributesArr.length; i++){
	
	     var stroka = atributesArr[i].split(" ");
		 
		 stroka.shift();
		 
		 for(var j=0; j< stroka.length; j++){
			    
             textures.push(parseFloat(stroka[j]));				
		 }	 
       }
	   
	   return textures;
}

function parseFaces(regexp){

       var facesV = [];
	   var facesT = [];
	   
       var atributesArr = str.match(regexp);
	   
       for(var i =0; i<atributesArr.length; i++){
	
	     var stroka = atributesArr[i].split(" ");
		 
		 stroka.shift();
		 
		 for(var j=0; j< stroka.length; j++){
			  
             var podstoka = stroka[j].split("/");	  
             facesV.push(parseFloat(podstoka.shift()));
             facesT.push(parseFloat(podstoka.shift()));			 
		 }	 
       }
	   
	   return {facesV: facesV, facesT: facesV};
}

var Model = { vertices: parseVertices(regexpVertices),
              textures: parseTextures(regexpTextures),
			  faces: parseFaces(regexpFaces)
            };
var NewModel = { vertices: buildModelVertices(Model),
                 textures: 	buildModelTextures(Model)
               };			
	 
getIndices(NewModel);
console.dir(Model);	 			
			 
//Model.facesV.map(function(item, index){
	return NewModel;
	
}	


function buildModelVertices(model){
	var nevVertices = [];
	for (var i=0; i< model.faces.facesV.length; i=i+3){
		
		nevVertices.push( model.vertices[model.faces.facesV[i]-1] );
		nevVertices.push( model.vertices[ model.faces.facesV[i]-1+1] );
		nevVertices.push( model.vertices[ model.faces.facesV[i]-1+2] );
		
		nevVertices.push( model.vertices[ model.faces.facesV[i+1]-1] );
		nevVertices.push( model.vertices[ model.faces.facesV[i+1]-1+1] );
		nevVertices.push( model.vertices[ model.faces.facesV[i+1]-1+2] );
		
		nevVertices.push( model.vertices[ model.faces.facesV[i+2]-1] );
		nevVertices.push( model.vertices[ model.faces.facesV[i+2]-1+1]);
		nevVertices.push( model.vertices[ model.faces.facesV[i+2]-1+2] );
	}
	//console.dir(nevVertices);
	return nevVertices;
}


function buildModelTextures(model){
	var nevTextures = [];
	for (var i=0; i< model.faces.facesT.length; i=i+3){
		
		nevTextures.push( model.textures[model.faces.facesT[i]-1] );
		nevTextures.push( model.textures[ model.faces.facesT[i]-1+1] );
	
		
		nevTextures.push( model.textures[ model.faces.facesT[i+1]-1] );
		nevTextures.push( model.textures[ model.faces.facesT[i+1]-1+1] );
	
		
		nevTextures.push( model.textures[ model.faces.facesT[i+2]-1] );
		nevTextures.push( model.textures[ model.faces.facesT[i+2]-1+1]);		
	}
	//console.dir(nevTextures);
	return nevTextures;
}

function getIndices(model){
	model.indices  = [];
	
    for(var i=0; i<model.vertices.length/3; i++){
		
		model.indices.push(i);
	}		
}

