var app = app || {};

(function () {

    app.projectSections = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return WS_BASE_URL + "project/" + app.project.id + "/sections";
                },
                beforeSend: app.setRequestHeader
            }
        },
        schema: {
            parse: function(data) {
                var result = [];

                $.each(data._embedded.section, function(index, projectSection){

                    var exist = false;

                    $.each(app.listOfSections.data(), function(idx, deliverableSection){

                        if ( deliverableSection.sectionObject.id == projectSection.id ) {
                            exist = true;
                        }

                    });

                    if ( !exist ) {
                        result.push(projectSection);
                    }

                });

                return result;

            },
        },
        filter: { field: "privatesection", operator: "eq", value: false }
    })

})()