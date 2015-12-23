var SPUtil = {
	clamp:function(val,min,max) {
		return val < min ? min : (val > max ? max : val);
	}
};

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

function INPUT() { var self; return {
	_keycode_to_pressed : {},
	_just_pressed : [],
	_just_released : [],

	_mouse_down : false,
	_mouse_just_pressed : false,
	_mouse_just_released : false,
	_mouse_position : {x:0,y:0},

	__keydown_queue : [],
	__keyup_queue : [],

	i_cons:function(g) {
		self = this;
		window.addEventListener("keydown",function(evt) {
			if (self.__keydown_queue.indexOf(evt.keyCode) == -1) self.__keydown_queue.push(evt.keyCode);
		});
		window.addEventListener("keyup",function(evt) {
			if (self.__keyup_queue.indexOf(evt.keyCode) == -1) self.__keyup_queue.push(evt.keyCode);
		});
		document.getElementById("grid").addEventListener("mousedown",function(evt) {
			if (!self._mouse_down) {
				self._mouse_just_pressed = true;
			}
			self._mouse_down = true;
			self._mouse_position.x = evt.offsetX;
			self._mouse_position.y = evt.offsetY;
		});
		document.getElementById("grid").addEventListener("mousemove",function(evt) {
			self._mouse_position.x = evt.offsetX;
			self._mouse_position.y = evt.offsetY;
		});
		document.getElementById("grid").addEventListener("mouseup",function(evt) {
			if (self._mouse_down) {
				self._mouse_just_released = true;
			}
			self._mouse_down = false;
			self._mouse_position.x = evt.offsetX;
			self._mouse_position.y = evt.offsetY;
		});
	},

	has_focus:function() {
		return document.activeElement == document.body;
	},

	i_update:function(g) {
		self._just_pressed.length = 0;
		self._just_released.length = 0;
		self._mouse_just_pressed = false;
		self._mouse_just_released = false;

		for (var i = 0; i < self.__keydown_queue.length; i++) {
			var itr = self.__keydown_queue[i];
			if (!self._keycode_to_pressed[itr]) {
				self._just_pressed.push(itr);
			}
			self._keycode_to_pressed[itr] = true;
		}
		for (var i = 0; i < self.__keyup_queue.length; i++) {
			var itr = self.__keyup_queue[i];
			if (self._keycode_to_pressed[itr]) {
				self._just_released.push(itr);
			}
			self._keycode_to_pressed[itr] = false;
		}
		self.__keydown_queue.length = 0;
		self.__keyup_queue.length = 0;
	},

	key_pressed:function(key) { return !!self._keycode_to_pressed[key]; },
	key_just_pressed:function(key) { return self._just_pressed.indexOf(key) != -1; },
	key_just_released:function(key) { return self._just_released.indexOf(key) != -1; },
	mouse_pressed:function() { return self._mouse_down; },
	mouse_just_pressed:function() { return self._mouse_just_pressed; },
	mouse_just_released:function() { return self._mouse_just_released; },

	mouse_position:function() {
		return {
			x: self._mouse_position.x,
			y: self._mouse_position.y
		}
	}
}};