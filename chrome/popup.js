var config;var speedi=0.0;
var hostname="hproxy.iitm.ac.in";
var portnum=3128;
var moder="fixed_servers";
var save = {};
var roll;
var pass;
var status;
function proxyset(x){
	if(x==0) moder="direct";
	else if(x==3){moder="system";status="#sysproxy";}
	else if(x==1){moder="fixed_servers";hostname="hproxy.iitm.ac.in";portnum=3128;status="#hproxy";}
	else if(x==2){moder="fixed_servers";hostname="fbproxy.iitm.ac.in";portnum=3333;status="#fbproxy";}
	else if(x==4){moder="fixed_servers";hostname="10.93.0.37";portnum=3333;status="#oproxy";}
	chrome.storage.sync.set({'status':status}, function() {});
	chrome.storage.sync.get({roll:'',pass:'',status:''}, function(result) {
	$("button").removeClass("active").addClass("default");$(result.status).removeClass("default").addClass("active");
	});
	config = {
      		mode: moder,
      		rules: {
		  proxyForHttp: {
		    scheme: "http",
		    host: hostname,
		    port: portnum,
		  },
		  proxyForHttps: {
		    scheme: "http",
		    host: hostname,
		    port: portnum,
		  },
		  bypassList: ["*.iitm.ac.in"]
		}
	};
	myFunction(x);
}
function myFunction(x) {
	chrome.proxy.settings.set(
          {value: config, scope: 'regular'},
          function() {});
	if(x==1 || x==2){
		chrome.webRequest.onAuthRequired.addListener(
            callbackFn,
            {urls: ["<all_urls>"]},
            ['blocking'] );
	}
}
function login(){
	proxyset(0);
	chrome.storage.sync.get({roll:'',pass:''}, function(result) {
		$.post("https://netaccess.iitm.ac.in/account/login",
		{userLogin:result.roll,
		userPassword:result.pass},
		function(data,status){
			var checkLogin = data.search("Login failed");
			if(checkLogin != -1) alert("Login failed...Please check your Username and Password in Options tab");
			else{
			status="#netaccess";
			chrome.storage.sync.set({'status':status}, function() {});
			chrome.storage.sync.get({roll:'',pass:'',status:''}, function(result) {
			$("button").removeClass("active").addClass("default");$(result.status).removeClass("default").addClass("active");
			});
			approve();
			}
		});
	});
}
function approve(){
	chrome.storage.sync.get({time:''}, function(result) {
		$.ajax({
		type: "POST",
		url: "https://netaccess.iitm.ac.in/account/approve",
		data: {duration:result.time,approveBtn:""}
		})
		.done(function(response){
			var success =  $($.parseHTML(response)).find("div.alert-success");
			array = success.html().split(" ");
			var i;
			for (i = 0; i < array.length; ++i) {
			if(isNaN(array[i]) || array[i]==""){}
			else{
			var memory = parseInt(array[i],10)+array[i+1].slice(0,1);
			chrome.browserAction.setBadgeText({text: memory.toString()});
			}
			}
		});
	});
}
Image.prototype.load = function(i, max, speedi, callback ) {
    var url="http://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Logo_Google_2013_Official.svg/750px-Logo_Google_2013_Official.svg.png"+"?n="+Math.random();
    var startTime, endTime;
    var progressBar;
	var downloadSize = 32796	;
    var thisImg = this,
        xmlHTTP = new XMLHttpRequest();

    if(i!=0) document.getElementById("pid").value = i*100;

    xmlHTTP.open( 'GET', url , true );
    xmlHTTP.responseType = 'arraybuffer';

    xmlHTTP.onload = function( e ) {
        var h = xmlHTTP.getAllResponseHeaders(),
            m = h.match( /^Content-Type\:\s*(.*?)$/mi ),
            mimeType = m[ 1 ] || 'image/png';
            // Remove your progress bar or whatever here. Load is done.

        var blob = new Blob( [ this.response ], { type: mimeType } );
        thisImg.src = window.URL.createObjectURL( blob );
        if ( callback ) callback( this );
    };

    xmlHTTP.onprogress = function( e ) {
    	document.getElementById("pid").value = i*100;
        if ( e.lengthComputable ) document.getElementById("pid").value += parseInt( ( e.loaded / e.total ) * 100 );
        //console.log(document.getElementById("pid").value);
        // Update your progress bar here. Make sure to check if the progress value
        // has changed to avoid spamming the DOM.
        // Something like: 
        // if ( prevValue != thisImage completedPercentage ) display_progress();
    };

    xmlHTTP.onloadstart = function() {
        // Display your progress bar here, starting at 0
        if(i==0){
        	progressBar = document.createElement("progress");
		    progressBar.value = 0;
		    //progressBar.setAttribute('class', 'pstyle');
		    progressBar.setAttribute('id', 'pid');
		    progressBar.max = 100*max;
		    c = document.body.appendChild(progressBar);
		    //$("#checkspeed").removeClass("default").addclass("act");
		    //c.className = "pstyle";
		}
        startTime = (new Date()).getTime();
        //thisImg.completedPercentage = 0;
        //document.getElementById("pid").value += thisImg.completedPercentage;
    };

    xmlHTTP.onloadend = function() {
        //remove your progress bar here.
        //thisImg.completedPercentage = 100;
        endTime = (new Date()).getTime();
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
		var speedBps = (bitsLoaded / duration);
		var speedKbps = (speedBps / 1024);
		var speedMbps = (speedKbps / 1024);
		speedi += speedMbps;
	    i++;
	    document.getElementById("pid").value = i*100;
	    console.log(i+" "+max)
		if(i<max){
			var download=new Image();
			download.load(i,max,speedi);
		}
		else if(i==max){
			$("body").append("<div class='stest'><center>Speed is "+(speedi/i).toFixed(2)+" Mbps</center><div>");
			var elem = document.getElementById('pid');
    		elem.parentNode.removeChild(elem);
    		$("#checkspeed").toggleClass("butt act");
    		document.getElementById("checkspeed").disabled=false;
		}
    }
    xmlHTTP.send();
}
function callbackFn(details) {
    chrome.storage.sync.get({roll:'',pass:'',status:''}, function(result) {
	    if (result.status=='#hproxy' || result.status=='#fbproxy'){
		    return details.isProxy === !0 ? {
		        authCredentials: {
		            username: result.roll,
		            password: result.pass
		        }
	    	} : {};
	    }
    });
}
window.onload = function() {
	chrome.storage.sync.get({roll:'',pass:'',status:''}, function(result) {
		if(result.roll == ""){
			$("#status").html("<center><b>Please save your details here</b></center>");
			$("#opt").toggle();$("#options").toggleClass("butt act");
			var inter = setInterval(function(){
				var ifram = $("#opt").contents().find("html").html();
				var icheck = ifram.search("Successful!");
				if(icheck != -1){
					chrome.storage.sync.set({'status':"#netaccess"}, function() {});
					chrome.storage.sync.get({roll:'',pass:'',status:''}, function(result2) {
						$("#status").html("<center><b>Logged in as "+result2.roll+"</b></center>");
						$("button").removeClass("active").addClass("default");
						$(result2.status).removeClass("default").addClass("active");
					});
					$("#opt").toggle();$("#options").toggleClass("butt act");
					clearInterval(inter);
				}
			},1000);
			status="#sysproxy";
			chrome.storage.sync.set({'status':status}, function() {});
			chrome.storage.sync.get({roll:'',pass:'',status:''}, function(result) {
				$("button").removeClass("active").addClass("default");
				$(result.status).removeClass("default").addClass("active");
			});
		}
		else $("#status").html("<center><b>Logged in as "+result.roll+"</b></center>");
		$("button").removeClass("active").addClass("default");
		$(result.status).removeClass("default").addClass("active");
	});
	document.getElementById("netaccess").onclick = function() {login();}
	document.getElementById("hproxy").onclick = function() {proxyset(1);}
	document.getElementById("fbproxy").onclick = function() {proxyset(2);}
	document.getElementById("sysproxy").onclick = function() {proxyset(3);}
	document.getElementById("oproxy").onclick = function() {proxyset(4);}
	document.getElementById("options").onclick = function() {
		$("#opt").toggle();$("#options").toggleClass("butt act");
	}
	document.getElementById("checkspeed").onclick = function() {
		var download=new Image();
		download.load(0,15,0);
		$("#checkspeed").toggleClass("butt act");
		document.getElementById("checkspeed").disabled=true;
	}
}
      
