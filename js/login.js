$( "#form-signin" ).submit(function( event ) {
  event.preventDefault();
  $('#errores').text('');
  $('#ok').text('Comprobando credenciales...');
  login($("#inputLoginid").val(), $("#inputPassword").val(), function(){
  	console.log("change");
  	window.location.replace('index.html');
  });
});