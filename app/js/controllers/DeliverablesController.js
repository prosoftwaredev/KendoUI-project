// var app = app || {};
// app.user = getUserInformationBase64();
// app.deliverable = {};

// // Objects

// var listOfDeliverables = null;
// var deliverableObject = new DeliverableDataModel();;
// var sectionsObject = null;
// var translations = null;

// var deliverableViewModel = null;

// // Functions

// var addNewDeliverable;
// var saveDeliverable;
// var getListOfDeliverables;
// var setDeliverableViewModel;



// addNewDeliverable = function addNewDeliverable() {

//   deliverableViewModel.set('deliverable', {
//     status: {},
//     type: {},
//     theme: {},
//     securityClassification: {}
//   });

//   $("#dropdownListStatus").data('kendoDropDownList').value(null);

//   clearSectionsList();

//   goToCreateMode();

// }


// saveDeliverable = function saveDeliverable(e) {
//   var deliverable = deliverableViewModel.get('deliverable');
//   var newDeliverable = new Object();

//   newDeliverable.deliverabletheme = WS_BASE_URL + "deliverabletheme/" + deliverable.theme.id;
//   newDeliverable.deliverableType = WS_BASE_URL + "deliverabletype/" + deliverable.type.id;
//   newDeliverable.securityClassification = WS_BASE_URL + "securityclassification/" + deliverable.securityClassification.id;


//   newDeliverable.name = deliverable.title;
//   newDeliverable.issueDate = deliverable.issueDate;
//   newDeliverable.currentVersion = "1.0.0.0";
//   newDeliverable.project = WS_BASE_URL + "project/" + getProjectInformationBase64().id;
//   var currentUserInformation = getUserInformationBase64();

//   if (currentUserInformation != null) {
//     var organizationId = null;
//     if ('organizationId' in currentUserInformation) {
//       newDeliverable.organisation = WS_BASE_URL + "organisation/" + currentUserInformation.organizationId;
//     } else {
//       newDeliverable.organisation = WS_BASE_URL + "organisation/1";
//     }
//   }

//   deliverableObject = new DeliverableDataModel();

//   if (deliverableViewModel.get("isEditMode")) {
//     deliverableObject.Update(JSON.stringify(newDeliverable)).done(function (newItem) {
//       //Refresh List View
//       // $("#list-deliverables").data("kendoListView").dataSource.fetch(function (data) { });
//       listOfDeliverables.Read().done(function () {
//         $("#list-deliverables").data('kendoListView').setDataSource(listOfDeliverables.GetDataSource());
//         selectNewDeliverable(newItem);
//         goToViewMode();
//       })
//     });
//   }
//   else {
//     deliverableObject.Create(JSON.stringify(newDeliverable)).done(function (newItem) {
//       //Refresh List View
//       // $("#list-deliverables").data("kendoListView").dataSource.fetch(function (data) { });
//       listOfDeliverables.Read().done(function () {
//         $("#list-deliverables").data('kendoListView').setDataSource(listOfDeliverables.GetDataSource());
//         selectNewDeliverable(newItem);
//         goToViewMode();
//       })
//     });
//   }

// }



// getListOfDeliverables = function getListOfDeliverables() {
//   listOfDeliverables = new DeliverablesDataModel(getProjectInformationBase64().id);
//   listOfDeliverables.Read().done(function () {
//     $("#list-deliverables").kendoListView({
//       dataSource: listOfDeliverables.GetDataSource(),
//       template: kendo.template($("#deliverable-item-template").html()),
//       selectable: true,
//       change: selectDeliverable,
//       dataBound: function (e) {
//         // Is this really working
//         $("#list-deliverables").kendoSortable({
//           handler: ".item"
//         });
//       }
//     });
//   }).always(function () {
//     kendo.ui.progress($("#list-deliverables"), false);
//     $("#list-deliverables").css("min-height", "inherit");
//   });
// }


// setDeliverableViewModel = function setDeliverableViewModel(translations) {
//   deliverableViewModel = kendo.observable({
//     listOfDeliverablesTitle: translations.titles.list,
//     deliverableDetailsTitle: translations.titles.help,
//     helpLine1: translations.helpLine1,
//     helpLine2: translations.helpLine2,
//     isHelpMode: true,
//     isEditMode: false,
//     isCreateMode: false,
//     isViewMode: false,

//     isAddCreateMode: function () {
//       return this.get('isEditMode') || this.get('isCreateMode');
//     },
//     isViewEditMode: function () {
//       return this.get('isEditMode') || this.get('isViewMode');
//     },
//     isViewDetailsMode: function () {
//       return this.get('isEditMode') || this.get('isCreateMode') || this.get('isViewMode');
//     },
//     cancelSave: function (e) {
//       if (this.get('isEditMode')) {
//         goToViewMode();
//       }
//       else {
//         goToHelpMode();
//       }
//     },
//     editDeliverable: function (e) {
//       goToEditMode();
//     },
//     hasAddDeliverablePermissons: getAddDeliverablePermissions(),
//     addNewDeliverable: addNewDeliverable,
//     saveDeliverable: saveDeliverable,
//     navigateToDetails: function () {
//       loadContentFromURI('deliverableDetails');
//     }
//   });

// }

// function createComponents() {

//   var language = getLanguage();

//   var languageFile = "../../translations/deliverable/" + language + ".json";

//   $.getJSON(languageFile, function (json) {

//     translations = json;
//     getListOfDeliverables()
//     setDeliverableViewModel(translations);
//     pullDataSources();

//     kendo.bind(".content", deliverableViewModel);
//   });


// }

// function getLanguage() {
//   return "en-US";
// }



// // Checks if the user has add new deliverable permissions and returns true or false
// function getAddDeliverablePermissions() {

//   var user = getUserInformationBase64();

//   if (user.role === 'PROGRAM_ROLE' || user.role === 'PROJECT_ROLE') {
//     app.user.hasDSSRole = true;
//     return true;
//   }
//   app.user.hasDSSRole = false;
//   return false;
// }

// function selectDeliverable(e) {

//   if (this.select().length > 0) {

//     var dataItem = this.dataItem(this.select().first());

//     deliverableObject.SetId(dataItem.id);

//     deliverableObject.Read().done(function (data) {

//       goToViewMode();

//       deliverableViewModel.set('deliverable', deliverableObject.GetDetailsAsObservable());

//       // This should be changed later it is now here only for testing purposes
//       //deliverableViewModel.set('deliverableIsEditable', true);
//        deliverableViewModel.set('deliverableIsEditable', function() {
//          return deliverableSetEditableOptions(deliverableObject) && 
//                 deliverableViewModel.get('isViewMode');
//        });


//       deliverableViewModel.set('issueDateFormatted', function () {
//         return kendo.toString(deliverableViewModel.get('deliverable.issueDate'), 'd');
//       });

//       createSectionsList(deliverableObject);

//       // Save the currently selected deliverable object for use in DeliverableViewController.js
//       app.deliverableObject = deliverableObject;

//     });
//   }
// }


// function selectNewDeliverable(newItem) {

//   var listView = $("#list-deliverables").data("kendoListView");

//   var children = listView.element.children();
//   var index = 0;
//   for (var x = 0; x < children.length; x++) {
//     if (listView.dataSource.data()[x].id == newItem.id) {
//       index = x;
//     };
//   };

//   listView.select(children[index]);
// }

// function pullDataSources() {

//   var themes = new DeliverableThemesDataModel();
//   var types = new DeliverableTypesModel();
//   var securityClassifications = new SecurityClassificationsDataModel();

//   var statuses = new kendo.data.DataSource({
//     transport: {
//       read: {
//         url: WS_BASE_URL + "status",
//         beforeSend: function (req) {
//           var auth = getCurrentAuthentificationBase64();
//           if (auth != null) {
//             req.setRequestHeader('Authorization', "Basic " + auth);
//           }
//         }
//       }
//     },
//     schema: {
//       data: "_embedded.status",
//       model: {
//         id: "id",
//         fields: {
//           id: { from: "id", type: "number", editable: false },
//           // other fields
//         }
//       }
//     }
//   })

//   deliverableViewModel.set('themesSource', themes.GetDataSource());
//   deliverableViewModel.set('typesSource', types.GetDataSource());
//   deliverableViewModel.set('securityClassificationsSource', securityClassifications.GetDataSource());
//   deliverableViewModel.set('statuseSource', statuses);

// }




// function deliverableSetEditableOptions(deliverableObject) {

//   var deliverableIsEditable = false;
//   app.user.hasRARole = false;

//   var deliverableStatus = deliverableObject.GetStatus();

//   if (deliverableStatus != null) {

//     if (deliverableStatus.editable) {

//       var currentUserInformation = getUserInformationBase64();
//       var userId = null;

//       if (currentUserInformation != null) {
//         if ('userId' in currentUserInformation) {
//           userId = currentUserInformation.userId;
//         }
//       }

//       var roles = deliverableObject.GetRaciRoles();

//       $.each(roles, function (index, role) {
//         if (role.raciRole.name === 'R' || role.raciRole.name === 'A') {
//           $.each(role.users, function (ind, user) {
//             if (user.id === userId) {
//               app.user.hasRARole = true;
//               deliverableIsEditable = true;
//             }
//           });
//         }
//       });
//     }
//   }

//   //return deliverableIsEditable;

//   // TODO: remove later only for tests
//   return true;

// }


// function createSectionsList(deliverableObject) {

//   clearSectionsList();

//   $.each(deliverableObject.GetSections(), function (key, section) {
//     var sectionTemplate = kendo.template($("#section-item-template").html());
//     $("#sections").append(sectionTemplate(section.section));
//   });

// }

// function clearSectionsList() {
//   $("#sections").html("");
// }

// function deliverablesClearSelection() {
//   var deliverableListView = $("#list-deliverables").data("kendoListView");
//   if (deliverableListView != null) {
//     deliverableListView.clearSelection();
//   }
// }

// function goToHelpMode() {
//   deliverablesClearSelection();
//   deliverableViewModel.set('deliverableDetailsTitle', translations.titles.help);

//   deliverableViewModel.set('isHelpMode', true);
//   deliverableViewModel.set('isEditMode', false);
//   deliverableViewModel.set('isCreateMode', false);
//   deliverableViewModel.set('isViewMode', false);

// }

// function goToCreateMode() {
//   deliverablesClearSelection();
//   deliverableViewModel.set('deliverableDetailsTitle', translations.titles.add);

//   deliverableViewModel.set('isCreateMode', true);
//   deliverableViewModel.set('isHelpMode', false);
//   deliverableViewModel.set('isViewMode', false);
//   deliverableViewModel.set('isEditMode', false);
// }

// function goToViewMode() {
//   deliverableViewModel.set('deliverableDetailsTitle', translations.titles.view);

//   deliverableViewModel.set('isViewMode', true);
//   deliverableViewModel.set('isHelpMode', false);
//   deliverableViewModel.set('isCreateMode', false);
//   deliverableViewModel.set('isEditMode', false);
// }

// function goToEditMode() {
//   deliverableViewModel.set('deliverableDetailsTitle', translations.titles.edit);

//   deliverableViewModel.set('isEditMode', true);
//   deliverableViewModel.set('isHelpMode', false);
//   deliverableViewModel.set('isCreateMode', false);
//   deliverableViewModel.set('isViewMode', false);
// }

