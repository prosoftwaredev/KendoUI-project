var app = app || {};

app.deliverableController = function (vm) {

    // To get the organization id call app.user.organizationId
    app.user = getUserInformationBase64();

    app.project = getProjectInformationBase64();

    // Objects

    var sectionsObject = null;
    var translations = null;

    // Functions

    var updateDeliverable;
    var loadViewModelInitials;
    var setTranslations;

    updateDeliverable = function updateDeliverable(e) {

        if (validator.validate()) {
            app.deliverable.one("change", function (e) {

                $.each(app.listOfDeliverables.data(), function (index, item) {

                    if (item.id == vm.get('deliverable').id) {
                        item.set('name', vm.get('deliverable').title);
                        var el = $("#list-deliverables"),
                            grid = el.data("kendoGrid"),
                            row = el.find("tbody>tr[data-uid=" + item.uid + "]");
                        grid.select(row);
                    }
                })
                $("#deliverable-notification").data("kendoNotification").success('Deliverable Updated Successfully.');
            });
            app.deliverable.sync();
            goToViewMode();
        }
        else {
            alert('There are required fields that need your attention.')
        }

    }

    var validator = $('#deliverable-meta-data').kendoValidator({
        rules: {
            datepicker: function (input) {
                if (input.is("[data-role=datepicker]")) {
                    return input.data("kendoDatePicker").value();
                } else {
                    return true;
                }
            }
        },
        messages: {
            datepicker: "Please enter valid date!"
        }
    }).getKendoValidator();

    $("#list-deliverables").kendoGrid({
        toolbar: ['pdf'],
        dataSource: app.listOfDeliverables,
        selectable: true,
        change: selectDeliverable,
        height: '380px',
        scrollable: false,
        filterable: true,
        pageable: {
            numeric: false
        },
        sortable: true,
        columns: [{
            headerAttributes: { style: "display: none" },
            template: '<div class="item"><span>#:name#</span></div>'
        }],
        dataBound: function (e) {
            // Is this really working
            $("#list-deliverables").kendoSortable({
                handler: ".item"
            });
        }
    });

    setTranslations = function setTranslations(translations) {
        vm.set('listOfDeliverablesTitle', translations.titles.list);
        vm.set('deliverableDetailsTitle', translations.titles.help);
        vm.set('helpLine1', translations.helpLine1);
        vm.set('helpLine2', translations.helpLine2);
        vm.set('linkTitle', translations.titles.link);
        vm.set('headerTitle', translations.titles.header);
        vm.set('deliverablesList', translations.titles.headerAdditional);
        vm.set('importButton', translations.buttons.import);
        vm.set('exportButton', translations.buttons.export);
        vm.set('editButton', translations.buttons.edit);
        vm.set('updateButton', translations.buttons.update);
        vm.set('cancelButton', translations.buttons.cancel);
        vm.set('viewDetailsButton', translations.buttons.viewDetails);
        vm.set('title', translations.content.title);
        vm.set('issueDate', translations.content.issueDate);
        vm.set('status', translations.content.status);
        vm.set('type', translations.content.type);
        vm.set('theme', translations.content.theme);
        vm.set('securityClassification', translations.content.securityClassification);
    }

    loadViewModelInitials = function loadViewModelInitials(translations) {

        setTranslations(translations);

        goToHelpMode();

        vm.set('userAvatar', function () {
            var currentUserInformation = getUserInformationBase64();
            if ('userAvatar' in currentUserInformation) {
                return currentUserInformation.userAvatar;
            }
        });

        vm.set('isViewEditMode', function () {
            return this.get('isEditMode') || this.get('isViewMode');
        })
        vm.set('cancelSave', function (e) {
            app.deliverable.cancelChanges();
            vm.set('deliverable', app.deliverable.data()[0]);
            goToViewMode();
        });
        vm.set('editDeliverable', function (e) {
            goToEditMode();
        });
        vm.set('updateDeliverable', updateDeliverable);
        vm.set('navigateToDetails', function () {
            app.navigate('DeliverableSections');
            //loadContentFromURI('deliverableDetails');
        });

        vm.set('themesSource', app.themeModel);
        vm.set('typesSource', app.typeModel);
        vm.set('securityClassificationsSource', app.securityClassificationModel);
    }

    var language = getLanguage();

    var languageFile = "../../translations/deliverable/" + language + ".json";

    $.getJSON(languageFile, function (json) {

        translations = json;
        loadViewModelInitials(translations);

        app.user.hasDSSRole = app.user.role === 'PROGRAM_ROLE' || app.user.role === 'PROJECT_ROLE';

    });


    function getLanguage() {
        return "en-US";
    }

    function selectDeliverable(e) {

        if (this.select().length > 0) {

            var dataItem = this.dataItem(this.select().first());

            app.selectedDeliverableId = dataItem.id;

            app.deliverable.fetch(function () {

                goToViewMode();

                app.selectedDeliverable = this.data()[0];

                if (app.selectedDeliverable.status) {
                    vm.set('statuseSource', app.statusModel);
                }

                vm.set('deliverable', app.selectedDeliverable);

                // This should be changed later it is now here only for testing purposes
                //vm.set('deliverableIsEditable', true);
                vm.set('deliverableIsEditable', function () {
                    return deliverableSetEditableOptions(app.selectedDeliverable) &&
                        vm.get('isViewMode');
                });

                vm.set('issueDateFormatted', function () {
                    return kendo.toString(vm.get('deliverable.issueDate'), 'd');
                });

                createSectionsList(app.selectedDeliverable);



            });

        }
    }

    function deliverableSetEditableOptions(deliverableObject) {

        app.user.hasRARole = false;

        $.each(deliverableObject.raciRoleUsers, function (index, role) {

            if (role.raciRole.name === 'R' || role.raciRole.name === 'A') {

                $.each(role.users, function (ind, user) {

                    if (user.id === app.user.userId) {
                        app.user.hasRARole = true;
                    }

                });
            }
        });

        return true;
        return app.user.hasRARole;

    }

    function createSectionsList(deliverableObject) {

        $("#sections").html("");

        $.each(deliverableObject.sections, function (key, section) {
            var sectionTemplate = kendo.template($("#section-item-template").html());
            $("#sections").append(sectionTemplate(section.section));
        });

    }

    function deliverablesClearSelection() {
        var deliverableListView = $("#list-deliverables").data("kendoListView");
        if (deliverableListView != null) {
            deliverableListView.clearSelection();
        }
    }

    function goToHelpMode() {
        deliverablesClearSelection();
        vm.set('deliverableDetailsTitle', translations.titles.help);

        vm.set('isHelpMode', true);
        vm.set('isEditMode', false);
        vm.set('isViewMode', false);

    }

    function goToViewMode() {
        vm.set('deliverableDetailsTitle', translations.titles.view);

        vm.set('isViewMode', true);
        vm.set('isHelpMode', false);
        vm.set('isEditMode', false);
    }

    function goToEditMode() {
        vm.set('deliverableDetailsTitle', translations.titles.edit);

        vm.set('isEditMode', true);
        vm.set('isHelpMode', false);
        vm.set('isViewMode', false);
    }



}
