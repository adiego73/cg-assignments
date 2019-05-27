function makeOrthogonalProjectionMatrix(w,a,n,f){
	var out = utils.identityMatrix();
	out[0] = 1/w;
	out[5] = a/w;
	out[10] = -2/(f-n);
	out[11] = -(f+n)/(f-n);
	return out;
}

function A1(w, a, n, f){
	// Make an isometric view, w = 40, a = 16/9, n = 1, f = 101.
	var Rx = utils.MakeRotateXMatrix(35.26);
	var Ry = utils.MakeRotateYMatrix(45);

	var out = makeOrthogonalProjectionMatrix(w,a,n,f);
	out = utils.multiplyMatrices(out, Rx);
	out = utils.multiplyMatrices(out, Ry);

	return out;
}

function A2(w,a,n,f){
	// Make a dimetric view, w = 40, a = 16/9, n = 1, f = 101, rotated 20 around the x-axis
	var Rx = utils.MakeRotateXMatrix(20);
	var Ry = utils.MakeRotateYMatrix(45);

	var out = makeOrthogonalProjectionMatrix(w,a,n,f);
	out = utils.multiplyMatrices(out, Rx);
	out = utils.multiplyMatrices(out, Ry);

	return out;
}

function A3(w,a,n,f){
	// Make a trimetric view, w = 40, a = 16/9, n = 1, f = 101, rotated -30 around the x-axis and 30 around the y-axis
	var Rx = utils.MakeRotateXMatrix(-30);
	var Ry = utils.MakeRotateYMatrix(30);

	var out = makeOrthogonalProjectionMatrix(w,a,n,f);
	out = utils.multiplyMatrices(out, Rx);
	out = utils.multiplyMatrices(out, Ry);

	return out;
}

function Cavalier(w,a,n,f){
	// Make an cavalier projection view, w = 40, a = 16/9, n = 1, f = 101, at 45 degrees
	var shearX = -1*Math.cos(utils.degToRad(45));
	var shearY = -1*Math.sin(utils.degToRad(45));
	var S = utils.MakeShearZMatrix(shearX, shearY);

	var out = makeOrthogonalProjectionMatrix(w,a,n,f);
	out = utils.multiplyMatrices(out, S);

	return out;
}

function Cabinet(w,a,n,f){
	// Make a cabinet projection view, w = 40, a = 16/9, n = 1, f = 101, at 60 degrees
	var shearX = -0.5*Math.cos(utils.degToRad(60));
	var shearY = -0.5*Math.sin(utils.degToRad(60));
	var S = utils.MakeShearZMatrix(shearX, shearY);

	var out = makeOrthogonalProjectionMatrix(w,a,n,f);
	out = utils.multiplyMatrices(out, S);

	return out;
}

function axonometry() {
	var a = 16/9;
	var w = 40;
	var n = 1;
	var f = 101;

	return [A1(w,a,n,f), A2(w,a,n,f), A3(w,a,n,f), Cavalier(w,a,n,f), Cabinet(w,a,n,f)];
}

