window.onload = function(){
	console.log("Go")
	let bdd = ["Achlys-","Aphrodite-","Apollon-","Arès-","Até-","Artémis-","Asclépios-","Athéna-","Atlas-","Borée-","Charon-","Chloris-","Cronos-","Déméter-","Dionysos-","Éole-","Éos-","Éris-","Éros-","Gaïa-","Hadès-","Hébé-","Hécate-","Hélios-","Héphaïstos-","Héra-","Héraclès-","Hermès-","Hestia-","Hygie-","Léto-","Maïa-","Métis-","Minos-","Morphée-","Océanos-","Ouranos-","Pan-","Perséphone-","Ploutos-","Poséidon-","Priape-","Rhadamanthe-","Rhéa-","Séléné-","Thémis-","Thétis-","Triton-","Tyché-","Zéphyr-","Zeus"]
	bdd = bdd.map(name => {
		return name.charAt(0).toLowerCase() + name.slice(1)
	})
	let alphab = getAlphabet(bdd)

	if(typeof(Worker) !== "undefined"){
		console.log("Workers are supported")
		var worker = new Worker("../src/workerHMM.js")
		worker.addEventListener("message", e => {
			switch(e.data.cmd){
				case 'start':
					console.log(e.data.data)
					break
				case 'done':
					console.log("Learning done")
					h = Object.assign(new HMM(), e.data.data)
					worker.terminate()
					break
				case 'console':
					console.log(e.data.data)
					break
				default:
					console.log("Message not understood")
					console.log(e)
			}
		}, false)

		let message = {'cmd': 'learn',
						'database': bdd,
						'nStates': 10,
						'alphab': alphab}
		worker.postMessage(message)
	} else {
		console.log("Workers are not supported")
	}
}