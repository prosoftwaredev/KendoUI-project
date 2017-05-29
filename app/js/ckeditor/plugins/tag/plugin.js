CKEDITOR.plugins.add('tag', {
  // i18n
  lang: 'en,fr',

  // provide widget api
  requires: 'widget',

  // widget toolbar button icon
  icons: 'tag',

  init: function(editor) {
    var pluginDirectory = this.path;
    editor.addContentsCss(pluginDirectory + 'styles/tag.css');

    CKEDITOR.tools.extend(editor.config, {
      tag: {
        tabId: 'tag-person'
      }
    });

    // CKEDITOR.dtd.$editable['span'] = 1;

    // widget registration
    editor.widgets.add('tag', {
      // widget toolbar button label
      button: editor.lang.tag.widgetToolbarButtonLabel,

      // bind widget to dialog window
      dialog: 'tag',

      // widget template
      template:
        '<a class="tag"></a>',

      data: function() {
        if('_t' === this.data.type) {
          this.element.data('type', this.data.type);
          this.element.setAttribute('href', this.data.profileurl);
          this.element.setText('@' + this.data.personname);
        }  else if('_v' === this.data.type) {
          this.element.data('type', this.data.type);
          this.element.setText('$' + this.data.varname);
        } else if('_c' === this.data.type) {
          this.element.data('type', this.data.type);
          this.element.setText(this.data.deliverablename.toUpperCase());
        }
      }
    });

    editor.addCommand('tagPerson', {
      exec: function(editor) {
          editor.config.tag.tabId = 'tag-person';
          editor.execCommand('tag');
      }
    });

    editor.addCommand('insertConst', {
      exec: function(editor) {
          editor.config.tag.tabId = 'tab-deliverables';
          editor.execCommand('tag');
      }
    });

    editor.addCommand('insertVar', {
      exec: function(editor) {
          editor.config.tag.tabId = 'tag-var';
          editor.execCommand('tag');
      }
    });

    // widget configuration dialog registration
    CKEDITOR.dialog.add('tag', pluginDirectory + 'dialogs/tag.js');

    // shortcut
    editor.setKeystroke(CKEDITOR.ALT + 77 /*m*/, 'tagPerson');
    editor.setKeystroke(CKEDITOR.ALT + 67 /*c*/, 'insertConst');
    editor.setKeystroke(CKEDITOR.ALT + 88 /*x*/, 'insertVar');
  }
});
