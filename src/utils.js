Array.prototype.initHMM = function(){
	let s = 0
	for(let i=0; i<this.length; i++){
		this[i] = 1/this.length + (Math.random()-0.5)/this.length/10
		s += this[i]
	}
	for(i=0; i<this.length; i++){
		this[i] /= s
	}
}

Array.prototype.sum = function(){
	let s = 0;
	for(let i=0; i<this.length; i++){
		s += this[i]
	}
	return(s)
}

indexMax = (arr) => {
    if (arr.length === 0) {
        return -1;
    }

    let max = arr[0];
    let maxIndex = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

indexFromProbs = (probs) => {
	let r = Math.random()
	let s = 0
	for(let i=0; i<probs.length; i++){
		if(r < s + probs[i]){
			return i
		} else {
			s += probs[i]
		}
	}
}

getAlphabet = (arrSeq) => {
	let alphab = []
	for(let i=0; i<arrSeq.length; i++){
		let seq = arrSeq[i]
		for(let j=0; j<seq.length; j++){
			if(alphab.indexOf(seq[j]) === -1){
				alphab[alphab.length] = seq[j]
			}
		}
	}
	return(alphab)
}