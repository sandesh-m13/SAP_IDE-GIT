sap.ui.define([
	"ui/pmc/pricing/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, BaseController, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("ui.pmc.pricing.controller.PricingMainView", {
		onInit: function() {

		},
		subscribeEvent: function() {
			var oEventBus = this.getEventBus();
			oEventBus.subscribe("attributeListChannel", "navBack", function(channel, fn, oEventData) {
				this.onItemBack();
			}.bind(this));
		},
		/*BOC SANDESHMALI 3/11/23-HPE-PRICICNG-RATECARD- Routes to detail view page */
		onRowPress: function() {

			// if (!this._oEditDataFragment) {
			// 	this._oEditDataFragment = sap.ui.xmlfragment("ui.pmc.pricing.view.Pricing_SubView_RateCardDetail", this);
			// 	this.getView().addDependent(this._oEditDataFragment);
			// 	// this._oEditDataFragment.setModel(oModel, "EditData");
			// }
			// this._oEditDataFragment.open();

		},
		/*EOC SANDESHMALI 3/11/23-HPE-PRICICNG-RATECARD- Routes to detail view page */
		/*BOC SANDESHMALI 3/11/23-HPE-PRICICNG-RATECARD- Routes to detail view page */
		onPressGo: function() {

			var aNewFilters = [],
				oRateCardSearchInput = this.byId("idRateCardSearchInput"),
				oDescSearchInput = this.byId("idDescSearchInput");

			var skRateCardSearch = oRateCardSearchInput.getSelectedKey();
			var skDescSearch = oDescSearchInput.getSelectedKey();
			if (skRateCardSearch) {
				aNewFilters.push(new Filter("Creation", FilterOperator.EQ, skRateCardSearch));
			}
			if (skDescSearch) {
				aNewFilters.push(new Filter("Material", FilterOperator.EQ, skDescSearch));
			}
			var oTable = this.byId("idOfferSearchTable"),
				oBinding = oTable.getBinding("items");
			oBinding.filter(aNewFilters);
			if (oBinding.isSuspended()) {
				oBinding.resume();

			}
		},
		onPressNewRateCard: function() {
			var router = this.getOwnerComponent().getRouter();
			router.navTo("NewRateCard");
		}
	});
});