function SPAppUI() { var self; return {
	MODES : {
		_1pt : "_1pt",
		_2pt : "_2pt"
	},
	_params : {
		_current_mode : "",
		_val : ""
	},

	i_cons: function() {
		self = this;
		self._params._current_mode = self.MODES._1pt;

		$(".controls").draggable({handle:"b"});

		["bubble","spike"].forEach(function(itr){
			var itr_option = $("<option/>");
			itr_option.attr({"value":itr}).text(itr);
			$("._1pt > .val_select").append(itr_option);
		});
		$("._1pt > .val_select").on("change",function(val) {
			self._params._val = $(this).val();
		});

		["bubble","spike","puffer"].forEach(function(itr){
			var itr_option = $("<option/>");
			itr_option.attr({"value":itr}).text(itr);
			$("._2pt > .val_select").append(itr_option);
		});
		$("._2pt > .val_select").on("change",function(val) {
			self._params._val = $(this).val();
		});

		self.set_and_update_mode(self._params._current_mode);
	},
	i_update: function() {
		
	},

	set_and_update_mode: function(mode) {
		for (var itr in self.MODES) {
			if (itr == mode) {
				$("."+itr).show();
			} else {
				$("."+itr).hide();	
			}
		}

		if (mode == self.MODES._1pt) {
			self._params._val = $("._1pt > .val_select > option:selected").val();
		} else {
			self._params._val = $("._2pt > .val_select > option:selected").val();
		}
	}
}; }