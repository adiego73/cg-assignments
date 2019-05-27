function perspective() {
	// Build a perspective projection matrix, for a 16/9 viewport,
	// with fov-y=90, near plane n=0.1, and far plane f=100.
	var out = [1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		0.0];

	var a = 16/9;
	var fov_y = 90;
	var n = 0.1;
	var f = 100;

	var l = -a * n * Math.tan(utils.degToRad(fov_y)/2);
	var r = l * (-1);
	var t =  n * Math.tan(utils.degToRad(fov_y)/2);
	var b = t * (-1);

	out[0] = (2*n)/(r-l);
	out[2] = (r+l)/(r-l);
	out[5] = (2*n)/(t-b);
	out[6] = (t+b)/(t-b);
	out[10] = (f+n)/(n-f);
	out[11] = (2*f*n)/(n-f);
	out[14] = -1;


	return out;
}

