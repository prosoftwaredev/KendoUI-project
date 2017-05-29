CKEDITOR.plugins.add('comment', {
  // i18n
  lang: 'en,fr',

  // provide widget api
  requires: 'widget',

  // widget toolbar button icon
  icons: 'comment',

  onLoad: function() {
    var self = this;
    self.__ = {}
    self.__.INLINE_COMMENT_WRAPPER_TAG = 'mark';
    self.__.PLUGIN_CSS = [
      'styles/comment.css'
    ];
    self.__.EXTERN_CSS = [
      'styles/pcomment.css'
    ];

    self.__.addPluginCss = function(editor) {
      for(var i = 0; i < self.__.PLUGIN_CSS.length; i++) {
          var cssPath = self.__.PLUGIN_CSS[i];
          editor.addContentsCss(self.path + cssPath);
      }

      for(var i = 0; i < self.__.EXTERN_CSS.length; i++) {
          var cssPath = self.__.EXTERN_CSS[i];
          var link = new CKEDITOR.dom.element('link');
          var head = new CKEDITOR.dom.element(document.head);
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('href', self.path + cssPath);
          link.appendTo(head);
      }

      self.__.newComment = function(editor) {
        var uuid = 0;
        try {
          var fragment = editor.getSelection().getRanges()[0].extractContents();
          var wrapper = new CKEDITOR.dom.element(self.__.INLINE_COMMENT_WRAPPER_TAG);
          var uuid = self.__.uuid4();
          wrapper.data('comment-uuid', uuid);
          fragment.appendTo(wrapper);
          editor.insertElement(wrapper);
        } catch(e) {
          console.log(e);
        }
        return uuid;
      };

      self.__.uuid4 = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0;
          var v = (c == 'x') ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      self.__.showComments = function(editor, comments) {
        var container = CKEDITOR.document.getById(editor.name + '_comments');
        for(var i = 0; i < comments.length; i++) {
          var comment = new CKEDITOR.dom.element('p');
          comment.appendText(comments[i]);
          container.append(comment);
        }
      };

      self.__.clearComments = function(editor) {
        var commentEntries = CKEDITOR.document.getById(editor.name + '_comments').getChildren();
        while(commentEntries.count() > 0) {
          var node = commentEntries.getItem(commentEntries.count() - 1);
          node.remove();
        }
      };

      self.__.getComments = function(editor, uuid) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if(xhr.readyState === 4) {
            data = JSON.parse(xhr.responseText);
            self.__.showComments(editor, data['result']);
          }
        };
        xhr.open('GET', 'api/gc.php?comment-uuid='+uuid, true);
        xhr.send();
      };
    };

  },
  init: function(editor) {
    var self = this;
    self.__.addPluginCss(editor);

    editor.addCommand('insCommentCmd', {
      exec: function() {
        if(editor.getSelection().getSelectedText().length > 0) {
          if(editor.getSelection().getStartElement().getName() === 'mark' &&
             editor.getSelection().getStartElement().hasAttribute('data-comment-uuid')) {
          } else {
            var uuid = self.__.newComment(editor);
            document.getElementById(editor.name + '_comment-id').value = uuid;
            document.getElementById(editor.name + '_comment-box').style.display = "block";
          }
        }
      }
    });

    editor.ui.addButton('InsertCommentButton', {
      label: editor.lang.comment.toolbarButtonLabel,
      command: 'insCommentCmd',
      icon: self.path + 'icons/comment.png'
    });

    editor.on('contentDom', function() {
      var template = '<div id="' + editor.name + '_comment-box" class="comment-box"><form method="POST" id="'+ editor.name +'_comment-form"><input name="comment-text" id="' + editor.name + '_comment-text" /><input name="comment-uuid" id="' + editor.name + '_comment-id" type="hidden"/><input id="' + editor.name + '_comment-btn" value="Comment" type="submit" /></form><div id="' + editor.name + '_comments" class="comments"></div></div>';
      var commentBoxElement = CKEDITOR.dom.element.createFromHtml(template);
      var editorElement = CKEDITOR.dom.element.get(document.getElementById('cke_' + editor.name));
      commentBoxElement.insertAfter(editorElement);

      var editable = editor.editable();
      var callback = function() {
        var __form = document.forms[editor.name + '_comment-form'];
        self.__.clearComments(editor);
        if(editor.elementPath().lastElement.getName() == 'mark' &&
           editor.elementPath().lastElement.hasAttribute('data-comment-uuid')) {
             var commentId = editor.elementPath().lastElement.data('comment-uuid');
             __form['comment-uuid'].value = commentId;
             self.__.getComments(editor, commentId);
            document.getElementById(editor.name + '_comment-box').style.display = "block";
          } else {
            __form['comment-text'].value = '';
            document.getElementById(editor.name + '_comment-box').style.display = "none";
          }
      };


      editable.attachListener(editable, 'click', callback);
      editable.attachListener(editable, 'focus', callback);
      editable.attachListener(editable, 'keyup', callback);
      document.forms[editor.name + '_comment-form'].addEventListener('submit', function(e) {
        e.preventDefault();
        var __form = this;
        var comment = __form['comment-text'].value;
        var uuid = __form['comment-uuid'].value;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if(xhr.readyState === 4) {
            data = JSON.parse(xhr.responseText);
            self.__.showComments(editor, data['result']);
            __form['comment-text'].value = '';
          }
        };
        xhr.open('POST', 'api/sc.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send("comment-text="+comment+"&comment-uuid="+uuid);
      });
    });
  }
});
