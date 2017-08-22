class HMM {
	constructor(nStates, alphab, maxIter = 100){
		this.nStates = nStates
		this.alphab = alphab
		this.oldLogProb = -Infinity
		this.maxIter = maxIter

		this.initProb = new Array(nStates)
		this.initProb.initHMM()
		this.transProb = []
		for(let i=0; i<nStates; i++){
			this.transProb[i] = new Array(nStates)
			this.transProb[i].initHMM()
		}
		this.emisProb = []
		for(let i=0; i<nStates; i++){
			this.emisProb[i] = new Array(alphab.length)
			this.emisProb[i].initHMM()
		}
	}

	forward(seq, getCt = false){
		let T = seq.length
		// let c = Array(T)
		// c[0] = 0
		let alphas = new Array(T)
		for(let i=0; i<T; i++){
			alphas[i] = new Array(this.nStates)
		}

		// compute alphas[0][i]
		for(i=0; i<this.nStates; i++){
			alphas[0][i] = this.initProb[i]*this.emisProb[i][this.getIndex(seq[0])]
			// c[0] += alphas[0][i]
		}

		// scale alphas[0][i]
		// for(i=0; i<this.nStates; i++){
		// 	alphas[0][i] /= c[0]
		// }

		// compute alphas[t][i]
		for(let t=1; t<T; t++){
			// c[t] = 0
			for(i=0; i<this.nStates; i++){
				alphas[t][i] = 0
				for(let j=0; j<this.nStates; j++){
					alphas[t][i] += alphas[t-1][j]*this.transProb[j][i]
				}
				alphas[t][i] *= this.emisProb[i][this.getIndex(seq[t])]
				// c[t] += alphas[t][i]
			}
			// for(i=0; i<this.nStates; i++){
			// 	alphas[t][i] /= c[t]
			// }
		}

		// if(getCt){
		// 	return c
		// } else {
		// 	return alphas
		// }

		return alphas
	}

	backward(seq){
		let T = seq.length
		// let c = this.forward(seq, true)
		let betas = new Array(T)
		for(let i=0; i<T; i++){
			betas[i] = new Array(this.nStates)
		}

		// init betas[T-1][i]=1, scaled by c[T-1]
		for(let i=0; i<this.nStates; i++){
			betas[T-1][i] = 1 // /c[T-1]
		}

		// beta pass
		for(let t=T-2; t>=0; t--){
			for(i=0; i<this.nStates; i++){
				betas[t][i] = 0
				for(let j=0; j<this.nStates; j++){
					betas[t][i] += this.transProb[i][j]*this.emisProb[j][this.getIndex(seq[t+1])]*betas[t+1][j]
				}

				// scale betas[t][i] with same c as alphas[t][i]
				// betas[t][i] /= c[t]
			}
		}

		return betas
	}

	getGammas(seq){
		let T = seq.length
		let alphas = this.forward(seq)
		let betas = this.backward(seq)
		let gammas = new Array(T)
		for(let i=0; i<T; i++){
			gammas[i] = new Array(this.nStates)
			if(i<T-1){
				for(let j=0; j<this.nStates; j++){
					gammas[i][j] = new Array(this.nStates)
				}
			}
		}
		
		for(let t=0; t<T-1; t++){
			let denom = 0
			for(let i=0; i<this.nStates; i++){
				for(let j=0; j<this.nStates; j++){
					denom += alphas[t][i]*this.transProb[i][j]*this.emisProb[j][this.getIndex(seq[t+1])]*betas[t+1][j]
				}
			}
			for(i=0; i<this.nStates; i++){
				for(let j=0; j<this.nStates; j++){
					gammas[t][i][j] = alphas[t][i]*this.transProb[i][j]*this.emisProb[j][this.getIndex(seq[t+1])]*betas[t+1][j]/denom
				}
			}

			// Special case for gammas[T-1][i]
			denom = 0
			for(i=0; i<this.nStates; i++){
				denom += alphas[T-1][i]
			}
			for(i=0; i<this.nStates; i++){
				gammas[T-1][i] = alphas[T-1][i]/denom
			}
		}

		return gammas
	}

	fit(arrSeq){
		for(let i=0; i<this.maxIter; i++){
			this.fitStep(arrSeq)
			let score = arrSeq.map(e => this.logProb(e)).sum()
			if(score > this.oldLogProb){
				this.oldLogProb = score
			} else {
				break
			}
		}
		console.log("Fitness finished after " +i+ " steps")
	}

	fitStep(arrSeq){
		let allGammas = new Array(arrSeq.length)
		for(let i=0; i<arrSeq.length; i++){
			allGammas[i] = this.getGammas(arrSeq[i])
		}

		// re-estimate initProb
		for(i=0; i<this.nStates; i++){
			let s = 0
			for(let n=0; n<arrSeq.length; n++){
				s += allGammas[n][0][i].sum()/arrSeq.length
			}
			this.initProb[i] = s
		}

		// re-estimate transProb
		for(i=0; i<this.nStates; i++){
			for(let j=0; j<this.nStates; j++){
				let numer = 0
				let denom = 0
				for(let n=0; n<arrSeq.length; n++){
					let seq = arrSeq[n]
					for(let t=0; t<seq.length-1; t++){
						numer += allGammas[n][t][i][j]
						denom += allGammas[n][t][i].sum()
					}
				}
				this.transProb[i][j] = numer/denom
			}
		}

		// re-estimate emisProb
		for(i=0; i<this.nStates; i++){
			for(let j=0; j<this.alphab.length; j++){
				let numer = 0
				let denom = 0
				for(let n=0; n<arrSeq.length; n++){
					let seq = arrSeq[n]
					let T = seq.length
					for(let t=0; t<T-1; t++){
						if(this.getIndex(seq[t]) === j) {
							numer += allGammas[n][t][i].sum()
						}
						denom += allGammas[n][t][i].sum()
					}
					// On ajoute cet élément séparément vu que
					// gammas à T-1 est définie spécialement
					if(this.getIndex(seq[T-1]) === j) {
						numer += allGammas[n][T-1][i]
					}
					denom += allGammas[n][T-1][i]
				}
				this.emisProb[i][j] = numer/denom
			}
		}
	}

	logProb(seq){
		let alphas = this.forward(seq)
		return Math.log(alphas[seq.length-1].sum())
	}

	viterbi(seq){
		let T = seq.length
		let delta = new Array(T)
		let psi = new Array(T)
		for(let i=0; i<T; i++){
			delta[i] = new Array(this.nStates)
			psi[i] = new Array(this.nStates)
		}

		for(i=0; i<this.nStates; i++){
			delta[0][i] = this.initProb[i]*this.emisProb[i][this.getIndex(seq[0])]
			psi[0][i] = 0
		}

		for(let t=1; t<T; t++){
			for(let j=0; j<this.nStates; j++){
				let arr = []
				for(i=0; i<this.nStates; i++){
					arr[i] = delta[t-1][i]*this.transProb[i][j]
				}
				delta[t][j] = Math.max(...arr)*this.emisProb[j][this.getIndex(seq[t])]
				psi[t][j] = indexMax(arr)
			}
		}

		let v = {}
		v.prob = Math.max(...delta[T-1])
		v.seq = new Array(T)
		v.seq[T-1] = indexMax(delta[T-1])
		for(let t=T-2; t>=0; t--){
			v.seq[t] = psi[t+1][v.seq[t+1]]
		}

		return v
	}

	getIndex(symbol){
		return this.alphab.indexOf(symbol)
	}
}