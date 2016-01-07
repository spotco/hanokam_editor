function SPAppData() { var self = {
	TYPES: {
		_1pt : "1pt",
		_2pt : "2pt"
	},

	_entries : [],

	_type_check_protos : {},

	_pt_tmp_1 : null,
	_pt_tmp_2 : null,

	i_cons: function() {
		self._pt_tmp_1 = self.cons_point(0,0);
		self._pt_tmp_2 = self.cons_point(0,0);

		self._type_check_protos[self.TYPES._1pt] = self.cons_1pt("test_val",self.cons_point(0,0));
		self._type_check_protos[self.TYPES._2pt] = self.cons_2pt("test_val",self.cons_point(0,0),self.cons_point(0,0),self.cons_point(0,0),self.cons_point(0,0));
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
			if (itr.type == self.TYPES._1pt) {
				itr.start.y += y_val;
			} else if (itr.type == self.TYPES._2pt) {
				itr.start.y += y_val;
				itr.pt1.y += y_val;
				itr.pt2.y += y_val;
			}
		}
	},

	click_point0_element1:function(grid_mouse_pos) {
		var pt_dist_max = 10;
		for (var i = 0; i < self._entries.length; i++) {
			var itr = self._entries[i];
			if (itr.type == self.TYPES._1pt) {
				if (SPUtil.pt_dist(grid_mouse_pos,itr.start) < pt_dist_max) {
					return [itr.start,itr];
				}
			} else if (itr.type == self.TYPES._2pt) {
				if (SPUtil.pt_dist(grid_mouse_pos,itr.start) < pt_dist_max) {
					return [itr.start,itr];
				} else if (SPUtil.pt_dist(grid_mouse_pos,itr.pt1) < pt_dist_max) {
					return [itr.pt1,itr];
				} else if (SPUtil.pt_dist(grid_mouse_pos,itr.pt2) < pt_dist_max) {
					return [itr.pt2,itr];
				}
			}
		}
		return null;
	},

	json_out: function() {
		return (JSON.stringify({
			"entries":self._entries
		}, null, 5));
	},
	json_in: function (text) {
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

		for (var i = 0; i < json_obj.entries.length; i++) {
			var itr = json_obj.entries[i];
			var cmp = self._type_check_protos[itr.type];
			if (!SPUtil.assert_b_has_all_a_prop(cmp,itr)) {
				console.log("invalid json entry at entries["+i+"]");
				return false;
			}
		}
		self._entries = json_obj.entries;
		return true;
	},

	cons_point: function(x,y) {
		return {
			"x":x,"y":y
		}
	},
	cons_1pt: function(val,point_start) {
		return {
			"type":self.TYPES._1pt,
			"val":val,
			"start":point_start
		}
	},
	cons_2pt: function(val,point_start,point_pt1,point_pt2,speed) {
		return {
			"type":self.TYPES._2pt,
			"val":val,
			"pt1":point_pt1,
			"pt2":point_pt2,
			"start":point_start,
			"speed":speed
		}
	}
}; 
return self;
}