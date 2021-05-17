function validateForm() {
  var username = document.forms["theForm"]["username"].value;
  var password = document.forms["theForm"]["firstname"].password;
    if (username == "") {
      alert("username must be filled out");
      return false;
    } else if (password == "") {
        alert("password must be filled out");
        return false;
    } else {
        alert("That is a very valid submission");
        return true;
    }
  }

	