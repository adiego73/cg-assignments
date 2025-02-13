function draw() {
	// line(x1,y1, x2,y2)
	// draws a line from a point at Normalized screen coordinates x1,y1 to Normalized screen coordinates x2,y2

	//------------------
	// HOUSE LINES

	// Interpolation
	//y = y0 + (x − x0) ( (y1 − y0) / (x1 - x0)
	// y = 0.8 + (x - 0) ( (0.5 - 0.8)/(0.5 - 0) ) ==> y = 0.8 - 0.6x
	line(0, 0.8,0.5,0.5);
	line(-0.5, 0.5,0,0.8);
	line(-0.5,-0.7,-0.5, 0.5);
	line(0.5,-0.7,0.5, 0.5);
	line(-0.5,-0.7,0.5,-0.7);

	//-----------------
	// DOOR
	line(-0.1,-0.7,-0.1, -0.3);
	line(0.1,-0.7,0.1, -0.3);
	line(-0.1,-0.3,0.1, -0.3);

	//-----------------
	// WINDOW 1
	line(0.4,0.5,0.4, 0.2);
	line(0.1,0.5,0.1, 0.2);
	line(0.4,0.5,0.1, 0.5);
	line(0.4,0.2,0.1, 0.2);

	//-----------------
	// WINDOW 2
	line(-0.4,0.5,-0.4, 0.2);
	line(-0.1,0.5,-0.1, 0.2);
	line(-0.4,0.5,-0.1, 0.5);
	line(-0.4,0.2,-0.1, 0.2);

	//-----------------
	// CHIMNEY
	line(0.2,0.68,0.2, 0.8);
	line(0.4,0.56,0.4, 0.8);
	line(0.4,0.8,0.2, 0.8);
}

