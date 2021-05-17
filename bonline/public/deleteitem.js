
function validateForm() {

    var name = document.forms["theForm"]["name"].value;
  
      if (name == "") {
        alert("The title must be filled out");
        return false;
  
      } else {
  
        alert("That is a very valid submission");
        return true;
      }
      
  }
  
      