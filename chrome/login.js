// function login(){
// 	chrome.storage.sync.get({roll:'',pass:''}, function(result) {
// 		$.post("https://netaccess.iitm.ac.in/account/login",
// 		{userLogin:result.roll,
// 		userPassword:result.pass},
// 		function(data,status){
// 			var checkLogin = data.search("Login failed");
// 			if(checkLogin != -1) console.log("Login failed...Please check your Username and Password");
// 			else{
// 			chrome.storage.sync.set({'status':"#netaccess"}, function() {});
// 			chrome.storage.sync.get({roll:'',pass:'',status:'',refresh:''}, function(result) {
// 			$("button").removeClass("active").addClass("default");$(result.status).removeClass("default").addClass("active");
// 			//if(result.refresh == "1"){setInterval(approve(),100000);}
// 			});
// 			}
// 		});
// 	});
// }
function approve(){
	chrome.storage.sync.get({roll:'',pass:'',time:'',rval:'',status:''}, function(result) {
		if(result.status=='#hproxy' || result.status=='#fbproxy') chrome.webRequest.onAuthRequired.addListener(callbackFn,{urls: ["<all_urls>"]},['blocking'] );
		else if(result.status=='#oproxy');
		else{
			$.post("https://netaccess.iitm.ac.in/account/login",
				{userLogin:result.roll,userPassword:result.pass},
				function(data,status){
					var checkLogin = data.search("Login failed");
					if(checkLogin != -1) console.log("Login failed...Please check your Username and Password");
					else{
						chrome.storage.sync.set({'status':"#netaccess"}, function() {});
						chrome.storage.sync.get({status:''}, function(result2) {
							$("button").removeClass("active").addClass("default");$(result2.status).removeClass("default").addClass("active");
						});
					}
					var success =  $($.parseHTML(data)).find("div.alert-success");
					array = success.html().split(" ");
					var i;
					for (i = 0; i < array.length; ++i) {
						if(isNaN(array[i]) || array[i]=="") console.log("Error during login");
						else{
							var memory = parseInt(array[i],10)+array[i+1].slice(0,1);
							chrome.browserAction.setBadgeText({text: memory.toString()});
						}
					}
				}
			);
			if(result.rval != 0){
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
						if(isNaN(array[i]) || array[i]=="") console.log("just passing by till i get a number");
						else{
							var memory = parseInt(array[i],10)+array[i+1].slice(0,1);
							chrome.browserAction.setBadgeText({text: memory.toString()});
						}
					}
				});
			}
		}
	});
}
function callbackFn(details) {
    chrome.storage.sync.get({roll:'',pass:'',status:''}, function(result) {
	    if (result.status=='#hproxy' || reult.status=='#fbproxy'){
		    return details.isProxy === !0 ? {
		        authCredentials: {
		            username: result.roll,
		            password: result.pass
		        }
	    	} : {};
	    }
    });
}

function startBackgroundProcess() {
    approve();console.log("YIII");
    chrome.storage.sync.get({rval:'',rtype:''}, function(result) {
        if(result.rval == 0) setTimeout(startBackgroundProcess, 1000 * 60 * 5);//defualt
        else setTimeout(startBackgroundProcess, 1000 * result.rval * result.rtype);
    });
}

window.onload = function(){
	startBackgroundProcess();
}
