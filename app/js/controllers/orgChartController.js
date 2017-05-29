var usersObject=null;
var positionsObject=null;
var teamObject = null;
var userObject = null;
var userDeleteObject = null;
var hierarchyObject=null;
var UsersDetailsObject=null;
var userMode = "view";
var idNewShape=100;
var idNewUser =null;
var lastname=null;
var firstname=null;
var modeObservable;
var editMenu=false;
var avatarToEdit;
var typeToEdit;
var organizationId = null;
var zoomLevel=1;
function createComponents() {
  try {
    modeObservable = kendo.observable({
      editMode : false
    });
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
    // clear last project info
   removeProjectInformationBase64();
   var currentUserInformation = getUserInformationBase64();
    if (currentUserInformation != null) {
      if ('organizationId' in currentUserInformation) {
        organizationId = currentUserInformation.organizationId;
      }
    }
    createOrgChartComponents();
    createWinDialog();
    teamObject = new TeamDataModel(projectId);
    teamObject.Read().done(function() {
      createDiagram();
    });
    createOrgChartEvent();
  } catch(e) {
    console.log(e);
  }
}


function addChild() {
  $("#Name").data('kendoDropDownList').select(1);
  $("#JobTitle").data('kendoDropDownList').select(1);
  $('#dialog').data("kendoWindow").center().open();
}

function editElement(){
  var selected = $("#diagram").getKendoDiagram().select();
  for (var idx = 0; idx < selected.length; idx++) {
  //  $("#NameToEdit").data('kendoDropDownList').value(selected[idx].dataItem.user.name+" "+selected[idx].dataItem.user.firstname);
    $("#NameToEdit").data('kendoDropDownList').select(function(dataItemlist) {
      return ((dataItemlist.name == selected[idx].dataItem.user.name)&&(dataItemlist.firstname == selected[idx].dataItem.user.firstname));
    });
    $("#JobTitleToEdit").data('kendoDropDownList').select(function(dataItemlist) {
      return (dataItemlist.name == selected[idx].dataItem.position.name);
    });
    $("#textcolorEdit").data('kendoColorPicker').value(selected[idx].dataItem.color);
    avatarToEdit=selected[idx].dataItem.avatar;
    typeToEdit=selected[idx].dataItem.user.type;
  }
  $(".MsgValidate").hide();
  $('#dialogEdit').data("kendoWindow").center().open();
}

function deleteElement() {
  var selected = $("#diagram").getKendoDiagram().select();
  for (var idx = 0; idx < selected.length; idx++) {
    var selecteNode = selected[idx].dataItem.id;
  }
  // suppression de lien
  //while pour ne pas avoir des fils
  var j = teamObject.GetHierarchysDataSource().data().length - 1;
  var hasASons = false;

  while ((j >= 0) && (!hasASons)) {
    if (teamObject.GetHierarchysDataSource().data()[j].from == selecteNode) {
      hasASons = true;
    }
    j--;
  }
  j=teamObject.GetHierarchysDataSource().data().length-1;
  while((j>=0)&&(!hasASons))
  {
    if( teamObject.GetHierarchysDataSource().data()[j].to==selecteNode){
      teamObject.GetHierarchysDataSource().remove(teamObject.GetHierarchysDataSource().data()[j]);
    }
    j--;
  }

  if((!hasASons)&&(teamObject.GetUsersDataSource().data().length>1)){
    // suppression de shape
    for(var i=teamObject.GetUsersDataSource().data().length-1; i>=0; i--){
      if( teamObject.GetUsersDataSource().data()[i].id==selecteNode){
        teamObject.GetUsersDataSource().remove(teamObject.GetUsersDataSource().data()[i]);
      }
    }
    $("#diagram").data("kendoDiagram").dataSource.data(teamObject.GetUsersDataSource().data());
    $("#diagram").data("kendoDiagram").connectionsDataSource.data(teamObject.GetHierarchysDataSource().data());
  }else{
    $('#dialogSuppression').data("kendoWindow").center().open();
  }
}

function onSelectShape () {// chargement des details utilisateur
  $("#loader").show();
  $("#users-details-box").hide();
  var selectedItem = $("#diagram").getKendoDiagram().select();
  for (var idx = 0; idx < selectedItem.length; idx++) {
    var selecteItemNode = selectedItem[idx].dataItem;
  }

  if (selecteItemNode) {
    var userId = selecteItemNode.id;
	UsersDetailsObject =new UsersDetailsDataModel(userId);
    //affectation info user
   var templateInfoUser = kendo.template($("#templateUserdet").html());

      var templateInfoUserResult = templateInfoUser($("#diagram").data("kendoDiagram").dataSource.get(userId));
      $("#userdet").html(templateInfoUserResult);

	//affectation des skills
    var templateSkill = kendo.template($("#templateUserSkill").html());
	UsersDetailsObject.ReadSkill().done(function(result) {
    $("#users-details-box").show();


     var templateSkillResult = templateSkill(UsersDetailsObject.GetSkillsDataSource().data());
     $("#skill").html(templateSkillResult);
	}).fail(function( jqXHR, textStatus ) {
    $("#users-details-box").hide();
  }).always(function(){
    kendo.ui.progress($("#users-details-box"), false);
  });
	//affectation des certificat
    var templateCertificat = kendo.template($("#templateUserCertificat").html());
	UsersDetailsObject.ReadCertificat().done(function(result) {
    $("#users-details-box").show();
     var templateCertificatResult = templateCertificat(UsersDetailsObject.GetCertificatsDataSource().data());
     $("#certificat").html(templateCertificatResult);
	}).fail(function( jqXHR, textStatus ) {
    $("#users-details-box").hide();
  }).always(function(){
    kendo.ui.progress($("#users-details-box"), false);
  });
	//affectation des experience
    var templateExperience = kendo.template($("#templateUserExperience").html());
	UsersDetailsObject.ReadExperience().done(function(result) {
    $("#users-details-box").show();
     var templateExperienceResult = templateExperience(UsersDetailsObject.GetExperiencesDataSource().data());
     $("#experience").html(templateExperienceResult);
	}).fail(function( jqXHR, textStatus ) {
    $("#users-details-box").hide();
  }).always(function(){
    kendo.ui.progress($("#users-details-box"), false);
  });
	//affectation des education
    var templateEducation = kendo.template($("#templateUserEducation").html());
	UsersDetailsObject.ReadEducation().done(function(result) {
    $("#users-details-box").show();
     var templateEducationResult = templateEducation(UsersDetailsObject.GetEducationsDataSource().data());
     $("#education").html(templateEducationResult);
	}).fail(function( jqXHR, textStatus ) {
    $("#users-details-box").hide();
  }).always(function(){
    kendo.ui.progress($("#users-details-box"), false);
  });
}
}

function visualTemplate(options) {
  var dataviz = kendo.dataviz;
  var g = new dataviz.diagram.Group();
  var dataItem = options.dataItem;
  var colorShape="#FF0000";
  if((typeof(dataItem.color)!= "undefined")&&(dataItem.color!=""))
    colorShape=dataItem.color;
  g.append(new dataviz.diagram.Rectangle({
    width: 270,
    height: 75,
    stroke: {
      width: 1,
      color: "#ebebeb"
    },
    fill: {
      color: "#FFFFFF"
    }
  }));
  g.append(new dataviz.diagram.Rectangle({
      width: 5,
      height: 75,
      fill: {
      color: colorShape
      },
      stroke: {
          width: 0
      }
  }));
  var userName=" ";
  if(dataItem.user.name!=null)
    userName=dataItem.user.name;


  var userFirstName=" ";
  if(dataItem.user.firstname)
    userFirstName=dataItem.user.firstname;

  g.append(new dataviz.diagram.TextBlock({

    text : userName+" "+userFirstName,
    x : 80,
    y : 20,
    fill : "#5d5d5d"
  }));
  var postionName=" ";
  if(dataItem.position !=null)
    postionName=dataItem.position.name;
  g.append(new dataviz.diagram.TextBlock({
    text : postionName,
    x : 80,
    y : 40,
    fill : "#5d5d5d",
    fontWeight : "600"
  }));
  var avatar="images/navbar/avatar/noavatar.jpg";
  if((typeof(dataItem.avatar)!= "undefined")&&(dataItem.avatar!=""))
    avatar="images/navbar/avatar/"+dataItem.avatar;


  g.append(new dataviz.diagram.Image({
    source: avatar,
    x: 25,
    y: 15,
    width: 45,
    height: 45
  }));
  if(dataItem.user.type=="consultant") {
    g.append(new dataviz.diagram.Image({
      source: "images/extern.png",
      x: 235,
      y: 3,
      width: 20,
      height: 20
    }));
  }
  return g;
}

function createWinDialog() {
  $('#dialogSuppression').kendoWindow({
    width: "400px",
    title: "Remove ressource",
    visible: false,
    modal: true,
  });

  $('#dialogEdit').kendoWindow({
    width: "250px",
    title: "Edit ressource",
    visible: false,
    modal: true,
  });

  $('#dialog').kendoWindow({
    width: "250px",
    title: "Add ressource",
    visible: false,
    modal: true,
  });
}
function createOrgChartEvent() {
  $("#primaryOKButton").kendoButton({
    click: function (e) {

      var selected = $("#diagram").data("kendoDiagram").select();
      if(selected.length>0) {
        var selecteNode=selected[0].dataItem.id;
        var newAvatar = "noavatar.jpg";
        idNewShape++;//gestion des id à revoir
        if (($("#JobTitle").data('kendoDropDownList').value() != "") && ($("#Name").data('kendoDropDownList').value() != "")) {
          $(".MsgValidate").hide();
          var avatarToShow = "noavatar.jpg";
          if ($("#Name").data('kendoDropDownList').dataItem()) {
            avatarToShow = $("#Name").data('kendoDropDownList').dataItem().avatar;
            idNewUser = $("#Name").data('kendoDropDownList').dataItem().id;
            lastname = $("#Name").data('kendoDropDownList').dataItem().name;
            firstname = $("#Name").data('kendoDropDownList').dataItem().firstname;

          }
          userObject = new UserDataModel(idNewUser, lastname, firstname, "type", $("#JobTitle").data('kendoDropDownList').dataItem().id, $("#JobTitle").data('kendoDropDownList').text(), $("#textcolor").val(), avatarToShow);

           var resExit =teamObject.AddUser(userObject, Mode.LOCAL);
          if(resExit==true) {
            hierarchyObject = new HierarchyDataModel(idNewShape, selecteNode, idNewUser);
            teamObject.AddHierarchy(hierarchyObject, Mode.LOCAL);
            $("#diagram").data("kendoDiagram").dataSource.data(teamObject.GetUsersDataSource().data());
            $("#diagram").data("kendoDiagram").connectionsDataSource.data(teamObject.GetHierarchysDataSource().data());
            $('#dialog').data("kendoWindow").close();
          }else {
            $(".MsgValidate").show();
          }
        } else {
          $(".MsgValidate").show();
        }
      }

    }
  });
  $("#primaryOKButtonEdit").kendoButton({
    click: function (e) {
      var selected = $("#diagram").data("kendoDiagram").select();
      if(selected.length>0) {
        var selecteNode=selected[0].dataItem.id;
        var newAvatar = "noavatar.jpg";
        idNewShape++;//gestion des id à revoir
        if (($("#JobTitleToEdit").data('kendoDropDownList').value() != "") && ($("#NameToEdit").data('kendoDropDownList').value() != "")) {

          var avatarToShow = "noavatar.jpg";
          if ($("#NameToEdit").data('kendoDropDownList').dataItem()) {
            avatarToShow = $("#NameToEdit").data('kendoDropDownList').dataItem().avatar;
            idNewUser = $("#NameToEdit").data('kendoDropDownList').dataItem().id;
            lastname = $("#NameToEdit").data('kendoDropDownList').dataItem().name;
            firstname = $("#NameToEdit").data('kendoDropDownList').dataItem().firstname;

          }
          userObject = new UserDataModel(idNewUser, lastname, firstname, "type", $("#JobTitleToEdit").data('kendoDropDownList').dataItem().id, $("#JobTitleToEdit").data('kendoDropDownList').text(), $("#textcolorEdit").val(), avatarToShow);
          if(selecteNode==idNewUser){
            teamObject.UpdateUser(userObject, Mode.LOCAL);
            $("#diagram").data("kendoDiagram").dataSource.data(teamObject.GetUsersDataSource().data());
            $("#diagram").data("kendoDiagram").connectionsDataSource.data(teamObject.GetHierarchysDataSource().data());
            $('#dialogEdit').data("kendoWindow").close();
          }else {
            var resExit = teamObject.AddUser(userObject, Mode.LOCAL);

            if (resExit == true) {

              for (var i = teamObject.GetHierarchysDataSource().data().length - 1; i >= 0; i--) {
                if (teamObject.GetHierarchysDataSource().data()[i].to == selecteNode) {
                  hierarchyObject = new HierarchyDataModel(idNewShape, teamObject.GetHierarchysDataSource().data()[i].from, idNewUser);
                  teamObject.AddHierarchy(hierarchyObject, Mode.LOCAL);
                  teamObject.GetHierarchysDataSource().remove(teamObject.GetHierarchysDataSource().data()[i]);
                }
                if (teamObject.GetHierarchysDataSource().data()[i].from == selecteNode) {
                  hierarchyObject = new HierarchyDataModel(idNewShape, idNewUser, teamObject.GetHierarchysDataSource().data()[i].to);
                  teamObject.AddHierarchy(hierarchyObject, Mode.LOCAL);
                  teamObject.GetHierarchysDataSource().remove(teamObject.GetHierarchysDataSource().data()[i]);
                }
              }

              userDeleteObject =new UserDataModel(selecteNode);
              teamObject.DeleteUser(userDeleteObject, Mode.LOCAL);
              $("#diagram").data("kendoDiagram").dataSource.data(teamObject.GetUsersDataSource().data());
              $("#diagram").data("kendoDiagram").connectionsDataSource.data(teamObject.GetHierarchysDataSource().data());
              $('#dialogEdit').data("kendoWindow").close();
            } else {
              $(".MsgValidate").show();
            }
          }

        } else {
          $(".MsgValidate").show();
        }
      }


    }
  });
  $("#primaryOKButtonSuppression").kendoButton({
    click: function (e) {
      $('#dialogSuppression').data("kendoWindow").close();
    }
  });
}
function createOrgChartComponents() {
  usersObject = new UsersDataModel(organizationId);
  usersObject.Read().done(function() { });
  positionsObject = new PositionsDataModel();
  positionsObject.Read().done(function() { });
  $("#Name").kendoDropDownList({
    placeholder: "Ressource to Edit...",
    dataTextField: "firstname",
    dataValueField: "id",
    filter: "contains",
    dataSource: usersObject.GetUsersDataSource(),
    valueTemplate: "<div><span class='k-state-default'><img src='images/navbar/avatar/#:data.avatar#' class='imgavatar'></img>" +
    "#:data.name# #:data.firstname# </span></div>",
    template: "<div><span class='k-state-default'><img src='images/navbar/avatar/#:data.avatar#' class='imgavatar'></img>" +
    "#:data.name# #:data.firstname# </span></div>",

  });

  $("#JobTitle").kendoDropDownList({
    placeholder: "Role in this project...",
    dataTextField: "name",
    dataValueField: "id",
    filter: "contains",
    dataSource: positionsObject.GetPositionsDataSource(),

  });

  $("#NameToEdit").kendoDropDownList({
    placeholder: "Ressource to Edit...",
    dataTextField: "firstname",
    dataValueField: "id",
    filter: "contains",
    dataSource: usersObject.GetUsersDataSource(),
    valueTemplate: "<div><span class='k-state-default'><img src='images/navbar/avatar/#:data.avatar#' class='imgavatar'></img>" +
    "#:data.name# #:data.firstname# </span></div>",
    template: "<div><span class='k-state-default'><img src='images/navbar/avatar/#:data.avatar#' class='imgavatar'></img>" +
    "#:data.name# #:data.firstname# </span></div>",

  });

  $("#JobTitleToEdit").kendoDropDownList({
    placeholder: "Role in this project...",
    dataTextField: "name",
    dataValueField: "id",
    filter: "contains",
    dataSource: positionsObject.GetPositionsDataSource(),
  });

  $("#textcolorEdit").kendoColorPicker({
    palette: [
                "#2B5166", "#429867", "#FAB243",
                "#E02130", "#2D959E", "#E4FF9E", "#28457F"
            ],
    tileSize: 32
  });
  $("#textcolor").kendoColorPicker({
    palette: [
                "#2B5166", "#429867", "#FAB243",
                "#E02130", "#2D959E", "#E4FF9E", "#28457F"
            ],
    tileSize: 32
  });

//gestion des notifications
  var notification = $("#notification").kendoNotification({
    position: {
      pinned: true,
      top: 400,
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

  $("#toolbar-users").kendoToolBar({
    items: [
      { type: "button", id: "importOrgChartBtn", text: "Import", icon:"download", enable:false },
      { type: "button", id: "exportOrgChartBtn", text: "Export", icon:"upload" , enable:false},
      { type: "button", id: "editOrgChartBtn", text: "Edit" , icon:"edit", togglable: true},
      { type: "button", id: "saveOrgChartBtn", text: "Save", icon:"save", hidden:true },
      { type: "button", id: "cancelOrgChartBtn", text: "Cancel", icon:"close", hidden:true }
    ],
    toggle:function(e){

      if (e.checked){
        e.sender.show($("#saveOrgChartBtn"));
        e.sender.show($("#cancelOrgChartBtn"));
        editMenu={
          tools: [{
            type: "button",
            template: "<a href='#' class='btn' onclick='addChild();'><span class='glyphicon glyphicon-plus'></span>&nbsp;</a></span>",

          }, {
            type: "button",
            template: "<a href='#' class='btn' onclick='editElement();' ><span class='glyphicon glyphicon-pencil'></span>&nbsp;</a></span>",
          },
            {
              type: "button",
              template: "<a href='#' class='btn'onclick='deleteElement();'><span class='glyphicon glyphicon-remove'></span>&nbsp;</a></span>",

            },
          ]
        };

      } else {
        editMenu=false;
        e.sender.hide($("#saveOrgChartBtn"));
        e.sender.hide($("#cancelOrgChartBtn"));
      }

      $("#diagram").getKendoDiagram().options.shapeDefaults.editable=editMenu;
      $("#diagram").getKendoDiagram().refresh();
    },
    click: function(e) {

      if (e.id == "cancelOrgChartBtn") {
        modeObservable.set("editMode", false);
        teamObject.Read().done(function(){
          e.sender.toggle("#editOrgChartBtn", false);
          e.sender.hide("#saveOrgChartBtn");
          e.sender.hide("#cancelOrgChartBtn");

        });
      } else if (e.id == "saveOrgChartBtn") {
        teamObject.Create().done(function(){
          e.sender.toggle("#editOrgChartBtn", false);
          e.sender.hide("#saveOrgChartBtn");
          e.sender.hide("#cancelOrgChartBtn");
          $("#notification").data("kendoNotification").show({
            message: "Savaed"
          }, "success");
        });
      }
      editMenu=false;
      $("#diagram").getKendoDiagram().options.shapeDefaults.editable=editMenu;
      $("#diagram").getKendoDiagram().refresh();
      // call edit mode service
    }
  });


}
function createDiagram() {
  $("#diagram").kendoDiagram({
    dataSource: teamObject.GetUsersDataSource(),
    connectionsDataSource: teamObject.GetHierarchysDataSource(),
  zoomMin: 0.3,
    layout: {
      type: "tree"
    },
    editable: {tools: [

      {
        type: "button",
        text: "1:1",
        click: function() {
          var diagram = $("#diagram").getKendoDiagram();
          diagram.zoom(zoomLevel);
          diagram.bringIntoView(diagram.shapes);

        }
      },
    ]},
    select: onSelectShape,
    shapeDefaults: {
      visual: visualTemplate,
      editable: editMenu
    },
    connectionDefaults: {
      stroke: {
        color: "#d7d7d7",
        width: 1
      },
      editable: false,

    },
    dataBound: function (e) {
      var that = this;
      setTimeout(function () {
        that.bringIntoView(that.shapes);

      }, 0);
      var diagram = $("#diagram").getKendoDiagram();
      zoomLevel= diagram.zoom();
    },
  });
  var diagram = $("#diagram").getKendoDiagram();
  diagram.bringIntoView(diagram.shapes);
  diagram.scroller.enabled = true;
  zoomLevel= diagram.zoom();
}








