sap.ui.define([
	"ui/pmc/pricing/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/ui/export/Spreadsheet"

], function(Controller, BaseController, Filter, FilterOperator, MessageToast, Spreadsheet) {
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
			var currentDate = new Date();
			var currentYear = currentDate.getFullYear(); // Get the current year
			var currentMonth = currentDate.getMonth() + 1; // Get the current month (0-11, so we add 1)
			var currentDay = currentDate.getDate(); // Get the current day of the month
			// Construct the date string in the desired format (e.g., "YYYY-MM-DD")
			var dateString = currentYear + '-' + currentMonth + '-' + currentDay;
			this.getView().byId("idNewValidFrom").setValue(dateString);
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

		/*BOC KomalDumbre 5/25/23-HPE-PRICICNG-MEDALLION- Making Selected Row editable and adjusting UI for update */
		onUpdate: function(evt) {
			try {
				var oSelectedData = this.byId("idMedallionTable").getSelectedItem().getBindingContext("tableItems").getObject(); //Get selected data from table
				if (oSelectedData) {
					// Making Selected Row Editable
					evt.getSource().getParent().getParent().getSelectedItem().getCells()[0].setEditable(true);
					evt.getSource().getParent().getParent().getSelectedItem().getCells()[1].setEditable(true);
					evt.getSource().getParent().getParent().getSelectedItem().getCells()[2].setEditable(true);
					evt.getSource().getParent().getParent().getSelectedItem().getCells()[3].setEditable(true);
					// Disabling Form Editing
					this.getView().byId("idRegion").setEditable(false);
					this.getView().byId("idCountry").setEditable(false);
					this.getView().byId("idBrt").setEditable(false);
					this.getView().byId("idDivision").setEditable(false);
					// Removing Clone, Update, New and Go Buttons from toolbar
					this.getView().byId("idCloneBtn").setVisible(false);
					this.getView().byId("idUpdateBtn").setVisible(false);
					this.getView().byId("idNewBtn").setVisible(false);
					this.getView().byId("idGoBtn").setVisible(false);
					// Adding Update Save and Cancel Buttons to toolbar
					this.getView().byId("idUpdateSaveBtn").setVisible(true);
					this.getView().byId("idUpdateCancelBtn").setVisible(true);
				}
			} catch (err) {
				// MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ymse.SelRec"));
				MessageToast.show("No Data Selected!");
			}
		},
		/*EOC KomalDumbre 5/25/23-HPE-PRICICNG-MEDALLION- Making Selected Row editable and adjusting UI for update*/

		onUpdateSave: function(evt) {

			var oModel = this.getOwnerComponent().getModel(); // OData Model
			// var oSelectedData = evt.getSource().getParent().getParent().getSelectedItem().getBindingContext("tableItems").getObject(); //Selected data from table
			var oSelectedData = oSelectedData = this.byId("idMedallionTable").getSelectedItem().getBindingContext("tableItems").getObject(); //Selected data from table
			var uniquekey = oSelectedData.uniquekey.trim();
			var sPath = "/(Empid='" + uniquekey + "')"; // Unique Key
			sPath = "/EntitySet('" + oSelectedData.uniquekey + "')"; //Pass entity set & unique key of selected data
			oModel.update(sPath, oSelectedData, {
				success: function() {
					MessageToast.show("Details Updated!");
				}.bind(this),
				error: function() {
					MessageToast.show("Failed to Update!");
				}.bind(this)
			});

		},

		/*BOC KomalDumbre 5/25/23-HPE-PRICICNG-MEDALLION- Cancel Update Button */
		onUpdateCancel: function(evt) {
			// Making rows back to non-editable
			evt.getSource().getParent().getParent().getSelectedItem().getCells()[0].setEditable(false);
			evt.getSource().getParent().getParent().getSelectedItem().getCells()[1].setEditable(false);
			evt.getSource().getParent().getParent().getSelectedItem().getCells()[2].setEditable(false);
			evt.getSource().getParent().getParent().getSelectedItem().getCells()[3].setEditable(false);
			// Enabling Form Editing
			this.getView().byId("idRegion").setEditable(true);
			this.getView().byId("idCountry").setEditable(true);
			this.getView().byId("idBrt").setEditable(true);
			this.getView().byId("idDivision").setEditable(true);
			// Adding Clone, Update, New and Go Buttons to toolbar
			this.getView().byId("idCloneBtn").setVisible(true);
			this.getView().byId("idUpdateBtn").setVisible(true);
			this.getView().byId("idNewBtn").setVisible(true);
			this.getView().byId("idGoBtn").setVisible(true);
			// Removing Update Save and Cancel Buttons from toolbar
			this.getView().byId("idUpdateSaveBtn").setVisible(false);
			this.getView().byId("idUpdateCancelBtn").setVisible(false);
		},
		/*EOC KomalDumbre 5/25/23-HPE-PRICICNG-MEDALLION- Cancel Update Button */

		/*BOC KomalDumbre 5/25/23-HPE-PRICICNG-MEDALLION- Get call to clone an entry */
		onClone: function() {
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

			}
			/*EOC KomalDumbre 5/25/23-HPE-PRICICNG-MEDALLION- Get call to clone an entry */

	});
});