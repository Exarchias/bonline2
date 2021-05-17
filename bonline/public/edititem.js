
function validateForm() {
  var name = document.forms["theForm"]["name"].value;
  var price = document.forms["theForm"]["price"].value;
    if (name == "") {
      alert("the title must be filled out");
      return false;
    } 
    else {

      if(price != ""){
        if (isNaN(price)) {
          alert("The price needs to be a number");
          return false;
      }
      }
        alert("That is a very valid submission");
        return true;
    }
  }

	