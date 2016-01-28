var Canvas = (function () {
    function Canvas(c) {
        this._g = c.getContext("2d");
        this.width = this._g.canvas.width;
        this.height = this._g.canvas.height;
    }
    Canvas.prototype.clear = function () {
        this._g.clearRect(0, 0, this.width, this.height);
    };
    Canvas.prototype.draw_rect = function (x, y, width, height, color) {
        this._g.save();
        this._g.fillStyle = color;
        this._g.translate(x, y);
        this._g.fillRect(0, 0, width, height);
        this._g.restore();
    };
    Canvas.prototype.draw_centered_rect = function (x, y, width, height, color, rotation) {
        this._g.save();
        this._g.fillStyle = color;
        this._g.translate(x, y);
        this._g.rotate(rotation);
        this._g.fillRect(-width / 2, -height / 2, width, height);
        this._g.restore();
    };
    Canvas.prototype.draw_circ = function (x, y, rad, color) {
        this._g.save();
        this._g.fillStyle = color;
        this._g.beginPath();
        this._g.arc(x, y, rad, 0, Math.PI * 2);
        this._g.closePath();
        this._g.fill();
        this._g.restore();
    };
    Canvas.prototype.draw_text = function (x, y, text, font_size, font_color, text_align) {
        this._g.font = "normal " + font_size + "px game";
        this._g.fillStyle = font_color;
        this._g.textAlign = text_align;
        this._g.fillText(text, x, y);
    };
    Canvas.prototype.draw_line = function (x1, y1, x2, y2, width, color) {
    	this._g.save();
    	this._g.lineWidth = width;
    	this._g.strokeStyle = color;
    	this._g.beginPath();
    	this._g.moveTo(x1,y1);
    	this._g.lineTo(x2,y2);
    	this._g.stroke();
    	this._g.restore();
    };
    Canvas.prototype.set_identity = function() {
    	this._g.setTransform(1, 0, 0, 1, 0, 0);
    };
    Canvas.prototype.translate = function(x,y) {
    	this._g.translate(x,y);
    };
    Canvas.prototype.scale = function(scale) {
    	this._g.scale(scale,scale);
    };
    Canvas.prototype.save = function(scale) {
    	this._g.save();
    };
    Canvas.prototype.restore = function(scale) {
    	this._g.restore();
    };
    Canvas.prototype.alpha = function(alpha) {
    	this._g.globalAlpha = alpha;
    };
    Canvas.prototype.draw_triangle = function(x0,y0,x1,y1,x2,y2,color) {
        this._g.save();
        this._g.fillStyle = color;
        this._g.beginPath();
        this._g.moveTo(x0,y0);
        this._g.lineTo(x1,y1);
        this._g.lineTo(x2,y2);
        this._g.closePath();
        this._g.fill();
        this._g.restore();
    };
    
    return Canvas;
})();