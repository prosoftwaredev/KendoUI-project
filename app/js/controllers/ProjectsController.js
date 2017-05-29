var projectsObject = null;

$(document).ready(function(){
	initProjects();
});

function initProjects() {
	try {
		// clear last project info
		removeProjectInformationBase64();
		var currentUserInformation = getUserInformationBase64();
		if (currentUserInformation != null) {
			var organizationId = null;
			if ('organizationId' in currentUserInformation) {
				organizationId = currentUserInformation.organizationId;
			}
			var userId = null;
			if ('userId' in currentUserInformation) {
				userId = currentUserInformation.userId;
			}
			var userRole = null;
			if ('role' in currentUserInformation) {
				userRole = currentUserInformation.role;
			}
			var userName = null;
			if ('userName' in currentUserInformation) {
				userName = currentUserInformation.userName;
			}
			var userAvatar = null;
			if ('userAvatar' in currentUserInformation) {
				userAvatar = currentUserInformation.userAvatar;
			}
			var canAddProject = false;
			if ('role' in currentUserInformation) {
				canAddProject = (userRole == "PROGRAM_ROLE");
			}
			var roleObservable = kendo.observable({
				canAddProject : canAddProject,
				userName : userName,
				userAvatar : userAvatar
			});
			kendo.bind($("#addProjectHeaderList"), roleObservable);
			kendo.bind($("#addProjectHeader"), roleObservable);
			kendo.bind($("#addProject").closest("div"), roleObservable);
			kendo.bind($("#add-project-btn"), roleObservable);
			kendo.bind($(".divider"), roleObservable);
			kendo.bind($(".user.user-menu"), roleObservable);
			
			projectsObject = new ProjectsDataModel(userId, organizationId, userRole);
			projectsObject.Read().done(function() {
				kendo.bind($("#ListProject"), projectsObject.GetProjectsAsObservable());
				kendo.bind($("#ListProjectsHeader"), projectsObject.GetProjectsAsObservable());
				createProjectsEvents();
			}).always(function(){
				kendo.ui.progress($("#ListProject"), false);
			}).fail(function(){
				showNotification("Error reading projects list", "error");
			});
			$("#addProject, #addProjectHeaderList, #add-project-btn").click(function(e){
				loadContentFromURI('AddProjectForms');
			});
		} else {
			logout();
		}
	} catch(e) {
		console.log(e);
	}
}

function createProjectsEvents() {
	$(".projectItem .panel-body").click(function(e){
		displaySideBar(true);
		var projectInfo = projectsObject.GetProjectById($(this).closest(".projectItem").attr("id"));
		if (projectInfo != null) {
			setProjectInformationBase64(projectInfo);
		}
		app.navigate('Deliverables');
		//loadContentFromURI("deliverables");
	});
	
	$("#ListProjectsHeader a").click(function(e){
		displaySideBar(true);
		var projectInfo = projectsObject.GetProjectById($(this).attr("id"));
		if (projectInfo != null) {
			setProjectInformationBase64(projectInfo);
		}
		app.navigate('Deliverables');
		//loadContentFromURI("deliverables");
	});
	
	$(".edit-project-btn").click(function(e){
		var projectInfo = projectsObject.GetProjectById($(this).closest(".projectItem").attr("id"));
		if (projectInfo != null) {
			setProjectInformationBase64(projectInfo);
		}
		loadContentFromURI('EditProjectForms');
	});
	
	$(".delete-project-btn").click(function(e){
		var active = ($(this).attr("active")=="true")?false:true;
		activateProject($(this).closest(".projectItem").attr("id"), $(this).closest(".projectItem").find(".projectName").first().text(), active);
	});
}

function activateProject(id, name, active) {
	var projectObject = new ProjectDataModel(id, name);
	if (projectObject != null) {
		projectObject.SetActive(active);
		var activeStr = (projectObject.GetActive()==true)?"activated":"deactivated";
		var activatingStr = (projectObject.GetActive()==true)?"activating ":"deactivating ";
		projectsObject.ActivateProject(projectObject, Mode.ALL).done(function(){
			kendo.unbind($("#ListProject"));
			kendo.bind($("#ListProject"), projectsObject.GetProjectsAsObservable());			
			createProjectsEvents();
			showNotification(projectObject.GetName() + " successfully " + activeStr, "success");
		}).fail(function(){
			showNotification("Error " + activatingStr + projectObject.GetName(), "error");
		});
	}
}

function createKendoComponents() {
	kendo.destroy("#phase-details-box");
	var gateKeeper = null;
	if (projectObject != null) {
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
		"#:data.name# #:data.firstname# </span></div>"
	});
	// start date
	var startDateValue = null;
	if (phaseObject != null) {
		startDateValue = phaseObject.GetStartDate();
	}
	$("#phaseStartDate").kendoDatePicker({
		value: startDateValue,
		format: "yyyy-MM-dd"
	});
	// end date
	var endDateValue = null;
	if (phaseObject != null) {
		endDateValue = phaseObject.GetEndDate();
	}
	$("#phaseEndDate").kendoDatePicker({
		value: endDateValue,
		format: "yyyy-MM-dd"
	});
}