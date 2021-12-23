define(function(require, exports, module){
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    var CodeHintManager = brackets.getModule('editor/CodeHintManager');
    var FileSystem = brackets.getModule('filesystem/FileSystem');

    var rootPath = ExtensionUtils.getModulePath(module);

    var htmlStartHintProvider = {
        hasHints: function(editor, implicit){
            var pos = editor.getCursorPos();
            if(pos.line === 0 && pos.ch < 5){
                var text = editor.document.getRange({line: 0, ch: 0}, pos);
                this.editor = editor;
                return "<html".indexOf(text) === 0;
            }
            this.editor = undefined;
            return false;
        },
        getHints: function(implicit){
            var editor = this.editor;

            if(editor){
                var pos = editor.getCursorPos();
                if(pos.line === 0 && pos.ch < 5){
                    var text = editor.document.getRange({line: 0, ch: 0}, pos);
                    var matched = text.substr(1);

                    if("<h".indexOf(text) === 0){
                        return {
                            hints: ['html...', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html'],
                            match: matched,
                            selectInitial: true
                        }
                    }
                    else if("<html".indexOf(text) === 0){
                        return {
                            hints: ['html...', 'html'],
                            match: matched,
                            selectInitial: true
                        }
                    }
                }
            }

            this.editor = undefined;
            return true;
        },
        insertHint: function(hint){
            var editor = this.editor;

            if(editor){
                if(hint === 'html...'){
                    var pos = editor.getCursorPos();
                    var template = FileSystem.getFileForPath(rootPath + 'html5-template.html');
                    template.read(function(err, html){
                        if(!err) editor.document.setText(html);
                    });
                }
                else{
                    var pos = editor.getCursorPos();
                    var text = editor.document.getRange({line: 0, ch: 0}, pos);
                    var matched = text.substr(1);
                    var textToInsert = hint.substr(matched.length);
                    editor.document.replaceRange(textToInsert, pos);
                }
            }

            this.editor = undefined;
            return false;
        },
        insertHintOnTab: true
    }

    CodeHintManager.registerHintProvider(htmlStartHintProvider, ['html'], 0);
});
