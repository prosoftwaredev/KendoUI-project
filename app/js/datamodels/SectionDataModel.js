var SectionDataModel;
(function() {    
    SectionDataModel = function SectionDataModel(SectionID) {	
		
		console.log("created");
		this._uriServices = {
			"GET" : WS_BASE_URL + "section/" +SectionID+ "/preview" ,
			"POST" : WS_BASE_URL + "section"
		};
		
		this._id = null;
		if ((typeof id != "undefined") && (id != null)) {
			this._id = id;
		}
		
		this._title= null;
		if ((typeof title != "undefined") && (title != null)) {
			this._title = title;
		}
		
		this._content= null;
		if ((typeof content != "undefined") && (content != null)) {
			this._content= content;
		}	
		console.log("created");
	};
	
	SectionDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	SectionDataModel.prototype.GetId = function() {
		return this._id;
	}
	SectionDataModel.prototype.GetTitle= function() {
		return this._title;
	}
	SectionDataModel.prototype.GetContent = function() {
		return this._content;
	}
	
	SectionDataModel.prototype.GetDetailsAsObservable = function() {
		return kendo.observable({
			"title" : this._title,
			"content" : this._content
		});
	}
	// Setters
	SectionDataModel.prototype.SetId = function(id) {
		this._id = id;
	}
	SectionDataModel.prototype.SetTitle = function(title) {
		this._title = title;
	}
	SectionDataModel.prototype.SetContent = function(content) {
		this._content = content;
	}
	// Operations
	SectionDataModel.prototype.Read = function() {
		return sendHttpRequest("GET", this._uriServices.GET, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSON(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get SectionDataModel : " + jqXHR.statusText);
			});
	}
SectionDataModel.prototype.CreateSection = function(sectionObject) {
		return sendHttpRequest("POST", this._uriServices.POST, true, this, sectionObject).fail(function( jqXHR, textStatus ) {
				console.log("Error Create SectionDataModel : " + jqXHR.statusText);
			});
	}	
	SectionDataModel.prototype.fromJSON = function(jsonObject) {
		if ('id' in jsonObject) {
			this._id = jsonObject.id;
		}
		if ('title' in jsonObject) {
			this._title = jsonObject.title;
		}
		if ('content' in jsonObject) {
			this._content= jsonObject.content;
		}
	}
	SectionDataModel.prototype.toJSON = function() {
		//stringify a workprocess object : used to send data to server
		return '{"id":'+this._id+', "title":"'+this._title+'", "content":'+this._content+'}';
	}
	SectionDataModel.prototype.toHTML = function() {				
	}
}());