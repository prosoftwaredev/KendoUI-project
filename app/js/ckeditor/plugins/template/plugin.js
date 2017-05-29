CKEDITOR.plugins.add('template', {
  // i18n
  lang: 'en,fr',

  // provide widget api
  requires: ['widget', 'ajax'],

  // widget toolbar button icon
  icons: 'template',

  init: function(editor) {
    var pluginDirectory = this.path;
    editor.addContentsCss(pluginDirectory + 'styles/template.css');

	
	CKEDITOR.tools.extend(editor.config, {
      template: {
        tabId: 'template-team'
      }
    });
    // widget registration
    editor.widgets.add('template', {
      // widget toolbar button label
      button: editor.lang.template.widgetToolbarButtonLabel,

      // bind widget to dialog window
      dialog: 'template',

     template:
        '<img class="template-diag" />',

      data: function() {
        if('_t' === this.data.type) {
          this.element.data('type', this.data.type);
          this.element.setAttribute('src', this.data.imagesrc);
        } else if('_p' === this.data.type) {
          this.element.data('type', this.data.type);
          this.element.setAttribute('href', this.data.pkgurl);
          this.element.setText('[' + this.data.pkgname + ']');
        } 
      }
    });


    // widget configuration dialog registration
    CKEDITOR.dialog.add('template', pluginDirectory + 'dialogs/template.js');

  }
});
