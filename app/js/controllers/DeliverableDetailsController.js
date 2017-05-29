var deliverableDetailsVM;
var selectedSectionId;
var commentId;
var attachmentId;

var addComment;
var openAddSectionDialog;
var syncComments;


addComment = function (e) {

    if (window.getSelection) {
      var range = $("#text-container").context.getSelection("#text-container").getRangeAt(0);//window.getSelection().getRangeAt(0);
        var selectionContents = range.extractContents();

        kendo.prompt("Please, enter your comment").then(function (comment) {

            var uuid = generateUUID();
            var span = document.createElement("span");

            $(span).attr('data-uuid', uuid);

            $(span).bind('click', function (e) {

                var comments = $("#comments-table").data('kendoGrid').dataSource.data();

                var uuid = this.getAttribute('data-uuid');
                for (var i = 0; i < comments.length; i++) {
                    if (comments[i].uuid == uuid) {
                        commentNotification.hide();
                        var state = "warning";
                        if (comments[i].resolution) {
                            state = "success";
                        }
                        commentNotification.show("<div class='notification-text'>" + comments[i].value + "</div>", state);

                    }
                }

            });

            span.className = "comment-element";

            span.appendChild(selectionContents);
            range.insertNode(span);
            editor.setData($("#text-container").html());
            syncComments();

          $("#comments-table").data('kendoGrid').dataSource.add({ value: comment, resolution: false, uuid: uuid });
            $("#comments-table").data('kendoGrid').dataSource.sync();
        }, function () {
          $("#text-container").html(editor.getData());
        });
    }
}


openAddSectionDialog = function openAddSectionDialog(e) {
    deliverableDetailsVM.set('showAddNewSectionDialog', true);
}



$(document).ready(function () {
    var sectionDataModel = null;
    var deliverableObject = app.selectedDeliverable;

  var newItem =  -1;

    var sectionsData = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return WS_BASE_URL + "deliverable/" + deliverableObject.GetId() + "/deliverableSections";
                },
                beforeSend: function (req) {
                    var auth = getCurrentAuthentificationBase64();
                    if (auth != null) {
                        req.setRequestHeader('Authorization', "Basic " + auth);

                    }
                }
            },
            update: {
                url: function () {
                    return WS_BASE_URL + 'section/' + selectedSectionId
                },
                type: 'PATCH',
                contentType: "application/json",
                beforeSend: function (req) {
                    var auth = getCurrentAuthentificationBase64();
                    if (auth != null) {
                        req.setRequestHeader('Authorization', "Basic " + auth);

                    }
                }
            },
            create: {
                url: function () {
                    return WS_BASE_URL + 'deliverablesection'
                },
                type: 'POST',
                contentType: "application/json",
                beforeSend: function (req) {
                    var auth = getCurrentAuthentificationBase64();
                    if (auth != null) {
                        req.setRequestHeader('Authorization', "Basic " + auth);

                    }
                }
            },
            parameterMap: function (data, operation) {

                if (operation === "create") {

                    var model = {
                        rank: 1,
                        organisation: WS_BASE_URL + 'organization/' + getUserInformationBase64().organizationId,
                        project: WS_BASE_URL + "project/" + getProjectInformationBase64().id,
                        deliverable: WS_BASE_URL + "odeliverable/" + deliverableObject.GetId(),
                        section: WS_BASE_URL + "section/" + data.id
                    };

                    return kendo.stringify(model);
                }

                if (operation === 'update') {

                    var model = {
                        name: data.name,
                        content: data.content,
                    };

                    return kendo.stringify(model);
                }

                return data;
            }
        },
        schema: {
            data: "_embedded.deliverablesection",
            model: {
                id: 'id'
            }
        },

    });

    var userCanEdit = app.user.hasDSSRole || app.user.hasRARole;

    // TODO: change between view and edit mode should be done without code with toggleable button to be updated
    deliverableDetailsVM = kendo.observable({
        isViewMode: true,
        isDeliverableEditable: deliverableObject.GetStatus().editable,
        userAvatar: function (){
          var currentUserInformation = getUserInformationBase64();
          if ('userAvatar' in currentUserInformation) {
            return currentUserInformation.userAvatar;
          }
        },
        isEditMode: function () {
            return !this.get('isViewMode');
        },
        editDetails: function (e) {
            editor.setData($("#text-container").html());
            this.set('isViewMode', false);
        },
        saveDetails: function () {
            var content = editor.getData();
            $("#text-container").html(content);
            var sectionId = selectedSectionId;

            var section = null;
            var sections = sectionsData.data();

            $.each(sections, function (index, item) {
                if (item.id == sectionId) {
                    section = item;
                }
            });

            if (section) {
                section.set('content', content);
                sectionsData.sync();
            }

        },
        cancelDetails: function () {
            editor.setData($("#text-container").html());
        },
        isEditable: function () {

            return this.get('isViewMode') && userCanEdit
        },
        isCommentable: function () {
            // To be removed later only for testing
            return this.get('isViewMode') || deliverableObject.GetStatus().commentable;
            //return this.get('isViewMode') && deliverableObject.GetStatus().commentable;
        },

        viewDetails: function (e) {
            $("#text-container").html(editor.getData());
            this.set('isViewMode', true);
        },
        attachmentsTitle: 'Attachments',
        addSectionHelpText: 'Please use the autocomlete to choose section or create new one.',
        addComment: addComment,
        openAddSectionDialog: openAddSectionDialog,
        closeAddSectionDialog: function () {
           $('#sectionAutoComplete').data("kendoAutoComplete").value("");
            deliverableDetailsVM.set('showAddNewSectionDialog', false);
        },
        addNewSection: function () {
            var sectionName = this.get('newSection');
            var section = null;
            var sections = sectionsData.data();

            $.each(sections, function (index, item) {
                if (item.name == sectionName) {
                    section = item;
                }
            });

            if (section) {
                sectionsData.add(section);
            }
            else {
                new kendo.data.DataSource({
                    transport: {
                        create: {
                            url: function () {
                                return WS_BASE_URL + 'section'
                            },
                            type: 'POST',
                            contentType: "application/json",
                            beforeSend: function (req) {
                                var auth = getCurrentAuthentificationBase64();
                                if (auth != null) {
                                    req.setRequestHeader('Authorization', "Basic " + auth);

                                }
                            }
                        },
                        parameterMap: function (data, operation) {
                            if (operation === "create") {

                                var model = {
                                    name: data.name,
                                    content: "",
                                    privatesection: false,
                                    organisation: WS_BASE_URL + 'organization/' + getUserInformationBase64().organizationId,
                                    project: WS_BASE_URL + "project/" + getProjectInformationBase64().id
                                };

                                return kendo.stringify(model);
                            }
                            return data;
                        }
                    },
                    schema: {
                        model: {
                            id: 'id'
                        }
                    },
                    change: function (data) {
                        if (data != undefined && data.length > 0)
                            sectionsData.add(data[0]);
                    }
                });
            }
            alert('Add section: ' + section);
            $('#sectionAutoComplete').data("kendoAutoComplete").value("");
            deliverableDetailsVM.set('showAddNewSectionDialog', false);
        },
        deliverableSections: new kendo.data.DataSource({
            transport: {
                read: {
                    url: function () {
                        return WS_BASE_URL + "project/" + getProjectInformationBase64().id + "/sections";
                    },
                    beforeSend: function (req) {
                        var auth = getCurrentAuthentificationBase64();
                        if (auth != null) {
                            req.setRequestHeader('Authorization', "Basic " + auth);
                        }
                    }
                }
            },
            schema: {
                data: "_embedded.section"
            },
            filter: { field: "privatesection", operator: "eq", value: false }
        })
    });

    // Show the add comment button only if Setction.Commentable == true;
    // Show the edit button only if the user has the roles and status.editable == true



    var grid = $("#sections-list").kendoGrid({
        toolbar: [{
            template: `<button 
                                    data-role='button' 
                                    data-icon='plus' 
                                    data-bind='visible: isEditMode, events { click: openAddSectionDialog }'>
                                    ADD
                                    </button>` }],
        dataSource: sectionsData,
        selectable: true,
        scrollable: false,
        editable: "popup",
        height: "300px",
        columns: [
            {
                field: "id",// create a column bound to the "name" field
                title: "Table of content" // set its title to "Name"
            },
            "rank"
        ],
        dataBound: function () {
            this.select("tr:eq(1)");

            if(newItem != -1){
              selectNewDeliverable(newItem)
            }
        },
        change: function (e) {
            var selectedItem = grid.dataItem(grid.select());

            var sectionDetails = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function () {
                            return WS_BASE_URL + "deliverablesection/" + selectedItem.id + "/section"
                        },
                        beforeSend: function (req) {
                            var auth = getCurrentAuthentificationBase64();
                            if (auth != null) {
                                req.setRequestHeader('Authorization', "Basic " + auth);

                            }
                        }
                    }
                },
                schema: {
                    parse: function (data) {
                        return [data];
                    }
                }
            });

            sectionDetails.fetch(function () {
                var details = this.data()[0];

                selectedSectionId = details.id;

                deliverableDetailsVM.set('sectionCommentable', true);

                $("#text-container").html(details.content);
                editor.setData(details.content);

                setAttachmentsButtons();
                $("#comments-table").data('kendoGrid').dataSource.read();
                $("#impact-analysis-table").data('kendoGrid').dataSource.read();
                $("#revisions-table").data('kendoGrid').dataSource.read();
                $("#attachments-list").data('kendoListView').dataSource.read();
            });
        }
    }).data('kendoGrid');

    grid.table.kendoSortable({
        filter: ">tbody >tr",
        hint: $.noop,
        cursor: "move",
        placeholder: function (element) {
            return element.clone().addClass("k-state-hover").css("opacity", 0.65);
        },
        container: "#sections-list tbody",
        change: function (e) {
            var skip = grid.dataSource.skip(),
                oldIndex = e.oldIndex + skip,
                newIndex = e.newIndex + skip,
                data = grid.dataSource.data(),
                dataItem = grid.dataSource.getByUid(e.item.data("uid"));

            grid.dataSource.remove(dataItem);
            grid.dataSource.insert(newIndex, dataItem);
        }
    });



    $("#attachments-list").kendoListView({
        autoBind: false,
        dataSource: {
            transport: {
                read: {
                    url: function () {
                        return WS_BASE_URL + "section/" + selectedSectionId + "/files";
                    },
                    beforeSend: function (req) {
                        var auth = getCurrentAuthentificationBase64();
                        if (auth != null) {
                            req.setRequestHeader('Authorization', "Basic " + auth);

                        }
                    }
                },
                update: {
                    url: function () {
                        return WS_BASE_URL + 'file/' + attachmentId
                    },
                    type: 'PATCH',
                    contentType: "application/json",
                    beforeSend: function (req) {
                        var auth = getCurrentAuthentificationBase64();
                        if (auth != null) {
                            req.setRequestHeader('Authorization', "Basic " + auth);

                        }
                    }
                },
                create: {
                    url: function () {
                        return WS_BASE_URL + 'file'
                    },
                    type: 'POST',
                    contentType: "application/json",
                    beforeSend: function (req) {
                        var auth = getCurrentAuthentificationBase64();
                        if (auth != null) {
                            req.setRequestHeader('Authorization', "Basic " + auth);

                        }
                    }
                },
                parameterMap: function (data, operation) {
                    if (operation === "create") {

                        var model = {
                            name: data.name,
                            extension: data.extension,
                            creationDate: data.creationDate,
                            uploadDate: data.uploadDate,
                            size: data.size,
                            organisation: WS_BASE_URL + 'organization/' + getUserInformationBase64().organizationId,
                            section: WS_BASE_URL + 'section/' + selectedSectionId,
                            project: WS_BASE_URL + "project/" + getProjectInformationBase64().id,
                            path: 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf'
                        };

                        return kendo.stringify(model);
                    }

                    if (operation === 'update') {

                        var model = {
                            name: data.name
                        };

                        return kendo.stringify(model);
                    }

                    return data;
                }
            },
            schema: {
                data: "_embedded.file",
                model: {
                    id: 'id'
                },

            }
        },
        template: kendo.template($("#attachments-template").html()),
        dataBound: function () {
            setAttachmentsButtons();
        }
    })

    $("#details-tabstrip").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });

    $("#files").kendoUpload({
        async: {
            saveUrl: "save",
            removeUrl: "remove",
            autoUpload: false
        },
        validation: {
            allowedExtensions: [".png", ".bmp", ".gif"]
        },
        select: onSelect,
        showFileList: false,
        dropZone: ".dropZoneElement"
    });

    function onSelect(e) {

        var type = e.files[0].rawFile.type;
        if (true || e.operation == "upload") {
            if (e.files.length > 0) {
                var file = e.files[0];

                if (file) {
                    var name = file.name.substr(0, file.name.lastIndexOf('.'));
                    var extension = file.name.substr(file.name.lastIndexOf('.') + 1, file.name.length);
                    var date = new Date(file.rawFile.lastModified);
                    var size = file.size;

                    var newAttachment = {
                        icon: getFileType(extension),
                        name: name,
                        extension: extension,
                        size: size,
                        creationDate: date,
                        uploadDate: new Date(),
                    };

                    $("#attachments-list").data('kendoListView').dataSource.add(newAttachment);
                    $("#attachments-list").data('kendoListView').dataSource.sync();
                    setAttachmentsButtons();
                }
            }
        }
    }



  syncComments = function syncComments(){
    var content = $("#text-container").html();
    var sectionId = selectedSectionId;

    var section = null;
    var sections = sectionsData.data();

    $.each(sections, function (index, item) {
      if (item.id == sectionId) {
        section = item;
      }
    });
    if (section) {
      newItem = section;
      section.set('content', content);
      sectionsData.sync();
    }
  };

  function selectNewDeliverable(newItem) {
    var grid = $("#sections-list").data("kendoGrid");
    grid.select("tr[data-uid='" + newItem.uid + "']");
  }


    function setAttachmentsButtons() {
        $(".attachment-button.open").kendoButton({
            click: function (e) {
                var item = getSelectedAtachment(e);
                window.open("http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf", "_blank")
            }
        });

        $(".attachment-button.edit").kendoButton({
            click: function (e) {
                var item = getSelectedAtachment(e);
                kendo.prompt("Edit attachment name:", item.name).then(function (name) {
                    attachmentId = item.id;

                    item.set('name', name);
                    $("#attachments-list").data('kendoListView').dataSource.sync();
                    //$("#attachments-list").data('kendoListView').refresh();
                    // setAttachmentsButtons();
                });
            }
        });

        $(".attachment-button.delete").kendoButton({
            click: function (e) {
                var item = getSelectedAtachment(e);

                kendo.confirm("Are you sure that you want to delete the attachment?").then(function () {

                    $("#attachments-list").data('kendoListView').dataSource.remove(item);
                });
            }
        });

        kendo.bind('body', deliverableDetailsVM);
    }

    setAttachmentsButtons();



    $("#comments-table").kendoGrid({
        autoBind: false,
        dataSource: {
            transport: {
                read: {
                    url: function () {
                        return WS_BASE_URL + "section/" + selectedSectionId + "/comments";
                    },
                    beforeSend: function (req) {
                        var auth = getCurrentAuthentificationBase64();
                        if (auth != null) {
                            req.setRequestHeader('Authorization', "Basic " + auth);

                        }
                    }
                },
                create: {
                    url: function () {
                        return WS_BASE_URL + "comment";
                    },
                    type: 'POST',
                    contentType: "application/json",
                    beforeSend: function (req) {
                        var auth = getCurrentAuthentificationBase64();
                        if (auth != null) {
                            req.setRequestHeader('Authorization', "Basic " + auth);

                        }
                    }
                },
                update: {
                    url: function () {
                        return WS_BASE_URL + "comment/" + commentId;
                    },
                    type: 'PATCH',
                    contentType: "application/json",
                    beforeSend: function (req) {
                        var auth = getCurrentAuthentificationBase64();
                        if (auth != null) {
                            req.setRequestHeader('Authorization', "Basic " + auth);

                        }
                    }
                },
                parameterMap: function (data, operation) {
                    if (operation === "create") {

                        var model = {
                            organisation: WS_BASE_URL + 'organization/' + getUserInformationBase64().organizationId,
                            project: WS_BASE_URL + "project/" + getProjectInformationBase64().id,
                            user: WS_BASE_URL + 'user/' + getUserInformationBase64().userId,
                            section: WS_BASE_URL + 'section/' + selectedSectionId,
                            value: data.value,
                            resolution: data.resolution
                        };

                        return kendo.stringify(model);
                    }

                    if (operation === 'update') {

                        var model = {
                            resolution: data.resolution
                        };

                        return kendo.stringify(model);
                    }

                    return data;
                }
            },
            schema: {
                model: {
                    id: 'id'
                },
                data: "_embedded.comment"

            }
        },
        noRecords: true,
        columns: [
            { field: "value", width: "90%", title: "Comment" },
            {
                field: "resolution", title: "Fixed", width: "10%",
                template: '<input type="checkbox" onclick="setItemAsFixed(this)" #= resolution ? "checked=checked" : "" # />'
            }
        ]
    });

    $("#revisions-table").kendoGrid({
        autoBind: false,
        dataSource: {
            transport: {
                read: {
                    url: function () {
                        return WS_BASE_URL + "section/" + selectedSectionId + "/sectionVersions";
                    },
                    beforeSend: function (req) {
                        var auth = getCurrentAuthentificationBase64();
                        if (auth != null) {
                            req.setRequestHeader('Authorization', "Basic " + auth);

                        }
                    }
                }
            },
            schema: {
                data: '_embedded.sectionversion'
            }
        },
        noRecords: true,
        columns: [
            { field: 'content', title: 'Revision Details' }
        ]
    });

    $("#impact-analysis-table").kendoGrid({
        autoBind: false,
        dataSource: {
            transport: {
                read: {
                    url: function () {
                        return WS_BASE_URL + "deliverable/findBySection/" + selectedSectionId;
                    },
                    beforeSend: function (req) {
                        var auth = getCurrentAuthentificationBase64();
                        if (auth != null) {
                            req.setRequestHeader('Authorization', "Basic " + auth);

                        }
                    }
                }
            },
        },
        columns: [
            { field: 'name', title: 'Name' },
            { field: 'currentPhaseName', title: 'Phase' },
            { field: 'currentVersion', title: 'Version' },
            { field: 'responsible', title: 'Responsible' }
        ]
    });

    $("#variables-table").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: WS_BASE_URL + "projectvariable",
                    beforeSend: function (req) {
                        var auth = getCurrentAuthentificationBase64();
                        if (auth != null) {
                            req.setRequestHeader('Authorization', "Basic " + auth);

                        }
                    }
                }
            },
            schema: {
                data: "_embedded.projectvariable"

            }
        },
        columns: [
            { field: 'name', title: "Name" },
            { field: 'value', title: 'Value' }
        ]
    });

    $("#logs-table").kendoGrid({
        dataSource: {
            data: [
                { logs: "Log 1", description: "Description of Log 1" },
                { logs: "Log 2", description: "Description of Log 2" },
                { logs: "Log 3", description: "Description of Log 3" },
                { logs: "Log 4", description: "Description of Log 4" }]
        },
        columns: [
            { title: "Logs", field: "logs", width: "30%" },
            { title: "Log Description", field: "description", width: "70%" }
        ]
    });

    deliverableDetailsVM.set('users', new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return WS_BASE_URL + 'user/search/organisation/' + getUserInformationBase64().organizationId;
                },
                beforeSend: function (req) {
                    var auth = getCurrentAuthentificationBase64();
                    if (auth != null) {
                        req.setRequestHeader('Authorization', "Basic " + auth);

                    }
                }
            }
        }
    }));

    deliverableDetailsVM.set('usersBound', function (e) {
        e.sender.select(0);
    });

    deliverableDetailsVM.set('addContributor', function (e) {
        var contributorId = $("#users-list").data('kendoDropDownList').value();
        var contributor;
        var contributors = $("#users-list").data('kendoDropDownList').dataSource.data();

        $.each(contributors, function (index, item) {
            if (item.id == contributorId) {
                contributor = item;
            }
        });

        if (contributor !== undefined) {
            $("#contributors-table").data('kendoGrid').dataSource.add(contributor);
            $("#users-list").data('kendoDropDownList').dataSource.remove(contributor);
        }
    });

    $("#contributors-table").kendoGrid({
        toolbar: [
            {
                template: `<input data-role='dropdownlist' id='users-list'
                data-bind='source: users, events: { dataBound: usersBound }'
                data-template='users-template' data-value-template='users-template'
                data-value-field='id' data-text-field='firstname'
                data-value-primitive='true' />` },
            {
                template: `<button data-role='button'
                data-bind='click: addContributor'>Add Contributor</button>` },
        ],
        columns: [
            { template: $("#users-template").html() }]
    });

    function getSelectedAtachment(e) {
        var itemUid = $($(e.sender.element).closest(".attachment-item")[0]).attr('data-uid');
        var items = $("#attachments-list").data('kendoListView').dataSource;

        return items.getByUid(itemUid);
    }

    kendo.bind('body', deliverableDetailsVM);
});

var commentNotification = $("#comment-notificaiton").kendoNotification({
    appendTo: ".notifications-container",
    width: "150px"
}).data("kendoNotification");

function setItemAsFixed(e) {
    var item = $("#comments-table").data('kendoGrid').dataItem($(e).closest('tr'));
    item.resolution = $(e).is(":checked");
    item.dirty = true;
    commentId = item.id;
    $("#comments-table").data('kendoGrid').dataSource.sync();
}

function generateUUID() {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function getFileType(type) {

    switch (type) {
        case "pdf":
            return "https://cdn0.iconfinder.com/data/icons/document-file-types/512/pdf-512.png";
        case "jpeg":
        case "png":
        case "jpg":
            return "https://cdn0.iconfinder.com/data/icons/document-file-types/512/jpg-512.png";
        case "xls":
        case "xlsx":
            return "https://cdn0.iconfinder.com/data/icons/document-file-types/512/xls-512.png";
        case "doc":
        case "docx":
            return "https://cdn0.iconfinder.com/data/icons/document-file-types/512/doc-512.png";
        default:
            return "https://cdn3.iconfinder.com/data/icons/brands-applications/512/File-512.png";
    }
}
