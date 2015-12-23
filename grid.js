function GRID() { var self; return {
	_params: {
		_x: 0,
		_y: 0,
		_scale : 1
	},
	_canvas : null,

	i_cons: function(g) {
		self = this;
		self._canvas = new Canvas(document.getElementById("grid"));
		self._params._x = 0;
		self._params._y = 0;
		self.draw(g);
	},

	i_update: function(g) {
		var move_speed = g._input.key_pressed(CONTROLS.MOVEFASTER) ? 15 : 5;
		if (g._input.key_pressed(CONTROLS.LEFT)) {
			self._params._x -= move_speed / self._params._scale;
		} else if (g._input.key_pressed(CONTROLS.RIGHT)) {
			self._params._x += move_speed / self._params._scale;
		}
		if (g._input.key_pressed(CONTROLS.UP)) {
			self._params._y += move_speed / self._params._scale;
		} else if (g._input.key_pressed(CONTROLS.DOWN)) {
			self._params._y -= move_speed / self._params._scale;
		}
		if (g._input.key_pressed(CONTROLS.ZOOMIN)) {
			self._params._scale = SPUtil.clamp(self._params._scale+0.1,0.3,3);
		} else if (g._input.key_pressed(CONTROLS.ZOOMOUT)) {
			self._params._scale = SPUtil.clamp(self._params._scale-0.1,0.3,3);
		}

		if (g._input.mouse_just_released()) {
			g._data._entries.push(
				g._data.cons_1pt(
					"tmp_val", self.get_grid_mouse_position(g)
				));
		}

		self.draw(g);
	},

	get_grid_mouse_position:function(g) {
		var rtv = g._input.mouse_position();
		var view_width = self._canvas.width / self._params._scale;
		var view_height = self._canvas.height / self._params._scale;
		rtv.x = rtv.x/self._params._scale - view_width/2;
		rtv.y = -rtv.y/self._params._scale + view_height/2;
		return rtv;
	},

	draw:function(g) {
		self._canvas.set_identity();
		self._canvas.clear();
		
		self.draw_grid(g);
		self.draw_entries(g);

		self._canvas.set_identity();
	},

	draw_entries: function(g) {
		g._data._entries.forEach(function(itr){
			if (itr.type == "1pt") {
				self._canvas.draw_circ(itr.start.x,-itr.start.y,10,COLOR.YELLOW);
				self._canvas.draw_text(itr.start.x,-itr.start.y-10,itr.val,15,COLOR.YELLOW,"center");

			} else if (itr.type == "2pt") {
				self._canvas.draw_circ(itr.pt1.x,-itr.pt1.y,5,COLOR.RED);
				self._canvas.draw_line(itr.pt1.x,-itr.pt1.y,itr.pt2.x,-itr.pt2.y,2,COLOR.RED);
				self._canvas.draw_circ(itr.pt2.x,-itr.pt2.y,5,COLOR.RED);

				self._canvas.draw_text(itr.start.x,-itr.start.y-10,itr.val,15,COLOR.YELLOW,"center");
				self._canvas.draw_circ(itr.start.x,-itr.start.y,10,COLOR.YELLOW);

			}
		});
	},

	draw_grid: function(g) {
		var view_width = self._canvas.width / self._params._scale;
		var view_height = self._canvas.height / self._params._scale;

		self._canvas.scale(self._params._scale);
		self._canvas.translate(
			-(self._params._x)*self._params._scale + view_width/2,
			self._params._y*self._params._scale + view_height/2
		);
		

		var screen_bottom_y = self._params._y*self._params._scale - view_height/2;
		var screen_top_y = self._params._y*self._params._scale + view_height/2;
		var screen_left_x = self._params._x*self._params._scale - view_width/2;
		var screen_right_x = self._params._x*self._params._scale + view_width/2;

		for (var i = Math.floor(screen_bottom_y/50)*50; i < screen_top_y; i+= 50) {
			self._canvas.save();
			self._canvas.alpha(0.3);
			self._canvas.draw_line(screen_left_x,-i,screen_right_x,-i,2,COLOR.WHITE);
			self._canvas.alpha(0.6);
			self._canvas._g.textBaseline = 'middle';
			self._canvas.draw_text(screen_left_x,-i,""+i,15,COLOR.WHITE,"left");
			self._canvas.restore();
			
		}

		for (var i = Math.floor(screen_left_x/50)*50; i < screen_right_x; i+= 50) {
			self._canvas.save();
			self._canvas.alpha(0.3);
			self._canvas.draw_line(i,-screen_bottom_y,i,-screen_top_y,2,COLOR.WHITE);
			self._canvas.alpha(0.6);
			self._canvas._g.textBaseline = 'top';
			self._canvas.draw_text(i,-screen_top_y,""+i,15,COLOR.WHITE,"left");
			self._canvas.restore();
		}

		self._canvas.save();
		self._canvas.alpha(0.4);
		self._canvas.draw_line(0,-screen_bottom_y,0,-screen_top_y,4,COLOR.WHITE);
		self._canvas.draw_line(screen_left_x,0,screen_right_x,0,4,COLOR.WHITE);
		self._canvas.restore();
	}
}; }