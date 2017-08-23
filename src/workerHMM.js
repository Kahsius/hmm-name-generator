importScripts('HMM.js')
importScripts('utils.js')

onmessage = e => {
	// throw JSON.stringify({data:e})
	let data = e.data
	switch(data.cmd){
		case 'learn':
			postMessage({'cmd':'start', 'data':'Learning started'})

			let h = new HMM(data.nStates, data.alphab, data.maxIter)
			h.fit(data.database)
			postMessage({'cmd':'done', 'data':h})
			break
		default:
			postMessage("error")
	}
}