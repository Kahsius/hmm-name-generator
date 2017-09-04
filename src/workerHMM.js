importScripts('HMM.js')
importScripts('utils.js')

onmessage = e => {
	// throw JSON.stringify({data:e})
	let data = e.data
	var _stop = false
	let h = null
	switch(data.cmd){
		case 'learn':
			postMessage({'cmd':'start', 'data':'Learning started'})

			h = new HMM(data.nStates, data.alphab, data.maxIter)
			h.fit(data.database)
			postMessage({'cmd':'done', 'data':h})
			break
		case 'learnVerbose':
			postMessage({'cmd':'start', 'data':'Learning (verbose) started'})
			h = new HMM(data.nStates, data.alphab, data.maxIter)
			let arrSeq = data.database
			for(let i=0; i<h.maxIter; i++){
				h.fitStep(arrSeq)
				let score = arrSeq.map(e => h.logProb(e)).sum()
				postMessage({'cmd':'updateChart', 'data':score})
				postMessage({'cmd':'bar', 'data':(i+1)/h.maxIter})
				postMessage({'cmd':'saveHMM', 'data':h})
				if(score > h.oldLogProb){
					h.oldLogProb = score
				} else {
					break
				}
			}
			postMessage({'cmd':'done', 'data':h})
			break			
		default:
			postMessage("error")
	}
}