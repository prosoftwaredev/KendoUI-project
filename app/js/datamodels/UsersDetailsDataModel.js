var UsersDetailsDataModel;
(function() {
    UsersDetailsDataModel = function UsersDetailsDataModel(userID) {
      this._uriServices = {
			"GET" : {
          "INFO" : WS_BASE_URL + "user/",
					"EDUC" : WS_BASE_URL + "user/",
					"EXP": WS_BASE_URL + "user/",
					"CERT": WS_BASE_URL + "user/",
					"SKILL": WS_BASE_URL + "skill/search/user/"
					}
      };

      this._userID = null;
      if ((typeof userID != "undefined") && (userID != null)) {
        this._userID = userID;
      }

      this._infoUserDataSource = new kendo.data.DataSource({
        data: [],
        schema: {
          model: {
            id: "id"
          }
        }
      });


      this._educationsDataSource = new kendo.data.DataSource({
        data: [],
        schema: {
          model: {
            id: "id"
          }
        }
      });

	this._experiencesDataSource = new kendo.data.DataSource({
        data: [],
        schema: {
          model: {
            id: "id"
          }
        }
      });


      this._certificatsDataSource = new kendo.data.DataSource({
        data: [],
        schema: {
          model: {
            id: "id"
          }
        }
      });

	this._skillsDataSource = new kendo.data.DataSource({
        data: [],
        schema: {
          model: {
            id: "id"
          }
        }
      });
    };

	UsersDetailsDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	UsersDetailsDataModel.prototype.GetUserId = function() {
		return this._userID;
	}
	UsersDetailsDataModel.prototype.GetEducationsDataSource  = function() {
		return this._educationsDataSource;
	}
	UsersDetailsDataModel.prototype.GetExperiencesDataSource = function() {
		return this._experiencesDataSource;
	}
	UsersDetailsDataModel.prototype.GetCertificatsDataSource  = function() {
		return this._certificatsDataSource;
	}
	UsersDetailsDataModel.prototype.GetSkillsDataSource = function() {
		return this._skillsDataSource;
	}
  UsersDetailsDataModel.prototype.GetInfoUserDataSource = function() {
    return this._infoUserDataSource;
  }
	// Setters
	UsersDetailsDataModel.prototype.SetUserId = function(userID) {
		this._userID = userID;
	}
	//education
	UsersDetailsDataModel.prototype.ReadEducation = function() {
		var url=this._uriServices.GET.EDUC+ this._userID +"/educations";
		return sendHttpRequest("GET",url, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSONEducation(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get UsersDetailsDataModel : " + jqXHR.statusText);
			});
	}
	UsersDetailsDataModel.prototype.fromJSONEducation = function(jsonObject) {
		if (('_embedded' in jsonObject) && ('education' in jsonObject._embedded)) {
			this._educationsDataSource.data(jsonObject._embedded.education);
		}
	}
	//experiences
	UsersDetailsDataModel.prototype.ReadExperience = function() {
		var url=this._uriServices.GET.EXP+ this._userID +"/experiences";
		return sendHttpRequest("GET",url, true, this).done(function(result){
			if (typeof result == "object") {
				this.fromJSONExperience(result);
			}
		}).fail(function( jqXHR, textStatus ) {
			console.log("Error Get UsersDetailsDataModel : " + jqXHR.statusText);
		});
	}
	UsersDetailsDataModel.prototype.fromJSONExperience = function(jsonObject) {
		if (('_embedded' in jsonObject) && ('experience' in jsonObject._embedded)) {
			this._experiencesDataSource.data(jsonObject._embedded.experience);
			}
	}
	//certificates
	UsersDetailsDataModel.prototype.ReadCertificat = function() {
		var url=this._uriServices.GET.CERT+this._userID+"/certificats";
		return sendHttpRequest("GET",url, true, this).done(function(result){
			if (typeof result == "object") {
				this.fromJSONCertificat(result);
			}
		}).fail(function( jqXHR, textStatus ) {
			console.log("Error Get UsersDetailsDataModel : " + jqXHR.statusText);
		});
	}
	UsersDetailsDataModel.prototype.fromJSONCertificat = function(jsonObject) {
		if (('_embedded' in jsonObject) && ('certificat' in jsonObject._embedded)) {
			this._certificatsDataSource.data(jsonObject._embedded.certificat);
		}
	}

  //info
  UsersDetailsDataModel.prototype.ReadInfoUser = function() {
    var url=this._uriServices.GET.INFO+this._userID;
    return sendHttpRequest("GET",url, true, this).done(function(result){
        this.fromJSONInfoUser(result);
    }).fail(function( jqXHR, textStatus ) {
      console.log("Error Get UsersDetailsDataModel : " + jqXHR.statusText);
    });
  }
  UsersDetailsDataModel.prototype.fromJSONInfoUser = function(jsonObject) {
      this._infoUserDataSource.data(jsonObject);
  }

	//skill
		UsersDetailsDataModel.prototype.ReadSkill = function() {
		var url=this._uriServices.GET.SKILL+this._userID;
		return sendHttpRequest("GET",url, true, this).done(function(result){

				this.fromJSONSkill(result);

		}).fail(function( jqXHR, textStatus ) {
			console.log("Error Get UsersDetailsDataModel : " + jqXHR.statusText);
		});
	}
	UsersDetailsDataModel.prototype.fromJSONSkill = function(jsonObject) {

      this._skillsDataSource.data(jsonObject);

	}
	UsersDetailsDataModel.prototype.toJSON = function() {

	}
	UsersDetailsDataModel.prototype.toHTML = function() {
	}
}());
