 var url = "http://localhost:8080/mstudent"
//var url = "http://mstudentservice.jelastic.dogado.eu"


  $(document).on("click", ".tablebutton", function(evt){
  		var id = $(this).attr('value');
  		$.ajax({
						type:"GET",
					     url:url+"/adminstrator/schedule/getschedule/"+id,
					     dataType: 'json',
					     async: false,
					     success: function(data){ getScheduleId(data, id)},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}
			   
					     }
				});
  				$("#preview").show();
  		
  });

  function getScheduleId(data,id){
  	for(var i in data){
  		$("#course").html(data[i].classes);
  		if(data[i].day == "1"){
  			$("#date").html("Poniedziałek");
  		}else if(data[i].day == "2"){
  			$("#date").html("Wtorek");
  		}else if(data[i].day == "3"){
  			$("#date").html("Środa");
  		}else if(data[i].day == "4"){
  			$("#date").html("Czwartek");
  		}else if(data[i].day == "5"){
  			$("#date").html("Piątek");
  		}else if(data[i].day == "6"){
  			$("#date").html("Sobota");
  		}else if(data[i].day == "7"){
  			$("#date").html("Niedziela");
  		}
  		$("#place").html(data[i].place);
  		$("#week").html(data[i].week);
  		$("#classes").html(data[i].place);
  		$("#audy").html(data[i].audytorium);
  		if(data[i].information === undefined)
  			$("#info").html("");
  		else
  			$("#info").html(data[i].information);
  	}
  	$("#id").html(id);
  }


 $(document).ready(function () {
 		createHarmonogram();
 		$("#preview").hide();
 
 		$("#zwin").click(function(){
  			$("#preview").hide();
  		});
 			$("#id").hide();


  		$("#delete").click(function(){

  		var id = $("#id").html();
  			
		var result = confirm("Czy na pewno chcesz usunąć to zajęcia?");
		if ( result== true) {
			$.ajax({
						type:'GET',
					     url:url+"/adminstrator/schedule/deleteschedule/"+id,
					     async: false,		
					     contentType: 'application/x-www-form-urlencoded', 
					  	statusCode: {
						    200: function() {
						      		performDelete();
						  		}
						 },
					     success: function(){},
					     error:  function(jqXHR, textStatus, errorThrown) {
					     	if(textStatus > 500){
			        		alert("Can not connect to server! " );}
			   
					     }
			});
			$("#preview").hide();
		}

  		});

  		$("#addSChedule").click(function(){
  			var classes = $("#hClasses :selected").text();
  			var day = $("#hDay :selected").val();
  			var hour = $("#hHour :selected").text();
  			var week = $("#hWeek :selected").text();
  			var place = $("#hPlace").val();
  			var audytorium = $("#hAudytorium").val();
  			var info = $("#hInformation").val();


  			var result = confirm("Czy na pewno chcesz dodać to zajęcie?");
			if ( result== true) {
	  			$.ajax({
					type:"GET",
					url:url+"/adminstrator/schedule/checkschedule/"+hour+"/"+day+"/?week="+week,
					dataType: 'json',
					async: false,
					statusCode: {
							    200: function() {
							      cannotInsertHarmonogram();
							  		},
							  		404: function() {
							     canInsertHarmonogram(classes, day, hour, week, place, audytorium, info)
							  		}
							 },
					success: function(data){ },
					error:  function(jqXHR, textStatus, errorThrown) {
						if(textStatus > 500){
					    	alert("Can not connect to server! " );}
						
					}
				});
	  		}

  		});

 });

 function performDelete(){
 	alert("Zajęcie zostało usunięte z harmonogramu.");
 	$("#myTable").empty();
	createHarmonogram();
 }

 function createHarmonogram(){
 			$.ajax({
				type:"GET",
				url:url+"/adminstrator/schedule/getschedule",
				dataType: 'json',
				async: false,
				success: function(data){ onSuccessCreateHarmonogram(data)},
				error:  function(jqXHR, textStatus, errorThrown) {
					if(textStatus > 500){
				    	alert("Can not connect to server! " );}
					
				}
			});
 }
 function cannotInsertHarmonogram(){
 		alert("Istnieje juz takie zajcię");
 }
 function canInsertHarmonogram(classes, day, hour, week, place, audytorium, info){

 			$.ajax({
				type:"POST",
				url:url+"/adminstrator/schedule/addschedule?classes="+classes+"&hour="+hour+"&day="+day+"&week="+week+"&place="+place+"&audytorium="+audytorium+"&information="+info,
				dataType: 'json',
				async: false,
				success: function(data){ onSuccessInsertHarmonogram()},
				error:  function(jqXHR, textStatus, errorThrown) {
					if(textStatus > 500){
				    	alert("Can not connect to server! " );}
					
				}
			});
 }

function onSuccessInsertHarmonogram(){
	alert("Dodano nowe zajęcie do harmonogramu.")
	$("#myTable").empty();
	createHarmonogram();
}

function  onSuccessCreateHarmonogram(data)
{
	var dayArray = ["1","2","3","4","5","6","7"];
	for(var h = 8 ; h <=20 ; h++ )
	{
		tr = $("<tr>");	
		tr.append("<td class='first' >"+h+" - "+(h+1)+"</td>");
		var  l = 0;
		var status = false;
		var trBodyArray = [];
		for(var d = 0 ; d < 7 ; d++,l++){

			var tdBody ;
			
			for(var i in data)
			if(h === data[i].hour){
				

				
				if(dayArray[d] === data[i].day){
					if(l % 2 === 0){
						status = true;
						if(data[i].classes === 'Wykład')
							tr.append("<td class='next'><button value='"+data[i].id+"' id='show_"+data[i].id+"' class='tablebutton btn btn-success btn-sm'><span ><bold>W</bold></span></button></td>");
						else if(data[i].classes === 'Konsultacje')
							tr.append("<td class='next'><button value='"+data[i].id+"' id='show_"+data[i].id+"' class='tablebutton btn btn-warning btn-sm'><span ><bold>K</bold></span></button></td>");
						else if(data[i].classes === 'Laboratorium')
							tr.append("<td class='next'><button value='"+data[i].id+"'id='show_"+data[i].id+"' class='tablebutton btn btn-danger btn-sm'><span ><bold>L</bold></span></button></td>");
					}else{
						status = true;
						if(data[i].classes === 'Wykład')
							tr.append("<td class='second'><button value='"+data[i].id+"' id='show_"+data[i].id+"' class='tablebutton btn btn-success btn-sm'><span ><bold>W</bold></span></button></td>");
						else if(data[i].classes === 'Konsultacje')
							tr.append("<td class='second'><button value='"+data[i].id+"'i id='show_"+data[i].id+"' class='tablebutton btn btn-warning btn-sm'><span ><bold>K</bold></span></button></td>");
					else if(data[i].classes === 'Laboratorium')
							tr.append("<td class='next'><button value='"+data[i].id+"' id='show_"+data[i].id+"' class='tablebutton btn btn-danger btn-sm'><span ><bold>L</bold></span></button></td>");
					}
				}
			}
			if(status !== true){
				if(l % 2 === 0)
					tr.append("<td class='next'></td>");
				else
				  tr.append("<td class='second'></td>");	
			}
			status = false;
			
		}
		tr.append("</tr>");
		$("#myTable").append(tr);
	}
	
}
 	
