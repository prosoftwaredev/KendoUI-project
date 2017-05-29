var phasesObject = null;
var phaseObject = null;
var statusObject = null;
var transitionObject = null;
var modeObservable;
var workprocessesObject = null;
var usersObject = null;
var userId = null;
var updateFlag = true;
var hasChanges = false;

$(document).ready(function () {
	initPhases();
});

function initPhases() {
	try {
		var projectInformation = getProjectInformationBase64();
		var projectId = null;
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
		kendo.bind($("#phase-help-box"), modeObservable);
		createPhasesToolbar(canEditProject);
		phasesObject = new PhasesDataModel(projectId);
		phasesObject.Read().done(function() {
			createPhasesListView();
		}).always(function(){
			kendo.ui.progress($("#list-phases"), false);
			$("#list-phases").css("min-height","inherit");
		}).fail(function(){
				showNotification("Error reading phases list", "error");
		});
		createPhasesEvent(canEditProject);
		var currentUserInformation = getUserInformationBase64();
		if (currentUserInformation != null) {
			var organizationId = null;
			if ('organizationId' in currentUserInformation) {
				organizationId = currentUserInformation.organizationId;
			}
			if ('userId' in currentUserInformation) {
				userId = currentUserInformation.userId;
			}
			workprocessesObject = new WorkProcessesDataModel(null, organizationId);
			workprocessesObject.Read().fail(function(){
				showNotification("Error reading workprocesses list", "error");
			});
			
			usersObject = new UsersDataModel(organizationId);
			usersObject.Read().fail(function(){
				showNotification("Error reading users list", "error");
			});
		}
	} catch(e) {
		console.log(e);
	}
}

function createWpDiagram() {
	if ($("#workprocess").data("kendoDiagram")) {
		$("#workprocess").data("kendoDiagram").destroy();
	}	
	$("#workprocess").removeClass("hidden");
	$("#workprocess").kendoDiagram({
		dataSource: phaseObject.GetWorkProcess().GetStatusDataSource(),
		connectionsDataSource: phaseObject.GetWorkProcess().GetTransitionsDataSource(),
		editable:{
		  tools:{},
		  resize:false
		},
		layout: {
		  type: "tree",
		  subtype: "down"
		}, 
		connectionDefaults:{
			editable:false,
			endCap: "ArrowEnd",
			type:"polyline",
			fill: "#e9e9e9"
		},
		shapeDefaults :{
			editable:false,
			visual:getVisual,
			content: {
				template: "#= dataItem.name #"				
			}
		},
		zoomRate:0,
		dataBound : function(e) {
			var that = this;
			setTimeout(function () {
				that.bringIntoView(that.shapes);
			}, 0);
		},
		select: onSelectDiagram
	});	
}

function createPhasesToolbar(canEditProject) {
	try {
		$("#toolbar-phase").kendoToolBar({
			items: [
				{ type: "button", id: "importPhaseBtn", text: "Import", icon:"download", enable:false },
				{ type: "button", id: "exportPhaseBtn", text: "Export", icon:"upload" , enable:false},
				{ type: "button", id: "editPhaseBtn", text: "Edit" , icon:"edit", togglable: true, hidden:!canEditProject},
				{ type: "button", id: "savePhaseBtn", text: "Save", icon:"save", hidden:true },
				{ type: "button", id: "cancelPhaseBtn", text: "Cancel", icon:"close", hidden:true }			
			],
			toggle:function(e){ 
				editToggle(e);
			}, 
			click: function(e) {
				if (e.id == "cancelPhaseBtn") {
					cancelPhaseClick(e);
				} else if (e.id == "savePhaseBtn") {					
					savePhaseClick(e);
				}
			}
		});
	} catch (e) {
		console.log(e);
	}
}

function createPhasesListView() {
	try {
		$("#list-phases").kendoListView({
			dataSource: phasesObject.GetDataSource(),
			template: kendo.template($("#templatePhaseItem").html()),
			selectable:true,
			navigatable: true,
			change : function() {
				if (this.select().length > 0) {
					updateFlag = true;
					var dataItem = this.dataItem(this.select().first());
					this.current(this.select().first());
					if (phaseObject == null) {
						phaseObject = new PhaseDataModel()
					}
					phaseObject.SetId(dataItem.id);
					phaseObject.SetName(null);
					selectPhaseIHM();
				}
			},
			dataBound:function(e) {
				if (modeObservable.get("editMode") == true) {
					$("#list-phases").kendoSortable({
						handler: ".k-i-move",
						change: changePhasesRank
					});
				}
				kendo.bind($("#list-phases .item"), modeObservable);
			}		
		});
	} catch(e) {
		console.log(e);
	}		
}

function createPhasesEvent(canEditProject) {
	kendo.bind($("#AddPhaseBtn"), modeObservable);
	$("#AddPhaseBtn").click(function(e){
		if (modeObservable.get("edit") == true) {
			hasChanges = true;
			if (phaseObject) {
				delete phaseObject;
				phaseObject = null;
			}
			$("#list-phases").data("kendoListView").clearSelection();
			$("#list-phases").data("kendoListView").current(null);
			$("#phase-help-box").hide();
			$("#phase-details-box").html($("#templatePhaseAdd").html());
			createKendoComponents();
			$("input").change(function(){
				hasChanges = true;
			});
			$("#phase-details-box").removeClass("hidden");
			$("#phase-details-box").show();
			$("#toolbar-phase").data("kendoToolBar").toggle("#editPhaseBtn", true);
			$("#toolbar-phase").data("kendoToolBar").show("#savePhaseBtn");
			$("#toolbar-phase").data("kendoToolBar").show("#cancelPhaseBtn");
			updateFlag = false;
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
			transitionObject.SetStatuses(phaseObject.GetWorkProcess().GetStatusDataSource().data().toJSON());
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

function removePhase(e) {
	try {
		var listView = $("#list-phases").data("kendoListView");
		if (listView) {
			var currentElem = $(e.target).closest(".item");
			var nextElemId = currentElem.is(":last-child")?currentElem.prev().attr("id"):currentElem.next().attr("id");
			var dataItem = listView.dataItem(currentElem);
			if (dataItem) {
				if (phaseObject && (dataItem.id == phaseObject.GetId()) && (phaseObject._deliverables.length==0)){
					phasesObject.DeletePhase(phaseObject, Mode.LOCAL);
					listView.select($("#list-phases #"+nextElemId));
				} else {
					var aPhase = new PhaseDataModel(dataItem.id, dataItem.name);
					aPhase.SetGateKeeper(dataItem.keeper);
					aPhase.SetWorkProcess(new WorkProcessDataModel(dataItem.workprocessId));
					aPhase.ReadDeliverables().done(function(){
						if(this._deliverables.length==0) {
							phasesObject.DeletePhase(this, Mode.LOCAL);
							listView.clearSelection();
							$("#phase-help-box").show();
							$("#phase-details-box").hide();
						} else {
							listView.select(currentElem);
						}
					});
				}
			}
		}
		e.preventDefault();
	} catch(ex) {
		console.log(ex);
	}
}

function createKendoComponents() {
	kendo.destroy("#phase-details-box");
	var gateKeeper = null;
	if (phaseObject != null) {
		gateKeeper = phaseObject.GetGateKeeper();
	}
	$("#phaseGateKeeper").kendoDropDownList({
		placeholder: "Enter a Name",
		dataTextField: "firstname",
		dataValueField: "id",
		value : (gateKeeper!=null)?gateKeeper.id:userId,
		filter: "contains",
		dataSource: usersObject.GetUsersDataSource(),
		valueTemplate: "<div><span class='k-state-default'><img src='images/navbar/avatar/#:data.avatar#' class='imgavatar'></img>" +
		"#:data.name# #:data.firstname# </span></div>",
		template: "<div><span class='k-state-default'><img src='images/navbar/avatar/#:data.avatar#' class='imgavatar'></img>" +
		"#:data.name# #:data.firstname# </span></div>",
		change: function(e) {
			hasChanges = true;
		}
	});
	// start date
	var startDateValue = null;
	if (phaseObject != null) {
		startDateValue = phaseObject.GetStartDate();
	}
	$("#phaseStartDate").kendoDatePicker({
		value: startDateValue,
		format: "yyyy-MM-dd",
		change: function() {
			hasChanges = true;
        }
	});
	// end date
	var endDateValue = null;
	if (phaseObject != null) {
		endDateValue = phaseObject.GetEndDate();
	}
	$("#phaseEndDate").kendoDatePicker({
		value: endDateValue,
		format: "yyyy-MM-dd",
		change: function() {
			hasChanges = true;
        }
	});
	var currentWorkprocessId = null;
	if (phaseObject != null && phaseObject.GetWorkProcess() != null) {
		currentWorkprocessId = phaseObject.GetWorkProcess().GetId();
	}
	$("#listWPCombo").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "id",
		value:currentWorkprocessId,
		dataSource: workprocessesObject.GetDataSource(),
		change: function(e) {
			hasChanges = true;
		}
	});
}

function postPhaseFromIHM() {
	createPhaseValidator();
	if($("#phase-details-box").data("kendoValidator").validate()) {
		var aPhaseName = $("#phaseName").val();
		var aGateKeeper = $("#phaseGateKeeper").data("kendoDropDownList").dataItem().toJSON();
		var aStartDate = kendo.toString($("#phaseStartDate").data("kendoDatePicker").value(), "yyyy-MM-dd");
		var anEndDate = kendo.toString($("#phaseEndDate").data("kendoDatePicker").value(), "yyyy-MM-dd");
		var aWorProcessId = $("#listWPCombo").val();
		var aNewRank = phasesObject.GetNewRank();
		if ((aPhaseName != "") && (aGateKeeper != null) && (aStartDate!=null) && (anEndDate!=null)) {
			if (phaseObject == null) {
				phaseObject = new PhaseDataModel(-1);
			}
			phaseObject.SetName(aPhaseName);
			phaseObject.SetStartDate(aStartDate);
			phaseObject.SetEndDate(anEndDate);
			phaseObject.SetGateKeeper(aGateKeeper);
			var aWorkProcess = new WorkProcessDataModel(aWorProcessId);
			phaseObject.SetWorkProcess(aWorkProcess);
			if (updateFlag) {				
				phasesObject.UpdatePhase(phaseObject, Mode.ALL).done(function(){
					showNotification("Phase successfully updated", "success");
					phasesObject.Read().done(function(){
						var listView = $("#list-phases").data("kendoListView");
						// selects 	last list view item
						if (listView) {
							selectItemList(listView, $("#list-phases #"+phaseObject.GetId()));							
						}
					}).fail(function(){
						showNotification("Error reading phases list", "error");
					});
				}).fail(function(){
					showNotification("Updating phase error", "error");
				});
			} else {
				phaseObject.SetRank(aNewRank);
				phasesObject.AddPhase(phaseObject, Mode.ALL).done(function(){
					showNotification("Phase successfully added", "success");
					phasesObject.Read().done(function(){
						var listView = $("#list-phases").data("kendoListView");
						// selects 	last list view item
						if (listView) {
							selectItemList(listView, listView.element.children().last());							
						}
					}).fail(function(){
						showNotification("Error reading phases list", "error");
					});
				}).fail(function(){
					showNotification("Adding phase error", "error");
				});
			}
		}
	} else {
		setTimeout(function(){
			$("#phase-details-box").data("kendoValidator").hideMessages();
		},5000);
		hasChanges = true;
	}
}

function selectPhaseIHM() {
	if(phaseObject != null) {
		if(phaseObject.GetName() != null) {
			displayPhaseIHM();
		} else {
			phaseObject.Read().done(function(){
				phaseObject.ReadDeliverables().done(function(){
					displayPhaseIHM();
				});
			}).fail(function(){
				showNotification("Error reading phase details", "error");
			});
		}
	}	
}

function displayPhaseIHM() {
	$("#phase-help-box").hide();
	kendo.unbind($("#phase-details-box"));
	if ($("#workprocess").data("kendoDiagram")) {
		$("#workprocess").data("kendoDiagram").destroy();
	}
	if ((modeObservable.get("editMode") == true) && (phaseObject._deliverables.length == 0)) {
		$("#phase-details-box").html($("#templatePhaseEdit").html());
		$("#phaseName").change(function(){
			hasChanges = true;
		});
	}else {
		$("#phase-details-box").html($("#templatePhaseDetails").html());
	}
	var phObservable = phaseObject.GetDetailsAsObservable();
	phObservable.set("used", phObservable.get("used") && modeObservable.get("editMode"));
	kendo.bind($("#phase-details-box"), phObservable);
	createKendoComponents();
	createWpDiagram();
	$("#phase-details-box").removeClass("hidden");
	$("#phase-details-box").show();
}

function changePhasesRank(e) {
	var view = phasesObject.GetDataSource().view();
	var	oldIndex = e.oldIndex,
		newIndex = e.newIndex,
		currentDataItem = view[oldIndex],
		targetDataItem = view[newIndex];
	currentDataItem.set("rank", targetDataItem.rank);
	phasesObject._newRanks.push(currentDataItem);
	if (oldIndex < newIndex) {
		for (var index=oldIndex+1; index <= newIndex; index++) {
			var item = view[index];
			item.set("rank", item.rank - 1);
			phasesObject._newRanks.push(item);
		}
	} else if (oldIndex > newIndex) {
		for (var index=newIndex; index < oldIndex; index++) {
			var item = view[index];
			item.set("rank", item.rank + 1);
			phasesObject._newRanks.push(item);
		}
	}
	kendo.bind($("#list-phases .item"), modeObservable);
}

function savePhaseClick(e) {
	if (hasChanges) {
		hasChanges = false;
		postPhaseFromIHM();
	} else {
		modeObservable.set("editMode", false);
		e.sender.toggle("#editPhaseBtn", false);
		e.sender.hide("#savePhaseBtn");
		e.sender.hide("#cancelPhaseBtn");
		if (phaseObject != null) {
			var listView = $("#list-phases").data("kendoListView");
			// selects 	last list view item
			if (listView) {
				listView.select($("#list-phases #"+phaseObject.GetId()));
				listView.current($("#list-phases #"+phaseObject.GetId()));
			}
		} else {
			$("#phase-help-box").show();
			$("#phase-details-box").hide();
		}
	}
	phasesObject.UpdatePhasesRank();
	phasesObject.DeletePhasesFromServer();	
}

function cancelPhaseClick(e) {
	e.sender.toggle("#editPhaseBtn", false);
	e.sender.hide("#savePhaseBtn");
	e.sender.hide("#cancelPhaseBtn");
	hasChanges = false;
	if ((phasesObject._removedPhases.length > 0) || (phasesObject._newRanks.length > 0)) {
		phasesObject.Read().done(function(){
			if (phaseObject != null) {
				var listView = $("#list-phases").data("kendoListView");
				// selects 	last list view item
				if (listView) {
					listView.select($("#list-phases #"+phaseObject.GetId()));
					listView.current($("#list-phases #"+phaseObject.GetId()));
				}
			} else {
				$("#phase-help-box").show();
				$("#phase-details-box").hide();
			}
		}).fail(function(){
			showNotification("Error reading phases list", "error");
		});
	} else {
		if (phaseObject != null) {
			var listView = $("#list-phases").data("kendoListView");
			// selects 	last list view item
			if (listView) {
				listView.select($("#list-phases #"+phaseObject.GetId()));
				listView.current($("#list-phases #"+phaseObject.GetId()));
			}
		} else {
			$("#phase-help-box").show();
			$("#phase-details-box").hide();
		}
	}
	modeObservable.set("editMode", false);
}

function editToggle(e) {
	if (e.checked){
		e.sender.show($("#savePhaseBtn"));
		e.sender.show($("#cancelPhaseBtn"));
		$("#list-phases").kendoSortable({
			handler: ".k-i-move",
			change: changePhasesRank
		});
	} else {
		hasChanges = false;
		e.sender.hide($("#savePhaseBtn"));
		e.sender.hide($("#cancelPhaseBtn"));
		if($("#list-phases").data("kendoSortable"))
			$("#list-phases").data("kendoSortable").destroy();
	}
	modeObservable.set("editMode", e.checked);
	if(e.checked) {
		if (updateFlag) {
			selectPhaseIHM();
		}
	} else {
		$("#phase-help-box").show();
		$("#phase-details-box").hide();
	}	
}

function selectItemList(list, elem) {
	list.select(elem);
	list.current(elem);
	modeObservable.set("editMode", false);
	$("#toolbar-phase").data("kendoToolBar").toggle("#editPhaseBtn", false);
	$("#toolbar-phase").data("kendoToolBar").hide("#savePhaseBtn");
	$("#toolbar-phase").data("kendoToolBar").hide("#cancelPhaseBtn");
	hasChanges = false;
}

function createPhaseValidator() {
	if ($("#phase-details-box").data("kendoValidator") == null) {
		$("#phase-details-box").kendoValidator({
			rules: {
				requiredDate: function(input){
					if (input.data("kendoDatePicker") 
						&& (input.data("kendoDatePicker").value()==null)) {
						return false;
					}
					return true;
				},
				duplicateName: function(input){					
					if (input.attr("id") == "phaseName") {
						var checkExist = (phaseObject == null) || ((phasesObject!=null)&&(phaseObject.GetName()!=input.val()));
						if (checkExist && phasesObject.IsPhaseExist(input.val())) {							
							return false;
						}
					}
					return true;
				},
				validDate : function(input) {
					if ((input.attr("id") == "phaseEndDate") 
						&& input.data("kendoDatePicker") 
						&& (input.data("kendoDatePicker").value()!=null)
						&& $("#phaseStartDate").data("kendoDatePicker") 
						&& ($("#phaseStartDate").data("kendoDatePicker").value()!=null)
						&& (input.data("kendoDatePicker").value() < $("#phaseStartDate").data("kendoDatePicker").value())) {
							return false;
						}
					return true;
				}
			
		  },
		  messages: {			  
			requiredDate: function(input) {
				return input.attr("name") + " is required";
			},
			duplicateName: function(input){
				return input.attr("name") + " is duplicated";
			},
			validDate: function(input) {
				return input.attr("name") + " should be greater than Start Date";
			}
		  }
		});
	}	
}