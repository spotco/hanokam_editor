function SPAppData() { var self; return {
	_entries : [],

	_type_check_protos : {
		"1pt":null,
		"2pt":null
	},

	_pt_tmp_1 : null,
	_pt_tmp_2 : null,

	i_cons: function() {
		self = this;
		self._pt_tmp_1 = self.cons_point(0,0);
		self._pt_tmp_2 = self.cons_point(0,0);

		self._type_check_protos["1pt"] = self.cons_1pt("test_val",self.cons_point(0,0));
		self._type_check_protos["2pt"] = self.cons_2pt("test_val",self.cons_point(0,0),self.cons_point(0,0),self.cons_point(0,0),self.cons_point(0,0));
	},

	i_update: function() {},

	json_out_pressed: function() {
		document.getElementById("msgout").value = (JSON.stringify({
			"entries":self._entries
		}, null, 5));
	},
	json_in_pressed: function () {
		var json_obj;
		var text = document.getElementById("msgout").value;
		try {
			json_obj = JSON.parse(text);
			
		} catch(err) {
			$("#msgout").text("bad json");
			console.log(err);
			return;
		}

		if (!SPUtil.assert_b_has_all_a_prop({"entries":[]},json_obj)) {
			console.log("invalid json no entries at root");
			return;
		}

		for (var i = 0; i < json_obj.entries.length; i++) {
			var itr = json_obj.entries[i];
			var cmp = self._type_check_protos[itr.type];
			if (!SPUtil.assert_b_has_all_a_prop(cmp,itr)) {
				console.log("invalid json entry at entries["+i+"]");
				return;
			}
		}
		self._entries = json_obj.entries;
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