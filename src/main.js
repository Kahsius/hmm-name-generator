window.onload = function(){
	console.log("Go")
	let bdd = ["Achlys-","Aphrodite-","Apollon-","Arès-","Até-","Artémis-","Asclépios-","Athéna-","Atlas-","Borée-","Charon-","Chloris-","Cronos-","Déméter-","Dionysos-","Éole-","Éos-","Éris-","Éros-","Gaïa-","Hadès-","Hébé-","Hécate-","Hélios-","Héphaïstos-","Héra-","Héraclès-","Hermès-","Hestia-","Hygie-","Léto-","Maïa-","Métis-","Minos-","Morphée-","Océanos-","Ouranos-","Pan-","Perséphone-","Ploutos-","Poséidon-","Priape-","Rhadamanthe-","Rhéa-","Séléné-","Thémis-","Thétis-","Triton-","Tyché-","Zéphyr-","Zeus"]
	bdd = bdd.map(name => {
		return name.charAt(0).toLowerCase() + name.slice(1)
	})
	let alphab = getAlphabet(bdd)
	h = new HMM(30, alphab)
	h.fit(bdd)
}