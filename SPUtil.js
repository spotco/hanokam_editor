var COLOR = {
	RED: "rgb(255,0,0)",
    BLUE: "rgb(0,0,255)",
    GREEN: "rgb(0,255,0)",
    WHITE: "rgb(255,255,255)",
    BLACK: "rgb(0,0,0)",
   	YELLOW: "rgb(255,255,0)"
}

var CONTROLS = {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	ZOOMIN: 187,
	ZOOMOUT: 189,
	MOVEFASTER: 16
}

var SPUtil = {
	clamp:function(val,min,max) {
		return val < min ? min : (val > max ? max : val);
	},
	cache_cond_update(cache,key,val) {
		var rtv = false;
		if (cache[key] != val) {
			rtv = true;
			cache[key] = val;
		}
		return rtv;
	}
};

var Vector3d = (function () {
    function Vector3d(x, y, z) {
        this.set(x,y,z);
    }
    Vector3d.prototype.copy_of = function () {
    	return new Vector3d(this.x,this.y,this.z);
    };
    Vector3d.prototype.set = function (x,y,z) {
    	this.x = x;
    	this.y = y;
    	this.z = z;
    	return this;
    };
    Vector3d.prototype.normalize = function () {
        var l = this.magnitude();
        this.x /= l;
        this.y /= l;
        this.z /= l;
        return this;
    };
    Vector3d.prototype.magnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
    Vector3d.prototype.scale = function (sf) {
        this.x *= sf;
        this.y *= sf;
        this.z *= sf;
        return this;
    };
    Vector3d.prototype.cross_with = function (a) {
        var x1;
        var y1;
        var z1;

        x1 = (this.y * a.z) - (a.y * this.z);
        y1 = -((this.x * a.z) - (this.z * a.x));
        z1 = (this.x * a.y) - (a.x * this.y);
        return new Vector3d(x1, y1, z1);
    };
    Vector3d.prototype.get_angle = function () {
        return Math.atan2(this.y, this.x);
    };
    Vector3d._tmp = new Vector3d(0,0,0);
    return Vector3d;
})();
