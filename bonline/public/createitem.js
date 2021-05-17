
function validateForm() {
  var name = document.forms["theForm"]["name"].value;
  var description = document.forms["theForm"]["description"].password;
  var price = document.forms["theForm"]["price"].value;
    if (name == "") {
      alert("the title must be filled out");
      return false;
    } else if (description == "") {
        alert("the description must be filled out");
        return false;
    } else if (price == "") {
      alert("The price Name must be filled out");
      return false;
  } else {
        if (isNaN(price)) {
              alert("Telphone needs to be a number");
              return false;
          }
        alert("That is a very valid submission");
        return true;
    }
  }
