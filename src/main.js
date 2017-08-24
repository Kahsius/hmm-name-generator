window.onload = function(){

	$("button.buttonInput").on("click", function(e){
		console.log("click")

		var ctx = $("#chart")
		var chart = new Chart(ctx,{
			type:'line',
			labels:[],
			data:{datasets:[{
				label: "Score evolution",
				data:[],
				fill:false
			}]}
		})
		chart.canvas.parentNode.style.height = "400px"
		chart.canvas.parentNode.style.width = "400px"

		$("button[name=generateButton]").css("display","none")
		$("#myProgress").css("display","block")
		$("#myBar").css("width","0px")
		$("div[name=randomName]").html("")

		let nStates = +$("input#nStates").val()
		let maxIter = +$("input#maxIter").val()
		let bdd = $("textarea[name=namelist]").val()

		// Data processing before learning
		bdd = bdd.split(",")
		console.log(bdd)
		if(bdd.length <=1){
			bdd = ["Achlys","Aphrodite","Apollon","Arès","Até","Artémis","Asclépios","Athéna","Atlas","Borée","Charon","Chloris","Cronos","Déméter","Dionysos","Éole","Éos","Éris","Éros","Gaïa","Hadès","Hébé","Hécate","Hélios","Héphaïstos","Héra","Héraclès","Hermès","Hestia","Hygie","Léto","Maïa","Métis","Minos","Morphée","Océanos","Ouranos","Pan","Perséphone","Ploutos","Poséidon","Priape","Rhadamanthe","Rhéa","Séléné","Thémis","Thétis","Triton","Tyché","Zéphyr","Zeus"]
		}else{
			$("div[name=process]").html("Not enough names")
		}
		bdd = bdd.map(name => {
			return name.charAt(0).toLowerCase() + name.slice(1) + "%"
		})
		let alphab = getAlphabet(bdd)
		if(typeof(Worker) !== "undefined"){
			console.log("Workers are supported")
			var worker = new Worker("src/workerHMM.js")
			worker.addEventListener("message", e => {
				switch(e.data.cmd){
					case 'start':
						console.log(e.data.data)
						break
					case 'done':
						console.log("Learning done")
						h = Object.assign(new HMM(), e.data.data)
						$("div[name=process]").html("Training finished, final score : " + h.oldLogProb)
						$("button[name=generateButton]").css("display","inline")
						worker.terminate()
						break
					case 'console':
						console.log(e.data.data)
						break
					case 'bar':
						$("div#myBar").css("width", (e.data.data*$("#myProgress").css("width").slice(0,-2)) + "px")
						break
					case 'saveHMM':
						h = Object.assign(new HMM(), e.data.data)
					case 'updateChart':
						let d = chart.data.datasets[0].data
						d[d.length] = e.data.data
						chart.data.labels[chart.data.labels.length] = chart.data.labels.length + 1
						chart.update()
						break
					default:
						console.log("Message not understood")
						console.log(e)
				}
			}, false)

			let message = {'cmd': 'learn',
							'database': bdd,
							'nStates': nStates,
							'alphab': alphab,
							'maxIter': maxIter}
			worker.postMessage(message)
			$("div[name=process]").html("Training ongoing")

			let b = $("button.buttonStop")
			b.on("click", function(e){
				$("div[name=process]").html("Training stopped, final score : " + h.oldLogProb)
				$("button[name=generateButton]").css("display","inline")
				worker.terminate()
				b.css("visibility","hidden")
			})
			b.css("visibility", "visible")

		} else {
			console.log("Workers are not supported")
		}
	})

	$("button[name=generateButton]").on("click", function(e){
		$("div[name=randomName]").html(h.generate())
	})

	$("body").on("mousemove", function(e){
		nStatesInput = $("input#nStates")
		let val = nStatesInput.val()
		if(val<+nStatesInput[0].min) nStatesInput.val(+nStatesInput[0].min)
		if(val>+nStatesInput[0].max) nStatesInput.val(+nStatesInput[0].max)

		maxIterInput = $("input#maxIter")
		val = maxIterInput.val()
		if(val<+maxIterInput[0].min) maxIterInput.val(+maxIterInput[0].min)
		if(val>+maxIterInput[0].max) maxIterInput.val(+maxIterInput[0].max)
	})

}