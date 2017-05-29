/* Concord Project Technologies CONFIDENTIAL
 * __________________
 * [2016-2017] Concord Project Technologies
 * All Rights Reserved.
 * NOTICE:All information contained herein is, and remains the property
 * of Concord Project Technologies and its suppliers, if any.
 * The intellectual and technical concepts contained herein are proprietary
 * to Concord Project Technologies and its suppliers and may be covered by
 * U.S. and Foreign Patents, patents in process, and are protected by trade
 * secret or copyright law.
 * Dissemination of this information or reproduction of this material is
 * strictly forbidden unless prior written permission is obtained from
 * Concord Project Technologies.
 * */
/**
 * Created by kaissaou on 2017-03-20.
 */

$(document).ready(function () {
	if (getCurrentAuthentificationBase64() != null) {
		//displaySideBar(false);
		loadContentFromURI("Projects");
	} else {
		logout();
	}
});

//refresh content tab with ajax implemented in Treeview Mainleftmenu
function loadContentFromURI(aPageName) {
  $(".k-animation-container").hide();
  if (aPageName !== ""){
	  $.ajax({
		url: 'pages/'+aPageName+'.html',
		success: function(data) {
		  $('#pagecontent').empty();
		  $('#pagecontent').html(data);
		  $("#loading").hide();
		},
		error: function (xhr, ajaxOptions, thrownError) {
		  $.ajax({
			url: 'pages/coming-soon.html',
			success: function(data) {
			  $('#pagecontent').empty();
			  $('#pagecontent').html(data);
			  $("#loading").hide();
			}
		  });
			}
		});
  }
}
