var oldName;
var newName;
var url = "http://localhost:8080/mstudent";
//var url = "http://mstudentservice.jelastic.dogado.eu"

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

		var result = confirm("Czy na pewno chcesz usunąć przedmiot "+name+" wraz ze wszytkimi grupami oraz studentami należacymi do tego przedmiotu?");
		if ( result== true) {
			$.ajax({
						type:'GET',
					     url:url+"/administrator/course/deleteusers/"+name,
					     async: false,
					     contentType: 'application/x-www-form-urlencoded',
					  	statusCode: {
						    200: function() {
						      performDelete(id, name);
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
		 var regCourse = /^[A-Z]([A-Z]|[a-z]|\s|.\.|\-|[0-9])+$/;

		 	if(regCourse.test(newName)){
				var TandF = confirm("czy chcesz zmienić nazwę przedmiotu: "+oldName+" na: "+newName);
				if(TandF)
				{
					$.ajax({
								type:"GET",
							     url:url+"/administrator/course/getcourse?name="+newName,
							     dataType: 'json',
							     async: false,

							  	statusCode: {
								    200: function() {
								      cannotChange(newName);
								  		},
								  		404: function() {
								      canChange(id, oldName, newName);
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
		}else
			alert("Niepoprawna tytuł nowego przedmiotu! Tytuł powinien zaczynać sie z dużej litery i może posiadać znaki  -.,")
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

		var regCourse = /^[A-Z]([A-Z]|[a-z]|\s|.\.|\-|[0-9])+$/;
		var regGroup  = /^(1[0-5]?|[2-9]{1})$/;



		var name = $('#newCourse ').val();
		name = name.toUpperCase();
		var sizeGroup = $('#sizeCourse').val();
		var courseFileNoExist = false;

		if(regCourse.test(name) && regGroup.test(sizeGroup)){
			var TandF = confirm("Czy chcesz dodać/zwięjszyć nowy przedmiot: "+name.toUpperCase()+" składającej się z  "+sizeGroup+ " grup?");
			if(TandF){
				for(i=1 ; i <=parseInt(sizeGroup) ; i++){
						$.ajax({
								type:"GET",
							     url:url+"/administrator/course/courses/"+i+"/"+name,
							     dataType: 'json',
							     async: false,

							  	statusCode: {
								    200: function() {
								    	courseFileNoExist = true;
								      cannotInsertCourse(name, i);
								  		},
								  		404: function() {
								      canInsertCourse(name, i);
								  		}
								 },
							     success: function(){},
							     error:  function(jqXHR, textStatus, errorThrown) {
							     	if(textStatus > 500){
					        		alert("Can not connect to server! " );}

							     }
							});
				}
				if(courseFileNoExist)
					addCourseFile(name);
			}
		}
		else {
			alert("Niepoprawny tytuł przedmiotu lub ilość grup! Tytuł powiniem składać się z dużych znaków. Moze zawierać litery, cyfry oraz znak -. Grupy mogą być z zakresu 1-15.");
			}


	});

	// $("#courses").click(function(){
	// 	alet("click");
	// })
});
	function addCourseFile(name){
		$.ajax({
								type:"POST",
							     url:url+"/file/addcourse?name="+name,
							     dataType: 'json',
							     async: false,
							     success: function(){},
							     error:  function(jqXHR, textStatus, errorThrown) {
							     	if(textStatus > 500){
					        		alert("Can not connect to server! " );}

							     }
							});
	}

	function cannotChange(name){
		alert("Istnieje juz przedmiot: "+name);
	}
	function cannotInsertCourse(name, group){
		alert("Istnieje juz grupa laboratoryjna L"+group+" przedmiotu: "+name);
	}




	function canChange(id, oldName, newName){
				$.ajax({
						type:"POST",
					     url:url+"/administrator/course/updatecourse?oldname="+oldName+"&newname="+newName,
					     dataType: 'json',
					     async: false,

					  	statusCode: {
						    200: function() {
						  		}
						 },
					     success: function(){},
					     error:  function(jqXHR, textStatus, errorThrown) {
			        		alert("Can not update! " );

					     }
					});

				$('span[id="nameSpan_'+id+'"]').css("font-weight","Bold");
				$('span[id="groupSpan_'+id+'"]').css("font-weight","Bold");
				$('span[id="nameSpan_'+id+'"]').text(newName);
	}

	function canInsertCourse(name, group){

				$.ajax({
						type:"POST",
					     url:url+"/administrator/course/insertcourse?name="+name+"&group="+group,
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
			getGroupedCourses();
			showPages();

	}

	function performDelete(id,name){
		$.ajax({
						type:'GET',
					     url:url+"/administrator/course/deletecourse/"+name,
					     async: false,
					     contentType: 'application/x-www-form-urlencoded',
					  	statusCode: {
						    200: function() {
						      var tr = $("#tr_"+id);
						        tr.css("background-color","#FF3700");


								alert("Grupa została usunięta");
						  		}
						 },
					     success: function(){},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}

					     }
					});


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
	    			"<span  id='groupSpan_"+numer+"'>" + data[i].group + "</span>"+

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
		     url:url+"/common/courses",
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



