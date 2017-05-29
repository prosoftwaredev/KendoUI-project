var app = app || {};

(function () {



    app.sectionsHelper = function () {

        this.generateUUID = function generateUUID() {
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



    }


})()

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