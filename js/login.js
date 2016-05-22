$( "#form-signin" ).submit(function( event ) {
  event.preventDefault();
  login($("#inputLoginid").val(), $("#inputPassword").val(), function(){
  	console.log("change");
  	window.location.replace('beeter.html');
  });
});