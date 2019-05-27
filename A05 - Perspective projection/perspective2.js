function perspective(w, h, fov) {
	// Build a perspective projection matrix, for a viewport
	// whose size is determined by parameters w (width) and h (height),
	// and whose fov-y is passed in parameter fov.
	// Near plane is n=0.1, and far plane f=100.
	var out = [1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];

	var a = w/h;
	var n = 0.1;
	var f = 100;

	var l = -a * n * Math.tan(utils.degToRad(fov)/2);
	var r = l * (-1);
	var t =  n * Math.tan(utils.degToRad(fov)/2);
	var b = t * (-1);

	out[0] = (2*n)/(r-l);
	out[2] = (r+l)/(r-l);
	out[5] = (2*n)/(t-b);
	out[6] = (t+b)/(t-b);
	out[10] = (f+n)/(n-f);
	out[11] = (2*f*n)/(n-f);
	out[14] = -1;
	out[15] = 0;

	return out;
}

