var sageMobFeed = {

   /**
   * Sends an XHR GET request to grab notebooks from sagemob database. The
   * XHR's 'onload' event pulls notebook objects out of the xhr 'open' call to the notebooks url.
    */
  loginForm: function(e) {
    console.log('loginForm is running.')
    var xhr2 = new XMLHttpRequest();
    var url = "http://localhost:3000/api/v1/tokens.json";

    var email = document.getElementById('emailadd').value;
    var password = document.getElementById('passwrd').value;

    var params = "email="+email+"&password="+password;
    console.log(params);
    xhr2.open("POST", url, true);
    xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr2.onload = function () {
    // Try to Get Notebooks here.
      console.log('xhr2 is running.');
      console.log(xhr2.responseText); //This responseText is the auth_token.
      var jsonResponse = JSON.parse(xhr2.responseText);
      var xhr3 = new XMLHttpRequest();
      var url = "http://localhost:3000/api/v1/notebooks.json";
      var params = "auth_token=" + jsonResponse.token;
      xhr3.open("GET", url+"?"+params, true);
      xhr3.onload = function (e){
        if (this.status == 200) {
          // JSON.parse does not evaluate the attacker's scripts.
          
          var jsonResponse = JSON.parse(xhr3.responseText);
          var nbooks = document.getElementById("popup");
          
          for (var i = 0; i < jsonResponse.notebooks.length; i++) {  
            var newDiv = document.createElement("div");
            newDiv.innerHTML = jsonResponse.notebooks[i].title;
            nbooks.appendChild(newDiv);
          }
        }
      }
      xhr3.send(null);
    };

    xhr2.send(params);
    e.preventDefault(); // This is crucial. Try out this jsfiddle to see what happens when this is removed: http://jsfiddle.net/Zk7kY/
  },

  fetch_feed: function() {
  	var xhr = new XMLHttpRequest();
    xhr.open('GET', "http://localhost:3000/api/v1/notebooks.json", true);

    
    xhr.onload = function(e) {
      if (this.status == 200) {
        // JSON.parse does not evaluate the attacker's scripts.
        
        var jsonResponse = JSON.parse(xhr.responseText);
        var nbooks = document.getElementById("popup");
        
        for (var i = 0; i < jsonResponse.notebooks.length; i++) {  
          var newDiv = document.createElement("div");
          newDiv.innerHTML = jsonResponse.notebooks[i].title;
          nbooks.appendChild(newDiv);
        }
      }
      /* User is not signed in. Show them a sign in screen. */
      else if (this.status == 401) {

        var newForm = document.createElement("form");
        newForm.setAttribute('id', 'loginwindow');
        var newEmail = document.createElement("input");
        newEmail.setAttribute('type', 'text');
        newEmail.setAttribute('name', 'emailaddress');
        newEmail.setAttribute('id', 'emailadd');
        var newPassword = document.createElement("input");
        newPassword.setAttribute('type', 'password');
        newPassword.setAttribute('name', 'password');
        newPassword.setAttribute('id', 'passwrd');
        var newSubmit = document.createElement("input");
        newSubmit.setAttribute('type', 'submit');
        newSubmit.setAttribute('value', 'Login');
        newSubmit.setAttribute('id', 'submitbutton');
        var extPopup = document.getElementById("popup");
        newForm.appendChild(newEmail);
        newForm.appendChild(newPassword);
        newForm.appendChild(newSubmit);
        extPopup.appendChild(newForm);


        // newForm.setAttribute('onsubmit', 'loginForm();'); // setAttribute causes the inline error in chrome ext.
        // document.getElementById('loginwindow').setAttribute('onsubmit', 'loginForm();return false;');
        document.getElementById('loginwindow').addEventListener("submit", sageMobFeed.loginForm, false); // This is crucial.

        console.log('hi');
        console.log(document.getElementById('emailadd').value);
        
        
      };

    }
    

    xhr.send();
  },	
   
  

};
// Wire up the listener.
// chrome.extension.onRequest.addListener(onRequest);

document.addEventListener('DOMContentLoaded', function () {
  sageMobFeed.fetch_feed();
});