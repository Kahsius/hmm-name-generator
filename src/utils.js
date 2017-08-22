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

function indexMax(arr) {
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

function multiplyArr(arr1, arr2){
	if(length(arr1) !== length(arr2)){
		console.log("size error: " +length(arr1)+ " != " + length(arr2))
	} else {
		let arr = []
		for(let i=0; i<arr1.length; i++){
			arr[i] = arr1[i] * arr2[i]
		}
		return arr
	}
}