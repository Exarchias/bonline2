function myFunction() {
    var x = document.getElementById("p");
    //var y=document.getElementById("btn");
    if (x.style.display === "block") {
      //  alert("Here 1");
      document.getElementById("btn").innerHTML = "+";
     document.getElementById("p").innerHTML = "";
      x.style.display = "none";
      
       
    } else {
     //   alert("Here 2");
      document.getElementById("btn").innerHTML = "-";
      document.getElementById("p").innerHTML = "Answer 1";
      x.style.display = "block";
      
      
    }
  }


  function myFunction1() {
    var y = document.getElementById("p1");
     
  
    if (y.style.display === "block") {
        
      document.getElementById("btn1").innerHTML = "+";
     document.getElementById("p1").innerHTML = "";
      y.style.display = "none";
      
       
    } else {
        document.getElementById("btn1").innerHTML = "-";
        document.getElementById("p1").innerHTML = "Answer 2";
      
    
      
      y.style.display = "block";
      
    }
  }


  function myFunction2() {
    var z = document.getElementById("p2");
    //var y=document.getElementById("btn");
    if (z.style.display === "block") {
      document.getElementById("btn2").innerHTML = "+";
     document.getElementById("p2").innerHTML = "";
      z.style.display = "none";
      
       
    } else {
      document.getElementById("btn2").innerHTML = "+";
      document.getElementById("p2").innerHTML = "Answer 3";
      z.style.display = "block";
      
    }
  }