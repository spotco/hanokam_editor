function SPAppData() { var self; return {
	_entries : [],

	_pt_tmp_1 : null,
	_pt_tmp_2 : null,

	i_cons: function() {
		self = this;
		self._pt_tmp_1 = self.cons_point(0,0);
		self._pt_tmp_2 = self.cons_point(0,0);
	},

	i_update: function() {
	},
	cons_point: function(x,y) {
		return {
			"x":x,"y":y
		}
	},
	cons_1pt: function(val,point_start) {
		return {
			"type":"1pt",
			"val":val,
			"start":point_start
		}
	},
	cons_2pt: function(val,point_start,point_pt1,point_pt2,goto_pt1) {
		return {
			"type":"2pt",
			"val":val,
			"pt1":point_pt1,
			"pt2":point_pt2,
			"start":point_start,
			"goto_pt1":goto_pt1
		}
	}

}; }