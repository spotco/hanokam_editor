function SPAppData() { var self = {
	_entries : [],

	_pt_tmp_1 : null,
	_pt_tmp_2 : null,

	i_cons: function() {
		self._pt_tmp_1 = self.cons_point(0,0);
		self._pt_tmp_2 = self.cons_point(0,0);
	},

	i_update: function() {},

	undo_last: function() {
		if (self._entries.length > 0) {
			self._entries.splice(self._entries.length-1,1);
		}
	},

	shift_all_y: function(y_val) {
		console.log(y_val)
		for (var i = 0; i < self._entries.length; i++) {
			var itr = self._entries[i];
			TYPES.forEach(function(type){
				if (type.get_type() == itr.type) {
					type.shift_y(itr,y_val);
				}
			});
		}
	},

	click_point0_element1:function(grid_mouse_pos) {
		var pt_dist_max = 10;
		for (var i = 0; i < self._entries.length; i++) {
			var itr = self._entries[i];
			var rtv = null;
			TYPES.forEach(function(type) {
				if (itr.type == type.get_type()) {
					rtv = type.click_point0_element1(grid_mouse_pos,itr,pt_dist_max);
				}
			});
			if (rtv != null) return rtv;
		}
		return null;
	},

	json_out: function(g) {
		return (JSON.stringify({
			"entries":self._entries,
			"spacing_bottom":g._ui.get_current_spacing_bottom()
		}, null, 5));
	},
	json_in: function (g,text) {
		var json_obj;
		try {
			json_obj = JSON.parse(text);
			
		} catch(err) {
			$("#msgout").text("bad json");
			console.log(err);
			return false;
		}

		if (!SPUtil.assert_b_has_all_a_prop({"entries":[]},json_obj)) {
			console.log("invalid json no entries at root");
			return false;
		}

		self._entries = json_obj.entries;
		g._ui.set_current_spacing_bottom(json_obj.spacing_bottom ? json_obj.spacing_bottom : 0);
		return true;
	},

	cons_point: function(x,y) {
		return {
			"x":x,"y":y
		}
	}
}; 
return self;
}