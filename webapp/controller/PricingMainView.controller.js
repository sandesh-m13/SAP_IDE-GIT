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

		/*BOC SANDESHMALI 3/11/23-HPE-PRICICNG-RATECARD- Routes to detail view page */
		onRowPress: function() {

			this.getView().byId("idSearchRateCard").setVisible(false);
			this.getView().byId("idTableRateCard").setVisible(false);
			this.getView().byId("idSearchDetailRC").setVisible(true);
			this.getView().byId("idTableDetailRC").setVisible(true);
			this.getView().byId("idBackPress").setVisible(true);
		},
		/*EOC SANDESHMALI 3/11/23-HPE-PRICICNG-RATECARD- Routes to detail view page */

		/*BOC SANDESHMALI 5/11/23-HPE-PRICICNG-RATECARD- Routes back to HomePage */
		onBackPress: function() {
			this.getView().byId("idSearchRateCard").setVisible(true);
			this.getView().byId("idTableRateCard").setVisible(true);
			this.getView().byId("idSearchDetailRC").setVisible(false);
			this.getView().byId("idTableDetailRC").setVisible(false);

		},
		/*EOC SANDESHMALI 5/11/23-HPE-PRICICNG-RATECARD- Routes back to HomePage */

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