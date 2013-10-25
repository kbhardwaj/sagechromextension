// jQuery
// if (span != null) {
// 	if (span.css('width') == '600px') {
// 		span.css('width', '0px');
// 		hide.text('open');
// 	}
// 	else {
// 		span.css('width', '600px');
// 		hide.text('close');
// 	};
// 	return;
// };
if (span != null) {
	return;
};

// var s = document.createElement('script');
// s.src = chrome.extension.getURL("scripts/bootstrap.min.js");
// (document.head||document.documentElement).appendChild(s);
// var s1 = document.createElement('script');
// s1.src = chrome.extension.getURL("scripts/wysihtml5-0.3.0.js");
// (document.head||document.documentElement).appendChild(s1);
// var s2 = document.createElement('script');
// s2.src = chrome.extension.getURL("scripts/bootstrap-wysihtml5.js");
// (document.head||document.documentElement).appendChild(s2);




// var div = $('body').append('<div>Test</div>');
var span = $('<span></span>');
var smheader = $('<div>SageMob</div>').attr('id','smheader');
var hide = $('<button>hide</button>');
var leftPanel = $('<div></div>').attr('id','searchnotebooks');
var rightPanel = $('<div></div>').attr('id','postnotes');
var searchNotebooksDiv = $('<ul></ul>').attr('id', 'notebookslist');


span.attr('id','popoutid');
hide.attr('id', 'togglebutton');

hide.toggle(
	function(){
		span.css('width', '0px')
		span.css('padding', '0px')
		span.css('border', '0px')
		hide.text('show')
	},
	function(){
		span.css('width', '650px')
		span.css('padding', '0px')
		span.css('border', '2px #BB3825 solid')
		hide.text('hide')
		
	}
)
span.css('border', '2px #BB3825 solid');
span.css('width', '650px');
span.css('padding', '0px');

leftPanel.html('');
span.prepend(smheader);
span.prepend(hide);



//define the meat of the app here.


var xhr = new XMLHttpRequest();
xhr.open('GET', "http://www.sagemob.com/api/v1/notebooks.json", true);
xhr.onload = function(e) {
  if (this.status == 200) {
    // JSON.parse does not evaluate the attacker's scripts.    
    var jsonResponse = JSON.parse(xhr.responseText);
    span.append(leftPanel);
    span.append(rightPanel);
    var newSearch = document.createElement("input");
    newSearch.setAttribute('type', 'text');
    newSearch.setAttribute('name', 'searchquery');
    newSearch.setAttribute('id', 'searchquery');
    newSearch.setAttribute('placeholder', 'search notebooks...')
	leftPanel.append(newSearch);
	
	var noteTitle = document.createElement("input");
	noteTitle.setAttribute('type', 'text');
    noteTitle.setAttribute('name', 'notetitle');
    noteTitle.setAttribute('id', 'notetitle');
    noteTitle.setAttribute('placeholder', 'Note Title...')
   	var noteContent = document.createElement("textarea");
	noteContent.setAttribute('type', 'textarea');
    noteContent.setAttribute('name', 'notecontent');
    noteContent.setAttribute('id', 'notecontent');
    noteContent.setAttribute('placeholder', 'Content of your note goes here...')
    
    var noteSubmit = document.createElement("button");
    noteSubmit.setAttribute('type', 'button');
    noteSubmit.setAttribute('value', 'Post');
    noteSubmit.setAttribute('id', 'notesubmit');
    noteSubmit.setAttribute('class', 'btn');
    noteSubmit.innerHTML = "Post Note";

    var notebookSelect = document.createElement("select");
    notebookSelect.setAttribute('id', 'mynotebooks');
    
    var promptoption = document.createElement("option");
    	promptoption.innerHTML = 'Choose Notebook';
    	promptoption.setAttribute('value', "disabled selected");
    	notebookSelect.appendChild(promptoption);

    for (var i = 0; i < jsonResponse.notebooks.length; i++) {
    	var option = document.createElement("option");
    	if (jsonResponse.notebooks[i].user_id == jsonResponse.id) {
    		option.innerHTML = jsonResponse.notebooks[i].title;
    		option.setAttribute('value', jsonResponse.notebooks[i].id);
	    	
	    	notebookSelect.appendChild(option);
	    	
    	}
    }
	rightPanel.append(noteTitle);
	rightPanel.append(noteContent);
	$('#notecontent').wysihtml5();
	rightPanel.append(notebookSelect);
	rightPanel.append(noteSubmit);
	


	document.getElementById('notesubmit').addEventListener("click", postNote, false);

	$('#searchquery').keyup(function() {
		console.log('keyup is running');
		var search_query = $(this).val();
		var keyword = encodeURIComponent(search_query);
		var url = "http://www.sagemob.com/api/v1/notebooks.json?query="+keyword;
		$.ajax({
			type: "GET",
			headers: {
		        "Content-Type": "application/json",
		        "Accept": "application/json"
		    },
			url: url,
			dataType:"json",
			success: function(response){
				console.log(response.notebooks);
				if (response.notebooks) {
					searchNotebooksDiv.html('');
					$.each(response.notebooks, function(i,data){
						console.log(response.notebooks)
						var notebook_title = data.title
						var newLi = $('<li></li>').attr('id', 'notebooklist');
						var notebookLink = $('<a></a>').text(notebook_title);
						var notebookID = data.id;
      					var notebookURL = "http://www.sagemob.com/notebooks/" + notebookID;
						notebookLink.attr('href', "http://www.sagemob.com/notebooks/" + notebookID);
						notebookLink.attr('target', '_blank');
						newLi.append(notebookLink);
						searchNotebooksDiv.prepend(newLi);
					});
				}
			}
		});
	});

    
    for (var i = 0; i < jsonResponse.notebooks.length; i++) {  
      var newLi = document.createElement("li")
      newLi.setAttribute('id','notebooklist')
      var notebookLink = document.createElement("a")
      notebookLink.innerHTML = jsonResponse.notebooks[i].title;
      var notebookID = jsonResponse.notebooks[i].id;
      var notebookURL = "http://www.sagemob.com/notebooks/" + notebookID;
      notebookLink.setAttribute('href', notebookURL);
      notebookLink.setAttribute('target', '_blank');
      newLi.appendChild(notebookLink);
      searchNotebooksDiv.append(newLi);
      leftPanel.append(searchNotebooksDiv);
    }
  }
  /* User is not signed in. Show them a sign in screen. */
  else if (this.status == 401) {
  	leftPanel.html('');
    var newForm = document.createElement("form");
    newForm.setAttribute('id', 'loginwindow');
    var newEmail = document.createElement("input");
    newEmail.setAttribute('type', 'text');
    newEmail.setAttribute('name', 'emailaddress');
    newEmail.setAttribute('id', 'emailadd');
    newEmail.setAttribute('placeholder', 'Email Address');
    var newPassword = document.createElement("input");
    newPassword.setAttribute('type', 'password');
    newPassword.setAttribute('name', 'password');
    newPassword.setAttribute('id', 'passwrd');
    newPassword.setAttribute('placeholder', 'Password');
    var newSubmit = document.createElement("button");
    newSubmit.setAttribute('type', 'button');
    newSubmit.setAttribute('value', 'Login');
    newSubmit.setAttribute('id', 'submitbutton');
    newSubmit.innerHTML = "Sign in";
    // newSubmit.setAttribute('onclick', 'loginForm()');
    
    newForm.appendChild(newEmail);
    newForm.appendChild(newPassword);
    newForm.appendChild(newSubmit);

    // var FBButton = document.createElement("button");
    // FBButton.setAttribute('type', 'button');
    // FBButton.setAttribute('value', 'facebook-signin');
    // FBButton.setAttribute('id', 'facebookbutton');
    // FBButton.innerHTML = "Connect With Facebook";
    
    span.append(newForm);
    // span.append(FBButton);


    // newForm.setAttribute('onsubmit', 'loginForm();'); // setAttribute causes the inline error in chrome ext.
    
    document.getElementById('submitbutton').addEventListener("click", loginForm, false); // This is crucial.
    document.getElementById('facebookbutton').addEventListener("click", facebookLogin, false);

    console.log('hi');
    
  };
}
xhr.send();

function facebookLogin() {
	var xhr5 = new XMLHttpRequest();
	var url = "http://www.sagemob.com/api/v1/omniauth_callbacks.json";
	xhr5.open("POST", url, true);
	xhr5.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhr5.onload = function () {
		console.log('xhr5 is running');
		// console.log(xhr5.responseText);
	}
}

function loginForm() {
	console.log('loginForm is running.')
    
    var xhr2 = new XMLHttpRequest();
    var url = "http://www.sagemob.com/api/v1/tokens.json";

    var email = document.getElementById('emailadd').value;
    var password = document.getElementById('passwrd').value;

    var params = "email="+email+"&password="+password;
    
    xhr2.open("POST", url, true);
    xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr2.onload = function () {
    // Try to Get Notebooks here.
      if (this.status == 200) {
	      console.log('xhr2 is running.');
	      // console.log(xhr2.responseText); //This responseText is the auth_token.
	      var jsonResponse = JSON.parse(xhr2.responseText);
	      var xhr3 = new XMLHttpRequest();
	      var url = "http://www.sagemob.com/api/v1/notebooks.json";
	      var params = "auth_token=" + jsonResponse.token;
	      var myID = jsonResponse.id;
	      xhr3.open("GET", url+"?"+params, true);
	      xhr3.onload = function (e){
	        if (this.status == 200) {
	          // JSON.parse does not evaluate the attacker's scripts.
	          
	            var jsonResponse = JSON.parse(xhr3.responseText);
	            span.append(leftPanel);
	            span.append(rightPanel);
	            var newSearch = document.createElement("input");
			    newSearch.setAttribute('type', 'text');
			    newSearch.setAttribute('name', 'searchquery');
			    newSearch.setAttribute('id', 'searchquery');
			    newSearch.setAttribute('placeholder', 'search notebooks...')
				leftPanel.append(newSearch);

				var noteTitle = document.createElement("input");
				noteTitle.setAttribute('type', 'text');
			    noteTitle.setAttribute('name', 'notetitle');
			    noteTitle.setAttribute('id', 'notetitle');
			    noteTitle.setAttribute('placeholder', 'Note Title...')
			   	var noteContent = document.createElement("textarea");
				noteContent.setAttribute('type', 'textarea');
			    noteContent.setAttribute('name', 'notecontent');
			    noteContent.setAttribute('id', 'notecontent');
			    noteContent.setAttribute('placeholder', 'Content of your note goes here...')
			    // noteContent.wysihtml5();
			    var noteSubmit = document.createElement("button");
			    noteSubmit.setAttribute('type', 'button');
			    noteSubmit.setAttribute('value', 'Post');
			    noteSubmit.setAttribute('id', 'notesubmit');
			    noteSubmit.innerHTML = "Post Note";
			    var notebookSelect = document.createElement("select");
			    notebookSelect.setAttribute('id', 'mynotebooks');
			    
			    
			    var promptoption = document.createElement("option");
			    	promptoption.innerHTML = 'Choose Notebook';
			    	promptoption.setAttribute('value', "disabled selected");
			    	notebookSelect.appendChild(promptoption);

			    for (var i = 0; i < jsonResponse.notebooks.length; i++) {
			    	var option = document.createElement("option");
			    	if (jsonResponse.notebooks[i].user_id == jsonResponse.id) {
			    		option.innerHTML = jsonResponse.notebooks[i].title;
			    		option.setAttribute('value', jsonResponse.notebooks[i].id);
				    	
				    	notebookSelect.appendChild(option);
				    	
			    	}
			    }
				rightPanel.append(noteTitle);
				rightPanel.append(noteContent);
				$('#notecontent').wysihtml5();
				rightPanel.append(notebookSelect);
				rightPanel.append(noteSubmit);


				document.getElementById('notesubmit').addEventListener("click", postNote, false);

				$('#searchquery').keyup(function() {
					console.log('keyup is running');
					var search_query = $(this).val();
					var keyword = encodeURIComponent(search_query);
					var url = "http://www.sagemob.com/api/v1/notebooks.json?query="+keyword;
					$.ajax({
						type: "GET",
						headers: {
					        "Content-Type": "application/json",
					// could use contentType for the above but setting it this way to illustrate the example
					        "Accept": "application/json"
					    },
						url: url,
						dataType:"json",
						success: function(response){
							console.log(response.notebooks);
							if (response.notebooks) {
								searchNotebooksDiv.html('');
								$.each(response.notebooks, function(i,data){
									console.log(response.notebooks)
									var notebook_title = data.title
									var newLi = $('<li></li>').attr('id', 'notebooklist');
									var notebookLink = $('<a></a>').text(notebook_title);
									var notebookID = data.id;
			      					var notebookURL = "http://www.sagemob.com/notebooks/" + notebookID;
									notebookLink.attr('href', "http://www.sagemob.com/notebooks/" + notebookID);
									notebookLink.attr('target', '_blank');
									newLi.append(notebookLink);
									searchNotebooksDiv.prepend(newLi);
								});
							}
						}
					});
				});
	          
	          for (var i = 0; i < jsonResponse.notebooks.length; i++) {  
		          var newLi = document.createElement("li")
		          newLi.setAttribute('id','notebooklist')
			      var notebookLink = document.createElement("a")
			      notebookLink.innerHTML = jsonResponse.notebooks[i].title;
			      var notebookID = jsonResponse.notebooks[i].id;
			      var notebookURL = "http://www.sagemob.com/notebooks/" + notebookID;
			      notebookLink.setAttribute('href', notebookURL);
			      notebookLink.setAttribute('target', '_blank');
			      newLi.appendChild(notebookLink);
			      searchNotebooksDiv.append(newLi);
			      leftPanel.append(searchNotebooksDiv);
	          }
	        }
	      }
	      xhr3.send(null);
	      document.getElementById('loginwindow').style.display = 'none';
	  }
	  else {
	  	var jsonResponse = JSON.parse(xhr2.responseText);
	  	var message = $('<div></div>').attr('id','errormessage');
    	message.append(jsonResponse.message);
    	message.delay(5000).fadeOut(400);
    	var theform = document.getElementById('loginwindow');
    	// theform.insertBefore(message, theform.firstChild);
    	message.insertBefore(theform);
	  	document.getElementById('emailadd').value = '';
	  	document.getElementById('passwrd').value = '';
	  };
	}
    xhr2.send(params);
    // e.preventDefault(); // This is crucial. Try out this jsfiddle to see what happens when this is removed: http://jsfiddle.net/Zk7kY/
    // document.getElementById('loginwindow').style.display = 'none';
    // document.getElementById('facebookbutton').style.display = 'none';
};

function postNote() {
	console.log("post note is running.");
	var titleVal = $('#notetitle').val();

	//trying to remove &nbsp; from the html
	// $('#notecontent').text(function (){
	// 	$(this).replace(/(&nbsp;)*/g,'');
	// });
	// $('#notecontent').text.replace(/(&nbsp;)*/g,'');
	var contentVal = $('#notecontent').val();
	var content = encodeURIComponent(contentVal);

	var notebookID = $('#mynotebooks')[0];
	var notebookIDVal = notebookID.options[notebookID.selectedIndex].value;

	// var note = {title: title, content: content, notebook_id: notebookIDVal};
	// params => {:note => {:title => title, :content => content, :notebook_id => notebookIDVal}}
	
	// var params = "title="+title+"&content="+content+"&notebookid="+notebook_id;
	var xhr4 = new XMLHttpRequest();
    var url = "http://www.sagemob.com/api/v1/notebooks/"+notebookIDVal+"/notes.json";

    var params = "title="+titleVal+"&content="+content+"&notebookid="+notebookIDVal;
    
    xhr4.open("POST", url, true);
    xhr4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr4.onload = function () {
    	// show posted note here.

        var jsonResponse = JSON.parse(xhr4.responseText);
        
        // rightPanel.empty();
        $('#notetitle').val('');
        // $('#notecontent').val('');
        // var rte = $('#notecontent').wysihtml5();
        $('#notecontent').data('wysihtml5').editor.clear();
        // $('.wysihtml5-editor placeholder').val('');
        $('#mynotebooks').val('');

        var message = $('<div></div>').attr('id','message');
    	message.append('The note, '+jsonResponse.note.title+', has been posted.');
    	message.delay(5000).fadeOut(400);
    	rightPanel.prepend(message);
    }
    xhr4.send(params);
	
};


//
$('body').prepend(span);







