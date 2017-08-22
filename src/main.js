window.onload = function(){
	console.log("Go")
	h = new HMM(4, ["a","b","c","d"])
	bdd = ["abd","acd","abdacd","acdabd","abdabd"]
	h.fit(bdd)
}