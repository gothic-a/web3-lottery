import path from 'path'
import fs from 'fs'
import solc from 'solc'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const inboxPath = path.resolve(__dirname, 'contracts', 'Lottery.sol')
const content = fs.readFileSync(inboxPath, 'utf8').toString()

const input = {
	language: 'Solidity',
	sources: {
		'Lottery.sol': { content },
	},
	settings: {
		outputSelection: {
			'*': { '*': ['*'] },
		},
	},
}

const output = JSON.parse(solc.compile(JSON.stringify(input)))

const {
	abi,
	evm: {
		bytecode: { object: bytecode },
	},
} = output.contracts['Lottery.sol'].Lottery

export { abi, bytecode }
