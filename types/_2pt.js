if (typeof(TYPES) == "undefined") { TYPES = []; }
(function(){
	var self = {
		get_type: function() {
			return "2pt";
		},

		i_cons: function(g) {
			g._grid._params[self.get_type()] = {
				_pt_start : {x:0,y:0,_draw:false},
				_pt1 : {x:0,y:0,_draw:false}
			};
		},

		grid_param_reset: function(g) {
			g._grid._params[self.get_type()]._pt_start._draw = false;
			g._grid._params[self.get_type()]._pt1._draw = false;
		},

		vals: function() {
			return ["bubble","spike","puffer"];
		},

		css_class_selector: function() {
			return ".2pt";
		},

		click_point0_element1: function(grid_mouse_pos,itr,pt_dist_max) {
			if (SPUtil.pt_dist(grid_mouse_pos,itr.start) < pt_dist_max) {
				return [itr.start,itr];
			} else if (SPUtil.pt_dist(grid_mouse_pos,itr.pt1) < pt_dist_max) {
				return [itr.pt1,itr];
			} else if (SPUtil.pt_dist(grid_mouse_pos,itr.pt2) < pt_dist_max) {
				return [itr.pt2,itr];
			}
			return null;
		},

		shift_y: function(itr,y_val) {
			itr.start.y += y_val;
			itr.pt1.y += y_val;
			itr.pt2.y += y_val;
		},

		grid_mouse_released: function(g) {
			var grid_mouse_pos = g._grid.get_grid_mouse_position(g);
			if (g._grid._params._mode == g._grid.MODES.PLACE_PT_START) {
				g._grid._params[self.get_type()]._pt_start.x = grid_mouse_pos.x;
				g._grid._params[self.get_type()]._pt_start.y = grid_mouse_pos.y;
				g._grid._params[self.get_type()]._pt_start._draw = true;
				g._grid._params._mode = g._grid.MODES.PLACE_PT1;

			} else if (g._grid._params._mode == g._grid.MODES.PLACE_PT1) {
				g._grid._params[self.get_type()]._pt1.x = grid_mouse_pos.x;
				g._grid._params[self.get_type()]._pt1.y = grid_mouse_pos.y;
				g._grid._params[self.get_type()]._pt1._draw = true;
				g._grid._params._mode = g._grid.MODES.PLACE_PT2;

			} else if (g._grid._params._mode == g._grid.MODES.PLACE_PT2) {

				g._data._entries.push(self.cons_2pt(
					g._ui._params._val,
					g._data.cons_point(
						g._grid._params[self.get_type()]._pt_start.x,
						g._grid._params[self.get_type()]._pt_start.y),
					g._data.cons_point(
						g._grid._params[self.get_type()]._pt1.x,
						g._grid._params[self.get_type()]._pt1.y),
					g._data.cons_point(
						grid_mouse_pos.x,
						grid_mouse_pos.y),
					self.get_current_speed()
				));
				g._grid._params._mode = g._grid.MODES.PLACE_PT_START;
				g._grid.reset_preview_params(g);
			}
		},

		cons_2pt: function(val,point_start,point_pt1,point_pt2,speed) {
			return {
				"type":self.get_type(),
				"val":val,
				"pt1":point_pt1,
				"pt2":point_pt2,
				"start":point_start,
				"speed":speed
			}
		},

		get_current_speed : function() {
			return parseFloat($(".2pt > .speed_select").val());
		},

		draw_preview: function(g) {
			var grid_mouse_pos = g._grid.get_grid_mouse_position(g);
			if (g._grid._params[self.get_type()]._pt_start._draw) {
				g._grid._canvas.save();
				g._grid._canvas.alpha(0.5);
				g._grid._canvas.draw_circ(
					g._grid._params[self.get_type()]._pt_start.x,
					-g._grid._params[self.get_type()]._pt_start.y,
					10,
					COLOR.YELLOW);
				if (g._grid._params[self.get_type()]._pt1._draw) {
					g._grid._canvas.draw_circ(
						g._grid._params[self.get_type()]._pt1.x,
						-g._grid._params[self.get_type()]._pt1.y,
						5,
						COLOR.RED);
					
					g._grid._canvas.draw_line(
						g._grid._params[self.get_type()]._pt1.x,
						-g._grid._params[self.get_type()]._pt1.y,
						grid_mouse_pos.x,
						-grid_mouse_pos.y,
						2,
						COLOR.RED);
				}
				g._grid._canvas.restore();
			}
		},
		entry_draw: function(g,itr) {
			g._grid._canvas.draw_circ(itr.pt1.x,-itr.pt1.y,5,COLOR.RED);
			g._grid._canvas.draw_line(itr.pt1.x,-itr.pt1.y,itr.pt2.x,-itr.pt2.y,2,COLOR.RED);
			g._grid._canvas.draw_circ(itr.pt2.x,-itr.pt2.y,5,COLOR.RED);

			g._grid._canvas.draw_text(itr.start.x,-itr.start.y-10,itr.val+"("+itr.speed+")",15,COLOR.YELLOW,"center");
			g._grid._canvas.draw_circ(itr.start.x,-itr.start.y,10,COLOR.YELLOW);

			var pt_1 = g._data._pt_tmp_1;
			pt_1.x = itr.start.x; 
			pt_1.y = itr.start.y;
			var pt_2 = g._data._pt_tmp_2;
			pt_2.x = itr.pt1.x; 
			pt_2.y = itr.pt1.y;
			var dir = Vector3d._tmp.set(pt_2.x-pt_1.x,pt_2.y-pt_1.y,0).normalize().scale(20);

			g._grid._canvas.draw_line(
				pt_1.x, -pt_1.y, pt_1.x + dir.x, -(pt_1.y + dir.y),5,COLOR.YELLOW);
		}
	};
	TYPES.push(self);
})();