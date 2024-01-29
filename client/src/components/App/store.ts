import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import web3 from '../../web3'
import lotteryContract from '../../web3/lotteryContract'

interface LotteryState {
	accounts: string[] | null
	isConnected: boolean
	manager: string | null
	players: string[] | null
	balance: number | null
	lastWinner: string | null
	getAccounts: () => Promise<void>
	getManager: () => Promise<void>
	getPlayers: () => Promise<void>
	getBalance: () => Promise<void>
	getLastWinner: () => Promise<void>
}

const useLotteryStore = create<LotteryState>()(
	immer((set) => ({
		isConnected: !!web3.currentProvider,
		accounts: null,
		manager: null,
		players: null,
		balance: null,
		lastWinner: null,
		getAccounts: async () => {
			const accounts = await web3.eth.getAccounts()

			set((state) => {
				state.accounts = accounts
			})
		},
		getManager: async () => {
			const manager: string = await lotteryContract.methods.manager().call()

			set((state) => {
				state.manager = manager
			})
		},
		getPlayers: async () => {
			const players: string[] = await lotteryContract.methods.getPlayers().call()

			set((state) => {
				state.players = players
			})
		},
		getBalance: async () => {
			const contractAddress = lotteryContract.options.address

			if (contractAddress) {
				const wei = await web3.eth.getBalance(contractAddress)
				const ether = +web3.utils.fromWei(wei, 'ether')

				set((state) => {
					state.balance = ether
				})
			}
		},
		getLastWinner: async () => {
			const address: string = await lotteryContract.methods.lastWinner().call()

			set((state) => {
				state.lastWinner = address
			})
		},
	})),
)

export default useLotteryStore
