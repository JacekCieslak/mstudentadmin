
 //var url = "http://localhost:8080/mstudent"
 var url = "http://mstudentservice.jelastic.dogado.eu"
 var TandF = false;


 $(document).on("click", ".tablebutton", function(evt){

 	var wyrazenieDelete = /delete_[0-9]*/;
 	var wyrazenieDowload = /download_[0-9]*/;
// 	var wyrazenieUpdate = /update_[0-9]*/;
// 	var wyrazenieCancel = /cancel_[0-9]*/;

 	var clickButton = $(this).attr('id');

	if( wyrazenieDelete.test(clickButton) ){
		var id = $(this).parent().parent().parent().attr('value');

		var nameDocument = $('span[id="nameSpan_'+id+'"]').text();
		var course = $("#coursesSelectpicker :selected").text();
		var fileCourse	=$("#coursesFileSelectpicker :selected").text();
		alert(nameDocument+" course "+course+" fileCourse "+fileCourse+" ID "+id);
		var result = confirm("Czy na pewno chcesz usunąć dokument "+nameDocument+"?");
		var fileDeleted = false;

		if ( result== true) {
			if(fileCourse == "Laboratorium")
				var deleteURL = url+"/file/attachment/delete?file="+nameDocument.toLowerCase()+"&course="+course.toLowerCase()+"&coursetype=laboratorium";
			else
				var deleteURL = url+"/file/attachment/delete?file="+nameDocument.toLowerCase()+"&course="+course.toLowerCase()+"&coursetype=wyklady";
			
				$.ajax({
							type:'GET',
						     url:deleteURL,
						     dataType: 'json',

						     async: false,		
						  	
						     success: function(){},
						     error:  function(jqXHR, textStatus, errorThrown) {
						     	if(textStatus > 500){
				        		alert("Can not connect to server! " );}
				   
						     }
				});
			
	//	$('#coursesSelectpicker').find('option').remove();
		} 
		performDelete(id);

		$("#myTable").empty();
		getCourseFiles(course, fileCourse);
		//getCourseFiles(course, fileCourse);
				showPages();
	}
 });

$(document).ready(function () {
		getGroupedCourses();
		var course = $("#coursesSelectpicker :selected").text();
		var fileCourse	=$("#coursesFileSelectpicker :selected").text();
		getCourseFiles(course, fileCourse);

		
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

	$( '#sub' ).submit( function( e ) {

    	var filePath = $("#sub").children().children().val();
	  	var  splithPath = filePath.split("\\");
	    var regFileName = /^([0-9A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s._-]*.pdf)$/;
		var courseName = $("#coursesSelectpicker :selected").text();
		var fileCourse = $("#coursesFileSelectpicker :selected").text();

		
	    if(regFileName.test(splithPath[2])){
	    		checkFileName(splithPath[2],courseName,fileCourse);
	    		if(TandF != true){
	    			if(fileCourse == "Laboratorium"){
	    						alert("Dodanie labki");
					    	    $.ajax({		
								      url: url+"/file/upload/labs?name="+courseName,
								      type: 'POST',
								      data: new FormData( this ),
								      processData: false,
								      contentType: false
								       
								    });
							 	e.preventDefault();
					}else{
								   $.ajax({		
								      url: url+"/file/upload/course?name="+courseName,
								      type: 'POST',
								      data: new FormData( this ),
								      processData: false,
								      contentType: false
								       
								    });
							 	e.preventDefault();

					}
				 }else
				 alert("Istnieje juz taki dokument dla przedmiotu: "+name+".");
				 e.preventDefault();
		}else{
			alert("Można dodawać wyłacznie pliki z rozszerzeniem .pdf. zawierające litery,cyfry oraz znaki ._-");
			 e.preventDefault();
		}
  	});

	 $( ".show" ).click(function() {
	 	var course = $("#coursesSelectpicker :selected").text();
		var fileCourse	=$("#coursesFileSelectpicker :selected").text();
		getCourseFiles(course, fileCourse);
	 });

});

	function performDelete(id){
		$.ajax({
						type:'GET',
					     url:url+"/administrator/document/deletedocument?id="+id,
					     async: false,		 
					     success: function(){},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}
			   
					     }
					});
		var tr = $("#tr_"+id);
        tr.css("background-color","#FF3700");

        tr.fadeOut(400, function(){
            tr.remove();
        });
		alert("Ocena została usunięta.");
	}

	function canAddDocument(e){

		
	}

	function cannotAddDocument(name){
		alert("Plik o nazwie "+name+" istnieje dla tego przedmiotu.");
		e.preventDefault();
	}

	function checkFileName(documentName, courseName, fileCourse){
		$.ajax({
						type:"GET",
						url:url+"/administrator/document/getdocument/?name="+documentName+"&coursename="+courseName+"&type="+fileCourse,
						dataType: 'json',
						async: false,

						statusCode: {
							200: function() {
								TandF = true;
							},
							404: function() {
								TandF = false;	
								canInsertDocument(documentName,courseName,fileCourse);

														}
						},
					error:  function(jqXHR, textStatus, errorThrown) {
					if(textStatus > 500){
						alert("Can not connect to server! " );}

				}
			});
	}

	function canInsertDocument(documentName,courseName, fileCourse){
		$.ajax({
						type:"POST",
						url:url+"/administrator/document/insertdocument/?name="+documentName+"&coursename="+courseName+"&type="+fileCourse,
						dataType: 'json',
						async: false,
					success: function(){
								var name = $(".selectpicker :selected").text();
								getCourseFiles(name, fileCourse); 
							}, 	
					error:  function(jqXHR, textStatus, errorThrown) {
					if(textStatus > 500){
						alert("Can not connect to server! " );}

				}
			});
	}

	function cannotUploadFile(){
		alert("Nie można wgrać pliku lub nie został on wybrany.");
	}
	
	
	function showPages()

	{
		$("#myPager").empty();
		$('#myTable').pageMe({pagerSelector:'#myPager',showPrevNext:true,hidePageNumbers:false,perPage:7});
	}


  function onSuccessGroupCourses(data){
  		for(var i in data){
  			$("#coursesSelectpicker").append("<option value="+i+">"+data[i].name+"</option");
  		}
  }


  function getCourseFiles(course,fileCourse) {    
        $.ajax({
		     type:"GET",
		     url:url+"/administrator/document/getdocuments?course="+course+"&type="+fileCourse,
		     dataType: 'json',
		     async: false,
          	statusCode: {
						200: function(data) {
							onSuccessCourseFiles(data);
						},
						404: function() {
							cannotShowCourses();
						}
			},
			success: function(){},
		     error:  function(jqXHR, textStatus, errorThrown) {
		     	if(textStatus > 500){
					alert("Can not connect to server! " );}
   
		     }

		});
    }
  function 	cannotShowCourses(){
  	alert("Problem z wyświetleniem listy materiałów.");
  }	

  function onSuccessCourseFiles(data){
  	var numer = 1;
  	if(data.length != 0){
  		$("#myTable").empty();
	  	for (var i in data){
	  				//if(i%2 ==0)
	  		tr = $("<tr class='even' id='tr_"+data[i].id+"' value="+data[i].id+">");
		    tr.append("<td class='ignore'>" + numer + "</td>");
		    tr.append("<td>" + 
		    			"<span id='nameSpan_"+data[i].id+"'>" + data[i].name + "</span>"+
		    		  "</td>");
		    tr.append("<td>" + 
		    			"<span  id='groupSpan_"+data[i].id+"'>" + data[i].course + "</span>"+
		    		  "</td>");
		     tr.append("<td>" + 
		    			"<span  id='typeGroup"+data[i].id+"'>" + data[i].type + "</span>"+
		    		  "</td>");
		    tr.append("<td>"+
		    				"<p  data-placement='top' data-toggle='tooltip' title='Edytuj'>"+
		    					"<button id='download_"+data[i].id+"' class='tablebutton btn btn-primary btn-xs' data-title='Edit' data-toggle='modal' data-target='#edit' >"+
		    					"<span class='glyphicon glyphicon-pencil'></span></button>"+
		    				"</p>"+
		    			"</td>");
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
	  }else{
	  	$("#myTable").empty();
	  	tr = $("<tr class='even'>");
	  	tr.append("<td class='ignore'>Brak materiałów dla tego przedmiotu.</td>");
	  	tr.append("</tr>");
	  	$("#myTable").append(tr);
	  }

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
		     	if(textStatus > 500){
					alert("Can not connect to server! " );}
   
		     }

		});
    }



