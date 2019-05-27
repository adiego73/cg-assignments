// these global variables are used to contain the current angles of the world
var q = Quaternion.ONE;

// this function returns the world matrix with the updated rotations.
// parameters rvx, rvy and rvz contains a value in the -1 .. +1 range that tells the angular velocity of the world.
function updateWorld(rvx, rvy, rvz) {

    var qx = Quaternion.fromAxisAngle([1,0,0], utils.degToRad(rvx));
    var qy = Quaternion.fromAxisAngle([0,1,0], utils.degToRad(rvy));
    var qz = Quaternion.fromAxisAngle([0,0,1], utils.degToRad(rvz));

    var out = qx;
    out = out.mul(qy);
    out = out.mul(qz);
    out = out.mul(q);

    q = out;

    // q = qz.mul(qx).mul(qy).mul(q);

    // var out = q;

    return out.toMatrix4();
}