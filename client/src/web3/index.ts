import Web3 from 'web3'

const web3 = new Web3()

if (window.ethereum) {
	try {
		await window.ethereum.request({ method: 'eth_requestAccounts' })

		web3.setProvider(window.ethereum)
	} catch (e) {}
}

export default web3
