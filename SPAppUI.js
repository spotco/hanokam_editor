function SPAppUI() { var self; return {
	MODES : {
		"1pt" : "1pt",
		"2pt" : "2pt"
	},
	_params : {
		_mode : "",
		_val : "",

		_2pt : {
			_goto_pt_1 : true
		}
	},
	_cache : {},

	i_cons: function(g) {
		self = this;
		self._params._mode = self.MODES["2pt"];

		$(".controls").draggable({handle:"b"});

		//1pt config
		["bubble","spike"].forEach(function(itr){
			var itr_option = $("<option/>");
			itr_option.attr({"value":itr}).text(itr);
			$(".1pt > .val_select").append(itr_option);
		});
		$(".1pt > .val_select").on("change",function(val) {
			self._params._val = $(this).val();
		});

		//2pt config
		["bubble","spike","puffer"].forEach(function(itr){
			var itr_option = $("<option/>");
			itr_option.attr({"value":itr}).text(itr);
			$(".2pt > .val_select").append(itr_option);
		});
		$(".2pt > .val_select").on("change",function(val) {
			self._params._val = $(this).val();
		});
		$(".2pt > .goto_pt1_select").on("change",function(val) {
			self._params._2pt._goto_pt_1 = (parseInt($(this).val()) == true);
		});

		self.set_and_update_mode(g,self._params._mode);
	},
	i_update: function(g) {
		if (SPUtil.cache_cond_update(self._cache,"focus_disp_cache_key",g._input.has_focus())) {
			$("#info_focused").text("Focused:"+g._input.has_focus());
		}
		if (SPUtil.cache_cond_update(self._cache,"grid_mode_disp_cache_key",g._grid._params._mode)) {
			$("#info_current_grid_mode").text("GridMode:"+g._grid._params._mode);
		}

	},

	set_and_update_mode: function(g, mode) {
		for (var itr in self.MODES) {
			var itr_val = self.MODES[itr];
			if (itr_val == mode) {
				$("."+itr_val).show();
			} else {
				$("."+itr_val).hide();	
			}
		}

		self._params._mode = mode;
		if (mode == self.MODES["1pt"]) {
			self._params._val = $(".1pt > .val_select > option:selected").val();
		} else if (mode == self.MODES["2pt"]) {
			self._params._val = $(".2pt > .val_select > option:selected").val();
		}
		g._grid.notify_ui_mode_change(g);
	}
}; }