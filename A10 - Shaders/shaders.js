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
	float decay = pow(LATarget / length(LAPos - fs_pos), LADecay);
	vec4 point_light_color = LAlightColor * decay;
	
	vec3 halfVec = normalize(light_dir + eyedirVec);
	vec4 blinn_specular = point_light_color * specularColor * pow(clamp(dot(halfVec, normalVec), 0.0, 1.0), SpecShine);
	
	vec4 lambert_diffuse = point_light_color * diffColor * clamp(dot(normalVec, light_dir), 0.0, 1.0);
	
	out_color = lambert_diffuse + blinn_specular;
	
`;

// Single directional light, Lambert diffuse, Phong specular, constant ambient and emission
var S3 = `
	vec3 reflection = 2.0 * dot(normalVec, LADir) * normalVec - LADir;
	vec4 phong_specular = LAlightColor * specularColor * pow(clamp(dot(reflection, eyedirVec), 0.0, 1.0), SpecShine);
	
	vec4 lambert_diffuse = LAlightColor * diffColor * clamp(dot(normalVec, LADir), 0.0, 1.0);
	
	vec4 ambient = ambientLightColor * ambColor;
	
	out_color = clamp(ambient + lambert_diffuse + phong_specular + emit, 0.0, 1.0);
`;

// Single spot light (with decay), Lambert diffuse, Blinn specular, no ambient and no emission
var S4 = `
	float LAC_out = cos(radians(LAConeOut / 2.0));
	float LAC_in = cos(radians(LAConeOut * LAConeIn / 2.0));
	float decay = pow(LATarget / length(LAPos - fs_pos), LADecay);
	
	// calculate the direction of light with the spot model
	vec3 spot_light_dir = normalize(LAPos - fs_pos);
	vec4 spot_light_color = LAlightColor * decay * clamp((dot(spot_light_dir, LADir) - LAC_out) / (LAC_in - LAC_out), 0.0, 1.0);
	
	vec3 halfVec = normalize(spot_light_dir + eyedirVec);
	vec4 blinn_specular = spot_light_color * specularColor * pow(clamp(dot(halfVec, normalVec), 0.0, 1.0), SpecShine);

	vec4 lambert_diffuse = spot_light_color * diffColor * clamp(dot(normalVec, spot_light_dir), 0.0, 1.0);
	
	out_color = clamp(lambert_diffuse + blinn_specular, 0.0, 1.0);
`;

// Single directional light, Cartoon diffuse, Cartoon specular, no ambient but emission
var S5 = `
	vec3 reflection = 2.0 * dot(normalVec, LADir) * normalVec - LADir;
	vec4 cartoon_specular_color = specularColor;
	vec4 cartoon_diffuse_color = diffColor;
	
	if(dot(reflection, eyedirVec) <= SToonTh){
		cartoon_specular_color = vec4(0.0, 0.0, 0.0, 1.0);
	}
	
	vec4 cartoon_specular = LAlightColor * cartoon_specular_color;
	
	if(dot(LADir, normalVec) <= DToonTh){
		cartoon_diffuse_color = vec4(0.0, 0.0, 0.0, 1.0);
	}
	
	vec4 cartoon_diffuse = LAlightColor * cartoon_diffuse_color;
	
	out_color = clamp(cartoon_diffuse + cartoon_specular + emit, 0.0, 1.0);
`;

// Single directional light, no diffuse, phong specular, hemispheric ambient and no emission
var S6 = `
	vec3 reflection = 2.0 * dot(normalVec, LADir) * normalVec - LADir;
	vec4 phong_specular = LAlightColor * specularColor * pow(clamp(dot(reflection, eyedirVec), 0.0, 1.0), SpecShine);
	
	vec4 ambient = ambColor * ( ambientLightColor * ((dot(normalVec, ADir) + 1.0) / 2.0) + ( (1.0 - dot(normalVec, ADir)) / 2.0 ) * ambientLightLowColor);

	out_color = clamp(phong_specular + ambient, 0.0, 1.0);
`;

// Three lights: a directional, a point and a spot. Lambert diffuse, phong specular, constant ambient and no emission
var S7 = `
//	LIGHT 1 - DIRECTIONAL
	vec3 reflection_1 = 2.0 * dot(normalVec, LADir) * normalVec - LADir;
	vec4 phong_specular_1 = LAlightColor * specularColor * pow(clamp(dot(reflection_1, eyedirVec), 0.0, 1.0), SpecShine);
	
	vec4 lambert_diffuse_1 = LAlightColor * diffColor * clamp(dot(normalVec, LADir), 0.0, 1.0);
	
	vec4 light_1 = lambert_diffuse_1 + phong_specular_1;
	
//	LIGHT 2 - POINT
	vec3 light_2_dir = normalize(LBPos - fs_pos);
	float decay_2 = pow(LBTarget / length(LBPos - fs_pos), LBDecay);
	vec4 point_light_color = LBlightColor * decay_2;
	
	vec3 reflection_2 = 2.0 * dot(normalVec, light_2_dir) * normalVec - light_2_dir;
	vec4 phong_specular_2 = point_light_color * specularColor * pow(clamp(dot(reflection_2, eyedirVec), 0.0, 1.0), SpecShine);
	
	vec4 lambert_diffuse_2 = point_light_color * diffColor * clamp(dot(normalVec, light_2_dir), 0.0, 1.0);
	
	vec4 light_2 = lambert_diffuse_2 + phong_specular_2;

//	LIGHT 3 - SPOT
	float LCC_out = cos(radians(LCConeOut / 2.0));
	float LCC_in = cos(radians(LCConeOut * LCConeIn / 2.0));
	
	float decay_3 = pow(LCTarget / length(LCPos - fs_pos), LCDecay);
	
	// calculate the direction of light with the spot model
	vec3 light_3_dir = normalize(LCPos - fs_pos);
	vec4 spot_light_color = LClightColor * decay_3 * clamp((dot(light_3_dir, LCDir) - LCC_out) / (LCC_in - LCC_out), 0.0, 1.0);
	
	vec3 reflection_3 = 2.0 * dot(normalVec, light_3_dir) * normalVec - light_3_dir;
	vec4 phong_specular_3 = spot_light_color * specularColor * pow(clamp(dot(reflection_3, eyedirVec), 0.0, 1.0), SpecShine);

	vec4 lambert_diffuse_3 = spot_light_color * diffColor * clamp(dot(normalVec, light_3_dir), 0.0, 1.0);
	
	vec4 light_3 = lambert_diffuse_3 + phong_specular_3;

	vec4 ambient = ambientLightColor * ambColor;

	out_color = clamp( light_1 + light_2 + light_3 + ambient , 0.0, 1.0);
`;
	return [S1, S2, S3, S4, S5, S6, S7];
}