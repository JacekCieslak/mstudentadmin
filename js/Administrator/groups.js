
$(document).on("click", ".tablebutton", function(evt){

	var wyrazenieDelete = /delete_[0-9]*/;
	var wyrazenieEdit = /edit_[0-9]*/;
	var wyrazenieUpdate = /update_[0-9]*/;
	var wyrazenieCancel = /cancel_[0-9]*/;

	var clickButton = $(this).attr('id');

	if( wyrazenieDelete.test(clickButton) ){
		var id = $(this).parent().parent().parent().attr('value');

		var name = $('input[id="course_'+id+'"]').val();
		var group = $('input[id="group_'+id+'"]').val();
		
		var result = confirm("Czy na pewno chcesz usunąć Grupę L"+group+" z przedmiotu "+name+"?");
		if ( result== true) {
			$.ajax({
						type:'GET',
					     url:"http://localhost:8080/mstudent/adminstrator/courses/deletegroup/"+id,
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
		$("#myTable").empty();
		getCourses();
				showPages();
	}
	else if(wyrazenieEdit.test(clickButton)){
		
			var id = $(this).parent().parent().parent().attr('value')
			
			 $('input[id="course_'+id+'"]').show();
			 $('input[id="group_'+id+'"]').show();
			 $('button[id="update_'+id+'"]').show();
			 $('button[id="cancel_'+id+'"]').show();
			 $('span[id="nameSpan_'+id+'"]').hide();
			 $('span[id="groupSpan_'+id+'"]').hide();
			 $('button[id="edit_'+id+'"]').parent().hide();
	}
	else if(wyrazenieUpdate.test(clickButton)){

			var id = $(this).parent().parent().parent().attr('value');

			var name = $('input[id="course_'+id+'"]').val();
			var group = $('input[id="group_'+id+'"]').val();

			alert(id+" "+name+" "+group);


				$.ajax({
							type:"GET",
						     url:"http://localhost:8080/mstudent/adminstrator/courses/"+group+"/"+name,
						     dataType: 'json',
						     async: false,

						  	statusCode: {
							    200: function() {
							      cannotChange();
							  		},
							  		404: function() {
							      canChange(id, name, group);
							  		}
							 },
						     success: function(){},
						     error:  function(jqXHR, textStatus, errorThrown) {
						     	if(textStatus > 500){
				        		alert("Can not connect to server! " );}
				   
						     }
						});

			$('input[id="course_'+id+'"]').hide();
			$('input[id="group_'+id+'"]').hide();
			$('button[id="update_'+id+'"]').hide();
			$('button[id="cancel_'+id+'"]').hide();
			$('span[id="nameSpan_'+id+'"]').show();
			$('span[id="groupSpan_'+id+'"]').show();
			$('button[id="edit_'+id+'"]').parent().show();
	}
	else if(wyrazenieCancel.test(clickButton)){

		var id = $(this).parent().parent().parent().attr('value');

		$('input[id="course_'+id+'"]').hide();
		$('input[id="group_'+id+'"]').hide();
		$('button[id="update_'+id+'"]').hide();
		$('button[id="cancel_'+id+'"]').hide();
		$('span[id="nameSpan_'+id+'"]').show();
		$('span[id="groupSpan_'+id+'"]').show();
		$('button[id="edit_'+id+'"]').parent().show();

		$('input[id="course_'+id+'"]').val($('span[id="nameSpan_'+id+'"]').text());
		$('input[id="group_'+id+'"]').val($('span[id="groupSpan_'+id+'"]').text());

	}
});

$(document).ready(function () {
		getGroupedCourses();
		getCourses();

		
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

	$( ".dodaj" ).click(function() {


		var name = $('.selectpicker  option:selected').text();
		var group = $('#newGroup').val();

		alert(name+" "+group);


			$.ajax({
						type:"GET",
					     url:"http://localhost:8080/mstudent/adminstrator/courses/"+group+"/"+name,
					     dataType: 'json',
					     async: false,

					  	statusCode: {
						    200: function() {
						      cannotChange();
						  		},
						  		404: function() {
						      canInsertGroup(name, group);
						  		}
						 },
					     success: function(){},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}
			   
					     }
					});

	});
});


	function cannotChange(){
		alert("Istnieje juz taki rekord"); 
	}

	function canChange(id, name, group){

				$.ajax({
						type:"POST",
					     url:"http://localhost:8080/mstudent/adminstrator/courses/"+id+"?name="+name+"&group="+group,
					     dataType: 'json',
					     async: false,

					  	statusCode: {
						    200: function() {
						  		}
						 },
					     success: function(){alert("jest");},
					     error:  function(jqXHR, textStatus, errorThrown) {
			        		alert("Can not update! " );
			   
					     }
					});
				$('span[id="nameSpan_'+id+'"]').text(name);
				$('span[id="nameSpan_'+id+'"]').css("font-weight","Bold");
				$('span[id="groupSpan_'+id+'"]').css("font-weight","Bold");

	}


	function canInsertGroup(name, group){

				$.ajax({
						type:"POST",
					     url:"http://localhost:8080/mstudent/adminstrator/courses/addgroup?name="+name+"&group="+group,
					     dataType: 'json',
					     async: false,

					  	statusCode: {
						    200: function() {
						      alert("Dodano nową grupę: "+name+" L"+group);
						      $("#myTable").empty();
						  		}
						 },
					     success: function(){},
					     error:  function(jqXHR, textStatus, errorThrown) {
			        		alert("Can not update! " );
			   
					     }
					});

			getCourses();
				showPages();

	}

	function performDelete(id){
		var tr = $("#tr_"+id);
        tr.css("background-color","#FF3700");

        tr.fadeOut(400, function(){
            tr.remove();
        });
		alert("Grupa została usunięta");
	}
	function showPages()

	{
		$("#myPager").empty();
		$('#myTable').pageMe({pagerSelector:'#myPager',showPrevNext:true,hidePageNumbers:false,perPage:7});
	}


  function onSuccessGroupCourses(data){
  		for(var i in data){
  			$(".selectpicker").append("<option value="+i+">"+data[i].name+"</option");
  		}
  }

  function onSuccessCourses(data){
  	var numer = 1;
  	for (var i in data){
  				//if(i%2 ==0)
  		tr = $("<tr class='even' id='tr_"+data[i].Id+"' value="+data[i].Id+">");
	    tr.append("<td class='ignore'>" + numer + "</td>");
	    tr.append("<td>" + 
	    			"<span id='nameSpan_"+data[i].Id+"'>" + data[i].name + "</span>"+
	    			"<input type='text' value='"+ data[i].name +"' class='editbox' id='course_"+ data[i].Id +"'/>"+
	    		  "</td>");
	    tr.append("<td>" + 
	    			"<span  id='groupSpan_"+data[i].Id+"'>" + data[i].group + "</span>"+
	    			"<input type='text' value='"+ data[i].group +"' class='editbox' id='group_"+ data[i].Id +"'/>"+
	    		  "</td>");
	    tr.append("<td>"+
	    				"<p  data-placement='top' data-toggle='tooltip' title='Edytuj'>"+
	    					"<button id='edit_"+data[i].Id+"' class='tablebutton btn btn-primary btn-xs' data-title='Edit' data-toggle='modal' data-target='#edit' >"+
	    					"<span class='glyphicon glyphicon-pencil'></span></button>"+
	    				"</p>"+
	    				"<p  data-placement='top' data-toggle='tooltip' title='Dodaj'>"+
	    					"<button id='update_"+data[i].Id+"' class='tablebutton btn btn-success btn-xs' data-title='update' data-toggle='modal' data-target='#update' >"+
	    					"<span class='glyphicon glyphicon-ok'></span></button>"+
	    					"<button id='cancel_"+data[i].Id+"' class=' tablebutton btn btn-warning btn-xs' data-title='Cancel' data-toggle='modal' data-target='#cancel' >"+
	    					"<span class='glyphicon glyphicon-remove'></span></button>"+
	    				"</p>"+
	    			"</td>");
	    tr.append("<td>"+
	    				"<p data-placement='top' data-toggle='tooltip' title='Delete'>"+
	    					"<button id='delete_"+data[i].Id+"' class='tablebutton btn btn-danger btn-xs' data-title='Delete' data-toggle='modal' data-target='#delete' >"+
	    					"<span class='glyphicon glyphicon-trash'></span></button>"+
	    				"</p>"+
	    		  "</td>");
	    tr.append("</tr>");
	    $("#myTable").append(tr);
	     numer++;
  	}
  		$('input[id^="course_"]').hide();
		$('input[id^="group_"]').hide();
		$('button[id^="update_"]').hide();
		$('button[id^="cancel_"]').hide();
    	// console.log(data);
    	// alert(JSON.stringify(data));
    	// var arg = JSON.parse(data);
    	// alert(arg);
    }

function getGroupedCourses() {    
        $.ajax({
		     type:"GET",
		     url:"http://localhost:8080/mstudent/common/courses",
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

function getCourses() {    
        $.ajax({
		     type:"GET",
		     url:"http://localhost:8080/mstudent/adminstrator/courses",
		     dataType: 'json',
		     async: false,
          	procesdata: true,

		  
		     success: onSuccessCourses,
		     error:  function(jqXHR, textStatus, errorThrown) {
		     	console.log('error '+textStatus);
        	//	alert("Error... " + textStatus + "        " + errorThrown);
   
		     }

		});
   
}   



