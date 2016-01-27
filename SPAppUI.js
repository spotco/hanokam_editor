function SPAppUI() { var self = {
	_params : {
		_mode : "",
		_val : "",
		_is_snap_to_50_active : false
	},
	_cache : {},

	i_cons: function(g) {
		self._params._mode = TYPES[0].get_type();

		$(".controls").draggable({handle:"b"});

		TYPES.forEach(function(type){
			var itr_option = $("<option/>");
			itr_option.attr({"value":type.get_type()}).text(type.get_type());
			$("#type_select").append(itr_option);	
			if (self._params._mode == type.get_type()) {
				itr_option.attr("selected",true);
			}
		});

		$("#type_select").on("change",function(val){
			self.set_and_update_mode(g,$(this).val());
		});
		
		TYPES.forEach(function(type){
			type.vals().forEach(function(itr){
				var itr_option = $("<option/>");
				itr_option.attr({"value":itr}).text(itr);
				$(type.css_class_selector()+" > .val_select").append(itr_option);
			});
			$(type.css_class_selector()+" > .val_select").on("change",function(val) {
				self._params._val = $(this).val();
			});
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
		TYPES.forEach(function(type){
			var itr_val = type.get_type();
			if (itr_val == mode) {
				$("."+itr_val).show();
			} else {
				$("."+itr_val).hide();	
			}
		});

		self._params._mode = mode;
		TYPES.forEach(function(type){
			self._params._val = $(type.css_class_selector()+" > .val_select > option:selected").val();
		});
		g._grid.notify_ui_mode_change(g);
	}
}; 
return self;
}