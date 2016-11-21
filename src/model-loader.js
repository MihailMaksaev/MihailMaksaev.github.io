function loadModel(urlPath, calback) {
//for three librari json loader
    var loader = new THREE.JSONLoader();

    loader.load(urlPath, function(geometry, materials) {

        var JSONOBJ = {};

        var texture = [];
        geometry.faceVertexUvs[0].forEach(function(item, i) {

            texture.push(item[0].x);
            texture.push(item[0].y);
            texture.push(item[1].x);
            texture.push(item[1].y);
            texture.push(item[2].x);
            texture.push(item[2].y);
        });

        var indices = [];
        geometry.faces.forEach(function(item, i) {

            indices.push(item["a"]);;
            indices.push(item["b"]);
            indices.push(item["c"]);
        });

        var vertices = [];

        for (var g = 0; g < geometry.morphTargets.length; g++) {
            // var num = ""+g;
            vertices[g] = [];

            geometry.morphTargets[g].vertices.forEach(function(item, i) {


                vertices[g].push(item["x"]);;
                vertices[g].push(item["y"]);
                vertices[g].push(item["z"]);
            });
        }
		//пересборка вершин для совпадения с текстурами
		var nevVertices = [];
		
		for (var gg = 0; gg < vertices.length; gg++) {
			
			
			nevVertices[gg] = [];
		
		    for(var ii = 0; ii< indices.length; ii=ii+3){
			     //console.log(indices.length);   
			    nevVertices[gg].push(vertices[gg][indices[ii]*3]); nevVertices[gg].push(vertices[gg][(indices[ii]*3)+1]); nevVertices[gg].push(vertices[gg][(indices[ii]*3)+2]);
				nevVertices[gg].push(vertices[gg][indices[ii+1]*3]); nevVertices[gg].push(vertices[gg][(indices[ii+1]*3)+1]); nevVertices[gg].push(vertices[gg][(indices[ii+1]*3)+2]);
				nevVertices[gg].push(vertices[gg][indices[ii+2]*3]); nevVertices[gg].push(vertices[gg][indices[ii+2]*3+1]); nevVertices[gg].push(vertices[gg][indices[ii+2]*3+2]);
		    }
			
			
        }
		
		var nevIndices = [];
		for(var vv=0; vv<indices.length; vv++){
			
			nevIndices.push(vv);
			
		}
		
        //console.dir(vertices);
        //console.dir(geometry);
        //console.dir(materials);

        JSONOBJ = {
            vertices: nevVertices,
			textures: texture,
            indices: nevIndices,
			nevVertices: nevVertices,
			nevIndices: nevIndices
            
        };

        //console.dir(JSONOBJ);

        calback(JSONOBJ);

    });



}