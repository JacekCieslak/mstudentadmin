var result = [];

$(document).ready(function () {
	$( "#login" ).click(function() {


 		var userName = $("input[name='username']").val();
 		var password = $("input[name='password']").val();


       
		 authenticate( userName, password );
		//alert("username: "+userName+" password: "+password);

		 
  	result = [];

	});
});

  function callback(data){
  		for (var i in data)
  				result.push(i, data[i]);
    	// console.log(data);
    	// alert(JSON.stringify(data));
    	// var arg = JSON.parse(data);
    	if(result[3] == true)
  			window.location.href = "/mstudentadmin/index.html"; 
    	// alert(arg);
    }

function authenticate(userName, password) {    
        $.ajax({
		     type:"GET",
		     url:"http://localhost:8080/mstudent/loginadmin/dologin",
		     dataType: 'jsonp',
		    
            // contentType: "application/json; charset=utf-8",
            //contentType: "application/json; charset=utf-8",
            crossdomain: true,
            jsonp: 'callback',

		     data:"username="+userName+"&password="+password, //<------since your controller returns string use "text"
		     success: function(msg){
		     	console.log('success');
		     	alert(msg);
		     },
		     error:  function(jqXHR, textStatus, errorThrown) {
		     	console.log('error');
        	//	alert("Error... " + textStatus + "        " + errorThrown);
   
		     }

		});

}   
function authenticate2(userName, password) { 
	$.ajax({
		     type:"GET",
		     url:"http://localhost:8080/mstudent/login/dologin",
             contentType: "application/x-www-form-urlencoded", 
             dataType: "json",
             jsonp: false,
		     data:"username=127053@stud.prz.edu.pl&password=cichanip2", //<------since your controller returns string use "text"
		     success: function(msg){
		     	console.log('success');
		     	data = JSON.parse(msg);
		     	alert(msg);
		     },
		     error:  function(jqXHR, textStatus, errorThrown) {
        	//	alert("Error... " + textStatus + "        " + errorThrown);
   
		     }

		});
}


  