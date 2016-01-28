if (typeof(TYPES) == "undefined") { TYPES = []; }
(function(){
	var self = {
		get_type: function() {
			return "1pt";
		},

		i_cons: function(g) {
			g._grid._params[self.get_type()] = {};
		},

		grid_param_reset: function(g) {
			g._grid._params[self.get_type()] = {};
		},

		vals: function() {
			return ["bubble","spike"];
		},

		css_class_selector: function() {
			return ".1pt";
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
			g._grid._params._mode = g._grid.MODES.PLACE_PT_START;
			g._data._entries.push(self.cons_1pt(
				g._ui._params._val, 
				g._data.cons_point(grid_mouse_pos.x,grid_mouse_pos.y)
			));
		},
		cons_1pt: function(val,point_start) {
			return {
				"type":self.get_type(),
				"val":val,
				"start":point_start
			}
		},

		draw_preview: function(g) {},
		entry_draw: function(g,itr) {
			g._grid._canvas.draw_circ(itr.start.x,-itr.start.y,10,COLOR.YELLOW);
			g._grid._canvas.draw_text(itr.start.x,-itr.start.y-10,itr.val,15,COLOR.YELLOW,"center");
		}
	};
	TYPES.push(self);
})();