 var url = "http://localhost:8080/mstudent"
 //var url = "http://mstudentservice.jelastic.dogado.eu"
 var idUser;
 $(document).on("change", "#coursesSelectpicker", function(evt){
        var nameChangeGroup = $('#coursesSelectpicker option:selected').html();
        $('#groupsSelectpicker').find('option').remove();
        getGroups(nameChangeGroup);
        $('.selectpicker').selectpicker('refresh');
 });


 $(document).on("click", ".tablebutton", function(evt){


	var wyrazenieDelete = /deleteGrade_[0-9]*/;
	var wyrazenieEdit = /editGrade_[0-9]*/;
	var wyrazenieCancel = /cancelGrade_[0-9]*/;
	var wyrazenieUpdate = /updateGrade_[0-9]*/;
	var wyrazenieOceny = /oceny_[0-9]*/;
	var wyrazenieAddGrade = /addGrade/;

	var wyrazenieTitle = /^[A-Z]([A-Z]|[a-z]|[ąćęłńóśźżĄĘŁŃÓŚŹŻ]|\s|.\.|\-|[0-9])+$/;
 	var wyrazenieGarde = /^(([2-4]{1})(\,5)?)|5$/;

 	var clickButton = $(this).attr('id');

	if( wyrazenieDelete.test(clickButton) ){
		id = $(this).parent().parent().parent().attr('value');
		var name = $('span[id="titleGrade_'+id+'"]').text();
		
		var result = confirm("Czy na pewno chcesz usunąć ocenę z : "+name);
		if ( result== true) {
			$.ajax({
						type:'GET',
					     url:url+"/adminstrator/grade/deletegrade/"+id,
					     async: false,		
					     contentType: 'application/x-www-form-urlencoded', 
					  	statusCode: {
						    200: function() {
						      performDelete(id);
						  		}
						 },
					     success: function(){},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}
			   
					     }
					});
		}
	}else if(wyrazenieOceny.test(clickButton)){
		
 			 idUser = $(this).parent().parent().parent().attr('value');
 			 name = $('span[id="nameSpan_'+idUser+'"]').text();
 			 userName = $('span[id="userSpan_'+idUser+'"]').text();
 			 surName = $('span[id="surNameSpan_'+idUser+'"]').text();

 			$.ajax({
						type:'GET',
					     url:url+"/adminstrator/grade/user/"+idUser,
					     async: false,		
					     contentType: 'application/x-www-form-urlencoded', 
					  	statusCode: {

						 },
					     success: function(data){onSuccessGetUserGrade(idUser,data, userName, name, surName)},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}
			   
					     }
					});

 	}else if(wyrazenieAddGrade.test(clickButton)){
 			var newTitle = $("#newTextTitle").val();
 			var newGarde = $("#newInputGarde").val();
 			var idUser = $("#idGarde").text();


 			

 			if(wyrazenieTitle.test(newTitle) && wyrazenieGarde.test(newGarde)){
 				$.ajax({
						type:'GET',
					     url:url+"/adminstrator/grade/checkgrade/"+newTitle+"?id="+idUser,
					     async: false,	
					  	statusCode: {
						    200: function() {
						      cannotAddGrade();
						  		},
						  	404: function(){
						  		canAddGrade(newTitle, newGarde, id);	
						  	}
						 },
					     success: function(){},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}
			   
					     }
					});

 			}else 
 				alert("Niepoprawna Tytuł oceny lub wartość oceny! Tytuł powinien zaczynać sie z dużej litery i może posiadać znaki  -. Oceny mogą być z zakresu 2-5 wraz z połówkami np. 3,5.  ");
 	}else if(wyrazenieEdit.test(clickButton)){
			var id = $(this).parent().parent().parent().attr('value');
 			$('span[id="titleGrade_'+id+'"]').hide();
 			$('span[id="gGrade_'+id+'"]').hide();
 			$('input[id="inputGarde_'+id+'"]').show();
			$('textarea[id="textTitle_'+id+'"]').show();

			 $('button[id="updateGrade_'+id+'"]').show();
			  $('button[id="cancelGrade_'+id+'"]').show();
			 $('button[id="editGrade_'+id+'"]').parent().hide();
 	}else if(wyrazenieCancel.test(clickButton)){
 		 var id = $(this).parent().parent().parent().attr('value');
			
 		$('span[id="titleGrade_'+id+'"]').show();
 			$('span[id="gGrade_'+id+'"]').show();
 			$('input[id="inputGarde_'+id+'"]').hide();
			$('textarea[id="textTitle_'+id+'"]').hide();

			$('input[id="inputGarde_'+id+'"]').val($('span[id="gGrade_'+id+'"]').text());
			$('textarea[id="textTitle_'+id+'"]').text($('span[id="titleGrade_'+id+'"]').text());

			 $('button[id="updateGrade_'+id+'"]').hide();
			  $('button[id="cancelGrade_'+id+'"]').hide();
			   $('button[id="editGrade_'+id+'"]').parent().show();

 	}else if(wyrazenieUpdate.test(clickButton)){

 		var idUser = $("#idGarde").text();
 		var id = $(this).parent().parent().parent().attr('value');
 		var newGarde = $('input[id="inputGarde_'+id+'"]').val();
 		var  newTitle = $('textarea[id="textTitle_'+id+'"]').val();
 			if(wyrazenieTitle.test(newTitle) && wyrazenieGarde.test(newGarde)){
 				var oldTitle = $('span[id="titleGrade_'+id+'"]').text();
 				var oldGarde = $('span[id="gGrade_'+id+'"]').text();
 				$.ajax({
						type:'GET',
					    url:url+"/adminstrator/grade/checkgrade/"+newTitle+"/"+newGarde+"?id="+idUser,
					     async: false,	
					  	statusCode: {
						    200: function() {
						      cannotUpdateGrade();
						  		},
						  	404: function(){
						  		canUpdateGrade(newTitle,  newGarde, id);	
						  	}
						 },
					     success: function(){},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}
					     }
					});

 			}else 
 				alert("Niepoprawna Tytuł oceny lub wartość oceny! Tytuł powinien zaczynać sie z dużej litery i może posiadać znaki  -. Oceny mogą być z zakresu 2-5 wraz z połówkami np. 3,5.  ")
 	}
});

$(document).ready(function () {
		getGroupedCourses();

		var name = $(".selectpicker :selected").text(); 
		getGroups(name);
		var id = $("#groupsSelectpicker :selected").text();
		getStudents(name, id);


		
	    (function ($) {
        $('#filter').keyup(function () {	 
            var rex = new RegExp($(this).val(), 'i');
            $('.searchable tr').hide();
            $('.searchable tr').filter(function () {
            	var text = $(this).find('td').not('.ignore').text();
                return rex.test(text);
            }).show();
            showPages();
        })
    }(jQuery));
	showPages();

	$("#studentPanel").hide();

	$( ".show" ).click(function() {


		var name = $("#coursesSelectpicker :selected").text(); 
		var id = $("#groupsSelectpicker :selected").text();
		getStudents(name, id);
		$("#studentPanel").hide();
				

	});
});

 	function canAddGrade(newTitle, newGarde, id){
 			$.ajax({
						type:'POST',
					     url:url+"/adminstrator/grade/addgrade/"+id+"?title="+newTitle+"&grade="+newGarde,
					     async: false,		
					     contentType: 'application/x-www-form-urlencoded', 
					  	statusCode: {

						 },
					     success: function(){addUser(id)},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}
			   
					     }
					});
	 	}

	 function canUpdateGrade(newTitle, newGarde, id){
 			$.ajax({
						type:'POST',
					     url:url+"/adminstrator/grade/updategrade/"+id+"?title="+newTitle+"&grade="+newGarde,
					     async: false,		
					     contentType: 'application/x-www-form-urlencoded', 
					  	statusCode: {

						 },
					     success: function(){updateUser(id)},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}
			   
					     }
					});
	 	}

 	function cannotAddGrade(){
 		alert("Istnieje juz ocena z takim tytułem.");
 	}

 	function cannotUpdateGrade(){
 		alert("Istnieje juz ocena z takim tytułem.");
 	}

	function cannotChange(){
		alert("W tej grupie nie ma zarejestrowanych żadnych studentów"); 
	}

	

	function performDelete(id){
		var tr = $("#gradetr_1"+id);
        tr.css("background-color","#FF3700");

        tr.fadeOut(400, function(){
            tr.remove();
        });
		alert("Ocena została usunięta.");
	}

	

	function updateUser(id){
		$('button[id="updateGrade_'+id+'"]').hide();
		$('button[id="cancelGrade_'+id+'"]').hide();
		$('button[id="editGrade_'+id+'"]').parent().show();
		$('span[id="gGrade_'+id+'"]').html("<b>"+$('input[id="inputGarde_'+id+'"]').val()+"</b>");
		$('span[id="titleGrade_'+id+'"]').html("<b>"+$('textarea[id="textTitle_'+id+'"]').text()+"</b>");
		$('input[id="inputGarde_'+id+'"]').hide();
		$('textarea[id="textTitle_'+id+'"]').hide();
		$('span[id="gGrade_'+id+'"]').show();
		$('span[id="titleGrade_'+id+'"]').show();
		alert("Ocena został zaktualizowana");
	}
	function showPages()

	{
		$("#myPager").empty();
		$('#myTable').pageMe({pagerSelector:'#myPager',showPrevNext:true,hidePageNumbers:false,perPage:7});
	}


  

  function onSuccessGetStudents(data){
  	var numer = 1;
  	if(data.length != 0){

  		 $("#myTable").empty();
	  	for (var i in data){
	  		if(parseInt(data[i].status)){
		  		tr = $("<tr class='even' id='tr_"+data[i].id+"' value="+data[i].id+">");
			    tr.append("<td class='ignore'>" + numer + "</td>");
			    tr.append("<td>" + 
			    			"<span id='userSpan_"+data[i].id+"'>" + data[i].username + "</span>"+
			    			 "</td>");
			    tr.append("<td>" + 
			    			"<span  id='nameSpan_"+data[i].id+"'>" + data[i].name + "</span>"+
			    			"</td>");
			     tr.append("<td>" + 
			    			"<span  id='surNameSpan_"+data[i].id+"'>" + data[i].surname + "</span>"+
			    			"</td>");
			     tr.append("<td>"+
				    			"<p  data-placement='top' data-toggle='tooltip' title='D'>"+
				    				"<button id='oceny_"+data[i].id+"' class='tablebutton btn btn-success btn-xs' data-title='statusTrue' data-toggle='modal' data-target='#statusTrue' >"+
				    				"<span >Oceny</span></button>"+
				    			"</p>"+
			    		 	"</td>");

			  
			    tr.append("</tr>");
			   
			    $("#myTable").append(tr);
			     numer++;
		 	}
	  	}
	  	$('button[id^="statusAddTrue_"]').hide();
	  }else{
	  	$("#myTable").empty();
	  	tr = $("<tr class='even'>Brak użytkowników w tej grupie");
	  	tr.append("<td class='ignore'>Brak studentów. </td>");
	  	tr.append("</tr>");
	  	$("#myTable").append(tr);
    	}
    }

function getGroupedCourses() {    
        $.ajax({
		     type:"GET",
		     url: url+"/common/courses",
		     dataType: 'json',
		     async: false,
          	procesdata: true,

		     success: onSuccessGroupCourses,
		     error:  function(jqXHR, textStatus, errorThrown) {
		     	console.log('error '+textStatus);
		     }

		});
    }



function onSuccessGetUserGrade(idUser, data, userName, name, surName){
	var numer = 1;
	$("#userId").html("Student <b>"+userName+"</b> - "+name+" "+surName+ "<p id='idGarde'>"+idUser+"</p>");
  	if(data.length != 0){

  		 $("#sTable").empty();
	  	for (var i in data){
		  		tr = $("<tr class='even' id='gradetr_"+data[i].id+"' value="+data[i].id+">");
			    tr.append("<td class='ignore'>" + numer + "</td>");
			    tr.append("<td>" + 
			    			"<span id='titleGrade_"+data[i].id+"'>" + data[i].title + "</span>"+
			    			"<textarea  style='max-width: 300px;'  class='editbox' rows='2' cols='30' id='textTitle_"+ data[i].id +"'>"+data[i].title+"</textarea>"+
			    			 "</td>");
			    tr.append("<td>" + 
			    			"<span  id='gGrade_"+data[i].id+"'>" + data[i].grade + "</span>"+
			    			"<input type='text' value='"+ data[i].grade +"' class='editbox' id='inputGarde_"+ data[i].id +"'/>"+
			    			"</td>");
			     tr.append("<td>"+
				    			"<p  data-placement='top' data-toggle='tooltip' title='Edytuj'>"+
			    					"<button id='editGrade_"+data[i].id+"' class='tablebutton btn btn-primary btn-xs' data-title='Edit' data-toggle='modal' data-target='#edit' >"+
			    					"<span class='glyphicon glyphicon-pencil'></span></button>"+
			    				"</p>"+
			    				"<p  data-placement='top' data-toggle='tooltip' title='Dodaj'>"+
			    					"<button id='updateGrade_"+data[i].id+"' class='tablebutton btn btn-success btn-xs' data-title='update' data-toggle='modal' data-target='#update' >"+
			    					"<span class='glyphicon glyphicon-ok'></span></button>"+
			    					"<button id='cancelGrade_"+data[i].id+"' class=' tablebutton btn btn-warning btn-xs' data-title='Cancel' data-toggle='modal' data-target='#cancel' >"+
			    					"<span class='glyphicon glyphicon-remove'></span></button>"+
			    				"</p>"+
			    		 	"</td>");

			     
			    tr.append("<td>"+
			    				"<p data-placement='top' data-toggle='tooltip' title='Delete'>"+
			    					"<button   id='deleteGrade_"+data[i].id+"' class='tablebutton btn btn-danger btn-xs' data-title='Delete' data-toggle='modal' data-target='#delete' >"+
			    					"<span class='glyphicon glyphicon-trash'></span></button>"+
			    				"</p>"+
			    		  "</td>");
			    tr.append("</tr>");
			   
			    $("#sTable").append(tr);
			     numer++;
	  	}
	  
	  	}else{
		  	$("#sTable").empty();
		  	tr = $("<tr class='even'>");
		  	tr.append("<td class='ignore'>Brak ocen. </td>");
		  	tr.append("</tr>");
		  	$("#sTable").append(tr);
      	}

      	tr = $("<tr class='even' id='gradetr_"+data[i].id+"' value="+data[i].id+">");
      	tr.append("<td class='ignore'>" + numer + "</td>");
      	tr.append("<td>" + 
			    		"<textarea style='max-width: 300px;'  class='editbox' rows='2' cols='30' id='newTextTitle'></textarea>"+
			    "</td>");
      	tr.append("<td>" + 
			    		"<input type='text'  class='editbox' id='newInputGarde'/>"+
			    	"</td>");
      	tr.append("<td></td>"); 
		tr.append("<td>" + 
      	 			 "<p  data-placement='top' data-toggle='tooltip' title='Dodaj'>"+
			    	 "<button  style='margin-top: 30px;' id='addGrade' class='tablebutton btn btn-success btn-xs' >"+
			    	  "DODAJ</button>"+
      				"</p>"+
      				"</td>");
		 
      	$("#sTable").append(tr);

      	$("#studentPanel").show();
      	$('textarea[id^="textTitle_"]').hide();
		$('input[id^="inputGarde_"]').hide();
		$('button[id^="updateGrade_"]').hide();
		$('button[id^="cancelGrade_"]').hide();
		$("#idGarde").hide();
}
   

    function getGroups(name) {   
        $.ajax({
		     type:"GET",
		     url:url+"/adminstrator/user/group/"+name,
		     dataType: 'json',
		     async: false,
          	procesdata: true,

		  
		     success: onSuccessGroups,
		     error:  function(jqXHR, textStatus, errorThrown) {
		     	console.log('error '+textStatus);
		     }

		});
    }

     function onSuccessGroups(data){
     	

  		for(var i in data){
  			$("#groupsSelectpicker").append("<option value="+i+">"+data[i].id+"</option");
  		}
  	}

	function onSuccessGroupCourses(data){
	  		for(var i in data){
	  			$("#coursesSelectpicker").append("<option value="+i+">"+data[i].name+"</option");
	  		}
	  }

	function getStudents(name, id) {    
       $.ajax({
				type:"GET",
				url:url+"/adminstrator/user/users/"+name+"/"+id,
				dataType: 'json',
				 async: false,
				statusCode: {
					    200: function(data){
					 		 onSuccessGetStudents(data);
						},
						404: function() {
						    annotShow()
						 }
				},
				error:  function(jqXHR, textStatus, errorThrown) {
				if(textStatus > 500){
			    alert("Can not connect to server! " );}
			   
			}
	});
   
}   



