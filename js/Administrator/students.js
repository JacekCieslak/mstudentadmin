 //var url = "http://localhost:8080/mstudent"
 var url = "http://mstudentservice.jelastic.dogado.eu"

 $(document).on("change", "#coursesSelectpicker", function(evt){
        var nameChangeGroup = $('#coursesSelectpicker option:selected').html();
        $('#groupsSelectpicker').find('option').remove();
        getGroups(nameChangeGroup);
        $('.selectpicker').selectpicker('refresh');
 });


 $(document).on("click", ".tablebutton", function(evt){


	var wyrazenieDelete = /delete_[0-9]*/;
	var wyrazenieStatusFalse = /statusFalse_[0-9]*/;

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
  	if(data.length != 0){

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
	  }else{
	  	$("#myTable").empty();
	  	tr = $("<tr class='even'>");
	  	tr.append("<td class='ignore'>Brak użytkowników w tej grupie.</td>");
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
          	procesdata: true,
		     success: onSuccessGetStudents,
		     error:  function(jqXHR, textStatus, errorThrown) {
		     	console.log('error '+textStatus);
   
		     }

		});
   
}   



