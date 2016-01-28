if (typeof(TYPES) == "undefined") { TYPES = []; }
(function(){
	var self = {
		get_type: function() {
			return "directional";
		},

		i_cons: function(g) {
			g._grid._params[self.get_type()] = {
				_dir_place_point : {x:0,y:0,_draw:false}
			};
		},

		grid_param_reset: function(g) {
			g._grid._params[self.get_type()]._dir_place_point._draw = false;
		},

		vals: function() {
			return ["lasercrab"];
		},

		css_class_selector: function() {
			return ".directional";
		},

		click_point0_element1: function(grid_mouse_pos,itr,pt_dist_max) {
			if (SPUtil.pt_dist(grid_mouse_pos,itr.start) < pt_dist_max) {
				return [itr.start,itr];
			}
			return null;
		},

		shift_y: function(itr,y_val) {
			itr.start.y += y_val;
		},

		grid_mouse_released: function(g) {
			var grid_mouse_pos = g._grid.get_grid_mouse_position(g);
			if (g._grid._params._mode == g._grid.MODES.PLACE_PT_START) {
				g._grid._params[self.get_type()]._dir_place_point.x = grid_mouse_pos.x;
				g._grid._params[self.get_type()]._dir_place_point.y = grid_mouse_pos.y;
				g._grid._params._mode = g._grid.MODES.PLACE_PT1;
				g._grid._params[self.get_type()]._dir_place_point._draw = true;

			} else if (g._grid._params._mode == g._grid.MODES.PLACE_PT1) {

				var dir_vec = (new Vector3d(
					g._grid._params[self.get_type()]._dir_place_point.x,
					g._grid._params[self.get_type()]._dir_place_point.y,
					0)).sub(new Vector3d(grid_mouse_pos.x,grid_mouse_pos.y,0)).normalize();

				g._data._entries.push(self.cons_directional(
					g._ui._params._val,
					g._data.cons_point(grid_mouse_pos.x,grid_mouse_pos.y),
					g._data.cons_point(
						SPUtil.round_dec(dir_vec.x,2),
						SPUtil.round_dec(dir_vec.y,2))
				));
				g._grid._params._mode = g._grid.MODES.PLACE_PT_START;
				g._grid.reset_preview_params(g);
			}
		},
		cons_directional: function(val,point_start,dir) {
			return {
				"type":self.get_type(),
				"val":val,
				"start":point_start,
				"dir":dir
			}
		},

		draw_preview: function(g) {
			if (g._grid._params[self.get_type()]._dir_place_point._draw) {
				g._grid._canvas.save();
				g._grid._canvas.alpha(0.5);
				g._grid._canvas.draw_circ(
					g._grid._params[self.get_type()]._dir_place_point.x,
					-g._grid._params[self.get_type()]._dir_place_point.y,
					10,
					COLOR.YELLOW);
				g._grid._canvas.restore();
			}
		},
		entry_draw: function(g,itr) {
			var pt2 = (new Vector3d(itr.dir.x,itr.dir.y,0)).scale(50).add(new Vector3d(itr.start.x,itr.start.y,0));

			g._grid._canvas.draw_line(itr.start.x,-itr.start.y,pt2.x,-pt2.y,3,COLOR.RED);
			g._grid._canvas.draw_circ(itr.start.x,-itr.start.y,10,COLOR.YELLOW);
			g._grid._canvas.draw_text(itr.start.x,-itr.start.y-10,itr.val,15,COLOR.YELLOW,"center");
		}
	};
	TYPES.push(self);
})();