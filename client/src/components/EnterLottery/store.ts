import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import lotteryContract from '../../web3/lotteryContract'
import { SendTransactionReturnType } from '../../types'

interface EnterLotteryState {
	loading: boolean
	error: string | null
	success: boolean
	enterLottery: (from: string, value: string) => Promise<SendTransactionReturnType | void>
}

const useEnterLotteryStore = create<EnterLotteryState>()(
	immer((set) => ({
		loading: false,
		error: null,
		success: false,
		enterLottery: async (from: string, value: string) => {
			try {
				set((state) => {
					state.loading = true
					state.success = false
					state.error = null
				})

				const res = await lotteryContract.methods.enter().send({ from, value })

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

export default useEnterLotteryStore
