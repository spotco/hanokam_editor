function SPGridCore() { var self = {
	MODES : {
		PLACE_PT_START : "PLACE_PT_START",
		PLACE_PT1 : "PLACE_PT1",
		PLACE_PT2 : "PLACE_PT2",
		PLACE_PT3 : "PLACE_PT3",
		EDITMOVE : "EDITMOVE",
		EDITMOVE_HAS_POINT : "EDITMOVE_HAS_POINT",
		EDITDELETE : "EDITDELETE"
	},
	WORLD_BOUNDS : {left:-875,right:875},

	_params: {
		_x: 0,
		_y: 0,
		_scale : 1,
		_mode : "",

		_edit_move_has_point : {
			_point : {x:0,y:0}
		}
	},
	_canvas : null,

	i_cons: function(g) {
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
		if (g._input.key_just_released(CONTROLS.ZOOMIN)) {
			self._params._scale = SPUtil.clamp(self._params._scale+0.1,0.3,3);
		} else if (g._input.key_just_released(CONTROLS.ZOOMOUT)) {
			self._params._scale = SPUtil.clamp(self._params._scale-0.1,0.3,3);
		}
		if (g._input.key_just_pressed(CONTROLS.EDITCANCEL)) {
			self._params._mode = self.MODES.PLACE_PT_START;
			self.reset_preview_params(g);
		}


		if (self._params._mode == self.MODES.EDITMOVE_HAS_POINT) {
			var grid_mouse_pos = self.get_grid_mouse_position(g);
			self._params._edit_move_has_point._point.x = grid_mouse_pos.x;
			self._params._edit_move_has_point._point.y = grid_mouse_pos.y;

		} else {
			if (g._input.key_pressed(CONTROLS.EDITMOVE)) {
				self.reset_preview_params(g);
				self._params._mode = self.MODES.EDITMOVE;
			} else if (g._input.key_just_released(CONTROLS.EDITMOVE,true)) {
				self._params._mode = self.MODES.PLACE_PT_START;
			}
		}

		if (g._input.key_just_pressed(CONTROLS.EDITDELETE)) {
			self.reset_preview_params(g);
			self._params._mode = self.MODES.EDITDELETE;

		} else if (g._input.key_just_released(CONTROLS.EDITDELETE,true)) {
			self._params._mode = self.MODES.PLACE_PT_START;
		} 

		if (g._input.mouse_just_released()) {
			var grid_mouse_pos = self.get_grid_mouse_position(g);

			if (self._params._mode == self.MODES.EDITMOVE_HAS_POINT) {
				self._params._mode = self.MODES.PLACE_PT_START;

			} else if (self._params._mode == self.MODES.EDITMOVE) {
				var click_point_element_result = g._data.click_point0_element1(grid_mouse_pos);
				if (click_point_element_result != null) {
					var point = click_point_element_result[0];
					self._params._mode = self.MODES.EDITMOVE_HAS_POINT;
					self._params._edit_move_has_point._point = point;
				}

			} else if (self._params._mode == self.MODES.EDITDELETE) {
				var click_point_element_result = g._data.click_point0_element1(grid_mouse_pos);
				if (click_point_element_result != null) {
					var element = click_point_element_result[1];
					g._data._entries = g._data._entries.filter(function(itr){
						return itr != element;
					});
				}

			} else {
				TYPES.forEach(function(type) {
					if (g._ui._params._mode == type.get_type()) {
						type.grid_mouse_released(g);
					}
				});
			}
		}

		self.draw(g);
	},

	notify_ui_mode_change:function(g) {
		self.reset_preview_params(g);
	},
	reset_preview_params:function(g) {
		TYPES.forEach(function(type) {
			type.grid_param_reset(g);
		});
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
		var grid_mouse_pos = self.get_grid_mouse_position(g);

		self._canvas.save();
		self._canvas.alpha(0.3);
		self._canvas.draw_circ(grid_mouse_pos.x,-grid_mouse_pos.y,4,COLOR.WHITE);
		self._canvas.restore();

		TYPES.forEach(function(type) {
			type.draw_preview(g);
		});
	},

	draw_entries: function(g) {
		g._data._entries.forEach(function(itr){
			TYPES.forEach(function(type) {
				if (itr.type == type.get_type()) {
					type.entry_draw(g,itr);
				}
			});
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

		if (screen_left_x < self.WORLD_BOUNDS.left) {
			self._canvas.save();
			self._canvas.alpha(0.2);
			self._canvas.draw_rect(screen_left_x,-screen_bottom_y,self.WORLD_BOUNDS.left-screen_left_x,-(screen_top_y-screen_bottom_y),COLOR.WHITE);
			self._canvas.restore();
		}
		
		if (screen_right_x > self.WORLD_BOUNDS.right) {
			self._canvas.save();
			self._canvas.alpha(0.2);
			var wid = screen_right_x-self.WORLD_BOUNDS.right;
			self._canvas.draw_rect(screen_right_x-wid,-screen_bottom_y,wid,-(screen_top_y-screen_bottom_y),COLOR.WHITE);
			self._canvas.restore();
		}
		

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
		
		if (g._ui.should_snap_to_50()) {
			rtv.x = Math.round(rtv.x/50)*50;
			rtv.y = Math.round(rtv.y/50)*50;
		}
		
		return rtv;
	}
}; 
return self;
}