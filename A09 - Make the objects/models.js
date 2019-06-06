var indexedPrimitives = {
    'piramid': function () {
        var vert = [[0, 0, 1], [-1, 1, 0], [1, 1, 0], [1, -1, 0], [-1, -1, 0]];
        var ind = [1, 2, 3, 3, 4, 1, 1, 0, 2, 2, 0, 3, 3, 0, 4, 4, 0, 1];

        return {'vertices': vert, 'index': ind};
    },
    'cube': function () {
        var vert = [[-1, 1, 1], [1, 1, 1], [1, -1, 1], [-1, -1, 1],
            [-1, 1, -1], [1, 1, -1], [1, -1, -1], [-1, -1, -1]];
        //front-face ordering --> counter-clockwise
        var ind = [
            3, 2, 1, 1, 0, 3, // face 1 - front
            3, 0, 4, 4, 7, 3, // face 2 - left
            6, 7, 4, 4, 5, 6, // face 3 - back
            2, 6, 5, 5, 1, 2, // face 4 - right
            3, 7, 6, 6, 2, 3, // face 5 - bottom
            5, 4, 0, 0, 1, 5 // face 6 - top
        ];

        return {'vertices': vert, 'index': ind};
    },
    'monopoly': function () {
        var vert = [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1], [0, 1.5, 1],
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [0, 1.5, -1]];
        var ind = [
            0, 1, 2, 0, 2, 3, 3, 2, 4, // front face
            1, 6, 7, 1, 7, 2, 2, 7, 9, 2, 9, 4, // right face
            6, 5, 8, 6, 8, 7, 7, 8, 9, // back face
            5, 0, 3, 5, 3, 8, 8, 3, 4, 8, 4, 9,
            5, 6, 1, 5, 1, 0
        ];

        return {'vertices': vert, 'index': ind};
    },
    'cone': function () {
        var vert = [[0.0, 0.0, 1]];
        var ind = [];
        var slices = 6;
        for (var i = 0; i < slices; i++) {
            vert[i + 1] = [Math.cos(2 * Math.PI / slices * i), Math.sin(2 * Math.PI / slices * i), 1];
            ind[3 * i] = 0;
            ind[3 * i + 1] = i + 1;
            ind[3 * i + 2] = (i < slices - 1) ? i + 2 : 1;
        }
        vert[7] = [0, 0, -1];
        ind.push(6,5,7, 1,6,7, 2,1,7, 3,2,7, 4,3,7, 5,4,7);

        return {'vertices': vert, 'index': ind};
    },
    'cylinder': function () {
        var vertFront = [[0.0, 0.0, 1.0]];
        var vertBack = [[0,0,-1]];
        var indFront = [];
        var indBack = [];
        var slices = 64;

        for (var f = 0; f < slices; f++) {
            vertFront[f + 1] = [Math.cos(2 * Math.PI / slices * f), Math.sin(2 * Math.PI / slices * f), 1.0];
            indFront[3 * f] = 0;
            indFront[3 * f + 1] = f + 1;
            indFront[3 * f + 2] = (f < slices - 1) ? f + 2 : 1;
        }

        var start = vertFront.length;
        for (var b = 0; b < slices; b++) {
            vertBack[b + 1]= [Math.cos(2 * Math.PI / slices * b), Math.sin(2 * Math.PI / slices * b), -1.0];
            indBack[3 * b] = start;
            indBack[3 * b + 1] = start + ( (b < slices - 1) ? b + 2 : 1);
            indBack[3 * b + 2] = start + b + 1;
        }

        var vert = vertFront.concat(vertBack);
        var ind = indFront.concat(indBack);

        for (var t = 0; t < slices; t++){
            var index = ind.length + 6*t;
            ind[index] = start + t + 1;
            ind[index + 1] = start + ((t < slices-1) ? t + 2 : 1);
            ind[index + 2] = t + 1;

            ind[index + 3] = start + ((t < slices-1) ? t + 2 : 1);
            ind[index + 4] = (t < slices-1) ? t + 2 : 1;
            ind[index + 5] = t + 1;
        }

        return {'vertices': vert, 'index': ind};
    },
    'sphere': function () {
        var vert = [[0, 0, 1]];
        var vertTop = [];
        var vertMiddle = [];
        var vertBottom = [];
        var ind = [];

        var slices = 6;
        // top part -> the top point and all the triangles connecting to it.
        for (var t = 0; t < slices; t++) {
            vertTop.push([Math.cos(2 * Math.PI / slices * t), Math.sin(2 * Math.PI / slices * t), 0.5]);
        }
        // doing the indexes: 0 -> the top point, then the indexes of the triangles
        ind.push(0,1,2, 0,2,3, 0,3,4, 0,4,5, 0,5,6, 0,6,1);

        // middle part: the hexagon is 15% scaled w.r.t the previous one
        for (var m1 = 0; m1 < slices; m1++) {
            vertMiddle.push([Math.cos(2 * Math.PI / slices * m1) * 1.15, Math.sin(2 * Math.PI / slices * m1) * 1.15, 0]);
        }
        // adding indexes for each face of the middle top face.
        ind.push(8,2,1, 1,7,8,
                 3,2,8, 8,9,3,
                 3,9,10, 10,4,3,
                 4,10,11, 11,5,4,
                 5,11,12, 12,6,5,
                 7,1,6, 6,12,7);

        // bottom part: the hexagon is the same as the first one.
        for (var b = 0; b < slices; b++) {
            vertBottom.push([Math.cos(2 * Math.PI / slices * b), Math.sin(2 * Math.PI / slices * b), -0.5]);
        }
        // adding indexes for each face of the middle bottom face.
        ind.push(14,8,7, 7,13,14,
            9,8,14, 14,15,9,
            9,15,16, 16,10,9,
            10,16,17, 17,11,10,
            11,17,18, 18,12,11,
            13,7,12, 12,18,13);

        // bottom part
        ind.push(19,14,13, 19,15,14, 19,16,15, 19,17,16, 19,18,17, 19,13,18);

        vert = vert.concat(vertTop).concat(vertMiddle).concat(vertBottom);
        vert.push([0.0, 0.0, -1]);

        return {'vertices': vert, 'index': ind};
    }
};

function buildGeometry() {
    // Draws a pyramid
    var piramid = indexedPrimitives.piramid();
    var color1 = [1.0, 0.0, 0.0];
    addMesh(piramid.vertices, piramid.index, color1);

    // Draws a cube
    var cube = indexedPrimitives.cube();
    var color2 = [0.0, 0.0, 1.0];
    addMesh(cube.vertices, cube.index, color2);

    // Draws a Monopoly house
    var monopoly = indexedPrimitives.monopoly();
    var color3 = [0.0, 1.0, 0.0];
    addMesh(monopoly.vertices, monopoly.index, color3);

    // Draws a Cone
    var cone = indexedPrimitives.cone();
    var color4 = [1.0, 1.0, 0.0];
    addMesh(cone.vertices, cone.index, color4);

    // Draws a Cylinder
    var cylinder = indexedPrimitives.cylinder();
    var color5 = [1.0, 0.0, 1.0];
    addMesh(cylinder.vertices, cylinder.index, color5);

    // Draws a Sphere
    var sphere = indexedPrimitives.sphere();
    var color6 = [0.0, 1.0, 1.0];
    addMesh(sphere.vertices, sphere.index, color6);
}

