if (typeof(TYPES) == "undefined") { TYPES = []; }
(function(){
	var self = {
		get_type: function() {
			return "polygon";
		},

		i_cons: function(g) {
			g._grid._params[self.get_type()] = {
				_pt0 : {x:0,y:0,_draw:false},
				_pt1 : {x:0,y:0,_draw:false},
				_pt2 : {x:0,y:0,_draw:false}
			};
		},

		grid_param_reset: function(g) {
			g._grid._params[self.get_type()]._pt0._draw = false;
			g._grid._params[self.get_type()]._pt1._draw = false;
			g._grid._params[self.get_type()]._pt2._draw = false;
		},

		vals: function() {
			return ["block"];
		},

		css_class_selector: function() {
			return ".polygon";
		},

		click_point0_element1: function(grid_mouse_pos,itr,pt_dist_max) {
			if (SPUtil.pt_dist(grid_mouse_pos,itr.pt0) < pt_dist_max) {
				return [itr.pt0,itr];
			}
			if (SPUtil.pt_dist(grid_mouse_pos,itr.pt1) < pt_dist_max) {
				return [itr.pt1,itr];
			}
			if (SPUtil.pt_dist(grid_mouse_pos,itr.pt2) < pt_dist_max) {
				return [itr.pt2,itr];
			}
			if (SPUtil.pt_dist(grid_mouse_pos,itr.pt3) < pt_dist_max) {
				return [itr.pt3,itr];
			}
			return null;
		},

		shift_y: function(itr,y_val) {
			itr.pt0.y += y_val;
			itr.pt1.y += y_val;
			itr.pt2.y += y_val;
			itr.pt3.y += y_val;
		},

		grid_mouse_released: function(g) {
			var params = g._grid._params[self.get_type()];
			var grid_mouse_pos = g._grid.get_grid_mouse_position(g);
			if (g._grid._params._mode == g._grid.MODES.PLACE_PT_START) {
				params._pt0.x = grid_mouse_pos.x;
				params._pt0.y = grid_mouse_pos.y;
				params._pt0._draw = true;
				g._grid._params._mode = g._grid.MODES.PLACE_PT1;

			} else if (g._grid._params._mode == g._grid.MODES.PLACE_PT1) {
				params._pt1.x = grid_mouse_pos.x;
				params._pt1.y = grid_mouse_pos.y;
				params._pt1._draw = true;
				g._grid._params._mode = g._grid.MODES.PLACE_PT2;

			} else if (g._grid._params._mode == g._grid.MODES.PLACE_PT2) {
				params._pt2.x = grid_mouse_pos.x;
				params._pt2.y = grid_mouse_pos.y;
				params._pt2._draw = true;
				g._grid._params._mode = g._grid.MODES.PLACE_PT3;

			} else if (g._grid._params._mode == g._grid.MODES.PLACE_PT3) {
				g._data._entries.push(self.cons_polygon(
					g._ui._params._val,
					g._data.cons_point(params._pt0.x,params._pt0.y),
					g._data.cons_point(params._pt1.x,params._pt1.y),
					g._data.cons_point(params._pt2.x,params._pt2.y),
					g._data.cons_point(grid_mouse_pos.x,grid_mouse_pos.y)
				));
				g._grid._params._mode = g._grid.MODES.PLACE_PT_START;
				g._grid.reset_preview_params(g);
			}
		},
		cons_polygon: function(val,pt0,pt1,pt2,pt3) {
			return {
				"type":self.get_type(),
				"val":val,
				"pt0":pt0,
				"pt1":pt1,
				"pt2":pt2,
				"pt3":pt3
			}
		},

		draw_preview: function(g) {
			var params = g._grid._params[self.get_type()];
			if (params._pt0._draw) self.draw_point(g,params._pt0.x,params._pt0.y);
			if (params._pt1._draw) self.draw_point(g,params._pt1.x,params._pt1.y);
			if (params._pt2._draw) self.draw_point(g,params._pt2.x,params._pt2.y);
		},

		draw_point: function(g,x,y) {
			g._grid._canvas.save();
			g._grid._canvas.alpha(0.5);
			g._grid._canvas.draw_circ(x,-y,5,COLOR.YELLOW);
			g._grid._canvas.restore();
		},

		entry_draw: function(g,itr) {
			g._grid._canvas.draw_text(itr.pt0.x,-itr.pt0.y-10,itr.val,15,COLOR.YELLOW,"center");
			g._grid._canvas.save();
			g._grid._canvas.alpha(0.85);
			g._grid._canvas.draw_triangle(
				itr.pt0.x,-itr.pt0.y,
				itr.pt1.x,-itr.pt1.y,
				itr.pt2.x,-itr.pt2.y,
				COLOR.RED
			);
			g._grid._canvas.draw_triangle(
				itr.pt0.x,-itr.pt0.y,
				itr.pt2.x,-itr.pt2.y,
				itr.pt3.x,-itr.pt3.y,
				COLOR.RED
			);
			self.draw_point(g,itr.pt0.x,itr.pt0.y);
			self.draw_point(g,itr.pt1.x,itr.pt1.y);
			self.draw_point(g,itr.pt2.x,itr.pt2.y);
			self.draw_point(g,itr.pt3.x,itr.pt3.y);
			g._grid._canvas.restore();
		}
	};
	TYPES.push(self);
})();