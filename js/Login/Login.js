//var url = "http://localhost:8080/mstudent";
var url = "http://mstudentservice.jelastic.dogado.eu"
var result = [];

$(document).ready(function () {
	$( "#login" ).click(function() {


 		var userName = $("input[name='username']").val();
 		var password = $("input[name='password']").val();
    var wyrazenieLogin = /^([A-Z][a-z]*)$/;
    var wyrazeniePassword = /^([A-Z][a-z]*)$/;

	 if(wyrazenieLogin.test(userName) && wyrazeniePassword.test(password)){
  	authenticate( userName, password ); 

  	    result = [];
      }else
      alert("Niepoprawne hasło lub login!");

	});
});

  function callback(data){

  		var sId = 's234543245';
		writeCookie('sessionId', sId, 3);


  		for (var i in data)
  				result.push(i, data[i]);
    	if(result[3] == true)
  			window.location.href = "/mstudentadmin/index.html"; 
    }

function authenticate(userName, password) {    

		$.ajax({
						type:"GET",
					     url:url+"/loginadmin/dologin?username="+userName+"&password="+password,
					     dataType: 'json',
					     async: false,
					     success: function(data){ callback(data)},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}
			   
					     }
				});

}  

function writeCookie(name,value,days) {
    var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*60*60*1000));
        expires = "; expires=" + date.toGMTString();
            }else{
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
  