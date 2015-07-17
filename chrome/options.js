fName=document.getElementById("username2");
pass=document.getElementById("password2");
invi=document.getElementById("invi");
button=document.getElementById("save");
var c=1;
function saveldap(){
	var username=document.getElementById("username2").value;
	var time=$('input[name="time"]:checked').val();
	var refresh=$('input[name="refresh"]:checked').val();
	var password=document.getElementById("password2").value;
        login(username,time,password,refresh);
}
function login(username,time,password,refresh){
	$.post("https://netaccess.iitm.ac.in/account/login",
	{userLogin:username,
	userPassword:password},
	function(data,status){
		var checkLogin = data.search("Login failed");
		if(checkLogin != -1){
		invi.innerHTML+="<div class='error'>Save failed...Please check your credentials</div>";
		}
		else{
		chrome.storage.sync.set({'roll':username,'pass':password,'time':time, 'refresh':refresh}, function() {
		});
		invi.innerHTML+="<div class='success'>Save Successful!</div>";
		show();
		}
	});
}
function show(){
	chrome.storage.sync.get({roll:'',pass:''}, function(result) {
		if(result.roll == 1) $("#r1").prop("checked", true);
		else $("#r2").prop("checked", true);
		document.getElementById("username2").value = result.roll;
		document.getElementById("password2").value = result.pass;
	});
}
function check(){
	invi.innerHTML="";
	fName.style.borderColor="#dadada";
	pass.style.borderColor="#dadada";
	if(fName.value==""){
		fName.style.borderColor="red";
		invi.innerHTML+="<div class='error'>Please enter Username</div>";
		c=0;
	}
	if(pass.value==""){
		pass.style.borderColor="red";
		invi.innerHTML+="<div class='error'>Please enter Password</div>";
		c=0;
	}
	if(c){
		saveldap();
	}
	else c=1;
}
window.onload = function() {
	show();
	document.getElementById("save").onclick = function() {check();}
}
