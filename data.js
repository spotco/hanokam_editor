function SPAppData() { var self; return {
	_entries : [],

	i_cons: function() {
		self = this;

		self._entries.push(self.cons_1pt(
			"1pt_test",
			self.cons_point(0,0)));

		self._entries.push(self.cons_2pt(
			"2pt_test",
			self.cons_point(0,50),
			self.cons_point(-50,50),
			self.cons_point(50,50)
		));

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
	cons_2pt: function(val,point_start,point_pt1,point_pt2) {
		return {
			"type":"2pt",
			"val":val,
			"pt1":point_pt1,
			"pt2":point_pt2,
			"start":point_start
		}
	}

}; }