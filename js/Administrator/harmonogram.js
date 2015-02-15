 //var url = "http://localhost:8080/mstudent"
var url = "http://mstudentservice.jelastic.dogado.eu"


  $(document).on("click", ".tablebutton", function(evt){
  		var id = $(this).attr('value');
  		$.ajax({
						type:"GET",
					     url:url+"/administrator/schedule/getschedule/"+id,
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
  		$("#date").html(data[i].day);
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
					     url:url+"/administrator/schedule/deleteschedule/"+id,
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
  			var day = $("#hDay :selected").text();
  			var hour = $("#hHour :selected").text();
  			var week = $("#hWeek :selected").text();
  			var place = $("#hPlace").val();
  			var audytorium = $("#hAudytorium").val();
  			var info = $("#hInformation").val();

  			var wyrazeniePlace = /^([A-Z]+[0-9]*)$/;
  			var wyrazenieAudytorium =/^[A-Z]([0-9a-zA-Z_.,-\[\]()\sąćęłńóśźżĄĘŁŃÓŚŹŻ])*$/;
  			var wyrazeneInfo = /^[A-Z]([0-9a-zA-Z_.,-\[\]()\sąćęłńóśźżĄĘŁŃÓŚŹŻ])*$/;


  			if(wyrazeniePlace.test(place) && wyrazenieAudytorium.test(audytorium) && wyrazeneInfo.test(info)){
	  			var result = confirm("Czy na pewno chcesz dodać to zajęcie?");
				if ( result== true) {
		  			$.ajax({
						type:"GET",
						url:url+"/administrator/schedule/checkschedule/"+hour+"/"+day+"/?week="+week,
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
		  	}else{
		  		var errorMsg = "";
		  		if(wyrazeniePlace.test(place) == false )
		  			errorMsg = errorMsg + "Niepoprawna nazwa miejsca. Nazwa miejsca powinna wyglądać np. B100. Dopuszczalne są wyłaczenie pojedyncza litera oraz cyfry. ";
		  		if(wyrazenieAudytorium.test(audytorium) == false )
		  			errorMsg = errorMsg + "Niepoprawna treść pola audytorium. W miejscu tym mogą występować wszystkie znaki oprócz znaków specjalnych. ";
		  		if(wyrazeneInfo.test(info) == false )
		  			errorMsg = errorMsg + "Niepoprawna treść pola dodatkowe informacje. W miejscu tym mogą występować wszystkie znaki oprócz znaków specjalnych. "
		  		alert(errorMsg);
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
				url:url+"/administrator/schedule/getschedule",
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
 		alert("Istnieje juz zajęcie o tej godzinie.");
 }
 function canInsertHarmonogram(classes, day, hour, week, place, audytorium, info){

 			$.ajax({
				type:"POST",
				url:url+"/administrator/schedule/addschedule?classes="+classes+"&hour="+hour+"&day="+day+"&week="+week+"&place="+place+"&audytorium="+audytorium+"&information="+info,
				dataType: 'json',
				async: false,
				success: function(data){ onSuccessInsertHarmonogram(data)},
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
	var dayArray = ["Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota","Niedziela"];
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

