function view(cx, cy, cz, alpha, beta, rho) {
	// Create a view matrix for a camera in position cx, cy and cz, looking in the direction specified by
	// alpha, beta and rho, as outlined in the course slides.
	var T = utils.MakeTranslateMatrix(cx,cy,cz);
	var Rx = utils.MakeRotateXMatrix(beta);
	var Ry = utils.MakeRotateYMatrix(alpha);
	var Rz = utils.MakeRotateZMatrix(rho);

	var out = T;
	out = utils.multiplyMatrices(out, Ry);
	out = utils.multiplyMatrices(out, Rx);
	out = utils.multiplyMatrices(out, Rz);
	out = utils.invertMatrix(out);

	return out;
}

