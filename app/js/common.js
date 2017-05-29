const WS_BASE_URL = "http://uat.tconglobal.com:8080/tcon-api/api/";
$.base64.utf8encode = true;
function sendHttpRequest(method, url, secure, context, data) {
	var options = {
		async : true,
		method  : method,
		contentType : "application/json",
		url : url
	};
	if ((typeof context != "undefined") && (context != null)) {
		options["context"] = context;
	}
	if ((typeof secure != "undefined") && (secure != null) && (secure == true)) {
		var auth = getCurrentAuthentificationBase64();
		if (auth != null) {
			options["headers"] = {
				"Authorization": "Basic " + auth
			};
		}
	}
	if ((typeof data != "undefined") && (data != null)) {
		options["data"] = data;
	}

	return $.ajax(options).fail(function( jqXHR, textStatus ) {
		if (jqXHR.status == 401) {
			// logout
			logout();
		}
	});
}

function sendHttpRequestURI(method, url, secure, context, data) {
	var options = {
		async : true,
		method  : method,
		contentType : "text/uri-list",
		url : url
	};
	if ((typeof context != "undefined") && (context != null)) {
		options["context"] = context;
	}
	if ((typeof secure != "undefined") && (secure != null) && (secure == true)) {
		var auth = getCurrentAuthentificationBase64();
		if (auth != null) {
			options["headers"] = {
				"Authorization": "Basic " + auth
			};
		}
	}
	if ((typeof data != "undefined") && (data != null)) {
		options["data"] = data;
	}
	
	return $.ajax(options).fail(function( jqXHR, textStatus ) {
		if (jqXHR.status == 401) {
			// logout
			logout();
		}
	});
}



function getCurrentAuthentificationBase64() {
	var encodedAuth = null;
	if (typeof(Storage) !== "undefined") {
		var encodedKey = $.base64.encode("username");
		var encodedUsr = sessionStorage.getItem(encodedKey);
		encodedKey = $.base64.encode("password"); 
		var encodedPwd = sessionStorage.getItem(encodedKey);
		if ((encodedUsr != null) && (encodedPwd != null)) {
			var decodedUsr = $.base64.decode(encodedUsr);
			var decodedPwd = $.base64.decode(encodedPwd);
			encodedAuth = $.base64.encode(decodedUsr + ":" + decodedPwd);
		}
	}
	return encodedAuth;
}

function setCurrentAuthentificationBase64(username, pwd) {
	if (typeof(Storage) !== "undefined") {
		var encodedKey = $.base64.encode("username");
		var encodeValue = $.base64.encode(username);
		sessionStorage.setItem(encodedKey, encodeValue);		
		encodedKey = $.base64.encode("password");
		encodeValue = $.base64.encode(pwd);
		sessionStorage.setItem(encodedKey, encodeValue);
	}
}

function setUserInformationBase64(jsonObject) {
	if (typeof(Storage) !== "undefined") {
		var userInfo = {};
		if ('organisationId' in jsonObject) {
			userInfo["organizationId"] = jsonObject.organisationId;
		}
		if (('role' in jsonObject) && (jsonObject.role != null)) {
			userInfo["role"] = jsonObject.role.name;
		}
		if (('user' in jsonObject) && (null != jsonObject.user)) {
			userInfo["userId"] = jsonObject.user.id;
			userInfo["userName"] = jsonObject.user.name + " " + jsonObject.user.firstname;
			userInfo["userAvatar"] = "images/navbar/avatar/"+jsonObject.user.avatar;
		}
		var encodedKey = $.base64.encode("userinfo");
		var userInfoStr = JSON.stringify(userInfo);
		var encodeValue = $.base64.encode(String(userInfoStr));
		sessionStorage.setItem(encodedKey, encodeValue);
	}
}

function getUserInformationBase64() {
	if (typeof(Storage) !== "undefined") {
		var encodedKey = $.base64.encode("userinfo");
		var encodedUserInfo = sessionStorage.getItem(encodedKey);
		if (encodedUserInfo != null) {
			var decodedUserInfo = $.base64.decode(encodedUserInfo);
			return JSON.parse(decodedUserInfo);
		}
	}
	return null;
}

function setProjectInformationBase64(jsonObject) {
	if (typeof(Storage) !== "undefined") {
		var encodedKey = $.base64.encode("projectinfo");
		var projectInfoStr = JSON.stringify(jsonObject);
		var encodeValue = $.base64.encode(String(projectInfoStr));
		sessionStorage.setItem(encodedKey, encodeValue);
	}
}

function getProjectInformationBase64() {
	if (typeof(Storage) !== "undefined") {
		var encodedKey = $.base64.encode("projectinfo");
		var encodedProjectInfo = sessionStorage.getItem(encodedKey);
		if (encodedProjectInfo != null) {
			var decodedProjectInfo = $.base64.decode(encodedProjectInfo);
			return JSON.parse(decodedProjectInfo);
		}
	}
	return null;
}

function removeProjectInformationBase64() {
	if (typeof(Storage) !== "undefined") {
		var encodedKey = $.base64.encode("projectinfo");
		sessionStorage.removeItem(encodedKey);
	}	
}

function clearSessionStorage() {
	sessionStorage.clear();
}

function logout() {
	clearSessionStorage();
	window.location.replace("login.html");
}

function displaySideBar(visible) {
	if (visible == true) {
		$(".main-sidebar").show();
		//$("#pagecontent").css("margin-left","230px");
		//$(".main-footer").css("margin-left","230px");
		$(".sidebar-toggle").css("visibility","visible");
	} else {
		$(".main-sidebar").hide();
		$("#pagecontent").css("margin-left","0px");
		$(".main-footer").css("margin-left","0px");
		$(".sidebar-toggle").css("visibility","hidden");
	}	
}

function showNotification(text, type) {
	if ((text!=null) && (text!="")) {
		if ($("#popupNotification").data("kendoNotification") == null) {
			$("#popupNotification").kendoNotification({
				autoHideAfter: 5000
			});
		}
		var types = ["info","success","warning","error"];
		if (types.indexOf(type)<0) {
			type = "info";
		}
		$("#popupNotification").data("kendoNotification").show(text,type);
	}
}

function getTextWidth(text, font) {
	 var f = font || '14px arial',
      o = $('<div>' + text + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width() + 20;

  o.remove();

  return w;
}