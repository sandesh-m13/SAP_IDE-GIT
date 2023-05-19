sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("ui.pmc.pricing.controller.BaseController", {

		onInit: function() {

		},

		//get the router
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		// Get the serivce model
		getODataModel: function() {

			return this.getOwnerComponent().getModel();
		},

		//resource bundle for i18n in controller
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		}

	});
});