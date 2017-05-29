var workprocessesObject = null;
var workprocessObject = null;
var statusObject = null;
var transitionObject = null;
var modeObservable;
var newStatusId = -1;
var newTransitionId = -1;
var updateFlag = true;
var hasChanges = false;

$(document).ready(function () {
	initWorkprocesses();
});

function initWorkprocesses() {
	try {
		var canEditProject = false;
		var projectInformation = getProjectInformationBase64();
		if(projectInformation != null) {
			if ('canEditProject' in projectInformation) {
				canEditProject = projectInformation.canEditProject;
			}
		}
		modeObservable = kendo.observable({
			editMode : false,
			edit : canEditProject
		});
		kendo.bind($("#workprocess-help-box"), modeObservable);
		createWorkprocessToolbar(canEditProject);
		var currentUserInformation = getUserInformationBase64();
		if (currentUserInformation != null) {
			var organizationId = null;
			if ('organizationId' in currentUserInformation) {
				organizationId = currentUserInformation.organizationId;
			}
			workprocessesObject = new WorkProcessesDataModel(null, organizationId);
			workprocessesObject.Read().done(function() {
				createWorkprocessListView();
			}).always(function(){
				kendo.ui.progress($("list-workprocesses"), false);
				$("#list-workprocesses").css("min-height","inherit");
			}).fail(function(){
				showNotification("Error reading workprocesses list", "error");
			});
		}
		createWorkprocessEvent(canEditProject);
	} catch(e) {
		console.log(e);
	}
}

function createWpDiagram(addMode) {
	if ($("#workprocess").data("kendoDiagram")) {
		$("#workprocess").data("kendoDiagram").destroy();
	}
	$("#workprocessWizard").hide();
	$("#workprocess").removeClass("hidden");
	var toolbarEdit = {};
	var statusEdit = false;
	if (((modeObservable.get("editMode") == true) && (workprocessObject._used == false)) || addMode) {
		$("#workprocess").addClass("edit");
		toolbarEdit = [{
				type: "button",
				text: "Add status",
				id: "AddStatusBtn",
				icon:"add",
				click: function() {
					if(statusObject!=null) {
						delete statusObject;
						statusObject = null;
					}
					$("#workprocessSpace").removeClass("col-sm-12");
					$("#workprocessSpace").addClass("col-sm-7");
					$("#workprocessEdition").html($("#templateStatusAdd").html());
					createStatusWidgets();
					$("#workprocessEdition").removeClass("hidden");
					$("#ValidateStatusBtn").click(function(e){
						hasChanges = true;
						addStatusFromIHM();
					});
					$("#CancelStatusBtn").click(function(e){
						$("#workprocessSpace").removeClass("col-sm-7");
						$("#workprocessSpace").addClass("col-sm-12");
						$("#workprocessEdition").html("");
					});
				}
			  },
				{
				type: "button",
				text: "Add transition",
				id: "AddTransitionBtn",				
				icon:"connector",
				enable:(workprocessObject.GetStatusDataSource().data().toJSON().length>=2),
				click: function() {
					if(transitionObject!=null) {
						delete transitionObject;
						transitionObject = null;
					}
					$("#workprocessSpace").removeClass("col-sm-12");
					$("#workprocessSpace").addClass("col-sm-7");					
					$("#workprocessEdition").html($("#templateTransitionAdd").html());
					createTransitionWidgets();
					$("#workprocessEdition").removeClass("hidden");
					$("#ValidateTransitionBtn").click(function(e){
						hasChanges = true;
						addTransitionFromIHM();
					});
					$("#CancelTransitionBtn").click(function(e){
						$("#workprocessSpace").removeClass("col-sm-7");
						$("#workprocessSpace").addClass("col-sm-12");
						$("#workprocessEdition").html("");
					});
				}
			  }];
		statusEdit = {
			connect:false,
			drag:true,
			tools:[{
				type: "button",
				icon: "edit",
				click: function() {
					var selectedItem = $("#workprocess").data("kendoDiagram").select();
					if (selectedItem.length > 0) {
						$("#workprocessSpace").removeClass("col-sm-12");
						$("#workprocessSpace").addClass("col-sm-7");						
						if (selectedItem[0] instanceof kendo.dataviz.diagram.Connection) {
							if (transitionObject == null) {
								transitionObject = new TransitionDataModel();
							}
							transitionObject.fromJSON(selectedItem[0].dataItem);
							transitionObject.SetStatuses(workprocessObject.GetStatusDataSource().data().toJSON());
							kendo.unbind($("#workprocessEdition"));	
							$("#workprocessEdition").html($("#templateTransitionEdit").html());
							createTransitionWidgets();
							kendo.bind($("#workprocessEdition"), transitionObject.GetDetailsAsObservable());
							$("#ValidateTransitionBtn").click(function(e){
								addTransitionFromIHM();
							});
							$("#CancelTransitionBtn").click(function(e){
								$("#workprocessSpace").removeClass("col-sm-7");
								$("#workprocessSpace").addClass("col-sm-12");
								$("#workprocessEdition").html("");
							});
						} else {
							if (statusObject == null) {
								statusObject = new StatusDataModel();
							}
							statusObject.fromJSON(selectedItem[0].dataItem);
							kendo.unbind($("#workprocessEdition"));	
							$("#workprocessEdition").html($("#templateStatusEdit").html());
							createStatusWidgets();
							kendo.bind($("#workprocessEdition"), statusObject.GetDetailsAsObservable());	
							$("#ValidateStatusBtn").click(function(e){
								addStatusFromIHM();
							});
							$("#CancelStatusBtn").click(function(e){
								$("#workprocessSpace").removeClass("col-sm-7");
								$("#workprocessSpace").addClass("col-sm-12");
								$("#workprocessEdition").html("");
							});
						}
						$("#workprocessEdition").removeClass("hidden");
					}
				}
			}, {name:"delete"}]
		};
	}
	$("#workprocess").kendoDiagram({
		dataSource: workprocessObject.GetStatusDataSource(),
		connectionsDataSource: workprocessObject.GetTransitionsDataSource(),
		editable:{
		  tools:toolbarEdit,
		  resize:false
		},
		layout: {
		  type: "tree",
		  subtype: "down"
		}, 
		connectionDefaults:{
			editable:statusEdit,
			endCap: "ArrowEnd",
			type:"polyline",
			fill: "#e9e9e9"
		},
		shapeDefaults :{
			editable:statusEdit,
			visual:getVisual,
			content: {
				template: "#= dataItem.name #"
			}
		},
		zoomRate:0,
		remove : function(e){
			hasChanges = true;
		},
		dataBound : function(e) {
			if (($("#AddStatusBtn").length!=0) && ($("#AddStatusBtn").closest(".k-toolbar").data("kendoToolBar")!=null)) {
				if (this.dataSource.data().toJSON().length < 2 ) {
					$("#AddStatusBtn").closest(".k-toolbar").data("kendoToolBar").enable("#AddTransitionBtn", false);
				} else {
					$("#AddStatusBtn").closest(".k-toolbar").data("kendoToolBar").enable("#AddTransitionBtn");
				}
			}
			if (((modeObservable.get("editMode") == false) || (workprocessObject._used == true)) && (addMode==false)) {
				if (this.dataSource.data().toJSON().length > 0) {
					var that = this;
					setTimeout(function () {
						that.bringIntoView(that.shapes);
					}, 0);
				}
			}
		},
		select: function(e) {
			if (((modeObservable.get("editMode") == false) || (workprocessObject._used == true)) && (addMode==false) )
				onSelectDiagram(e);
		}
	});	
}

function createWorkprocessToolbar(canEditProject) {
	try {
		$("#toolbar-workprocess").kendoToolBar({
			items: [
				{ type: "button", id: "importWorkprocessBtn", text: "Import", icon:"download", enable:false },
				{ type: "button", id: "exportWorkprocessBtn", text: "Export", icon:"upload" , enable:false},
				{ type: "button", id: "editWorkprocessBtn", text: "Edit" , icon:"edit", togglable: true, hidden:!canEditProject},
				{ type: "button", id: "saveWorkprocessBtn", text: "Save", icon:"save", hidden:true },
				{ type: "button", id: "cancelWorkprocessBtn", text: "Cancel", icon:"close", hidden:true }			
			],
			toggle:function(e){ 
				if (e.checked){
					e.sender.show($("#saveWorkprocessBtn"));
					e.sender.show($("#cancelWorkprocessBtn"));
				} else {
					e.sender.hide($("#saveWorkprocessBtn"));
					e.sender.hide($("#cancelWorkprocessBtn"));
				}
				modeObservable.set("editMode", e.checked);				
				workprocessesObject.Read().done(function(){
					$("#workprocess-help-box").show();
					$("#workprocess-details-box").hide();
					if ($("#list-workprocesses").data("kendoListView")) {
						$("#list-workprocesses").data("kendoListView").clearSelection();					
					}
				}).fail(function(){
					showNotification("Error reading workprocesses list", "error");
				});
				// call edit mode service
			}, 
			click: function(e) {
				if (e.id == "cancelWorkprocessBtn") {
					modeObservable.set("editMode", false);
					e.sender.toggle("#editWorkprocessBtn", false);
					e.sender.hide("#saveWorkprocessBtn");
					e.sender.hide("#cancelWorkprocessBtn");
					$("#workprocess-help-box").show();
					$("#workprocess-details-box").hide();
					workprocessesObject.Read().fail(function(){
						showNotification("Error reading workprocesses list", "error");
					});
				} else if (e.id == "saveWorkprocessBtn") {
					if (hasChanges) {
						hasChanges = false;
						postWPFromIHM();
					}
					workprocessesObject.DeleteWPsFromServer();
				}

				if ($("#list-workprocesses").data("kendoListView")) {
					$("#list-workprocesses").data("kendoListView").clearSelection();
				}
				// call edit mode service
			}
		});
	} catch (e) {
		console.log(e);
	}
}

function createWorkprocessListView() {
	try {
		$("#list-workprocesses").kendoListView({
			dataSource: workprocessesObject.GetDataSource(),
			template: kendo.template($("#templateWorkprocessItem").html()),
			selectable:true,
			navigatable:true,
			change : function() {
				if (this.select().length > 0) {
					var dataItem = this.dataItem(this.select().first());
					if (workprocessObject == null) {
						workprocessObject = new WorkProcessDataModel()
					}
					workprocessObject.SetId(dataItem.id);
					workprocessObject._used = dataItem.used;
					workprocessObject.Read().done(function(){
						$("#workprocess-help-box").hide();
						kendo.unbind($("#workprocess-details-box"));
						if ($("#workprocess").data("kendoDiagram")) {
							$("#workprocess").data("kendoDiagram").destroy();
						}
						if ((modeObservable.get("editMode") == true) && (workprocessObject._used == false)) {
							$("#workprocess-details-box").html($("#templateWorkprocessEdit").html());
							$("input").change(function(){
								hasChanges = true;
							});
						}else {
							$("#workprocess-details-box").html($("#templateWorkprocessDetails").html());
						}
						var wpObservable = workprocessObject.GetDetailsAsObservable();
						wpObservable.set("used", wpObservable.get("used") && modeObservable.get("editMode"));
						kendo.bind($("#workprocess-details-box"), wpObservable);
						createWpDiagram(false);
						$("#workprocess-details-box").removeClass("hidden");
						$("#workprocess-details-box").show();
					}).fail(function(){
						showNotification("Error reading workprocess details", "error");
					});				
				}
			},
			dataBound:function(e) {
				if (workprocessObject) {
					this.select("#list-workprocesses #"+workprocessObject.GetId());
				}
				kendo.bind($("#list-workprocesses .item"), modeObservable);
			}
		});
	} catch(e) {
		console.log(e);
	}		
}

function createWorkprocessEvent(canEditProject) {
	kendo.bind($("#AddWorkprocessBtn"), modeObservable);
	$("#AddWorkprocessBtn").click(function(e){
		if (modeObservable.get("edit") == true) {
			hasChanges = true;
			$("#list-workprocesses").data("kendoListView").clearSelection();
			$("#workprocess-help-box").hide();
			$("#workprocess-details-box").html($("#templateWorkprocessAdd").html());
			$("input").change(function(){
				hasChanges = true;
			});
			if (workprocessObject != null) {
				delete workprocessObject;
			}
			workprocessObject = new WorkProcessDataModel(-1);
			createWpDiagram(true);
			$("#workprocess-details-box").removeClass("hidden");
			$("#workprocess-details-box").show();
			$("#toolbar-workprocess").data("kendoToolBar").toggle("#editWorkprocessBtn", true);
			$("#toolbar-workprocess").data("kendoToolBar").show("#saveWorkprocessBtn");
			$("#toolbar-workprocess").data("kendoToolBar").show("#cancelWorkprocessBtn");
		}
	});	
}

function onSelectDiagram(e) {
	try {
		$("#workprocessSpace").removeClass("col-sm-12");
		$("#workprocessSpace").addClass("col-sm-7");
		$("#workprocess").data("kendoDiagram").bringIntoView($("#workprocess").data("kendoDiagram").shapes);
		if(e.selected[0] instanceof kendo.dataviz.diagram.Shape) {
			if (statusObject == null) {
				statusObject = new StatusDataModel();
			}
			statusObject.fromJSON(e.selected[0].dataItem);
			kendo.unbind($("#workprocessEdition"));
			$("#workprocessEdition").html($("#templateStatusDetails").html());
			kendo.bind($("#workprocessEdition"), statusObject.GetDetailsAsObservable());
		} else if (e.selected[0] instanceof kendo.dataviz.diagram.Connection) {
			if (transitionObject == null) {
				transitionObject = new TransitionDataModel();
			}
			transitionObject.fromJSON(e.selected[0].dataItem);
			transitionObject.SetStatuses(workprocessObject.GetStatusDataSource().data().toJSON());
			kendo.unbind($("#workprocessEdition"));
			$("#workprocessEdition").html($("#templateTransitionDetails").html());
			kendo.bind($("#workprocessEdition"), transitionObject.GetDetailsAsObservable());
		}
		
		$("#workprocessEdition").removeClass("hidden");
		$("#workprocessEdition").show();
	} catch (e) {
		console.log(e);
	}
}

var getVisual = function(data) {
	var textWidth = Math.max(100, getTextWidth(data.dataItem.name));
	var g = new kendo.dataviz.diagram.Group();
	var r = new kendo.dataviz.diagram.Rectangle({
		width : textWidth,
		height: 40,
		fill: "#f5f5f5"
	});
	g.append(r);
	
	return g;
};

function removeWorkprocess(e) {
	/*var dataItem = $("#list-workprocesses").data("kendoListView").dataItem($(e.target).closest(".item"));
	if (dataItem && (dataItem.used == false)) {
		var aWorkprocess = new WorkProcessDataModel(dataItem.id, dataItem.name);
		workprocessesObject.DeleteWorkProcess(aWorkprocess, Mode.LOCAL);
	}*/
	try {
		var listView = $("#list-workprocesses").data("kendoListView");
		if (listView) {
			var currentElem = $(e.target).closest(".item");
			var nextElemId = currentElem.is(":last-child")?currentElem.prev().attr("id"):currentElem.next().attr("id");
			var dataItem = listView.dataItem(currentElem);
			if (dataItem) {
				if (workprocessObject && (dataItem.id == workprocessObject.GetId()) && (dataItem.used==false)){
					workprocessesObject.DeleteWorkProcess(workprocessObject, Mode.LOCAL);
					listView.select($("#list-workprocesses #"+nextElemId));
				} else {
					if (dataItem.used==false) {
						var aWorkprocess = new WorkProcessDataModel(dataItem.id, dataItem.name);
						workprocessesObject.DeleteWorkProcess(aWorkprocess, Mode.LOCAL);
						if(workprocessObject) {
							listView.select(currentElem);
						} else {
							listView.clearSelection();
							$("#workprocess-help-box").show();
							$("#workprocess-details-box").hide();
						}
					} else {
						listView.select(currentElem);
					}
				}
			}
		}
		e.preventDefault();
	} catch(ex) {
		console.log(ex);
	}
}

function addStatusFromIHM() {
	if ($("#status-form").data("kendoValidator") == null) {
		$("#status-form").kendoValidator({
			rules: {
				requiredType: function(input){					
					if((input.data("kendoDropDownList") != null) 
						&& ((input.data("kendoDropDownList").value() == null) 
							|| (input.data("kendoDropDownList").value() == ""))) {
						return false;
					}
					return true;
				}
			},
			messages: {			  
				requiredType: function(input){
					return input.attr("name") + " is required";
				}
			}
		});
	}
	if($("#status-form").data("kendoValidator").validate()) {
		var aStatusName = $("#statusName").val();
		var aStatusType = $("#statusType").data("kendoDropDownList").dataItem().toJSON();
		var isComment = $("#statusComment").is(":checked");
		var isEdit = $("#statusEdit").is(":checked");		
		if (statusObject == null) {
			statusObject = new StatusDataModel(newStatusId--);
			statusObject.SetName(aStatusName);
			statusObject.SetType(aStatusType);
			statusObject.SetEditable(isEdit);
			statusObject.SetCommentable(isComment);
			workprocessObject.AddStatus(statusObject, Mode.LOCAL);
		} else {
			statusObject.SetName(aStatusName);
			statusObject.SetType(aStatusType);
			statusObject.SetEditable(isEdit);
			statusObject.SetCommentable(isComment);
			workprocessObject.UpdateStatus(statusObject, Mode.LOCAL);
		}
		$("#workprocessSpace").removeClass("col-sm-7");
		$("#workprocessSpace").addClass("col-sm-12");
		$("#workprocessEdition").html("");
		$("#workprocess").data("kendoDiagram").refresh();
		hasChanges = true;
	} else {
		setTimeout(function(){
			$("#status-form").data("kendoValidator").hideMessages();
		},5000);
	}
}

function addTransitionFromIHM() {
	if ($("#transition-form").data("kendoValidator") == null) {
		$("#transition-form").kendoValidator({
			rules: {
				requiredType: function(input){					
					if((input.data("kendoDropDownList") != null) 
						&& ((input.data("kendoDropDownList").value() == "") 
							|| (input.data("kendoDropDownList").value() == null))) {
							return false;
					}
					return true;
				}
			},
			messages: {			  
				requiredType: function(input){
					return input.attr("name") + " is required";
				}
			}
		});
	}
	if($("#transition-form").data("kendoValidator").validate()) {
		var aTransitionName = $("#transitionName").val();
		var aFromId = $("#transitionFrom").data("kendoDropDownList").value();
		var aToId = $("#transitionTo").data("kendoDropDownList").value();
		var aRACI = [];
		$("#workprocessEdition input:checked").each(function(index){
			aRACI.push({"id":$(this).attr("data-id"), "name":$(this).attr("data-name")});
		});
		if (transitionObject == null) {
			transitionObject = new TransitionDataModel(newTransitionId--);
			transitionObject.SetLabel(aTransitionName);
			transitionObject.SetFrom(aFromId);
			transitionObject.SetTo(aToId);
			transitionObject.SetRACI(aRACI);
			workprocessObject.AddTransition(transitionObject, Mode.LOCAL);
		} else {
			transitionObject.SetLabel(aTransitionName);
			transitionObject.SetFrom(aFromId);
			transitionObject.SetTo(aToId);
			transitionObject.SetRACI(aRACI);
			workprocessObject.UpdateTransition(transitionObject, Mode.LOCAL);
		}
		$("#workprocessSpace").removeClass("col-sm-7");
		$("#workprocessSpace").addClass("col-sm-12");
		$("#workprocessEdition").html("");
		$("#workprocess").data("kendoDiagram").refresh();
		hasChanges = true;
	} else {
		setTimeout(function(){
			$("#transition-form").data("kendoValidator").hideMessages();
		},5000);
	}
}

function createTransitionWidgets() {
	var fromValue = null,
		toValue = null;
	if (transitionObject != null) {
		fromValue = transitionObject.GetFrom();
		toValue = transitionObject.GetTo();
	}
	$("#transitionFrom").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "id",
		value: fromValue,
		dataSource: workprocessObject.GetStatusDataSource()
	});
	$("#transitionTo").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "id",
		value: toValue,
		dataSource: workprocessObject.GetStatusDataSource()
	});
}

function createStatusWidgets() {
	var typeValue = null;
	if (statusObject != null) {
		typeValue = (statusObject._type!=null)?statusObject._type.id:null;
	}
	$("#statusType").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "id",
		value: typeValue,
		dataSource: {
			transport: {
				read: {
					contentType : "application/json",
					url: WS_BASE_URL + "statustype",
					headers:{"Authorization":"Basic " + getCurrentAuthentificationBase64()}
				}
			},
			schema :{
				parse : function(data) {
					return data._embedded.statustype;					
				}
			}
		}
	});
}

function postWPFromIHM() {
	if ($("#wp-principal-form").data("kendoValidator") == null) {
		$("#wp-principal-form").kendoValidator({
			rules: {
				duplicateName: function(input){					
					if (input.attr("id") == "workprocessName") {
						return true;
					}
					return true;
				}
			},
			messages: {			  
				duplicateName: function(input){
					return input.attr("name") + " is duplicated";
				}
			}
		});
	}
	if($("#wp-principal-form").data("kendoValidator").validate()) {
		var aWpName = $("#workprocessName").val();
		if (workprocessObject.GetName() != null) {
			workprocessObject.SetName(aWpName);
			if (workprocessObject.GetStatusDataSource().data().length > 0) {
				workprocessesObject.UpdateWorkProcess(workprocessObject, Mode.ALL).done(function(){
						showNotification("Workprocess successfully 	updated", "success");
						workprocessesObject.Read().fail(function(){
							showNotification("Error reading workprocesses list", "error");
						});
					}).fail(function(){
						showNotification("Updating workprocess error", "error");
					});
			}
		} else {
			workprocessObject.SetName(aWpName);
			if (workprocessObject.GetStatusDataSource().data().length > 0) {
				workprocessesObject.AddWorkProcess(workprocessObject, Mode.ALL).done(function(){
						showNotification("Workprocess successfully 	added", "success");
						workprocessesObject.Read().fail(function(){
							showNotification("Error reading workprocesses list", "error");
						});
						$("#workprocessName").val("");if (workprocessObject != null) {
							delete workprocessObject;
						}
						workprocessObject = new WorkProcessDataModel(-1);
						createWpDiagram(true);
					}).fail(function(){
						showNotification("Adding workprocess error", "error");
					});
			}
		}
	} else {
		hasChanges = true;
		setTimeout(function(){
			$("#wp-principal-form").data("kendoValidator").hideMessages();
		},5000);
	}	
}