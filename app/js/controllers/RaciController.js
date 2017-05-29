var RACIObject=null;
var ALLRACIObject=null;
var phasesObject = null;
var phaseObject = null;
var usersObject= null;
var statusObject = null;
var transitionObject = null;
var userObject=null;
var deliverablesObject = null;
var deliverablesByPhaseObject = null;
var deliverableObject = null;
var projectId = null;
var userMode = "view";
var selecedDeliverableId=0;
var selecedPhaseId=0;
var selectedNewdeliverable=null;
var modeObservable;
var startStatus="unknown";
var translations = null;
var deliverableViewModel = null;
var setDeliverableViewModel;

function createComponents() {
  try {
    modeObservable = kendo.observable({
      editMode : false
    });

	var projectInformation = getProjectInformationBase64();

    var canEditProject = false;
    if(projectInformation != null) {
      if ('id' in projectInformation) {
        projectId = projectInformation.id;
      }
      if ('canEditProject' in projectInformation) {
        canEditProject = projectInformation.canEditProject;
      }
    }
    modeObservable = kendo.observable({
      editMode : false,
      edit : canEditProject
    });

    if (deliverablesByPhaseObject == null) {
      deliverablesByPhaseObject = new DeliverablesDataModel();
    }
    setDeliverableViewModel(translations);

		deliverableViewModel.set('deliverable', {
		status: {},
		type: {},
		theme: {},
		securityClassification: {}
		});

	/*	$("#dropdownListStatus").data('kendoDropDownList').value(null);*/

		kendo.bind(".content", deliverableViewModel);

    pullDataSources();
    createExtraComponents();
    createPreviewGrid();
    createPhasesToolbar();

  createExtraComponents();
    if (deliverablesByPhaseObject == null) {
      deliverablesByPhaseObject = new DeliverablesDataModel();
    }
    phasesObject = new PhasesDataModel(projectId);
    phasesObject.Read().done(function() {
      createPhasesListView();
    }).always(function(){
      kendo.ui.progress($("#list-phases"), false);
      $("#list-phases").css("min-height","inherit");
    });

    deliverablesObject = new DeliverablesDataModel();
    deliverablesObject.SetProjectId(projectId);
    deliverablesObject.Read().done(function() {
      createDeliverablesListView();
    }).always(function(){
      kendo.ui.progress($("#list-deliverables"), false);
      $("#list-phases").css("min-height","inherit");
    });

  } catch(e) {
    console.log(e);
  }
}
setDeliverableViewModel = function setDeliverableViewModel() {
  deliverableViewModel = kendo.observable({

  });

}

function pullDataSources() {

  var themes = new DeliverableThemesDataModel();
  var types = new DeliverableTypesModel();
  var securityClassifications = new SecurityClassificationsDataModel();

  var statuses = new kendo.data.DataSource({
    transport: {
      read: {
        url: WS_BASE_URL + "status",
        beforeSend: function (req) {
          var auth = getCurrentAuthentificationBase64();
          if (auth != null) {
            req.setRequestHeader('Authorization', "Basic " + auth);
          }
        }
      }
    },
    schema: {
      data: "_embedded.status",
      model: {
        id: "id",
        fields: {
          id: { from: "id", type: "number", editable: false },
          // other fields
        }
      }
    }
  })

  deliverableViewModel.set('themesSource', themes.GetDataSource());
  deliverableViewModel.set('typesSource', types.GetDataSource());
  deliverableViewModel.set('securityClassificationsSource', securityClassifications.GetDataSource());
  deliverableViewModel.set('statuseSource', statuses);

}

function editDeliverableFromPhase(e) {
  selecedDeliverableId=e;
  RACIObject=new RACIDataModel(projectId,selecedPhaseId,e);
   RACIObject.Read().done(function(){
    $("#inputR").data("kendoMultiSelect").value(RACIObject.GetRDataSource().data().toJSON());
    $("#inputA").data("kendoMultiSelect").value(RACIObject.GetADataSource().data().toJSON());
    $("#inputC").data("kendoMultiSelect").value(RACIObject.GetCDataSource().data().toJSON());
    $("#inputI").data("kendoMultiSelect").value(RACIObject.GetIDataSource().data().toJSON());
  });
  $(".MsgValidate").hide();
  $("#dialogRACI").show();
  // $('#dialogRACI').data("kendoWindow").center().open();

}
function addNewDeliverable(){
  $('#AddDeliverable').data("kendoWindow").center().open();
}
function deleteDeliverableFromPhase(e){
  deliverableObject =new DeliverableDataModel(e);
  deliverableObject.SetId(e);
  deliverablesByPhaseObject.DeleteDeliverable(deliverableObject, Mode.LOCAL);
  $("#list-deliverablesByphase").data("kendoListView").dataSource.data(deliverablesByPhaseObject.GetDataSource().data());
}

function saveDelivrablePhase(){
  deliverablesByPhaseObject.Create().done(function() {
    $("#notification").data("kendoNotification").show({
      message: "Savaed"
    }, "success");
  });
  }

function saveDelivrableRACI(){

  RACIObject=new RACIDataModel(projectId,selecedPhaseId,selectedNewdeliverable);

 if(($("#inputR").data("kendoMultiSelect").dataItems().length>0)&&($("#inputA").data("kendoMultiSelect").dataItems().length<2)) {
   var dataItems = $("#inputR").data("kendoMultiSelect").dataItems();
   for (var i = 0; i < dataItems.length; i++) {
     userObject = new UserDataModel(dataItems[i].id, dataItems[i].name, dataItems[i].firstName, dataItems[i].type, dataItems[i].positionID, dataItems[i].position, dataItems[i].color, dataItems[i].avatar);
     RACIObject.AddUserToR(userObject, Mode.LOCAL);
   }

   dataItems = $("#inputA").data("kendoMultiSelect").dataItems();
   for (var i = 0; i < dataItems.length; i++) {
     userObject = new UserDataModel(dataItems[i].id, dataItems[i].name, dataItems[i].firstName, dataItems[i].type, dataItems[i].positionID, dataItems[i].position, dataItems[i].color, dataItems[i].avatar);
     RACIObject.AddUserToA(userObject, Mode.LOCAL);
   }
   dataItems = $("#inputC").data("kendoMultiSelect").dataItems();
   for (var i = 0; i < dataItems.length; i++) {
     userObject = new UserDataModel(dataItems[i].id, dataItems[i].name, dataItems[i].firstName, dataItems[i].type, dataItems[i].positionID, dataItems[i].position, dataItems[i].color, dataItems[i].avatar);
     RACIObject.AddUserToC(userObject, Mode.LOCAL);
   }
   dataItems = $("#inputI").data("kendoMultiSelect").dataItems();
   for (var i = 0; i < dataItems.length; i++) {
     userObject = new UserDataModel(dataItems[i].id, dataItems[i].name, dataItems[i].firstName, dataItems[i].type, dataItems[i].positionID, dataItems[i].position, dataItems[i].color, dataItems[i].avatar);
     RACIObject.AddUserToI(userObject, Mode.LOCAL);
   }

   RACIObject.Create().done(function () {
     $("#notification").data("kendoNotification").show({
       message: "Savaed"
     }, "success");
   });
   return true;
 }
  else {
	 $(".MsgValidate").show();
	return false;
 }
}

function AddDeliverable(e) {
  var deliverable = deliverableViewModel.get('deliverable');
  var newDeliverable = new Object();

  newDeliverable.deliverabletheme = WS_BASE_URL + "deliverabletheme/" + deliverable.theme.id;
  newDeliverable.deliverableType = WS_BASE_URL + "deliverabletype/" + deliverable.type.id;
  newDeliverable.securityClassification = WS_BASE_URL + "securityclassification/" + deliverable.securityClassification.id;

  newDeliverable.name = deliverable.title;
  newDeliverable.issueDate = deliverable.issueDate;
  newDeliverable.currentVersion = "1.0.0.0";
  newDeliverable.project = WS_BASE_URL + "project/" + getProjectInformationBase64().id;
  var currentUserInformation = getUserInformationBase64();

  if (currentUserInformation != null) {
    var organizationId = null;
    if ('organizationId' in currentUserInformation) {
      newDeliverable.organisation = WS_BASE_URL + "organisation/" + currentUserInformation.organizationId;
    } else {
      newDeliverable.organisation = WS_BASE_URL + "organisation/1";
    }
  }

  deliverableObject = new DeliverableDataModel();
    deliverableObject.Create(JSON.stringify(newDeliverable)).done(function (newItem) {
      deliverablesObject = new DeliverablesDataModel();
      deliverablesObject.SetProjectId(projectId);
      deliverablesObject.Read().done(function() {
        $("#list-deliverables").data("kendoListView").dataSource.data(deliverablesObject.GetDataSource().data());

      }).always(function(){
        kendo.ui.progress($("#list-deliverables"), false);
        $("#list-phases").css("min-height","inherit");
      });

    });
}

function createPreviewGrid() {
  ALLRACIObject=new RACIDataModel(projectId);
  if(ALLRACIObject!=null){
  ALLRACIObject.Read().done(function(){
    var columns = ALLRACIObject.GetColumnsPreviewDataSource().data();
    var columns_length = columns.length;
    for (var i = 0; i < columns_length; i ++) {
      columns[i].width = 280;
    }
    if((columns[0]!=null)&&(columns[1]!=null) ){
      columns[0].locked = true;
      columns[0].lockable = false;
      columns[1].locked = true;
    }
    if ($("grid").data("kendoGrid")) {
      $("#grid").data("kendoGrid").destroy();
    }

    $("#grid").kendoGrid({
      sortable: true,
      reorderable: true,
      filterable: true,
      columnMenu: true,
      dataSource: {
        data: ALLRACIObject.GetPreviewDataSource()['_data'],
        group: { field: "Phase" } // set grouping for the dataSource
      },
      columns: columns
    });
  }).always(function(){
    // kendo.ui.progress($("#dialogRACI"), false);
    // $("#dialogRACI").css("min-height","inherit");
  });
    }
}
function createDeliverablesListView() {

  $("#list-deliverables").kendoListView({
    dataSource: deliverablesObject.GetDataSource(),
    template: kendo.template($("#templateDeliverableItem").html()),
    
  });

  $("#list-deliverables").kendoSortable({
    connectWith: "#list-deliverablesByphase",
    cursor: "move",
    placeholder: function(element) {
      return element.clone().css("opacity", 0.1);
    },
    hint: function(element) {
      return element.clone().removeClass("k-state-selected");
    }
  });

  $("#list-deliverablesByphase").kendoListView({
    dataSource: deliverablesByPhaseObject.GetDataSource(),
    selectable:true,
    template: kendo.template($("#templateDeliverableItemPhase").html())
  });


  $("#list-deliverablesByphase").kendoSortable({
    cursor: "move",
    placeholder: function(element) {
      return element.clone().css("opacity", 0.1);
    },
    hint: function(element) {
      return element.clone().removeClass("k-state-selected");
    },
    end: function(e) {
      if(e.action=="receive") {

       var dataItem=deliverablesObject.GetDataSource().getByUid(e.item.context.attributes["data-uid"].value);
       selectedNewdeliverable=dataItem.id;
       deliverableObject =new DeliverableDataModel(dataItem.id);
       deliverableObject.SetId(dataItem.id);
       deliverableObject.SetTitle(dataItem.title);
       deliverableObject.SetIssueDate(dataItem.issueDate) ;
       deliverableObject.SetStatus(startStatus) ;
       deliverableObject.SetTheme(dataItem.theme) ;
       deliverableObject.SetType(dataItem.type) ;
       var addReslt=deliverablesByPhaseObject.AddDeliverable(deliverableObject, Mode.LOCAL);
        if(addReslt==true){
          $('#inputR').data("kendoMultiSelect").value("");
          $('#inputA').data("kendoMultiSelect").value("");
          $('#inputC').data("kendoMultiSelect").value("");
          $('#inputI').data("kendoMultiSelect").value("");
          $("#list-deliverablesByphase").data("kendoListView").dataSource.data(deliverablesByPhaseObject.GetDataSource().data());

          // $('#dialogRACI').data("kendoWindow").center().open();
        }else{
          $("#list-deliverablesByphase").data("kendoListView").refresh();
          $("#notification").data("kendoNotification").show({
            title: "Avertissement",
            message: "This document exist in this Phase."
          }, "error");
        }
          $("#list-deliverables").data("kendoListView").refresh();

      }
    }

  });
}


function createPhasesListView() {
  try {

    if ($("#list-phases").data("kendoListView")) {
      $("#list-phases").data("kendoListView").destroy();
    }

    $("#list-phases").kendoListView({
      dataSource: phasesObject.GetDataSource(),
      template: kendo.template($("#templatePhaseItem").html()),
      selectable:true,
      change : function() {
        if (this.select().length > 0) {
          kendo.ui.progress($("#list-deliverablesByphase"), true);
          var dataItem = this.dataItem(this.select().first());
          selecedPhaseId=dataItem.id;
          startStatus=dataItem.startStatus.name;
          deliverablesByPhaseObject.SetProjectId(projectId);
          deliverablesByPhaseObject.SetPhaseId(selecedPhaseId);
          deliverablesByPhaseObject.Read().done(function() {

          }).always(function(){
            kendo.ui.progress($("#list-deliverablesByphase"), false);
		      	$("#list-deliverablesByphase").css("min-height","inherit");

          });
        }else {
       //   $("#list-deliverables") la rendre grisée
        }
      },

    });
    var listViewPhase=$("#list-phases").data("kendoListView");
    listViewPhase.select(listViewPhase.element.children().first());
  } catch(e) {
    console.log(e);
  }
}

function hideRACIEdit(){
  console.log(projectId);
  ALLRACIObject=new RACIDataModel(projectId);
  ALLRACIObject.Read().done(function(){
    var columns = ALLRACIObject.GetColumnsPreviewDataSource().data();
    var columns_length = columns.length;
    for (var i = 0; i < columns_length; i ++) {
      columns[i].width = 280;
    }
    columns[0].locked = true;
    columns[0].lockable = false;
    columns[1].locked = true;
    $("#grid").kendoGrid({
      sortable: true,
      reorderable: true,
      resizable: true,
      filterable: true,
      columnMenu: true,
      dataSource: {
        data: ALLRACIObject.GetPreviewDataSource()['_data'],
        group: { field: "Phase" } // set grouping for the dataSource
      },
      
      columns: columns
    });
  }).always(function(){
    // kendo.ui.progress($("#dialogRACI"), false);
    // $("#dialogRACI").css("min-height","inherit");

  });

  $("#raciEdit").hide();
  $("#raciPreview").show();
  createPreviewGrid();
  modeObservable.set("editMode", false);
}

function createPhasesToolbar() {

  try {

    $("#toolbar-phase").kendoToolBar({
      items: [
        { type: "button", id: "editPhaseBtn", icon:"edit", togglable: true},
        { type: "button", id: "importPhaseBtn", icon:"pdf", enable:false },
        { type: "button", id: "exportPhaseBtn", icon:"excel" , enable:false},
        { type: "button", id: "savePhaseBtn", icon:"save", hidden:true },
        { type: "button", id: "cancelPhaseBtn", icon:"close", hidden:true },
        { type: "button", id: "previewPhaseBtn", icon:"preview", hidden:true}
      ],
      toggle:function(e){
        if (e.checked){
          $("#raciPreview").hide();
          $("#raciEdit").removeClass("hidden");
          $("#raciEdit").show();

          if (deliverablesByPhaseObject == null) {
            deliverablesByPhaseObject = new DeliverablesDataModel();
          }
          phasesObject = new PhasesDataModel(projectId);
          phasesObject.Read().done(function() {
            createPhasesListView();
          }).always(function(){
            kendo.ui.progress($("#list-phases"), false);
            $("#list-phases").css("min-height","inherit");
          });
          deliverablesObject = new DeliverablesDataModel();
          deliverablesObject.SetProjectId(projectId);
          deliverablesObject.Read().done(function() {
            createDeliverablesListView();
          }).always(function(){
            kendo.ui.progress($("#list-deliverables"), false);
            $("#list-phases").css("min-height","inherit");
          });
          e.sender.show($("#savePhaseBtn"));
          e.sender.show($("#cancelPhaseBtn"));
          e.sender.show($("#previewPhaseBtn"));

        } else {
          hideRACIEdit();
          e.sender.hide($("#savePhaseBtn"));
          e.sender.hide($("#cancelPhaseBtn"));
          e.sender.hide($("#previewPhaseBtn"));
        }
        modeObservable.set("editMode", e.checked);

        // call edit mode service
      },
      click: function(e) {
        if (e.id == "cancelPhaseBtn") {
          hideRACIEdit();
          e.sender.hide($("#savePhaseBtn"));
          e.sender.hide($("#cancelPhaseBtn"));
          e.sender.hide($("#previewPhaseBtn"));
        } else if (e.id == "savePhaseBtn") {
          // save all: raci and add to phase courante
          saveDelivrablePhase();
          saveDelivrableRACI();
		    	modeObservable.set("editMode", false);

        }else if (e.id == "previewPhaseBtn") {
          hideRACIEdit();
          e.sender.hide($("#savePhaseBtn"));
          e.sender.hide($("#cancelPhaseBtn"));
          e.sender.hide($("#previewPhaseBtn"));
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
}
function createExtraComponents(){

  // $('#dialogRACI').kendoWindow({
  //   width: "500px",
  //   title: "Edit RACI",
  //   visible: false,
  //   modal: true,
  //   draggable: false
  // });
    $('#AddDeliverable').kendoWindow({
    width: "500px",
    title: "Add Deliverable",
    visible: false,
    modal: true,
  });

  $("#primaryOKButton").kendoButton({
    click: function (e) {
      var canCloseDialog=saveDelivrableRACI();
	   if(canCloseDialog) {
  		 $('#dialogRACI').hide();
     }
    }
  });

  $("#primaryADDButton").kendoButton({
    click: function (e) {
		AddDeliverable();
		$('#AddDeliverable').data("kendoWindow").center().close();
    }
  });


  usersObject = new UsersDataModel();
  usersObject.SetProjectID(projectId);
  usersObject.Read().done(function() { });

if ($("#inputR").data("kendoMultiSelect") == null) {
	  $("#inputR").kendoMultiSelect({
		placeholder: "Ressource to Edit...",
		dataTextField: "firstname",
		dataValueField: "id",
		filter: "contains",
		dataSource: usersObject.GetUsersDataSource(),
		itemTemplate: "<div><span class='k-state-default'><img src='images/navbar/avatar/#:data.avatar#' class='imgavatar'></img>" +
		"#:data.name# #:data.firstname# </span></div>",
		tagTemplate: "<div><span class='k-state-default'><span src='images/navbar/avatar/#:data.avatar#' class='imgavatar_tag'>#:data.name#</span>" +
		"#:data.name# #:data.firstname# </span></div>",
	  });
 }
 if ($("#inputA").data("kendoMultiSelect") == null) {
	  $("#inputA").kendoMultiSelect({
		placeholder: "Choose a approuvator,only One",
		dataTextField: "firstname",
		dataValueField: "id",
		filter: "contains",
		dataSource: usersObject.GetUsersDataSource(),
		itemTemplate: "<div><span class='k-state-default'><img src='images/navbar/avatar/#:data.avatar#' class='imgavatar'></img>" +
		"#:data.name# #:data.firstname# </span></div>",
		tagTemplate: "<div><span class='k-state-default'><span src='images/navbar/avatar/#:data.avatar#' class='imgavatar_tag'>#:data.name#</span>" +
		"#:data.name# #:data.firstname# </span></div>",
		// maxSelectedItems: 1 // nombre max de A doit etre 1
	  });
  }
if ($("#inputC").data("kendoMultiSelect") == null) {
  $("#inputC").kendoMultiSelect({
    placeholder: "Ressource to Edit...",
    dataTextField: "firstname",
    dataValueField: "id",
    filter: "contains",
    dataSource: usersObject.GetUsersDataSource(),
    itemTemplate: "<div><span class='k-state-default'><img src='images/navbar/avatar/#:data.avatar#' class='imgavatar'></img>" +
    "#:data.name# #:data.firstname# </span></div>",
    tagTemplate: "<div><span class='k-state-default'><span src='images/navbar/avatar/#:data.avatar#' class='imgavatar_tag'>#:data.name#</span>" +
		"#:data.name# #:data.firstname# </span></div>",
  });
  }
 if ($("#inputI").data("kendoMultiSelect") == null) {
	  $("#inputI").kendoMultiSelect({
		placeholder: "Ressource to Edit...",
		dataTextField: "firstname",
		dataValueField: "id",
		filter: "contains",
		dataSource: usersObject.GetUsersDataSource(),
		itemTemplate: "<div><span class='k-state-default'><img src='images/navbar/avatar/#:data.avatar#' class='imgavatar'></img>" +
		"#:data.name# #:data.firstname# </span></div>",
		tagTemplate: "<div><span class='k-state-default'><span src='images/navbar/avatar/#:data.avatar#' class='imgavatar_tag'>#:data.name#</span>" +
		"#:data.name# #:data.firstname# </span></div>",
	  });
  }

//gestion des notifications
  var notification = $("#notification").kendoNotification({
    position: {
      pinned: true,
      top: 200,
      right: 150
    },
    autoHideAfter: 1500,
    stacking: "down",
    hideOnClick: true,
    button: true,
    templates: [{
      type: "warning",
      template: $("#warningTemplate").html()
    }, {
      type: "error",
      template: $("#errorTemplate").html()
    }, {
      type: "success",
      template: $("#successTemplate").html()
    }]
  }).data("kendoNotification");

}
