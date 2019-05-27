function R1(){
	// Rotate 30 degrees around an arbitrary axis passing through (1,1,0). The x-axis can be aligned to the arbitrary axis after a rotation of 15 degrees around the z-axis, and then 45 degrees around the y-axis.
	var T = utils.MakeTranslateMatrix(1,1,0);
	var Rz = utils.MakeRotateZMatrix(15);
	var Ry = utils.MakeRotateYMatrix(45);
	var Rx = utils.MakeRotateXMatrix(30);

	var out = utils.multiplyMatrices(T, Ry);
	out = utils.multiplyMatrices(out, Rz);
	out = utils.multiplyMatrices(out, Rx);
	out = utils.multiplyMatrices(out, utils.invertMatrix(Rz));
	out = utils.multiplyMatrices(out, utils.invertMatrix(Ry));
	out = utils.multiplyMatrices(out, utils.invertMatrix(T));

	return out;
}

function S1(){
	// Double the size of an object, using as fixed point (1,1,0)
	var T = utils.MakeTranslateMatrix(1,1,0);
	var S = utils.MakeScaleMatrix(2);

	var out = utils.multiplyMatrices(T, S);
	out = utils.multiplyMatrices(out, utils.invertMatrix(T));

	return out;
}

function S2(){
	// Mirror the starship along a plane passing through (1,2,0), and obtained rotating 38 degree around the y axis the xy plane
	var T = utils.MakeTranslateMatrix(1,2,0);
	var Ry = utils.MakeRotateYMatrix(38);
	var M = utils.MakeScaleNuMatrix(1, 1, -1);

	var out = utils.multiplyMatrices(T, Ry);
	out = utils.multiplyMatrices(out, M);
	out = utils.multiplyMatrices(out, utils.invertMatrix(Ry));
	out = utils.multiplyMatrices(out, utils.invertMatrix(T));

	return out;
}

function I1(){
	// The ship has been doubled in size, rotated 45 degrees around the x axis, 30 degrees around the y axis, and moved to (1,1,-2). Return the ship in its original position
	var S = utils.invertMatrix(utils.MakeScaleMatrix(2));
	var Rx = utils.invertMatrix(utils.MakeRotateXMatrix(45));
	var Ry = utils.invertMatrix(utils.MakeRotateYMatrix(30));
	var T = utils.invertMatrix(utils.MakeTranslateMatrix(1,1,-2));

	var out = utils.multiplyMatrices(S, Rx);
	out = utils.multiplyMatrices(out, Ry);
	out = utils.multiplyMatrices(out, T);

	return out;
}


function move() {
	return [R1(), S1(), S2(), I1()];
}
