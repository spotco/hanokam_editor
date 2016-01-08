function SPAppUI() { var self = {
	MODES : {
		"1pt" : "1pt",
		"2pt" : "2pt"
	},
	_params : {
		_mode : "",
		_val : "",

		_2pt : {
			get_current_speed : function() {
				return parseFloat($(".2pt > .speed_select").val());
			}
		},

		_is_snap_to_50_active : false
	},
	_cache : {},

	i_cons: function(g) {
		self._params._mode = self.MODES["2pt"];

		$(".controls").draggable({handle:"b"});

		//types config
		for (var itr in self.MODES) {
			var itr_option = $("<option/>");
			itr_option.attr({"value":itr}).text(itr);
			$("#type_select").append(itr_option);	
			if (self._params._mode == self.MODES[itr]) {
				itr_option.attr("selected",true);
			}
		}
		$("#type_select").on("change",function(val){
			self.set_and_update_mode(g,self.MODES[$(this).val()]);
		});

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

		$("#shift_all_y_button").on("click",function(){
			var val = parseInt($("#shift_all_y_input").val());
			g._data.shift_all_y(val);
		});

		$("#snap_to_50").on("change",function(val) {
			self._params._is_snap_to_50_active = $("#snap_to_50").is(':checked');
		});
		self._params._is_snap_to_50_active = $("#snap_to_50").is(':checked');

		self.set_and_update_mode(g,self._params._mode);
	},
	i_update: function(g) {
		if (SPUtil.cache_cond_update(self._cache,"focus_disp_cache_key",g._input.has_focus())) {
			$("#info_focused").text("Focused:"+g._input.has_focus());
		}
		if (SPUtil.cache_cond_update(self._cache,"grid_mode_disp_cache_key",g._grid._params._mode)) {
			$("#info_current_grid_mode").text("GridMode:"+g._grid._params._mode);
		}
		if (g._input.key_just_released(CONTROLS.UNDO)) {
			g._data.undo_last(g);
		}
		if (g._input.key_just_released(CONTROLS.PRINT)) {
			self.json_out_pressed(g);
		}
	},

	get_current_spacing_bottom: function() {
		return parseFloat($("#spacing_bottom").val());
	},
	set_current_spacing_bottom: function(val) {
		$("#spacing_bottom").val(val);
	},

	should_snap_to_50: function() {
		return self._params._is_snap_to_50_active;
	},

	json_out_pressed: function (g) {
		document.getElementById("msgout").value = g._data.json_out(g);
	},
	json_in_pressed: function(g) {
		g._data.json_in(g,document.getElementById("msgout").value);
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
}; 
return self;
}