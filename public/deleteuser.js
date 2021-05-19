
function validateForm() {

  var username = document.forms["theForm"]["username"].value;

    if (username == "") {
      alert("username must be filled out");
      return false;

    } else {

      alert("That is a very valid submission");
      return true;
    }
    
}

	