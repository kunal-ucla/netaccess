var speedi=0.0;
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
			document.getElementById("status").innerHTML+="<center>SPEED IS "+speedi/i+"</center>";
			var elem = document.getElementById('pid');
    		elem.parentNode.removeChild(elem);
		}
    }
    xmlHTTP.send();
}
window.onload = function() {
    var download=new Image();
    download.load(0,5,0);
}