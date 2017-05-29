var projectObject = null;
var usersObject = null;
var projectsObject = null;
var editMode = false;
var organizationId = null; 

$(document).ready(function(){
	initProject();
});

function initProject() {
	try {
		editMode = ($("#edit-project-form").length > 0);
		createProjectEvents();
		var projectInformation = getProjectInformationBase64();
		if((projectInformation != null) && editMode) {
			var projectId = null;
			if ('id' in projectInformation) {
				projectId = projectInformation.id;
			}			
			if (projectId != null) {				
				projectObject = new ProjectDataModel(projectId);
				projectObject.Read().done(function(){
					kendo.bind($("#edit-project-form"), projectObject.GetDetailsAsObservable());
				});
			}
		}
		
		if ((projectInformation==null) && (editMode==false)) {
			$("#CancelProjectBtn").show();
			$("#CancelProject2Btn").show();
		}
		
		var currentUserInformation = getUserInformationBase64();
		if (currentUserInformation != null) {
			if ('organizationId' in currentUserInformation) {
				organizationId = currentUserInformation.organizationId;
			}
			usersObject = new UsersDataModel(organizationId);
			usersObject.Read().done(function(){
				createKendoComponents();
			}).fail(function(){
				showNotification("Error reading users list", "error");
			});
			var userId = null;
			if ('userId' in currentUserInformation) {
				userId = currentUserInformation.userId;
			}
			projectsObject = new ProjectsDataModel(userId);
			projectsObject.Read().fail(function(){
				showNotification("Error reading projects list", "error");
			});
		}
	} catch(e) {
		console.log(e);
	}
}

function createProjectEvents() {
	$("#NextProjectBtn").click(function () {
		if ($("#formPrincipal").data("kendoValidator") == null) {
			$("#formPrincipal").kendoValidator({
				rules: {				
					duplicateName: function(input){
						if (input.attr("id") == "project-name") {
							var checkExist = (editMode == false) || ((projectObject!=null)&&(projectObject.GetName()!=input.val()));
							if (checkExist && projectsObject.IsProjectExist(input.val())) {							
								return false;
							}
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
		if($("#formPrincipal").data("kendoValidator").validate()) {
			$("#formPrincipal").hide();
			$("#formSecond").show();
		} else {
			setTimeout(function(){
				$("#formPrincipal").data("kendoValidator").hideMessages();
			},5000);
		}
	});
	$("#BackProjectBtn").click(function () {   
		$("#formPrincipal").show();
		$("#formSecond").hide();    
	});
	$("#OKProjectBtn").click(function () {
		postProjectFromIHM();		
	});
	$("#CancelProjectBtn, #CancelProject2Btn").click(function () {
		displaySideBar(true);
		loadContentFromURI('Projects');
	});
}

function createKendoComponents() {
	var currentAdminId = null;
	if (projectObject !=null) {
		currentAdminId = (projectObject._admin!=null)?projectObject._admin.id:null;		
	}
	var enabled = (currentAdminId == null);
	$("#project-admin").kendoDropDownList({
		placeholder: "Enter a Name",
		dataTextField: "firstname",
		dataValueField: "id",
		value: currentAdminId,
		filter: "contains",
		dataSource: usersObject.GetUsersDataSource(),
		valueTemplate: "<div><span class='k-state-default'><img src='images/navbar/avatar/#:data.avatar#' class='imgavatar'></img>" +
		"#:data.name# #:data.firstname# </span></div>",
		template: "<div><span class='k-state-default'><img src='images/navbar/avatar/#:data.avatar#' class='imgavatar'></img>" +
		"#:data.name# #:data.firstname# </span></div>",
		enable: enabled
	});
	var currentStatusId = null;
	if (projectObject !=null) {
		currentStatusId = (projectObject._status!=null)?projectObject._status.id:null;
	}
	$("#project-currentstatus").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "id",
		value:currentStatusId,
		dataSource: {
			transport: {
				read: {
					contentType : "application/json",
					url: WS_BASE_URL + "projectstatusconfig",
					headers:{"Authorization":"Basic " + getCurrentAuthentificationBase64()}
				}
			},
			schema :{
				parse : function(data) {
					return data._embedded.projectstatusconfig;					
				}
			}
		}
	});
	var currentPhaseId = null;
	if (projectObject !=null) {
		currentPhaseId = (projectObject._phase!=null)?projectObject._phase.id:null;
	}
	$("#project-phase").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "id",
		value:currentPhaseId,
		dataSource: {
			transport: {
				read: {
					contentType : "application/json",
					url: WS_BASE_URL + "projectphaseconfig",
					headers:{"Authorization":"Basic " + getCurrentAuthentificationBase64()}
				}
			},
			schema :{
				parse : function(data) {
					return data._embedded.projectphaseconfig;					
				}
			}
		}
	});
	var currentTypeId = null;
	if (projectObject !=null) {
		currentTypeId = (projectObject._type!=null)?projectObject._type.id:null;
	}
	$("#project-type").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "id",
		value:currentTypeId,
		dataSource: {
			transport: {
				read: {
					contentType : "application/json",
					url: WS_BASE_URL + "projecttypeconfig",
					headers:{"Authorization":"Basic " + getCurrentAuthentificationBase64()}
				}
			},
			schema :{
				parse : function(data) {
					return data._embedded.projecttypeconfig;					
				}
			}
		}
	});
	var currentSectorId = null;
	if (projectObject !=null) {
		currentSectorId = (projectObject._sector!=null)?projectObject._sector.id:null;
	}
	$("#project-sector").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "id",
		value:currentSectorId,
		dataSource: {
			transport: {
				read: {
					contentType : "application/json",
					url: WS_BASE_URL + "projectsectorconfig",
					headers:{"Authorization":"Basic " + getCurrentAuthentificationBase64()}
				}
			},
			schema :{
				parse : function(data) {
					return data._embedded.projectsectorconfig;					
				}
			}
		}
	});
	var currentGoalId = null;
	if (projectObject !=null) {
		currentGoalId = (projectObject._goal!=null)?projectObject._goal.id:null;
	}
	$("#project-goal").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "id",
		value:currentGoalId,
		dataSource: {
			transport: {
				read: {
					contentType : "application/json",
					url: WS_BASE_URL + "projectgoalconfig",
					headers:{"Authorization":"Basic " + getCurrentAuthentificationBase64()}
				}
			},
			schema :{
				parse : function(data) {
					return data._embedded.projectgoalconfig;					
				}
			}
		}
	});
}

function postProjectFromIHM() {	
	var aName = $("#project-name").val();
	var aAdmin = $("#project-admin").data("kendoDropDownList").dataItem().toJSON();
	var aCenterName = $("#project-centername").val();	
	var aLocation = $("#project-location").val();
	var aStatus = $("#project-currentstatus").data("kendoDropDownList").dataItem().toJSON();
	var aPhase = $("#project-phase").data("kendoDropDownList").dataItem().toJSON();
	var aSector = $("#project-sector").data("kendoDropDownList").dataItem().toJSON();
	var aType = $("#project-type").data("kendoDropDownList").dataItem().toJSON();
	var aGoal = $("#project-goal").data("kendoDropDownList").dataItem().toJSON();
	if ((aName != "") && (aAdmin != null)) {
		if (projectObject == null) {
			projectObject = new ProjectDataModel(null,aName,true,aCenterName,aLocation,aGoal,aPhase,aSector,aStatus,aType,aAdmin,{"id":organizationId});
			projectObject.Create().done(function(){
				projectObject.Assign().done(function(){
					var projectInfo = {"id": projectObject.GetId(),"name": projectObject.GetName(),"active": projectObject.GetActive(), "canEditProject":true, "canDeleteProject":true};
					setProjectInformationBase64(projectInfo);
					displaySideBar(true);
					loadContentFromURI('phases');
					showNotification(projectObject.GetName()+" successfully created", "success");
				}).fail(function(){
					showNotification("Error creating "+projectObject.GetName(), "error");
				});
			}).fail(function(){
				showNotification("Error creating " + projectObject.GetName(), "error");
			});		
		} else {			
			projectObject.SetName(aName);			
			projectObject.SetCenterName(aCenterName);
			projectObject.SetLocation(aLocation);
			projectObject.SetStatus(aStatus);
			projectObject.SetPhase(aPhase);
			projectObject.SetType(aType);
			projectObject.SetSector(aSector);
			projectObject.SetGoal(aGoal);
			projectObject.Update().done(function(){
				showNotification(projectObject.GetName()+" successfully updated", "success");
				loadContentFromURI('Projects');				
			}).fail(function(){
				showNotification("Error updating "+projectObject.GetName(), "error");
			});
		}
	}
}