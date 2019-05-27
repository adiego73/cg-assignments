function worldViewProjection(carx, cary, carz, cardir, camx, camy, camz, aspectRatio) {
// Computes the world, view and projection matrices for the game.

// carx, cary and carz encodes the position of the car.
// Since the game is basically in 2D, cardir contains the rotation about the y-axis to orient the car
	var world = utils.identityMatrix();
	world = utils.multiplyMatrices(world, utils.MakeTranslateMatrix(carx, cary, carz));
	world = utils.multiplyMatrices(world, utils.MakeRotateYMatrix(cardir));

// The camera is placed at position camx, camy and camz. The view matrix should be computed using the
// LookAt camera matrix procedure, with the correct up-vector.
	var view = utils.MakeLookAt([camx, camy, camz], [carx, cary, carz], [0,1,0]);

// The projection matrix is perspective projection matrix, with the aspect ratio written in parameter
// aspectRatio, a vertical Fov-y of 60 degrees, and with near and far planes repsectively at 0.1 and 1000.0
	var projection = utils.MakePerspective(60, aspectRatio, 0.1, 1000.0);

	return [world, view, projection];
}

