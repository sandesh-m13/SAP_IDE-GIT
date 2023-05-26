sap.ui.define([
	"ui/pmc/pricing/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment"
], function(Controller, BaseController, Filter, FilterOperator, MessageToast, Spreadsheet, MessageBox, Fragment) {
	"use strict";

	return BaseController.extend("ui.pmc.pricing.controller.PricingMainView", {
		onInit: function() {

		},
		// test
		onadddd: function() {
			MessageBox.information("HI there");
		},

		/*BOC SANDESHMALI 5/24/23-HPE-PRICICNG-RATECARD-(Testing) information for pricing upload tool */
		onInfoButtonPress: function(oEvent) {
			var oHBox = oEvent.getSource().getParent();
			var oLabel = oHBox.getItems()[1]; // Assuming the label is the second item in the HBox
			var sLabelText = oLabel.getText();
			var sFieldInformation = "Information about " + sLabelText; // Replace with your actual information

			// Show the field information in a dialog or any other desired method
			MessageBox.information(sFieldInformation, {
				title: "Field Information"
			});
		},

		/*EOC SANDESHMALI 3/11/23-HPE-PRICICNG-RATECARD- Routes to detail view page */

		/*BOC SANDESHMALI 5/24/23-HPE-PRICICNG-RATECARD-Lazy loading of views*/
		// fragmentName: function() {
		// 	return "ui.pmc.pricing.view.Pricing_SubView_Medallion";
		// },
		onIconTabBarSelected: function(oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			// if (oEvent.getParameter("selectedKey") === "AttributeGroup") {

			// 	// this._oRouter.navTo("RouteApp",{},true);
			// 	oRouter.getTargets().display("MainToAttributeGroup");
			// }

			var sSelectedTab = oEvent.getParameter("selectedKey");
			// var oEventBus = this.getOwnerComponent().getEventBus();
			switch (sSelectedTab) {
				case "medallion":
					if (!this.byId("medallionFragment")) {
						// var oLayout = this.getView().byId('idMedallion'), //don't forget to set id for a VerticalLayout
						// 	oFragment = sap.ui.xmlfragment(this.fragmentName.bind(this));
						// oLayout.addContent(oFragment);
						// Fragment.load({
						// 	name: "ui.pmc.pricing.view.Pricing_SubView_Medallion"
						// }).then(function(oContent) {
						// 	if (!this.isDestroyStarted()) {
						// 		// do stuff
						// 	}
						// });

						this._medallionFragment = sap.ui.xmlfragment({
							fragmentName: "ui.pmc.pricing.view.Pricing_SubView_Medallion",
							controller: this
						});
					this._medallionFragment.open();
						// this.getView().addContent(this._medallionFragment);

						// this._medallionFragment.then(function(fragment) {
						// 	this.byId("idMedallion").addContent(fragment);
						// }.bind(this));
					}
					break;

					// case "medallion":
					// 	// this.loadMedallionFragment().then(function(oFragment) {
					// 	// 	// Once the fragment is loaded, you can display it or perform any other operations
					// 	// 	oRouter.getTargets().display("Medallion");
					// 	// 	sap.m.MessageToast.show("Hiii");
					// 	// 	// oEventBus.publish("attributeGroupChannel", "navBack", {});
					// 	// });
					// 	// sap.ui.xmlfragment({
					// 	// 	name: "ui.pmc.pricing.view.Pricing_SubView_Medallion",
					// 	// 	id: this.getView().getId(),
					// 	// 	controller: this
					// 	// }).
					// 	if (!this.byId("medallionFragment")) {
					// 		this._medallionFragment = sap.ui.xmlfragment("ui.pmc.pricing.view.Pricing_SubView_Medallion", this);

					// 		this._medallionFragment.then(function(fragment) {
					// 			this.byId("idMedallion").addContent(fragment);
					// 		}.bind(this));
					// 	}
					// 	break;

				case "third":
					oRouter.getTargets().display("TestView");
					// oEventBus.publish("attributeGroupChannel", "navBack", {});
					break;
			}

		},
		// loadMedallionFragment: function() {
		// 	return new Promise(function(resolve, reject) {
		// 		sap.ui.require(["ui.pmc.pricing.view.Medallion.fragment"], function(MedallionFragment) {
		// 			resolve(MedallionFragment);
		// 		}, function(error) {
		// 			reject(error);
		// 		});
		// 	});
		// },
		/*BOC SANDESHMALI 5/24/23-HPE-PRICICNG-RATECARD-Lazy loading of views*/

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
		},

		/*BOC SANDESHMALI 5/12/23-HPE-PRICICNG-RATECARD- Opens fragment to add new data */
		onPressAddNewData: function() {
			this.getView().getModel("AddEditData").setData({});
			if (!this._oEditDataFragment) {
				this._oEditDataFragment = sap.ui.xmlfragment("ui.pmc.pricing.fragments.EditSelected", this);
				this.getView().addDependent(this._oEditDataFragment);
				// this._oEditDataFragment.setModel(oModel, "EditData");
			}
			this._oEditDataFragment.open();
		},
		/*EOC SANDESHMALI 5/12/23-HPE-PRICICNG-RATECARD- Opens fragment to add new data */

		/*BOC SANDESHMALI 5/15/23-HPE-PRICICNG-RATECARD- Opens fragment to edit the selected data*/
		onPressEdit: function() {
			try {
				var oSelectedData = this.byId("idTableDetailRC").getSelectedItem().getBindingContext("purchaseitems").getObject();

				if (oSelectedData) {
					var oModel = this.getView().getModel("AddEditData");
					oModel.setData(oSelectedData);

					// this.getView().byId("idEmpDet").setModel(oModel, "FormData");
					if (!this._oEditDataFragment) {
						this._oEditDataFragment = sap.ui.xmlfragment("ui.pmc.pricing.fragments.EditSelected", this);
						this.getView().addDependent(this._oEditDataFragment);
						this._oEditDataFragment.setModel(oModel, "EditData");
					} else {
						this._oEditDataFragment.setModel(oModel, "EditData");
					}

					// Clear any existing data in the fragment's input fields
					// You can retrieve the input fields from the fragment using their IDs and set their values as needed

					// Open the fragment in a dialog
					this._oEditDataFragment.open();
				}

			} catch (err) {
				sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ymse.SelRec"));
			}

		},

		/*BOC SANDESHMALI 5/15/23-HPE-PRICICNG-RATECARD- Closes the Fragment*/
		onCancelEdit: function() {
			if (this._oEditDataFragment) {
				this._oEditDataFragment.close();
			}
		},
		/*EOC SANDESHMALI 5/15/23-HPE-PRICICNG-RATECARD- Closes the Fragment*/

		/*BOC SANDESHMALI 5/18/23-HPE-PRICICNG-RATECARD- Mass Upload handler*/
		handleUploadPress: function() {
			var oFileUploader = this.getView().byId("idFileUploader");
			this.getView().setBusy(true);
			if (oFileUploader.oFileUpload.files.length === 0) {
				var sMsg = this.i18n.getProperty("ymsg.MassUpload.MissingFile");
				sap.m.MessageBox.error(sMsg);
				this.getView().setBusy(false);
				return;
			}
			//uploaded file type
			var fileType = oFileUploader.oFileUpload.files[0].type;

			//if file type is .xlsx
			if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
				oFileUploader.destroyHeaderParameters();
				oFileUploader.setSendXHR(true);

				//setting content type header parameter
				var headerParma = new sap.ui.unified.FileUploaderParameter();
				headerParma.setName("Content-Type");
				headerParma.setValue(fileType);

				//uploading file
				oFileUploader.upload();
			}

			//if file type is not excel
			else {
				sMsg = this.i18n.getProperty("ymsg.MassUpload.SelectExcel");
				sap.m.MessageBox.error(sMsg);
			}
			this.getView().setBusy(false);

		},
		/*BOC SANDESHMALI 5/18/23-HPE-PRICICNG-RATECARD- Mass Upload handler*/

		/*EOC SANDESHMALI 5/18/23-HPE-PRICICNG-RATECARD- After Mass Upload done*/
		onhandleUploadComplete: function(oEvent) {
			var status = oEvent.getParameters().status;
			var oFileUploader = this.getView().byId("idFileUploader");
			if (status === 201 || status === 200) {
				var sText = oEvent.getParameter("headers")["sap-message"],
					parser = new DOMParser(),
					xmlDoc = parser.parseFromString(sText, "text/xml"),
					sMsg = xmlDoc.getElementsByTagName("message")[0].childNodes[0].nodeValue;
				sap.m.Messagebox(sMsg);
			} else {
				this.getView().setBusy(false);
				var sMsgEr = "File Upload failed!";
				sap.m.Messagebox(sMsgEr);
			}
			oFileUploader.clear();
		},
		/*EOC SANDESHMALI 5/18/23-HPE-PRICICNG-RATECARD- After Mass Upload done*/

		/*BOC SANDESHMALI 5/18/23-HPE-PRICICNG-RATECARD- Column Structure for excel template*/
		createColumnConfigTemplate: function() {
			return [{
				label: "Invoicing_Model",
				property: "Invoicing_Model"
			}, {
				label: "Country",
				property: "Country"
			}, {
				label: "Currency",
				property: "Currency"
			}, {
				label: "Unit_of_Measure",
				property: "Unit_of_Measure"
			}, {
				label: "Range_High",
				property: "Range_High"
			}, {
				label: "Rate_Per_Unit",
				property: "Rate_Per_Unit"
			}];
		},
		/*EOC SANDESHMALI 5/18/23-HPE-PRICICNG-RATECARD- Column Structure for excel template*/

		/*BOC SANDESHMALI 5/18/23-HPE-PRICICNG-RATECARD- Download template*/
		onDownloadTemplate: function() {
			var data = [];
			var obj = {};
			obj.Invoicing_Model = "eyte";
			obj.Country = "";
			obj.Currency = "";
			obj.Unit_of_Measure = "";
			obj.Range_High = "";
			obj.Rate_Per_Unit = "";
			data.push(obj);
			data.push(obj);

			var config = this.createColumnConfigTemplate();

			var oSettings = {
				workbook: {
					columns: config,
					context: {
						application: "Microsoft Excel",
						sheetName: "RATE_CARD"

					}
				},
				dataSource: data
			};

			new sap.ui.export.Spreadsheet(oSettings, "RATE_CARD.xlsx")
				.build()
				.then(function() {
					sap.m.MessageToast.show("Spreadsheet export has finished");
				});

		},
		/*EOC SANDESHMALI 5/18/23-HPE-PRICICNG-RATECARD- Download template*/

		/* Medallion Controller Logic--------------------------------------------------------------------*/

		/*BOC KomalDumbre 5/22/23-HPE-PRICICNG-MEDALLION- Routes to new medallion view page */
		onNew: function() {
			this.getView().getModel("medData").setData({});
			this.getView().byId("idMainForm").setVisible(false);
			this.getView().byId("idMedallionTable").setVisible(false);
			this.getView().byId("idNewMedallionForm").setVisible(true);
		},
		/*EOC KomalDumbre 5/22/23-HPE-PRICICNG-MEDALLION- Routes to new medallion view page */

		/*BOC KomalDumbre 5/22/23-HPE-PRICICNG-MEDALLION- Routes back to medallion initial view page */
		onBack: function() {
			this.getView().byId("idMainForm").setVisible(true);
			this.getView().byId("idMedallionTable").setVisible(true);
			this.getView().byId("idNewMedallionForm").setVisible(false);
		},
		onCancel: function() {
			this.onBack();
		},
		/*EOC KomalDumbre 5/22/23-HPE-PRICICNG-MEDALLION- Routes back to medallion initial view page */

		/*BOC KomalDumbre 5/17/23-HPE-PRICICNG-MEDALLION- Post call to add a new entry */
		onSave: function() {
			//Retrieving form data
			var medDetails = {
				Category: this.getView().byId("idNewCategory").getValue(),
				Region: this.getView().byId("idNewRegion").getValue(),
				Country: this.getView().byId("idNewCountry").getValue(),
				Subregion: this.getView().byId("idNewSubregion").getValue(),
				BusinessUnit: this.getView().byId("idNewBusinessUnit").getValue(),
				Division: this.getView().byId("idNewDivision").getValue(),
				ModelPin: this.getView().byId("idNewModelPin").getValue(),
				Brt: this.getView().byId("idNewBrt").getValue(),
				Discount: this.getView().byId("idNewDiscount").getValue(),
				Variance: this.getView().byId("idNewVariance").getValue(),
				ValidFrom: this.getView().byId("idNewValidFrom").getValue(),
				ValidTo: this.getView().byId("idNewValidTo").getValue()
			};
			var oModel = this.getOwnerComponent().getModel(); // OData model
			oModel.create("", medDetails, { // Post Call
				success: function() {
					MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText(""));

				}.bind(this),
				error: function() {
					MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText(""));
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		/*EOC KomalDumbre 5/17/23-HPE-PRICICNG-MEDALLION- Post call to add a new entry */

		/*BOC KomalDumbre 5/22/23-HPE-PRICICNG-MEDALLION- Get call to edit entry */
		onUpdate: function() {
			try {
				var oSelectedData = this.byId("idMedallionTable").getSelectedItem().getBindingContext("tableItems").getObject(); //Get selected data from table
				if (oSelectedData) {
					var oModel = this.getView().getModel("medData"); //Global json
					oModel.setData(oSelectedData);
					// this.getView().byId("idNewMedallionForm").getModel("FormModel").setData(oSelectedData); //Set data to form
					this.getView().byId("idNewMedallionForm").setModel(oModel, "FormModel"); //Set data in FormModel
					//Navigating UI
					this.getView().byId("idMainForm").setVisible(false);
					this.getView().byId("idMedallionTable").setVisible(false);
					this.getView().byId("idNewMedallionForm").setVisible(true);
				}

			} catch (err) {
				// MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ymse.SelRec"));
				MessageToast.show("No Data Selected!");
			}

		},
		/*EOC KomalDumbre 5/22/23-HPE-PRICICNG-MEDALLION- Get call to edit entry */

		/*BOC KomalDumbre 5/17/23-HPE-PRICICNG-MEDALLION- Update call to edit an entry */
		onUpdateSave: function(evt) {
				//OData
				var oDataModel = this.getOwnerComponent().getModel(), //OData Model
					oSelectedData = evt.getSource().getBindingContext("medData").getObject(), //Get data from table
					sPath = "/EntitySet('" + oSelectedData.uniquekey + "')"; //Pass entity set & unique selected key
				oDataModel.update(sPath, oSelectedData, {
					success: function(data) {
						MessageToast.show("Details Updated!");
					}.bind(this),
					error: function(error) {
						MessageToast.show("No Data Selected!");
					}.bind(this)
				});
			}
			/*EOC KomalDumbre 5/17/23-HPE-PRICICNG-MEDALLION- Update call to edit an entry */

	});
});