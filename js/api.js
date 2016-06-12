//var BASE_URI="http://192.168.1.132:8081/project"
var BASE_URI="http://147.83.7.204:8081/project"

function login(loginid, password, complete){
		
	var uri = BASE_URI + "/login"
	$.post(uri,
		{
			login: loginid,
			password: password
		}).done(function(authToken){				
			sessionStorage["auth-token"] = JSON.stringify(authToken.token);	
			sessionStorage["userid"] = JSON.stringify(authToken.userid);					
			complete();
		}).fail(function(jqXHR, textStatus, errorThrown){
			var code = jqXHR.status;
			if(code == 400)
			{
				$('#errores').text("Usuario o contraseña incorrectos");
			}

		}
	);	
}

function register(fullname, loginid, password, email, githubUsername, githubPassword, complete){
		
	var uri = BASE_URI + "/users"
	var githubauth = 'Basic '+ btoa(githubUsername+ ':' + githubPassword);
	$.post(uri,
		{
			loginid: loginid,
			password: password,
			email: email,
			fullname: fullname,
			githubauth: githubauth
		}).done(function(authToken){				
			sessionStorage["auth-token"] = JSON.stringify(authToken);
			complete();
		}).fail(function(jqXHR, textStatus, errorThrown){
			var code = jqXHR.status;
			if(code == 400)
			{
				$('#errores').text("Tus datos de github son incorrectos");
			}
			if(code == 409)
			{
				$('#errores').text("El usuario ya existe");
			}
			else if(code >= 500)
			{
				$('#errores').text("Error en el servidor");
			}

		}
	);	
}

function loadProjects(complete){
	// var authToken = JSON.parse(sessionStorage["auth-token"]);
	// var uri = authToken["links"]["current-stings"].uri;
	var uri = BASE_URI + "/projects"	
	var token = sessionStorage["auth-token"].replace(/\"/g, "");	

	$.ajax({
    	type: 'GET',
   		url: uri,
   		dataType: 'json',   		
    	headers: {
        	"X-Auth-Token":token
    	}
    }).done(function(data) { 
    	
    	complete(data["projects"]);
    	
  	}).fail(function(){
  		console.log("Error en loadProjects");
  	});
}

function loadTasks(projectid, complete){
	// var authToken = JSON.parse(sessionStorage["auth-token"]);
	// var uri = authToken["links"]["current-stings"].uri;
	var uri = BASE_URI + "/projects/"+projectid+"/tasks"	
	var token = sessionStorage["auth-token"].replace(/\"/g, "");	

	$.ajax({
    	type: 'GET',
   		url: uri,
   		dataType: 'json',   		
    	headers: {
        	"X-Auth-Token":token
    	}
    }).done(function(data) { 
    	
    	complete(data["tasks"]);
    	
  	}).fail(function(){
  		console.log("Error en loadTasks");
  	});
}

function loadUser(userid, complete) {
	var uri = BASE_URI + "/users/"+userid;
	var token = sessionStorage["auth-token"].replace(/\"/g, "");	

	$.ajax({
    	type: 'GET',
   		url: uri,
   		dataType: 'json',   		
    	headers: {
        	"X-Auth-Token":token
    	}
    }).done(function(data) { 
    	
    	complete(data);
    	
  	}).fail(function(){
  		console.log("Error en loadTasks");
  	});
}

function createProject(nombre, descripcion, repoOwner, repoName, complete) {
	var uri = BASE_URI + "/projects";
	var token = sessionStorage["auth-token"].replace(/\"/g, "");	

	$.ajax({
    	type: 'POST',
   		url: uri,
   		dataType: 'json',   		
    	headers: {
        	"X-Auth-Token":token
    	},
    	data: {
    		"name": nombre,
    		"description": descripcion,
    		"repoOwner": repoOwner,
    		"repoName": repoName
    	}
    }).done(function(data) { 
    	
    	complete(data);
    	
  	}).fail(function(){
  		console.log("Error en createProject");
  	});
}

function createTask(projectid, titulo, descripcion, complete) {
	var uri = BASE_URI + "/projects/"+projectid+"/tasks";
	var token = sessionStorage["auth-token"].replace(/\"/g, "");	

	$.ajax({
    	type: 'POST',
   		url: uri,
   		dataType: 'json',   		
    	headers: {
        	"X-Auth-Token":token
    	},
    	data: {
    		"title": titulo,
    		"description": descripcion
    		 		
    	}
    }).done(function(data) { 
    	
    	complete(data);
    	
  	}).fail(function(){
  		console.log("Error en createTask");
  	});
}

function cargarProyecto(projectid, complete) {
	var uri = BASE_URI + "/projects/"+projectid;
	var token = sessionStorage["auth-token"].replace(/\"/g, "");	

	$.ajax({
    	type: 'GET',
   		url: uri,
   		dataType: 'json',   		
    	headers: {
        	"X-Auth-Token":token
    	}    	
    }).done(function(data) {     	
    	complete(data);    	
  	}).fail(function(){
  		console.log("Error en cargarProyecto");
  	});
}

function addMember(projectid, userid, complete) {
	var uri = BASE_URI + "/projects/"+projectid+"/members";
	var token = sessionStorage["auth-token"].replace(/\"/g, "");	

	$.ajax({
    	type: 'POST',
   		url: uri,
   		dataType: 'json',   		
    	headers: {
        	"X-Auth-Token":token
    	},
    	data: {
    		"loginid": userid
    	}    	
    }).done(function(data) {  
    	$('#add_member_success').text("Usuario añadido correctamente");   	
    	complete(data);    	
  	}).fail(function(jqXHR, textStatus, errorThrown){
  		var code = jqXHR.status;
		if(code == 409)
		{
			$('#add_member_fail').text("Este usuario ya es miembro");
		}
		if(code == 400)
		{
			$('#add_member_fail').text("El usuario no existe");
		}		
  		console.log("Error en addMember");
  	});
}

function loadItems(projectid, taskid, complete){
  // var authToken = JSON.parse(sessionStorage["auth-token"]);
  // var uri = authToken["links"]["current-stings"].uri;
  var uri = BASE_URI + "/projects/"+projectid+"/tasks/"+taskid+"/checklist"  
  var token = sessionStorage["auth-token"].replace(/\"/g, "");  

  $.ajax({
      type: 'GET',
      url: uri,
      dataType: 'json',       
      headers: {
          "X-Auth-Token":token
      }
    }).done(function(data) { 
      
      complete(data["checklistItems"]);
      
    }).fail(function(){
      console.log("Error en loadItems");
    });
}

function addItem(projectid, taskid, title, complete) {
  var uri = BASE_URI + "/projects/"+projectid+"/tasks/"+taskid+"/checklist";
  var token = sessionStorage["auth-token"].replace(/\"/g, "");  

  $.ajax({
      type: 'POST',
      url: uri,
      dataType: 'json',       
      headers: {
          "X-Auth-Token":token
      },
      data: {
        "title": title
      }     
    }).done(function(data) {             
      complete(data);     
    }).fail(function(jqXHR, textStatus, errorThrown){ 
      console.log("Error en addMember");
    });
}

function checkItem(projectid, taskid, itemid, complete) {
  var uri = BASE_URI + "/projects/"+projectid+"/tasks/"+taskid+"/checklist/"+itemid;
  var token = sessionStorage["auth-token"].replace(/\"/g, "");  

  $.ajax({
      type: 'POST',
      url: uri,
      dataType: 'json',       
      headers: {
          "X-Auth-Token":token
      }           
    }).done(function(data) {             
      complete(data);     
    }).fail(function(jqXHR, textStatus, errorThrown){ 
      console.log("Error en checkItem");
    });

}

function updateTaskState(projectid, taskid, state, complete) {
  var uri = BASE_URI + "/projects/"+projectid+"/tasks/"+taskid;
  var token = sessionStorage["auth-token"].replace(/\"/g, "");  

  $.ajax({
      type: 'PUT',
      url: uri,
      dataType: 'json',       
      headers: {
          "X-Auth-Token":token
      },
      data: {
        "state": state
      }           
    }).done(function(data) {             
      complete(data);     
    }).fail(function(jqXHR, textStatus, errorThrown){ 
      console.log("Error en updateTaskState");
    });
}
