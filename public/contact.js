
  function validateform(){
    var name = document.forms["contactform"]["name"].value;
    var phone= document.forms["contactform"]["phone"].value;
    var email= document.forms["contactform"]["email"].value;
    var subject= document.forms["contactform"]["subject"].value;
    var message= document.forms["contactform"]["message"].value;


    if (name == "") {
        alert("the name must be filled out");
        return false;
      } else if (phone == "") {
          alert("the phone must be filled out");
          return false;
      } else if (email == "") {
        alert("The email must be filled out");
        return false;
      }else if(message==""){
          alert("The message must be filled out")
           return false;
    }else if(subject==""){
        alert("The message must be filled out")
         return false;
  } 
     else {
          if (isNaN(phone)) {
                alert("Telphone needs to be a number");
                return false;
            }
          alert("That is a very valid submission");
          return true;
      }
    }