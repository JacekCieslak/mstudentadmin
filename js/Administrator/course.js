var oldName;
var newName;

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
					     url:"http://localhost:8080/mstudent/adminstrator/courses/"+id,
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
	else if(wyrazenieEdit.test(clickButton)){
		var id = $(this).parent().parent().parent().attr('value')

		 oldName = $('span[id="nameSpan_'+id+'"]').text();
		
		 $('input[id="course_'+id+'"]').show();
		 $('button[id="update_'+id+'"]').show();
		 $('button[id="cancel_'+id+'"]').show();
		 $('span[id="nameSpan_'+id+'"]').hide();
		 $('button[id="edit_'+id+'"]').parent().hide();
	}
	else if(wyrazenieUpdate.test(clickButton)){
		var id = $(this).parent().parent().parent().attr('value');

		 newName = $('input[id="course_'+id+'"]').val();

		
			var TandF = confirm("czy chcesz zmienić nazwę przedmiotu: "+oldName+" na: "+newName);
			if(TandF)
			{	
				$.ajax({
							type:"GET",
						     url:"http://localhost:8080/mstudent/adminstrator/courses/getcourse?name="+newName,
						     dataType: 'json',
						     async: false,

						  	statusCode: {
							    200: function() {
							      cannotChange(newName);
							  		},
							  		404: function() {
							      canChange(oldName, newName);
							  		}
							 },
						     success: function(){},
						     error:  function(jqXHR, textStatus, errorThrown) {
						     	if(textStatus > 500){
				        		alert("Can not connect to server! " );}
				   
						     }
						});
			}

		$('input[id="course_'+id+'"]').hide();
		$('button[id="update_'+id+'"]').hide();
		$('button[id="cancel_'+id+'"]').hide();
		$('span[id="nameSpan_'+id+'"]').show();
		$('button[id="edit_'+id+'"]').parent().show();
	}
	else if(wyrazenieCancel.test(clickButton)){
		var id = $(this).parent().parent().parent().attr('value');

		$('input[id="course_'+id+'"]').hide();
		$('button[id="update_'+id+'"]').hide();
		$('button[id="cancel_'+id+'"]').hide();
		$('span[id="nameSpan_'+id+'"]').show();
		$('button[id="edit_'+id+'"]').parent().show();

		$('input[id="course_'+id+'"]').val($('span[id="nameSpan_'+id+'"]').text());
		$('input[id="group_'+id+'"]').val($('span[id="groupSpan_'+id+'"]').text());
	}


});

$(document).ready(function () {
		getGroupedCourses();
	//	getCourses();
		var oldName;
		var newName;

		$('input[id^="course_"]').hide();
		$('input[id^="group_"]').hide();
		$('button[id^="update_"]').hide();
		$('button[id^="cancel_"]').hide();
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


		var name = $('#newCourse ').val();
		name.toUpperCase();
		var sizeGroup = $('#sizeCourse').val();


		var TandF = confirm("Czy chcesz dodać/zwięjszyć nowy przedmiot: "+name.toUpperCase()+" składającej się z  "+sizeGroup+ " grup?");

		for(i=1 ; i <=parseInt(sizeGroup) ; i++){

				$.ajax({
						type:"GET",
					     url:"http://localhost:8080/mstudent/adminstrator/courses/"+i+"/"+name,
					     dataType: 'json',
					     async: false,

					  	statusCode: {
						    200: function() {
						      cannotupdateCourse(name, i);
						  		},
						  		404: function() {
						      canupdateCourse(name, i);
						  		}
						 },
					     success: function(){},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}
			   
					     }
					});
		}
			// $("#myTable").remove();
			// getCourses();

});
});

	function cannotChange(name){
		alert("Istnieje juz przedmiot: "+name);
	}
	function cannotupdateCourse(name, group){
		alert("Istnieje juz grupa laboratoryjna L"+group+" przedmiotu: "+name);
	}

	// function canupdateCourse(name, groupId){

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

	// 			$('span[id="nameSpan_'+id+'"]').css("font-weight","Bold");
	// 			$('span[id="groupSpan_'+id+'"]').css("font-weight","Bold");

	// }

	

	function canChange(oldName, newName){

				$.ajax({
						type:"POST",
					     url:"http://localhost:8080/mstudent/adminstrator/courses/updatecourses?name="+name,
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

				$('span[id="nameSpan_'+id+'"]').css("font-weight","Bold");
				$('span[id="groupSpan_'+id+'"]').css("font-weight","Bold");

	}

	function canupdateCourse(name, group){

				$.ajax({
						type:"POST",
					     url:"http://localhost:8080/mstudent/adminstrator/courses/updatecourse?name="+name+"&group="+group,
					     dataType: 'json',
					     async: false,

					  	statusCode: {
						    200: function() {
						      alert("Dodano nową grupę: "+name+" L"+group);
						  		}
						 },
					     success: function(){},
					     error:  function(jqXHR, textStatus, errorThrown) {
			        		alert("Can not update! " );
			   
					     }
					});

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


  // function onSuccessGroupCourses(data){
  // 		for(var i in data){
  // 			$(".selectpicker").append("<option value="+data[i].name+">"+data[i].name+"</option");
  // 		}
  //}

  function onSuccessGroupCourses(data){
  	var numer = 1;
  	for (var i in data){
  				//if(i%2 ==0)
  		tr = $("<tr class='even' id='tr_"+numer+"' value="+numer+">");
	    tr.append("<td class='ignore'>" + numer + "</td>");
	    tr.append("<td>" + 
	    			"<span id='nameSpan_"+numer+"'>" + data[i].name + "</span>"+
	    			"<input type='text' value='"+ data[i].name +"' class='editbox' id='course_"+ numer +"'/>"+
	    		  "</td>");
	    tr.append("<td>" + 
	    			"<span  id='groupSpan_"+numer+"'>" + data[i].groupSize + "</span>"+
	    			
	    		  "</td>");
	    tr.append("<td>"+
	    				"<p  data-placement='top' data-toggle='tooltip' title='Edytuj'>"+
	    					"<button id='edit_"+numer+"' class='tablebutton btn btn-primary btn-xs' data-title='Edit' data-toggle='modal' data-target='#edit' >"+
	    					"<span class='glyphicon glyphicon-pencil'></span></button>"+
	    				"</p>"+
	    				"<p  data-placement='top' data-toggle='tooltip' title='Dodaj'>"+
	    					"<button id='update_"+numer+"' class='tablebutton btn btn-success btn-xs' data-title='update' data-toggle='modal' data-target='#update' >"+
	    					"<span class='glyphicon glyphicon-ok'></span></button>"+
	    					"<button id='cancel_"+numer+"' class='tablebutton btn btn-warning btn-xs' data-title='Cancel' data-toggle='modal' data-target='#cancel' >"+
	    					"<span class='glyphicon glyphicon-remove'></span></button>"+
	    				"</p>"+
	    			"</td>");
	    tr.append("<td>"+
	    				"<p data-placement='top' data-toggle='tooltip' title='Delete'>"+
	    					"<button id='delete_"+numer+"' class='tablebutton btn btn-danger btn-xs' data-title='Delete' data-toggle='modal' data-target='#delete' >"+
	    					"<span class='glyphicon glyphicon-trash'></span></button>"+
	    				"</p>"+
	    		  "</td>");
	    tr.append("</tr>");
	    $("#myTable").append(tr);
	     numer++;
  	}
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

// function getCourses() {    
//         $.ajax({
// 		     type:"GET",
// 		     url:"http://localhost:8080/mstudent/adminstrator/courses",
// 		     dataType: 'json',
// 		     async: false,
//           	procesdata: true,

		  
// 		     success: onSuccessCourses,
// 		     error:  function(jqXHR, textStatus, errorThrown) {
// 		     	console.log('error '+textStatus);
//         	//	alert("Error... " + textStatus + "        " + errorThrown);
   
// 		     }

// 		});
   
// }   



