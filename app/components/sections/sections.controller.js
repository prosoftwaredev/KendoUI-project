var app = app || {};

(function () {


    app.user = app.user || getUserInformationBase64();

    app.project = app.user || getProjectInformationBase64();

    app.sectionsController = function (vm) {

        setSKEditor();

        var addComment = addCommentFunction;

        app.commentNotification = $("#comment-notificaiton").kendoNotification({
            appendTo: ".notifications-container",
            width: "150px"
        }).data("kendoNotification");

        var setTranslations = function setTranslations(translations) {
            vm.set('headerTitle', translations.titles.header);
            vm.set('deliverablesList', translations.titles.headerDetails);
            vm.set('headerLink', translations.titles.link);
            vm.set('headerDetails', translations.titles.details);
            vm.set('editButton', translations.buttons.edit);
            vm.set('addCommentButton', translations.buttons.addComment);
            vm.set('viewButton', translations.buttons.view);
            vm.set('saveButton', translations.buttons.save);
            vm.set('discardButton', translations.buttons.discard);
            vm.set('attachments', translations.content.attachments);
            vm.set('comments', translations.content.comments);
            vm.set('revisions', translations.content.revisions);
            vm.set('impactAnalysis', translations.content.impactAnalysis);
            vm.set('variables', translations.content.variables);
            vm.set('logs', translations.content.logs);
            vm.set('contributors', translations.content.contributors);
            vm.set('dropFile', translations.content.dropFile);
            vm.set('addFile', translations.buttons.addFile);
            vm.set('addSection', translations.buttons.addSection);
            vm.set('editSection', translations.buttons.editSection);
            vm.set('closeWindow', translations.buttons.closeWindow);
            vm.set('open', translations.buttons.open);
            vm.set('edit', translations.buttons.edit);
            vm.set('delete', translations.buttons.delete);
            vm.set('addSectionHelpText', translations.helpLine3);

        }

        var language = getLanguage();

        var languageFile = "../../translations/deliverable/" + language + ".json";

        $.getJSON(languageFile, function (json) {

            translations = json;
            setTranslations(translations);

        });

        function getLanguage() {
            return "en-US";
        }

        //app.sectionsHelper = new app.sectionsHelper();

        var newItem = -1;

        var deliverableSections = app.listOfSections;

        var userCanEdit = true;

        if (app.user) {
            var userCanEdit = app.user.hasDSSRole || app.user.hasRARole;
        }

        var grid = $("#sections-list").kendoGrid({
            toolbar: [{
                template: `<button 
                                    data-role='button' 
                                    data-icon='plus' 
                                    data-bind='visible: isEditMode, events { click: openAddSectionDialog }'>
                                    ADD
                                    </button>` }],
            dataSource: deliverableSections,
            selectable: true,
            scrollable: false,
            editable: "popup",
            height: "300px",
            columns: [
                {
                    field: 'sectionObject.name',
                    title: "Name"
                },
                {
                    command: [{
                        template: `<button 
                                    data-role='button' 
                                    data-icon='pencil' 
                                    data-bind='visible: isEditMode, events { click: openEditDialog }'>
                                    EDIT
                                    </button>` }, 'destroy'], width: '250px'
                }
            ],
            dataBound: function () {

                if (newItem != -1) {

                    selectNewDeliverable(newItem)
                }
                else {
                    this.select("tr:eq(1)");
                }
            },
            change: function (e) {

                app.commentNotification.hide();

                var seletedSection = grid.dataItem(grid.select());

                if (seletedSection.id != "" && (app.selectedSection == null || seletedSection.sectionObject.id != app.selectedSection.id)) {

                    app.selectedSection = seletedSection.sectionObject;

                    vm.set('sectionCommentable', true);

                    $("#text-container").html(app.selectedSection.content);

                    bindComments();
                    app.editor.setData(app.selectedSection.content);

                    setAttachmentsButtons();
                    $("#comments-table").data('kendoGrid').dataSource.read();
                    $("#impact-analysis-table").data('kendoGrid').dataSource.read();
                    $("#revisions-table").data('kendoGrid').dataSource.read();
                    attachmentsTable.dataSource.read();
                }
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

                grid.dataSource.pushDestroy(dataItem);
                grid.dataSource.insert(newIndex, dataItem);
  
                $.each(grid.dataSource.data(), function (index, item) {

                    item.set('rank', index + 1);
                });
                grid.dataSource.sync();


            }
        });

        // TODO: change between view and edit mode should be done without code with toggleable button to be updated
        vm.set('userAvatar', function () {
            var currentUserInformation = getUserInformationBase64();
            if ('userAvatar' in currentUserInformation) {
                return currentUserInformation.userAvatar;
            }
        });

        $("#sections-list").data('kendoGrid').hideColumn(1);
        vm.set('isViewMode', true);
        vm.set('isDeliverableEditable', function () {
            if (app.selectedDeliverable.status)
                return app.selectedDeliverable.status.editable;
            else
                return true;
        });

        vm.set('isEditMode', function () {
            return !this.get('isViewMode');
        });
        vm.set('editDetails', function (e) {
            app.editor.setData($("#text-container").html());
            $("#sections-list").data('kendoGrid').showColumn(1);
            this.set('isViewMode', false);
        });
        vm.set('saveDetails', function () {

            var content = app.editor.getData();
            $("#text-container").html(content);

            persistContent(content);

            $("#sections-list").data('kendoGrid').hideColumn(1);
            vm.set('isViewMode', true);

        });
        vm.set('cancelDetails', function () {
            app.editor.setData($("#text-container").html());
        });
        vm.set('isEditable', function () {
            return this.get('isViewMode') && userCanEdit
        });
        vm.set('isCommentable', function () {
            // To be removed later only for testing
            if (app.selectedDeliverable && app.selectedDeliverable.status)
                return this.get('isViewMode') || app.selectedDeliverable.status.commentable;
            //return this.get('isViewMode') && app.selectedDeliverable.status.commentable;
            else
                return this.get('isViewMode');
        });

        vm.set('viewDetails', function (e) {
            $("#text-container").html(app.editor.getData());
            $("#sections-list").data('kendoGrid').hideColumn(1);
            this.set('isViewMode', true);

            bindComments();

        });
        vm.set('addComment', addComment);
        vm.set('openAddSectionDialog', function (e) {
            vm.set('showAddNewSectionDialog', true);
        });
        vm.set('closeAddSectionDialog', function () {
            vm.set('showAddNewSectionDialog', false);
            $('#sectionAutoComplete').data("kendoAutoComplete").value("");
        });
        vm.set('openEditDialog', function (e) {
            var dataItem = $("#sections-list").data('kendoGrid').dataItem($(e.sender.element).closest('tr')).sectionObject;
            vm.set('sectionTitle', dataItem.name);
            vm.set('editedSectionId', dataItem.id);
            vm.set('showEditSectionDialog', true);
        });
        vm.set('closeEditDialog', function () {
            vm.set('showEditSectionDialog', false);
        });
        vm.set('editSectionFunction', function () {
            var newTitle = vm.get('sectionTitle');
            var sectionId = vm.get('editedSectionId');
            persistTitle(sectionId, newTitle);
            vm.set('showEditSectionDialog', false);
            $.each($("#sections-list").data('kendoGrid').dataSource.data(), function (index, item) {

                if (item.sectionObject.id == sectionId) {
                    item.set('sectionObject.name', newTitle);
                }
            });
        });
        vm.set('addNewSection', function () {
            var sectionName = this.get('newSection');
            var section = null;
            var sections = app.projectSections.data();

            $.each(sections, function (index, item) {
                if (item.name == sectionName) {
                    section = {
                        sectionId: item.id,
                        sectionObject: {
                            name: sectionName
                        }
                    };
                }
            });
            // If the section
            if (section) {
                deliverableSections.add(section);
                deliverableSections.sync();
            }
            else {
                app.createSectionList.one("change", function (data) {
                    if (data != undefined && data.items.length > 0)
                        section = {
                            sectionId: data.items[0].id,
                            rank: deliverableSections.data().length + 1,
                            sectionObject: {
                                name: sectionName
                            }
                        };
                    deliverableSections.add(section);
                    deliverableSections.sync();
                });
                app.createSectionList.add({ name: sectionName });
            }
            vm.set('showAddNewSectionDialog', false);
            $("#section-notification").data("kendoNotification").success('Section Added Successfully.');
            $('#sectionAutoComplete').data("kendoAutoComplete").value("");

        });
        vm.set('projectSections', app.projectSections);


        // Show the add comment button only if Setction.Commentable == true;
        // Show the edit button only if the user has the roles and status.editable == true

        var attachmentsTable = $("#attachments-list").kendoListView({
            autoBind: false,
            dataSource: app.attachmentsModel,
            template: kendo.template($("#attachments-template").html()),
            dataBound: function () {
                setAttachmentsButtons();
            }
        }).data('kendoListView');

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
                allowedExtensions: [".png", ".bmp", ".gif", 'xlsx', 'xls', 'doc', 'docx']
            },
            select: onFileUpload,
            showFileList: false,
            dropZone: ".dropZoneElement"
        });

        function onFileUpload(e) {

            var type = e.files[0].rawFile.type;
            if (true || e.operation == "upload") {
                if (e.files.length > 0) {
                    var file = e.files[0];

                    if (file) {
                        var name = file.name.substr(0, file.name.lastIndexOf('.'));
                        var extension = file.name.substr(file.name.lastIndexOf('.') + 1, file.name.length);
                        var creationDate = new Date(file.rawFile.lastModified);
                        var uploadDate = new Date();
                        var size = file.size;

                        var newAttachment = {
                            icon: getFileType(extension),
                            name: name,
                            extension: extension,
                            size: size,
                            creationDate: creationDate,
                            uploadDate: uploadDate,
                        };

                        attachmentsTable.dataSource.add(newAttachment);
                        attachmentsTable.dataSource.sync();
                        setAttachmentsButtons();
                    }
                }
            }
        }

        function selectNewDeliverable(newItem) {
            var element = $("#sections-list");
            var grid = element.data("kendoGrid");
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
                        app.selectedAttachment = item;

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
                    app.selectedAttachmentId = item.id;

                    kendo.confirm("Are you sure that you want to delete the attachment?").then(function () {

                        app.attachmentsModel.remove(item);
                        app.attachmentsModel.sync();
                        app.selectedAttachment = null;
                    });
                }
            });

            kendo.bind('body', vm);
        }

        setAttachmentsButtons();



        $("#comments-table").kendoGrid({
            autoBind: false,
            dataSource: app.commentsModel,
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
            dataSource: app.revisionsModel,
            noRecords: true,
            columns: [
                { field: 'content', title: 'Revision Details' }
            ]
        });

        $("#impact-analysis-table").kendoGrid({
            autoBind: false,
            dataSource: app.impactAnalysis,
            columns: [
                { field: 'name', title: 'Name' },
                { field: 'currentPhaseName', title: 'Phase' },
                { field: 'currentVersion', title: 'Version' },
                { field: 'responsible', title: 'Responsible' }
            ]
        });

        $("#variables-table").kendoGrid({
            dataSource: app.variablesModel,
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

        vm.set('users', new kendo.data.DataSource({
            transport: {
                read: {
                    url: function () {
                        return WS_BASE_URL + 'user/search/organisation/' + app.user.organizationId;
                    },
                    beforeSend: app.setRequestHeader
                }
            }
        }));

        vm.set('usersBound', function (e) {
            e.sender.select(0);
        });

        vm.set('addContributor', function (e) {
            var contributorId = $("#users-list").data('kendoDropDownList').value();
            var contributor;
            var contributors = $("#users-list").data('kendoDropDownList').dataSource.data();

            $.each(contributors, function (index, item) {
                if (item.id == contributorId) {
                    contributor = item;
                }
            });

            if (contributor !== undefined && $("#users-list").data('kendoDropDownList')._data().length > 0) {
                var lastContributor = {};

                $("#contributors-table").data('kendoGrid').dataSource.add(contributor);
                $("#users-list").data('kendoDropDownList').dataSource.remove(contributor);


                if ($("#users-list").data('kendoDropDownList').dataSource._data.length == 0) {
                    Object.assign(lastContributor, contributor);
                    lastContributor.firstname = 'No data';
                    lastContributor.name = '';
                    lastContributor.avatar = '';

                    $("#users-list").data('kendoDropDownList').dataSource.add(lastContributor);
                    $("#users-list").data("kendoDropDownList").enable(false);
                    $("#addContributor").data("kendoButton").enable(false);
                }
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
                    template: `<button data-role='button' id="addContributor"
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



        kendo.bind('body', vm);
    }

    function setSKEditor() {

        CKEDITOR.dtd.$removeEmpty.i = 0;
        CKEDITOR.dtd.$removeEmpty.span = 0;
        $('#editor-container').append('<textarea id="editor"></textarea>');
        app.editor = CKEDITOR.replace('editor', {
            removeButtons: 'Source,Flash,Iframe,Templates',
            skin: 'office2013',
            allowedContent: true,
            extraPlugins: 'bgimage,floating-tools,allowsave,notification,autoembed,autocorrect,chart,footnotes,docprops,leaflet,numericinput,quicktable,xml,texttransform,tabletools,tag,comment,uploadimage,template',
        });

        CKFinder.setupCKEditor(app.editor, '/tcon/ckfinder/');
    }


    function addCommentFunction(e) {

        if (window.getSelection) {
            var range = $("#text-container").context.getSelection("#text-container").getRangeAt(0);//window.getSelection().getRangeAt(0);
            var selectionContents = range.extractContents();

            kendo.prompt("Please, enter your comment").then(function (comment) {

                var uuid = generateUUID();
                var span = document.createElement("span");

                $(span).attr('data-uuid', uuid);

                span.className = "comment-element";

                span.appendChild(selectionContents);
                range.insertNode(span);

                bindComments();

                app.editor.setData($("#text-container").html());

                var content = $("#text-container").html();

                persistContent(content);

                $("#comments-table").data('kendoGrid').dataSource.add({ value: comment, resolution: false, uuid: uuid });

                // $("#comments-table").data('kendoGrid').dataSource.sync();
            }, function () {
                $("#text-container").html(app.editor.getData());
            });
        }
    }


})()


function setItemAsFixed(e) {
    var item = $("#comments-table").data('kendoGrid').dataItem($(e).closest('tr'));
    item.set('resolution', $(e).is(":checked"));
    app.selectedComment = item;
}

function persistContent(content) {
    var options = {
        async: true,
        method: 'PATCH',
        contentType: "application/json",
        url: WS_BASE_URL + 'section/' + app.selectedSection.id,
        data: kendo.stringify({
            content: content
        }),
        headers: {
            "Authorization": "Basic " + getCurrentAuthentificationBase64()
        }
    };
    return $.ajax(options).fail(function (jqXHR, textStatus) {
        if (jqXHR.status == 401) {
            console.log('rank update failed.')
        }
    });
}

function persistTitle(sectionId, title) {
    var options = {
        async: true,
        method: 'PATCH',
        contentType: "application/json",
        url: WS_BASE_URL + 'section/' + sectionId,
        data: kendo.stringify({
            name: title
        }),
        headers: {
            "Authorization": "Basic " + getCurrentAuthentificationBase64()
        }
    };
    return $.ajax(options).fail(function (jqXHR, textStatus) {
        if (jqXHR.status == 401) {
            console.log('rank update failed.')
        }
    });
}

function bindComments() {

    $('.comment-element').off('click').on('click', function (e) {

        var comments = $("#comments-table").data('kendoGrid').dataSource.data();

        var uuid = this.getAttribute('data-uuid');
        for (var i = 0; i < comments.length; i++) {
            if (comments[i].uuid == uuid) {

                app.commentNotification.hide();
                var state = "warning";
                if (comments[i].resolution) {
                    state = "success";
                }
                app.commentNotification.show("<div class='notification-text'>" + comments[i].value + "</div>", state);

            }
        }

    });
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