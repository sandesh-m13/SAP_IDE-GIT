sap.ui.define([
	"sap/ui/core/format/DateFormat",
	"sap/m/MessageToast",
	"sap/ui/core/format/NumberFormat"
], function (DateFormat, MessageToast, NumberFormat) {
	"use strict";
	return {
		formatDate: function (value) {
			if (value) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "dd-MM-YYYY"
				});
				return oDateFormat.format(value);
			} else {
				return value;
			}
		}

	};
});