var AbstractDataModel;
Mode = {
	"LOCAL" : 1,
	"REMOTE" : 2,
	"ALL" : 3
};
(function() {    
    AbstractDataModel = function() {
		if (this.constructor === AbstractDataModel) {
		  throw new Error("Can't instantiate abstract class!");
		}
	};
	AbstractDataModel.prototype.Create = function() {
		throw new Error("Abstract method!");
	}	
	AbstractDataModel.prototype.Read = function() {		
		throw new Error("Abstract method!");
	}
	AbstractDataModel.prototype.Update = function() {		
		throw new Error("Abstract method!");
	}
	AbstractDataModel.prototype.Delete = function() {		
		throw new Error("Abstract method!");
	}
	AbstractDataModel.prototype.fromJSON = function() {		
		throw new Error("Abstract method!");
	}
	AbstractDataModel.prototype.toJSON = function() {		
		throw new Error("Abstract method!");
	}
	AbstractDataModel.prototype.toHTML = function() {		
		throw new Error("Abstract method!");
	}
}());