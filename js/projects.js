var PROYECTOS;
var CURRENT_PROYECTO;
var USER_FULLNAME;
var USER_LOGINID;

$(document).ready(function(){
	
	listarProyectos();
	mostrarNombreUsuario();

	
	
});


function mostrarNombreUsuario() {
	loadUser(sessionStorage["userid"].replace(/\"/g, ""), function(user) {
		USER_FULLNAME = user.fullname;
		USER_LOGINID = user.loginid;
		$("#username").text(user.loginid);
	});
}

function listarProyectos() {
	$("#main-content").html('<div class="col-sm-12"><table class="table table-bordered table-hover" id="tabla-proyectos"><thead><th>Nombre del proyecto</th><th>Nombre del administrador</th><th>Fecha de creación</th><th>Dueño del repositorio</th><th>Nombre del repositorio</th></thead><tbody id="projectList"></tbody></table></div>');
	$("#project-title").text("Lista de proyectos");
	$("#project-description").text("Lista de los proyectos de los que eres miembro");
	$("#main-botones").html('<button type="button" class="btn btn-info btn-default pull-right" id="crear-proyecto">Crear nuevo proyecto</button>');
	
	$("#crear-proyecto").click( function(){	  		  
	  $("#create-project-modal").modal();
	});

	
  
	loadProjects(function(projects){
		console.log("Load project acabado con "+projects.length+" proyectos");
		PROYECTOS = projects;

		for(var i=0; i<projects.length; i++){
			console.log(projects[0].name);
			$("#projectList").append('<tr><td>'+projects[i].name+'</td><td>'+projects[i].adminName+'</td><td>'+projects[i].creationTimestamp+'</td><td>'+projects[i].repoOwner+'</td><td>'+projects[i].repoName+'</td></tr>');
		} 	

		$("table tr").click( function(){
		  var row = $(this).index();
		  cargarProyecto(PROYECTOS[row].id, function(proyecto) {
		  	mostrarProyecto(proyecto);
		  }); 
		});

	});

	
}



function mostrarProyecto(proyecto) {
	CURRENT_PROYECTO = proyecto;
	$("#project-title").text(proyecto.name);
	$("#project-description").html('<b>Descripción: </b>'+proyecto.description+' <b>Administrador: </b>'+proyecto.adminName);
	$("#main-botones").html('<button type="button" class="btn btn-info btn-default pull-right" id="crear-tarea">Crear nueva tarea</button>');

	if(proyecto.adminName == USER_LOGINID)
	{
		$("#main-botones").append('<button type="button" class="btn btn-info btn-default pull-right" id="add_miembro" style="margin-right: 10px;">Añadir miembro</button>');
	}

	$("#crear-tarea").click( function(){	  		  
	  $("#create-task-modal").modal();
	});
	$("#add_miembro").click( function(){	  		  
	  $("#add-member-modal").modal();
	});

	$("#main-content").html('<div class="col-sm-4 panel-wrapper">'+
            '<div class="panel panel-default panel-custom">'+
                '<div class="panel-heading panel-heading-custom">TAREAS</div>'+
                '<div class="panel-body" id="proposal">'+                    
                '</div>'+
            '</div>'+
            '</div>'+
            '<div class="col-sm-4 panel-wrapper">'+
            '<div class="panel panel-default panel-custom">'+
                '<div class="panel-heading panel-heading-custom">EN PROCESO</div>'+
                '<div class="panel-body" id="in_process">'+                                  
                '</div>'+
            '</div>'+
            '</div>'+
            '<div class="col-sm-4 panel-wrapper">'+
            '<div class="panel panel-default panel-custom">'+
                '<div class="panel-heading panel-heading-custom">COMPLETADAS</div>'+
                '<div class="panel-body" id="completed">'+                
                '</div>'+
            '</div>'+
            '</div>');

	loadTasks(proyecto.id, function(tasks) {

		listarTasks(tasks);
	});
}

function listarTasks(tasks) {
	$("#proposal").html('');
	$("#in_process").html('');
	$("#completed").html('');
	for(var i=0; i<tasks.length; i++){			
			if(tasks[i].state=="proposal")
				$("#proposal").append('<div class="row task-wrapper">'+tasks[i].title+'<button id="'+i+'" style="float:right;" type="button" class="btn btn-info">Ver</button></div>');
			else if(tasks[i].state=="in_process")
				$("#in_process").append('<div class="row task-wrapper">'+tasks[i].title+'<button id="'+i+'" style="float:right;" type="button" class="btn btn-info">Ver</button></div>');
			else if(tasks[i].state=="completed")
				$("#completed").append('<div class="row task-wrapper">'+tasks[i].title+'<button id="'+i+'" style="float:right;" type="button" class="btn btn-info">Ver</button></div>');
		} 

		$("#main-content button").click( function(event){
			event.preventDefault();
			var taskid = this.id;		  
			$('#modal-task-title').text(tasks[taskid].title)
			$('#task-description').text(tasks[taskid].description);
			$('#task-creator').text(tasks[taskid].creatorName);
			$('#task-fecha').text(tasks[taskid].creationTimestamp);
			$('#task-state-select').val(tasks[taskid].state);
			$('#task-items').text("");

			loadItems(CURRENT_PROYECTO.id, tasks[taskid].id, function(items) {
				listarItems(items, tasks[taskid].id);			  	 
			});


			if(tasks[taskid].creatorName == USER_LOGINID)
			{
				$('#add-item-container').show();
			}
			else
			{
				$('#add-item-container').hide();
			}

			$( "#add-item-form" ).unbind();
			$( "#add-item-form" ).submit(function( event ) {
				event.preventDefault();
				this.disabled = true;
				addItem(CURRENT_PROYECTO.id,tasks[taskid].id,$('#item-title').val(), function() {
					loadItems(CURRENT_PROYECTO.id, tasks[taskid].id, function(items) {
						listarItems(items, tasks[taskid].id);			  	 
					});	  		
				});
			});

			$( "#change-task-state" ).unbind();
			$( "#change-task-state" ).submit(function( event ) {
				event.preventDefault();
				
				updateTaskState(CURRENT_PROYECTO.id, tasks[taskid].id, $("#task-state-select").val(), function(task){
					$('#task-modal').modal('toggle');	
					loadTasks(CURRENT_PROYECTO.id, function(tasks) {
						listarTasks(tasks);
					});				  		
				});
			});

			$("#task-modal").modal();
		});
}

function listarItems(pitems, taskid) {
	$('#task-items').html('');
	for(var i=0; i<pitems.length; i++)
  	{		  		
  		if(pitems[i].checked)
  		{
  			$('#task-items').append('<tr><td>'+pitems[i].title+'</td><td class="text-center"><strong>Tarea completada</strong></td></tr>');
  		}
  		else
  		{
  			$('#task-items').append('<tr><td>'+pitems[i].title+'</td><td><button type="button" class="btn btn-info center-block">Marcar como completada</button></td></tr>');
  		}
  	}
  	$("#task-items tr td button").click( function(event){
  		event.preventDefault();
  		var row = $(this).closest('tr').index();
		checkItem(CURRENT_PROYECTO.id, taskid, pitems[row].id, function() {
			loadItems(CURRENT_PROYECTO.id, taskid, function(items) {
	  			listarItems(items, taskid);
	  		});
		});	
	});
}

$( "#create-project-form" ).submit(function( event ) {
  event.preventDefault();
  createProject($("#name").val(), $("#description").val(), $("#githubUser").val(), $("#githubRepo").val(), function(project){
  		$('#create-project-modal').modal('toggle');
  		listarProyectos(project);
  });
});

$( "#create-task-form" ).submit(function( event ) {
  event.preventDefault();
  createTask(CURRENT_PROYECTO.id, $("#createTask-title").val(), $("#createTask-description").val(), function(task){
  		$('#create-task-modal').modal('toggle');
  		cargarProyecto(CURRENT_PROYECTO.id, function(proyecto) {
		  	mostrarProyecto(proyecto);
	  	});
  });
});

$( "#add-member-form" ).submit(function( event ) {
  event.preventDefault();
  $('#add_member_fail').text("");
  $('#add_member_success').text("");
  addMember(CURRENT_PROYECTO.id, $("#member-name").val(), function(task){  		
  		
  });
});

$("#logout").click(function(event) {
	event.preventDefault();
	logout( function() {
		window.location.replace('login.html');
	})
})













