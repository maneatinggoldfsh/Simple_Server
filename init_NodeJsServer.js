//requires
var https = require("https");
var http = require("http");
var fs = require("fs");

//Port
const PORT = 8080;

//Request Handler
function handleRequest(request, response){
	//console.dir(request);
	//if request is for root, serv root text
	if(request.url === "/"){
		console.log(servDate()+" : Request for path: "+request.url);
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('Hello World\nPath: ' + request.url);
	//if request is for the favicon, serv favicon
	} else if(request.url === "/favicon.ico"){
		console.log(servDate()+" : Request for path: "+request.url);

		fs.readFile('.'+request.url, (error, data) => {
  			if (error) throw error;
          	icon = {
	            headers: {
	                'Content-Type': 'image/x-icon',
	            	'Content-Length': data.length,
	            	'Cache-Control': 'public, max-age=' + 86400
	            },
	            body: data
          };
          response.writeHead(200, icon.headers);
          response.end(icon.body);
      	});
    //if request is for any directory, serve that dirs index
	} else if (request.url.substring(request.url.length-1) === "/") {

		try {
		    console.log(servDate()+" : Request for path: "+request.url);
			response.writeHead(200, {'Content-Type': 'text/html'});
			var fileContents = fs.readFileSync('.'+request.url + 'index.html', {encoding: "utf8"});
			response.write(fileContents);
		    response.end();
		}
		catch(error) {
		    if (error.code === 'ENOENT') {
			  console.log('File not found!');
			  show404(request, response);
			} else {
			  throw error;
			}
		}

		// console.log(servDate()+" : Request for path: "+request.url);
		// response.writeHead(200, {'Content-Type': 'text/html'});
		// var fileContents = fs.readFileSync('.'+request.url + 'index.html', {encoding: "utf8"});
		// response.write(fileContents);
	 //    response.end();
	//if none of the above, 404 error
	} else if (request.url.substring(request.url.length-4) === ".css") {

		try {
		    console.log(servDate()+" : Request for path: "+request.url);
			response.writeHead(200, {'Content-Type': 'text/css'});
			var fileContents = fs.readFileSync('.'+request.url, {encoding: "utf8"});
			response.write(fileContents);
		    response.end();
		}
		catch(error) {
		    if (error.code === 'ENOENT') {
			  console.log('File not found!');
			  show404(request, response);
			} else {
			  throw error;
			}
		}

		// console.log(servDate()+" : Request for path: "+request.url);
		// response.writeHead(200, {'Content-Type': 'text/css'});
		// var fileContents = fs.readFileSync('.'+request.url, {encoding: "utf8"});
		// response.write(fileContents);
	 //    response.end();
	//if none of the above, 404 error
	} else if (request.url.substring(request.url.length-3) === ".js") {

		try {
		    console.log(servDate()+" : Request for path: "+request.url);
			response.writeHead(200, {'Content-Type': 'application/javascript'});
			var fileContents = fs.readFileSync('.'+request.url, {encoding: "utf8"});
			response.write(fileContents);
		    response.end();
		}
		catch(error) {
		    if (error.code === 'ENOENT') {
			  console.log('File not found!');
			  show404(request, response);
			} else {
			  throw error;
			}
		}

		// console.log(servDate()+" : Request for path: "+request.url);
		// response.writeHead(200, {'Content-Type': 'application/javascript'});
		// var fileContents = fs.readFileSync('.'+request.url, {encoding: "utf8"});
		// response.write(fileContents);
	 //    response.end();
	//if none of the above, 404 error
	} else if (request.url.substring(request.url.length-4) === ".png") {

		try {
		    console.log(servDate()+" : Request for path: "+request.url);
			response.writeHead(200, {'Content-Type': 'image/png'});
			var fileContents = fs.readFileSync('.'+request.url);
			response.write(fileContents);
		    response.end();
		}
		catch(error) {
		    if (error.code === 'ENOENT') {
			  show404(request, response);
			} else {
			  throw error;
			}
		}

		// console.log(servDate()+" : Request for path: "+request.url);
		// response.writeHead(200, {'Content-Type': 'image/png'});
		// var fileContents = fs.readFileSync('.'+request.url);
		// response.write(fileContents);
	 //    response.end();
	//if none of the above, 404 error
	} else {
	show404(request, response);
	}
}

// function to show 404
function show404(request,response){
	console.log(servDate()+" : 404 Error : Request for path: "+request.url);
		response.writeHead(404, "File Not Found");
		response.end("404 - File Not Found!");
}

//function to show error
function show404(request,response){
	console.log(servDate()+" : 404 Error : Request for path: "+request.url);
		response.writeHead(404, "File Not Found");
		response.end("404 - File Not Found!");
}


//Webserver
var server = http.createServer(handleRequest);
  
server.listen(PORT, function(){
	console.log(servDate() + ' : server running at localhost:'+PORT);
});

//function to give readable date
function servDate(){
var d = new Date(),
    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am',
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm;
}