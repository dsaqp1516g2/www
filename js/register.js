$( "#form-register" ).submit(function( event ) {
  event.preventDefault();
  register($("#inputFullname").val(), $("#inputLoginid").val(), $("#inputPassword").val(), $("#inputEmail").val(), $("#inputGithubUsername").val(), $("#inputGithubPassword").val(), function(){
  	console.log("change");
  	window.location.replace('login.html');
  });
});