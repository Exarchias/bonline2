function validateEmail(email) 
    {
        var regx = /\S+@\S+\.\S+/;
        return regx.test(email);
    }


function validateForm() {
    var username = document.forms["theForm"]["username"].value;
    var email = document.forms["theForm"]["email"].value;
    var telephone = document.forms["theForm"]["telephone"].value;
    if (username == "") {
      alert("username must be filled out");
      return false;
    } 
    else {
      if(email!=""){
        if (!validateEmail(email)) {
          alert("Not an email");
          return false;
        } 
      }
      
      if(telephone != ""){
        if (isNaN(telephone)) {
          alert("Telphone needs to be a number");
          return false;
      }
      }
        alert("That is a very valid submission");
        return true;
    }
  }

	