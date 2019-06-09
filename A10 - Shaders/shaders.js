function shaders() {
// The shader can find the required information in the following variables:

//vec3 fs_pos;			// Position of the point in 3D space
//
//vec3 LAPos;			// Position of first (or single) light
//vec3 LADir;			// Direction of first (or single) light
//float LAConeOut;		// Outer cone (in degree) of the light (if spot)
//float LAConeIn;		// Inner cone (in percentage of the outher cone) of the light (if spot)
//float LADecay;		// Decay factor (0, 1 or 2)
//float LATarget;		// Target distance
//vec4 LAlightColor;	// color of the first light
//		
//vec3 LBPos;			// Same as above, but for the second light
//vec3 LBDir;
//float LBConeOut;
//float LBConeIn;
//float LBDecay;
//float LBTarget;
//vec4 LBlightColor;
//
//vec3 LCPos;			// Same as above, but for the third one
//vec3 LCDir;
//float LCConeOut;
//float LCConeIn;
//float LCDecay;
//float LCTarget;
//vec4 LClightColor;
//
//vec4 ambientLightColor;		// Ambient light color. For hemispheric, this is the color on the top
//vec4 ambientLightLowColor;	// For hemispheric ambient, this is the bottom color
//vec3 ADir;					// For hemispheric ambient, this is the up direction
//
//float SpecShine;				// specular coefficient for both blinn and phong
//float DToonTh;				// Threshold for diffuse in a toon shader
//float SToonTh;				// Threshold for specular in a toon shader
//
//vec4 diffColor;				// diffuse color
//vec4 ambColor;				// material ambient color -> ambient ligth reflection color: m_a
//vec4 specularColor;			// specular color --> m_s
//vec4 emit;					// emitted color
//	
//vec3 normalVec;				// direction of the normal vecotr to the surface
//vec3 eyedirVec;				// looking direction -> omega_r
//
//
// Final color is returned into:
//vec4 out_color;

// Single directional light, Lambert diffuse only: no specular, no ambient, no emission
var S1 = `
	float decay = 1.0;
	out_color = LAlightColor * decay * diffColor * clamp(dot(LADir, normalVec), 0.0, 1.0);
`;

// Single point light with decay, Lambert diffuse, Blinn specular, no ambient and no emission
var S2 = `
	vec3 light_dir = normalize(LAPos - fs_pos);
	
	vec3 halfVec = normalize(light_dir + eyedirVec);
	vec4 blinn_specular = LAlightColor * specularColor * pow(clamp(dot(halfVec, normalVec), 0.0, 1.0), SpecShine);
	
	float decay = pow(LATarget / length(LAPos - fs_pos), LADecay);
	vec4 lambert_diffuse = LAlightColor * decay * diffColor * clamp(dot(normalVec, light_dir), 0.0, 1.0);
	
	out_color = lambert_diffuse + blinn_specular;
	
`;

// Single directional light, Lambert diffuse, Phong specular, constant ambient and emission
var S3 = `
	vec3 reflection = 2.0 * dot(normalVec, LADir) * normalVec - LADir;
	vec4 phong_specular = LAlightColor * specularColor * pow(clamp(dot(reflection, eyedirVec), 0.0, 1.0), SpecShine);
	
	vec4 lambert_diffuse = LAlightColor * diffColor * clamp(dot(normalVec, LADir), 0.0, 1.0);
	
	vec4 ambient = ambientLightColor * ambColor;
	
	out_color = clamp(ambient + lambert_diffuse + phong_specular + emit, 0.0, 1.0); // should add + emit to add the emission light
`;

// Single spot light (with decay), Lambert diffuse, Blinn specular, no ambient and no emission
var S4 = `
	float LAC_out = cos(radians(LAConeOut / 2.0));
	float LAC_in = cos(radians(LAConeOut * LAConeIn / 2.0));
	
	// calculate the direction of light with the spot model
	vec3 spot_light_dir = normalize(LAPos - fs_pos);
	float spot_light_model = clamp((dot(spot_light_dir, LADir) - LAC_out) / (LAC_in - LAC_out), 0.0, 1.0);
	
	vec3 halfVec = normalize(spot_light_dir + eyedirVec);
	vec4 blinn_specular = LAlightColor * specularColor * pow(clamp(dot(halfVec, normalVec), 0.0, 1.0), SpecShine);

	float decay = pow(LATarget / length(LAPos - fs_pos), LADecay);
	vec4 lambert_diffuse = LAlightColor * decay * spot_light_model * diffColor * clamp(dot(normalVec, spot_light_dir), 0.0, 1.0);
	
	out_color = clamp(lambert_diffuse + blinn_specular, 0.0, 1.0);
`;

// Single directional light, Cartoon diffuse, Cartoon specular, no ambient but emission
var S5 = `
	out_color = vec4(1.0, 0.0, 1.0, 1.0);
`;

// Single directional light, no diffuse, phong specular, hemispheric ambient and no emission
var S6 = `
	out_color = vec4(0.0, 1.0, 1.0, 1.0);
`;

// Three lights: a directional, a point and a spot. Lambert diffuse, phong specular, constant ambient and no emission
var S7 = `
	out_color = vec4(1.0, 1.0, 1.0, 1.0);
`;
	return [S1, S2, S3, S4, S5, S6, S7];
}

