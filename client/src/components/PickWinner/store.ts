import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import lotteryContract from '../../web3/lotteryContract'
import { SendTransactionReturnType } from '../../types'

interface PickWinnerState {
	loading: boolean
	error: string | null
	success: boolean
	pickWinner: (from: string) => Promise<SendTransactionReturnType | void>
}

const usePickWinnerStore = create<PickWinnerState>()(
	immer((set) => ({
		loading: false,
		error: null,
		success: false,
		pickWinner: async (from: string) => {
			try {
				set((state) => {
					state.loading = true
					state.success = false
					state.error = null
				})

				const res = await lotteryContract.methods.pickWinner().send({ from })

				set((state) => {
					state.loading = false
					state.success = true
				})

				return res
			} catch (e) {
				if (e instanceof Error) {
					const message = e.message

					set((state) => {
						state.loading = false
						state.success = false
						state.error = message
					})
				}
			}
		},
	})),
)

export default usePickWinnerStore
