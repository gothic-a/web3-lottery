import HDWalletProvider from '@truffle/hdwallet-provider'
import Web3 from 'web3'
import { abi, bytecode } from './compile.js'
import 'dotenv/config'
import fs from 'fs'

const { MNEMONIC, SEPOLIA_NETWORK } = process.env

const provider = new HDWalletProvider(MNEMONIC, SEPOLIA_NETWORK)

const web3 = new Web3(provider)

const accounts = await web3.eth.getAccounts()

const LOTTERY_MANAGER = accounts[0]

const result = await new web3.eth.Contract(abi)
	.deploy({ data: bytecode })
	.send({ from: LOTTERY_MANAGER, gas: '1000000' })

const data = JSON.stringify(
	{
		abi,
		address: result.options.address,
	},
	null,
	'\t',
)

const writeCallback = (e) => {
	if (e) return console.log(e)
	console.log('deployed contract data wrote')
}

fs.writeFileSync('contract.instance.json', data, writeCallback)

provider.engine.stop()
