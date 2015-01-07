 var url = "http://localhost:8080/mstudent"

 $(document).on("change", "#coursesSelectpicker", function(evt){
        var nameChangeGroup = $('#coursesSelectpicker option:selected').html();
        $('#groupsSelectpicker').find('option').remove();
        getGroups(nameChangeGroup);
        $('.selectpicker').selectpicker('refresh');



 });


 $(document).on("click", ".tablebutton", function(evt){


	var wyrazenieDelete = /delete_[0-9]*/;
	var wyrazenieStatusFalse = /statusFalse_[0-9]*/;
// 	var wyrazenieUpdate = /update_[0-9]*/;
// 	var wyrazenieCancel = /cancel_[0-9]*/;

 	var clickButton = $(this).attr('id');

	if( wyrazenieDelete.test(clickButton) ){
		var id = $(this).parent().parent().parent().attr('value');

		var name = $('span[id="userSpan_'+id+'"]').text();
		
		var result = confirm("Czy na pewno chcesz usunąć użytkonika: "+name);
		if ( result== true) {
			$.ajax({
						type:'GET',
					     url:url+"/adminstrator/user/deleteuser/"+id,
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
	//	$('#coursesSelectpicker').find('option').remove();
		}
	}
	else if(wyrazenieStatusFalse.test(clickButton)){
		
 			 id = $(this).parent().parent().parent().attr('value')
 			 
 			
 			$.ajax({
						type:'POST',
					     url:url+"/adminstrator/user/adduser/"+id,
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

// 	var wyrazenieDelete = /delete_[0-9]*/;
// 	var wyrazenieEdit = /edit_[0-9]*/;
// 	var wyrazenieUpdate = /update_[0-9]*/;
// 	var wyrazenieCancel = /cancel_[0-9]*/;

// 	var clickButton = $(this).attr('id');

// 	if( wyrazenieDelete.test(clickButton) ){
// 		var id = $(this).parent().parent().parent().attr('value');

// 		var name = $('input[id="course_'+id+'"]').val();
// 		var group = $('input[id="group_'+id+'"]').val();
		
// 		var result = confirm("Czy na pewno chcesz usunąć Grupę L"+group+" z przedmiotu "+name+"?");
// 		if ( result== true) {
// 			$.ajax({
// 						type:'GET',
// 					     url:"http://localhost:8080/mstudent/adminstrator/courses/deletegroup/"+id,
// 					     async: false,		
// 					     contentType: 'application/x-www-form-urlencoded', 
// 					  	statusCode: {
// 						    200: function() {
// 						      performDelete(id);
// 						  		}
// 						 },
// 					     success: function(){},
// 					     error:  function(jqXHR, textStatus, errorThrown) {
// 					     	if(textStatus > 500){
// 			        		alert("Can not connect to server! " );}
			   
// 					     }
// 					});
// 	//	$('#coursesSelectpicker').find('option').remove();
// 		} 
// 		$("#myTable").empty();
// 		getCourses();
// 				showPages();
// 	}
// 	else if(wyrazenieEdit.test(clickButton)){
		
// 			var id = $(this).parent().parent().parent().attr('value')
			
// 			 $('input[id="course_'+id+'"]').show();
// 			 $('input[id="group_'+id+'"]').show();
// 			 $('button[id="update_'+id+'"]').show();
// 			 $('button[id="cancel_'+id+'"]').show();
// 			 $('span[id="nameSpan_'+id+'"]').hide();
// 			 $('span[id="groupSpan_'+id+'"]').hide();
// 			 $('button[id="edit_'+id+'"]').parent().hide();
// 	}
// 	else if(wyrazenieUpdate.test(clickButton)){

// 			var id = $(this).parent().parent().parent().attr('value');

// 			var name = $('input[id="course_'+id+'"]').val();
// 			var group = $('input[id="group_'+id+'"]').val();

// 			alert(id+" "+name+" "+group);


// 				$.ajax({
// 							type:"GET",
// 						     url:"http://localhost:8080/mstudent/adminstrator/courses/"+group+"/"+name,
// 						     dataType: 'json',
// 						     async: false,

// 						  	statusCode: {
// 							    200: function() {
// 							      cannotChange();
// 							  		},
// 							  		404: function() {
// 							      canChange(id, name, group);
// 							  		}
// 							 },
// 						     success: function(){},
// 						     error:  function(jqXHR, textStatus, errorThrown) {
// 						     	if(textStatus > 500){
// 				        		alert("Can not connect to server! " );}
				   
// 						     }
// 						});

// 			$('input[id="course_'+id+'"]').hide();
// 			$('input[id="group_'+id+'"]').hide();
// 			$('button[id="update_'+id+'"]').hide();
// 			$('button[id="cancel_'+id+'"]').hide();
// 			$('span[id="nameSpan_'+id+'"]').show();
// 			$('span[id="groupSpan_'+id+'"]').show();
// 			$('button[id="edit_'+id+'"]').parent().show();
// 	}
// 	else if(wyrazenieCancel.test(clickButton)){

// 		var id = $(this).parent().parent().parent().attr('value');

// 		$('input[id="course_'+id+'"]').hide();
// 		$('input[id="group_'+id+'"]').hide();
// 		$('button[id="update_'+id+'"]').hide();
// 		$('button[id="cancel_'+id+'"]').hide();
// 		$('span[id="nameSpan_'+id+'"]').show();
// 		$('span[id="groupSpan_'+id+'"]').show();
// 		$('button[id="edit_'+id+'"]').parent().show();

// 		$('input[id="course_'+id+'"]').val($('span[id="nameSpan_'+id+'"]').text());
// 		$('input[id="group_'+id+'"]').val($('span[id="groupSpan_'+id+'"]').text());

// 	}
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

	

	$( ".show" ).click(function() {


		var name = $("#coursesSelectpicker :selected").text(); 
		var id = $("#groupsSelectpicker :selected").text();
				$.ajax({
						type:"GET",
					     url:url+"/adminstrator/user/users/"+name+"/"+id,
					     dataType: 'json',
					     async: false,
					     tatusCode: {
						  		404: function() {
						      cannotShow()
						  		}
						 },
					     success: function(data){ onSuccessGetStudents(data)},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}
			   
					     }
					});

	});
});


	function cannotChange(){
		alert("W tej grupie nie ma zarejestrowanych żadnych studentów"); 
	}

	// function canChange(data){

	// 			$.ajax({
	// 					type:"POST",
	// 				     url:"http://localhost:8080/mstudent/adminstrator/courses/"+id+"?name="+name+"&group="+group,
	// 				     dataType: 'json',
	// 				     async: false,

	// 				  	statusCode: {
	// 					    200: function() {
	// 					  		}
	// 					 },
	// 				     success: function(){alert("jest");},
	// 				     error:  function(jqXHR, textStatus, errorThrown) {
	// 		        		alert("Can not update! " );
			   
	// 				     }
	// 				});
	// 			$('span[id="nameSpan_'+id+'"]').text(name);
	// 			$('span[id="nameSpan_'+id+'"]').css("font-weight","Bold");
	// 			$('span[id="groupSpan_'+id+'"]').css("font-weight","Bold");

	// }

	function performDelete(id){
		var tr = $("#tr_"+id);
        tr.css("background-color","#FF3700");

        tr.fadeOut(400, function(){
            tr.remove();
        });
		alert("Użytkownik  została usunięta");
	}

	

	function addUser(id){
		$('button[id="statusAddTrue_'+id+'"]').show();
		$('button[id="statusFalse_'+id+'"]').hide();
		alert("Użytkownik został dodany do grupy.");
	}
	function showPages()

	{
		$("#myPager").empty();
		$('#myTable').pageMe({pagerSelector:'#myPager',showPrevNext:true,hidePageNumbers:false,perPage:7});
	}


  

  function onSuccessGetStudents(data){
  	var numer = 1;
  	if(data != null){

  		 $("#myTable").empty();
	  	for (var i in data){
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
		     if(parseInt(data[i].status)){
		     	tr.append("<td>"+
		    				"<p  data-placement='top' data-toggle='tooltip' title='D'>"+
		    					"<button id='statusTrue_"+data[i].id+"' class='tablebutton btn btn-success btn-xs' data-title='statusTrue' data-toggle='modal' data-target='#statusTrue' >"+
		    					"<span class='glyphicon glyphicon-ok'></span></button>"+
		    				"</p>"+
		    				"</td>");

		     }else{
		     	 tr.append("<td>"+
		    				"<p  data-placement='top' data-toggle='tooltip' title='Dodaj'>"+
		    					"<button id='statusFalse_"+data[i].id+"' class='tablebutton btn btn-warning btn-xs' data-title='statusFalse' data-toggle='modal' data-target='#statusFalse_' >"+
		    					"<span class='glyphicon glyphicon-remove'></span></button>"+
		    					"<button id='statusAddTrue_"+data[i].id+"' class='tablebutton btn btn-success btn-xs' data-title='statusTrue' data-toggle='modal' data-target='#statusTrue' >"+
		    					"<span class='glyphicon glyphicon-ok'></span></button>"+
		    				"</p>"+
		    				"</td>");
		     }
		    tr.append("<td>"+
		    				"<p data-placement='top' data-toggle='tooltip' title='Delete'>"+
		    					"<button id='delete_"+data[i].id+"' class='tablebutton btn btn-danger btn-xs' data-title='Delete' data-toggle='modal' data-target='#delete' >"+
		    					"<span class='glyphicon glyphicon-trash'></span></button>"+
		    				"</p>"+
		    		  "</td>");
		    tr.append("</tr>");
		   
		    $("#myTable").append(tr);
		     numer++;
	  	}
	  	$('button[id^="statusAddTrue_"]').hide();
	  }else
	  	alert("brak uzytkowników");
  // 		$('input[id^="course_"]').hide();
		// $('input[id^="group_"]').hide();
		// $('button[id^="update_"]').hide();
		// $('button[id^="cancel_"]').hide();
    	// console.log(data);
    	// alert(JSON.stringify(data));
    	// var arg = JSON.parse(data);
    	// alert(arg);
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
        	//	alert("Error... " + textStatus + "        " + errorThrown);
   
		     }

		});
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
        	//	alert("Error... " + textStatus + "        " + errorThrown);
   
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
          	procesdata: true,

		  
		     success: onSuccessGetStudents,
		     error:  function(jqXHR, textStatus, errorThrown) {
		     	console.log('error '+textStatus);
        	//	alert("Error... " + textStatus + "        " + errorThrown);
   
		     }

		});
   
}   



