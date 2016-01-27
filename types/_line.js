if (typeof(TYPES) == "undefined") { TYPES = []; }
(function(){
	var self = {
		get_type: function() {
			return "line";
		},

		i_cons: function(g) {
			g._grid._params[self.get_type()] = {
				_pt1 : {x:0,y:0,_draw:false}
			};
		},

		grid_param_reset: function(g) {
			g._grid._params[self.get_type()]._pt1._draw = false;
		},

		vals: function() {
			return ["blockleft","blockright"];
		},

		css_class_selector: function() {
			return ".line";
		},

		click_point0_element1: function(grid_mouse_pos,itr,pt_dist_max) {
			if (SPUtil.pt_dist(grid_mouse_pos,itr.pt1) < pt_dist_max) {
				return [itr.pt1,itr];
			} else if (SPUtil.pt_dist(grid_mouse_pos,itr.pt2) < pt_dist_max) {
				return [itr.pt2,itr];
			}
			return null;
		},

		shift_y: function(itr,y_val) {
			itr.pt1.y += y_val;
			itr.pt2.y += y_val;
		},

		grid_mouse_released: function(g) {
			var grid_mouse_pos = g._grid.get_grid_mouse_position(g);	
			if (g._grid._params._mode == g._grid.MODES.PLACE_PT_START) {
				g._grid._params[self.get_type()]._pt1.x = grid_mouse_pos.x;
				g._grid._params[self.get_type()]._pt1.y = grid_mouse_pos.y;
				g._grid._params._mode = g._grid.MODES.PLACE_PT1;
				g._grid._params[self.get_type()]._pt1._draw = true;

			} else if (g._grid._params._mode == g._grid.MODES.PLACE_PT1) {
				g._data._entries.push(self.cons_line(
					g._ui._params._val,
					g._data.cons_point(g._grid._params[self.get_type()]._pt1.x,g._grid._params[self.get_type()]._pt1.y),
					g._data.cons_point(grid_mouse_pos.x,grid_mouse_pos.y)
				));
				g._grid._params._mode = g._grid.MODES.PLACE_PT_START;
				g._grid.reset_preview_params(g);
			}
		},
		cons_line: function(val,pt1,pt2) {
			return {
				"type":self.get_type(),
				"val":val,
				"pt1":pt1,
				"pt2":pt2
			};
		},

		draw_preview: function(g,itr) {
			if (g._grid._params[self.get_type()]._pt1._draw) {
				g._grid._canvas.save();
				g._grid._canvas.alpha(0.5);
				g._grid._canvas.draw_circ(
					g._grid._params[self.get_type()]._pt1.x,
					-g._grid._params[self.get_type()]._pt1.y,
					10,
					COLOR.YELLOW);
				g._grid._canvas.restore();
			}
		},
		entry_draw: function(g,itr) {
			g._grid._canvas.draw_line(itr.pt1.x,-itr.pt1.y,itr.pt2.x,-itr.pt2.y,3,COLOR.RED);
			g._grid._canvas.draw_circ(itr.pt1.x,-itr.pt1.y,10,COLOR.YELLOW);
			g._grid._canvas.draw_circ(itr.pt2.x,-itr.pt2.y,10,COLOR.YELLOW);
			g._grid._canvas.draw_text(itr.pt1.x,-itr.pt1.y-10,itr.val,15,COLOR.YELLOW,"center");
		}
	};
	TYPES.push(self);
})();