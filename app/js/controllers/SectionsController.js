var sectionsObject = null;
var sectionObject = null;
//var sectionsObject = null;
var userMode = "view";
var baseUrl  = WS_BASE_URL + "" ; 
function createComponents() {
	createSectionsToolbar();
	sectionsObject = new SectionsListDataModel();
	sectionsObject.Read().done(function() {
		createSectionsListView();
	}).always(function(){
		kendo.ui.progress($("list-sections"), false);
		$("#list-sections").css("min-height","inherit");
	});;	
	createSectionsEvent();
}


function createSectionsToolbar() {
	$("#toolbar-section").kendoToolBar({
		items: [
			{ type: "button", id: "importPhase", text: "Import", icon:"download", enable:false },
			{ type: "button", id: "exportPhase", text: "Export", icon:"upload", enable:false },
			{ type: "button", id: "editPhase", text: "Edit" , icon:"edit", togglable: true},
			{ type: "button", id: "saveSection", text: "Save", icon:"save", hidden:true },
			{ type: "button", id: "cancelSection", text: "Cancel", icon:"close", hidden:true }			
		],
		toggle:function(e){ 
			if (e.checked){
				e.sender.show($("#saveSection"));
				e.sender.show($("#cancelSection"));
			} else {
				e.sender.hide($("#saveSection"));
				e.sender.hide($("#cancelSection"));
			}
		}
	});
}

function createSectionsListView() {
	 $("#list-sections").kendoListView({
		dataSource: sectionsObject.GetDataSource(),
		template: kendo.template($("#templateSectionItem").html()),
		selectable:true,
		change : function() {
			if (this.select().length > 0) {
				
				var dataItem = this.dataItem(this.select().first());
				sectionObject = new SectionDataModel(dataItem.id);
				sectionObject.Read().done(function(){
					$("#section-help-box").hide();
					$("#section-details-box").html($("#templatesectionDetails").html());
					kendo.bind($("#section-details-box"), sectionObject.GetDetailsAsObservable());

					$("#section-details-box").removeClass("hidden");
				});
			}
		},
		dataBound:function(e) {
			$("#list-deliverables").kendoSortable({
				handler: ".item"
			});
		}		
	});		
}
function createSectionsList(){
	var listOfSection = sectionsObject.GetDataSource().data() ; 
	
	$.each( listOfSection, function( key, section ) {
		var templateSection  = kendo.template($("#templateSection").html() );
		$("#sections").append(templateSection(section));
	}); 
}

function createSectionsEvent() {
	
	var newSection = new Object();
	function onSelectUserCombo(e) {
			if (e.item) {
				var dataItem = this.dataItem(e.item.index());
			//	newSection.responsibles = baseUrl + "user/"+dataItem.id;
			} else {
				console.log("event :: select");
			}
	};
	
	$("#AddSectionBtn").click(function(e){
			
				var sectionListView = $("#list-sections").data("kendoListView");
				if(sectionListView != null){
						sectionListView.clearSelection();
				}
				$("#section-help-box").hide();
				$("#section-details-box").html($("#templateSectionAdd").html());
				$("#section-details-box").removeClass("hidden");
				$("#section-details-box").show();
		
				var currentUserInformation = getUserInformationBase64();
				if (currentUserInformation != null) {
					var organizationId = null;
					if ('organizationId' in currentUserInformation) {
						organizationId = currentUserInformation.organizationId;
					}else{
						organizationId = 1 ;
					}
				}
		
				var usersList = new UsersDataModel(organizationId);
				usersList.Read().done(function(){
					$("#sectionResponsable").kendoComboBox({
                        filter:"startswith",
                        dataTextField: "name",
                        dataValueField: "id",
						select: onSelectUserCombo,
						autoBind: true,
                        dataSource: usersList.GetUsersDataSource()
                    });
				});		
		
		$("#SaveNewSectionBtn").click(function(){
					newSection.name = $("#sectionName").val() ; 
					newSection.content = $("#sectionContent").val();
					newSection.privatesection = false;
					var currentUserInformation = getUserInformationBase64();
			
				if (currentUserInformation != null) {
					var organizationId = null;
					if ('organizationId' in currentUserInformation) {
						newSection.organisation = baseUrl + "organisation/"+currentUserInformation.organizationId;
					}else{
						newSection.organisation = baseUrl + "organisation/1" ;
					}
				}
				newSection.project =  baseUrl + "project/"+getProjectInformationBase64().id
				sectionObject = new SectionDataModel();
			
					sectionObject.CreateSection(JSON.stringify(newSection)).done(function(){
						console.log("Section has been successfully added");
						createSectionsListView();
					});
		});
		
	});	
	
	
}