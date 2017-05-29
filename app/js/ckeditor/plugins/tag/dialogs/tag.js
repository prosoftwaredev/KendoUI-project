CKEDITOR.dialog.add('tag', function(editor) {
  return {
    title: editor.lang.tag.widgetDialogWindowTitle,
    minWidth: 500,
    minHeight: 100,
    onShow: function(e) {
      try {
        this.selectPage(editor.config.tag.tabId);
        this.getElement().getFirst().removeStyle('z-index');
      } catch(e) {
        console.log(e);
      }
    },
    contents: [
      {
        id: 'tag-person',
        label: editor.lang.tag.tagPersonTabLabel,
        elements: [
          {
            id: 'personname',
            type: 'text',
            label: editor.lang.tag.inputTextPersonNameLabel,
            labelLayout: 'horizontal',
            setup: function(widget) {
              try {
                if('_t' === widget.data.type) {
                  this.setValue(widget.data.personname);
                  this.getInputElement().data('url', widget.data.profileurl);
                  this.getInputElement().data('type', widget.data.type);
                }
              } catch(e) {
                console.log(e);
              }
            },
            commit: function(widget) {
              try {
                if(this.getDialog()._.currentTabId === 'tag-person') {
                  widget.setData('personname', this.getValue());
                  widget.setData('profileurl', this.getInputElement().data('url'));
                  widget.setData('type', '_t');
                }
              } catch(e) {
                console.log(e);
              }
            },
            validate: function() {
              var isvalid = true;
              if(this.getDialog()._.currentTabId === 'tag-person') {
                isvalid = this.getValue() !== '';
              }
              return isvalid;
            },
            onShow: function() {
              console.log('show');
            },
            onLoad: function() {
              try {
                var self = this;
                if(self.getDialog()._.currentTabId === 'tag-person' &&
                   '' === self.getInputElement().getValue()) {
                  self.getDialog().getButton('ok').disable();
                }
				var usersList  = null ;
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
					$(self.getInputElement().$).kendoAutoComplete({
					  dataSource: usersList.GetUsersDataSource().data(),
					  dataTextField: "firstname",
					  select: function(e) {
						self.getDialog().getButton('ok').enable();
						// Use the selected item or its text
					  }
					});
				});		
                
              } catch(e) {
                console.log(e);
              }
            }
          }
        ]
      },
       {
        id: 'tag-var',
        label: editor.lang.tag.tagVarTabLabel,
        elements: [
          {
            id: 'varname',
            type: 'text',
            label: editor.lang.tag.inputTextVarNameLabel,
            labelLayout: 'horizontal',
            setup: function(widget) {
              try {
                if('_v' === widget.data.type) {
                  this.setValue(widget.data.varname);
                  this.getInputElement().data('type', widget.data.type);
                }
              } catch(e) {
                console.log(e);
              }
            },
            commit: function(widget) {
              try {
                if(this.getDialog()._.currentTabId === 'tag-var') {
                  widget.setData('varname', this.getValue());
                  widget.setData('type', '_v');
                }
              } catch(e) {
                console.log(e);
              }
            },
            validate: function() {
              var isvalid = true;
              if(this.getDialog()._.currentTabId === 'tag-var') {
                isvalid = this.getValue() !== '';
              }
              return isvalid;
            },
            onLoad: function() {
              try {
				var listVariables = null;
				var variablesList = null ;
				sendHttpRequest("GET",WS_BASE_URL + "project/"+getProjectInformationBase64().id+"/projectVariables", true, this).done(function(result){
				if ((typeof result == "object") && (result._embedded != null) && (result._embedded.projectvariable != null) ) {
					listVariables = result._embedded.projectvariable ; 
					//Adapt data format to JQuery UI autocomplete Componenent
					$(self.getInputElement().$).kendoAutoComplete({
					  dataSource: listVariables,
					  dataTextField: "name",
					  select: function(e) {
						self.getDialog().getButton('ok').enable();
					  }
					});
				}
				}).fail(function( jqXHR, textStatus ) {
					console.log("Error Get Variables : " + jqXHR.statusText);
				});
                var self = this;
                if(self.getDialog()._.currentTabId === 'tag-var' &&
                   '' === self.getInputElement().getValue()) {
                  self.getDialog().getButton('ok').disable();
                }
              } catch(e) {
                console.log(e);
              }
            }
          }
        ]
      },
      {
        id: 'tab-deliverables',
        label: editor.lang.tag.tagDelivTabLabel,
        elements: [
          {
            id: 'deliverablename',
            type: 'text',
            label: editor.lang.tag.inputTextDelivNameLabel,
            labelLayout: 'horizontal',
            setup: function(widget) {
              try {
                if('_c' === widget.data.type) {
                  this.setValue(widget.data.deliverablename);
                  this.getInputElement().data('type', widget.data.type);
                }
              } catch(e) {
                console.log(e);
              }
            },
            commit: function(widget) {
              try {
                if(this.getDialog()._.currentTabId === 'tab-deliverables') {
                  widget.setData('deliverablename', this.getValue());
                  widget.setData('type', '_c');
                }
              } catch(e) {
                console.log(e);
              }
            },
            validate: function() {
              var isvalid = true;
              if(this.getDialog()._.currentTabId === 'tab-deliverables') {
                isvalid = this.getValue() !== '';
              }
              return isvalid;
            },
            onLoad: function() {
              try {
                var self = this;
                if(self.getDialog()._.currentTabId === 'tab-deliverables' &&
                   '' === self.getInputElement().getValue()) {
                //  self.getDialog().getButton('ok').disable();
                }
				  listOfDeliverables = new DeliverablesDataModel(getProjectInformationBase64().id);
					  listOfDeliverables.Read().done(function () {
						$(self.getInputElement().$).kendoAutoComplete({
						  dataSource: listOfDeliverables.GetDataSource(),
						  dataTextField: "name",
						  select: function(e) {
							self.getDialog().getButton('ok').enable();
						  }
						});
					  }).always(function () {
						kendo.ui.progress($("#list-deliverables"), false);
						$("#list-deliverables").css("min-height", "inherit");
					  });
              } catch(e) {
                console.log(e);
              }
            }
          }
        ]
      }
    ]
  };
});
CKEDITOR.dialog.add('tag', function(editor) {
  return {
    title: editor.lang.tag.widgetDialogWindowTitle,
    minWidth: 500,
    minHeight: 100,
    onShow: function(e) {
      try {
        this.selectPage(editor.config.tag.tabId);
        this.getElement().getFirst().removeStyle('z-index');
      } catch(e) {
        console.log(e);
      }
    },
    contents: [
      {
        id: 'tag-person',
        label: editor.lang.tag.tagPersonTabLabel,
        elements: [
          {
            id: 'personname',
            type: 'text',
            label: editor.lang.tag.inputTextPersonNameLabel,
            labelLayout: 'horizontal',
            setup: function(widget) {
              try {
                if('_t' === widget.data.type) {
                  this.setValue(widget.data.personname);
                  this.getInputElement().data('url', widget.data.profileurl);
                  this.getInputElement().data('type', widget.data.type);
                }
              } catch(e) {
                console.log(e);
              }
            },
            commit: function(widget) {
              try {
                if(this.getDialog()._.currentTabId === 'tag-person') {
                  widget.setData('personname', this.getValue());
                  widget.setData('profileurl', this.getInputElement().data('url'));
                  widget.setData('type', '_t');
                }
              } catch(e) {
                console.log(e);
              }
            },
            validate: function() {
              var isvalid = true;
              if(this.getDialog()._.currentTabId === 'tag-person') {
                isvalid = this.getValue() !== '';
              }
              return isvalid;
            },
            onShow: function() {
              console.log('show');
            },
            onLoad: function() {
              try {
                var self = this;
                if(self.getDialog()._.currentTabId === 'tag-person' &&
                   '' === self.getInputElement().getValue()) {
                  self.getDialog().getButton('ok').disable();
                }
				var usersList  = null ;
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
					$(self.getInputElement().$).kendoAutoComplete({
					  dataSource: usersList.GetUsersDataSource().data(),
					  dataTextField: "firstname",
					  select: function(e) {
						self.getDialog().getButton('ok').enable();
						// Use the selected item or its text
					  }
					});
				});		
                
              } catch(e) {
                console.log(e);
              }
            }
          }
        ]
      },
      {
        id: 'tag-pkg',
        label: editor.lang.tag.workPkgTabLabel,
        elements: [
          {
            id: 'pkgname',
            type: 'text',
            label: editor.lang.tag.inputTextWorkPkgNameLabel,
            labelLayout: 'horizontal',
            setup: function(widget) {
              try {
                if('_p' === widget.data.type) {
                  this.setValue(widget.data.pkgname);
                  this.getInputElement().data('url', widget.data.pkgurl);
                }
              } catch(e) {
                console.log(e);
              }
            },
            commit: function(widget) {
              try {
                if(this.getDialog()._.currentTabId === 'tag-pkg') {
                  widget.setData('pkgname', this.getValue());
                  widget.setData('pkgurl', this.getInputElement().data('url'));
                  widget.setData('type', '_p');
                }
              } catch(e) {
                console.log(e);
              }
            },
            validate: function() {
              var isvalid = true;
              if(this.getDialog()._.currentTabId === 'tag-pkg') {
                isvalid = this.getValue() !== '';
              }
              return isvalid;
            },
            onLoad: function() {
              try {
                var self = this;
                if(self.getDialog()._.currentTabId === 'tag-pkg' &&
                   '' === self.getInputElement().getValue()) {
                 // self.getDialog().getButton('ok').disable();
                }
              } catch(e) {
                console.log(e);
              }
            }
          }
        ]
      },
      {
        id: 'tag-var',
        label: editor.lang.tag.tagVarTabLabel,
        elements: [
          {
            id: 'varname',
            type: 'text',
            label: editor.lang.tag.inputTextVarNameLabel,
            labelLayout: 'horizontal',
            setup: function(widget) {
              try {
                if('_v' === widget.data.type) {
                  this.setValue(widget.data.varname);
                  this.getInputElement().data('type', widget.data.type);
                }
              } catch(e) {
                console.log(e);
              }
            },
            commit: function(widget) {
              try {
                if(this.getDialog()._.currentTabId === 'tag-var') {
                  widget.setData('varname', this.getValue());
                  widget.setData('type', '_v');
                }
              } catch(e) {
                console.log(e);
              }
            },
            validate: function() {
              var isvalid = true;
              if(this.getDialog()._.currentTabId === 'tag-var') {
                isvalid = this.getValue() !== '';
              }
              return isvalid;
            },
            onLoad: function() {
              try {
				var listVariables = null;
				var variablesList = null ;
				sendHttpRequest("GET",WS_BASE_URL + "project/"+getProjectInformationBase64().id+"/projectVariables", true, this).done(function(result){
				if ((typeof result == "object") && (result._embedded != null) && (result._embedded.projectvariable != null) ) {
					listVariables = result._embedded.projectvariable ; 
					//Adapt data format to JQuery UI autocomplete Componenent
					$(self.getInputElement().$).kendoAutoComplete({
					  dataSource: listVariables,
					  dataTextField: "name",
					  select: function(e) {
						self.getDialog().getButton('ok').enable();
					  }
					});
				}
				}).fail(function( jqXHR, textStatus ) {
					console.log("Error Get Variables : " + jqXHR.statusText);
				});
                var self = this;
                if(self.getDialog()._.currentTabId === 'tag-var' &&
                   '' === self.getInputElement().getValue()) {
                  self.getDialog().getButton('ok').disable();
                }
              } catch(e) {
                console.log(e);
              }
            }
          }
        ]
      },
      {
        id: 'tab-deliverables',
        label: editor.lang.tag.tagConstTabLabel,
        elements: [
          {
            id: 'constname',
            type: 'text',
            label: editor.lang.tag.inputTextConstNameLabel,
            labelLayout: 'horizontal',
            setup: function(widget) {
              try {
                if('_c' === widget.data.type) {
                  this.setValue(widget.data.constname);
                  this.getInputElement().data('type', widget.data.type);
                }
              } catch(e) {
                console.log(e);
              }
            },
            commit: function(widget) {
              try {
                if(this.getDialog()._.currentTabId === 'tab-deliverables') {
                  widget.setData('constname', this.getValue());
                  widget.setData('type', '_c');
                }
              } catch(e) {
                console.log(e);
              }
            },
            validate: function() {
              var isvalid = true;
              if(this.getDialog()._.currentTabId === 'tab-deliverables') {
                isvalid = this.getValue() !== '';
              }
              return isvalid;
            },
            onLoad: function() {
              try {
                var self = this;
                if(self.getDialog()._.currentTabId === 'tab-deliverables' &&
                   '' === self.getInputElement().getValue()) {
                //  self.getDialog().getButton('ok').disable();
                }
                /*$(self.getInputElement().$).autocomplete({
                  change: function(event, ui) {
                    if(null === ui.item) {
                      self.getInputElement().setValue('');
                      self.getDialog().getButton('ok').disable();
                    }
                  },
                  select: function(event, ui) {
                    self.getInputElement().data('url', ui.item.url);
                    self.getDialog().getButton('ok').enable();
                  },
                  source: [
                    {
                      id: 1,
                      value: 'totalequipmentcost'
                    },
                    {
                      id: 2,
                      value: 'totalbulkcost'
                    },
                    {
                      id: 2,
                      value: 'officecost'
                    }
                  ]
                });*/
              } catch(e) {
                console.log(e);
              }
            }
          }
        ]
      }
    ]
  };
});
