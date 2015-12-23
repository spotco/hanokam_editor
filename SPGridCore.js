function SPGridCore() { var self; return {
	MODES : {
		PLACE_PT_START : "PLACE_PT_START",
		PLACE_PT1 : "PLACE_PT1",
		PLACE_PT2 : "PLACE_PT2"
	},

	_params: {
		_x: 0,
		_y: 0,
		_scale : 1,
		_mode : "",

		_2pt : {
			_pt_start : {x:0,y:0,_draw:false},
			_pt1 : {x:0,y:0,_draw:false},
			reset : function() {
				this._pt_start._draw = false;
				this._pt1._draw = false;
			}
		}
	},
	_canvas : null,

	i_cons: function(g) {
		self = this;
		self._canvas = new Canvas(document.getElementById("grid"));
		self._params._x = 0;
		self._params._y = 0;
		self._params._scale = 1;
		self._params._mode = self.MODES.PLACE_PT_START;

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
			var grid_mouse_pos = self.get_grid_mouse_position(g);
			if (g._ui._params._mode == g._ui.MODES["1pt"]) {
				self._params._mode = self.MODES.PLACE_PT_START;
				g._data._entries.push(g._data.cons_1pt(
					g._ui._params._val, 
					g._data.cons_point(grid_mouse_pos.x,grid_mouse_pos.y)
				));

			} else if (g._ui._params._mode == g._ui.MODES["2pt"]) {
				if (self._params._mode == self.MODES.PLACE_PT_START) {
					self._params._2pt._pt_start.x = grid_mouse_pos.x;
					self._params._2pt._pt_start.y = grid_mouse_pos.y;
					self._params._2pt._pt_start._draw = true;
					self._params._mode = self.MODES.PLACE_PT1;

				} else if (self._params._mode == self.MODES.PLACE_PT1) {
					self._params._2pt._pt1.x = grid_mouse_pos.x;
					self._params._2pt._pt1.y = grid_mouse_pos.y;
					self._params._2pt._pt1._draw = true;
					self._params._mode = self.MODES.PLACE_PT2;

				} else {
					g._data._entries.push(g._data.cons_2pt(
						g._ui._params._val,
						g._data.cons_point(self._params._2pt._pt_start.x,self._params._2pt._pt_start.y),
						g._data.cons_point(self._params._2pt._pt1.x,self._params._2pt._pt1.y),
						g._data.cons_point(grid_mouse_pos.x,grid_mouse_pos.y),
						g._ui._params._2pt._goto_pt_1
					));
					self._params._mode = self.MODES.PLACE_PT_START;
					self._params._2pt.reset();
				}
			}
		}

		self.draw(g);
	},

	notify_ui_mode_change:function(g) {
		self._params._2pt.reset();
	},

	draw:function(g) {
		self._canvas.set_identity();
		self._canvas.clear();
		
		self.draw_grid(g);
		self.draw_entries(g);

		self.draw_preview(g);

		self._canvas.set_identity();
	},

	draw_preview: function(g) {
		if (self._params._2pt._pt_start._draw) {
			self._canvas.save();
			self._canvas.alpha(0.5);
			self._canvas.draw_circ(self._params._2pt._pt_start.x,-self._params._2pt._pt_start.y,10,COLOR.YELLOW);
			if (self._params._2pt._pt1._draw) {
				self._canvas.draw_circ(
					self._params._2pt._pt1.x,
					-self._params._2pt._pt1.y,5,COLOR.RED);

				var grid_mouse_pos = self.get_grid_mouse_position(g);
				self._canvas.draw_line(
					self._params._2pt._pt1.x,
					-self._params._2pt._pt1.y,
					grid_mouse_pos.x,
					-grid_mouse_pos.y,2,COLOR.RED);
			}
			self._canvas.restore();
		}
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

				var pt_1 = g._data._pt_tmp_1;
				pt_1.x = itr.start.x; 
				pt_1.y = itr.start.y;
				var pt_2 = g._data._pt_tmp_2;
				if (itr.goto_pt1) {
					pt_2.x = itr.pt1.x; 
					pt_2.y = itr.pt1.y;
				} else {
					pt_2.x = itr.pt2.x; 
					pt_2.y = itr.pt2.y;
				}
				var dir = Vector3d._tmp.set(pt_2.x-pt_1.x,pt_2.y-pt_1.y,0).normalize().scale(20);

				self._canvas.draw_line(
					pt_1.x, -pt_1.y, pt_1.x + dir.x, -(pt_1.y + dir.y),5,COLOR.YELLOW);
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
	},

	get_grid_mouse_position:function(g) {
		var rtv = g._input.mouse_position();
		var view_width = self._canvas.width / self._params._scale;
		var view_height = self._canvas.height / self._params._scale;
		rtv.x = rtv.x/self._params._scale - view_width/2 + self._params._x*self._params._scale;
		rtv.y = -rtv.y/self._params._scale + view_height/2 + self._params._y*self._params._scale;
		return rtv;
	}
}; }