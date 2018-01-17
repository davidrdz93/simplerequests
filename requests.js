/*  
DESCRIZIONE:
	oggetto che realizza richieste HTTP in modo asincrono.
UTILIZZO:
	- crea istanza da oggetto
	myRequest = new Request('http://myurl.com', 'METHOD', 'responseType');

	- chiama il metodo getResponse passando come parametro una funzione
	  alla quale verra' passata la risposta processata quando verra' disponibile
	 myRequest.getResponse( function(data) => {
		console.log("fai qualcosa con la risposta");
		console.log(data);
	 });
*/


function Request(url, method, responseType) {

	/* 
	responseType:
	1) "" -> DOMString
	2) "arraybuffer" -> ArrayBuffer
	3) "blob" -> Blob
	4) "document" -> Document
	5) "json" -> JSON
	6) "text" -> DOMString
	*/

	/* 
	method:
	"GET", "POST", "PUT", "DELETE", ecc ...
	*/

	this.url = url;
	this.method = method;
	this.responseType = responseType;
	this.data = null;
}

/* Restituisce un oggetto richiesta
 */

Request.prototype.createRequest = function(url, method, responseType) {

		let xhr = new XMLHttpRequest();


		/* The XMLHttpRequest.withCredentials property is a Boolean that indicates 
		 * whether or not cross-site Access-Control requests should be made using 
		 * credentials such as cookies
		 */
		if ("withCredentials" in xhr) {

			// per la maggior parte dei siti
			// inizializza la richiesta
			xhr.open(method, url)
			xhr.responseType = responseType;

		} else if (typeof XDomainRequest != "undefined") {
			// IE8 e IE9
			xhr = new XDomainRequest();
			xhr.open(method, url);
			xhr.responseType = responseType

		} else {
			// CORS not supported
			xhr = null;
		}

		return xhr;

	}

/* Restituisce una Promise dalla richiesta, risolvendola o rigettandola
 */

Request.prototype.makeRequest = function(xhr) {

			let promise = new Promise( (res, rej) => {

				if (xhr === null) {
					rej({error: "CORS not supported"});
				}

				xhr.onload = function() {

				if (this.status === 200) {
					console.log(xhr);
					res(xhr.responseXML);
					}
				else if (this.status !== 200) {
					rej({error: this.status});
					}
				};

				// esegui in caso di errore
				xhr.onerror = function() {
					rej({error: "Error!"});
				}

				// invia la richiesta
				xhr.send();
			});

			return promise;
}

/*  Accedi al valore che la promessa restituice
 *  chiamando una funzione passata come parametro nel caso
 *  in cui la Promise sia risolta
 */

Request.prototype.getResponse = function(func) {

	myRequest = this.createRequest(this.url, this.method, this.responseType);
	promise = this.makeRequest(myRequest);

	// elabora la Promise risolta
	promise.then( (res) =>{
		func(res);
	}).catch( (err) => {
		console.log(err);
	});
}



