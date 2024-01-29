import { ChangeEvent, FormEvent, useState } from 'react'
import { GridLoader, PulseLoader } from 'react-spinners'
import web3 from '../../web3'
import s from './enter-from.module.scss'
import useEnterLotteryStore from './store'
import usePickWinnerStore from '../PickWinner/store'
import useLotteryStore from '../App/store'

interface EnterLotteryProps {
	onSubmitSuccess: () => void
}

const EnterLottery = ({ onSubmitSuccess }: EnterLotteryProps) => {
	const accounts = useLotteryStore((state) => state.accounts)
	const { loading, enterLottery } = useEnterLotteryStore()
	const pickWinnerLoading = usePickWinnerStore((state) => state.loading)

	const [value, setValue] = useState<string>('')

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (accounts && value) {
			const wei = web3.utils.toWei(value, 'ether')

			const res = await enterLottery(accounts[0], wei)

			if (res) onSubmitSuccess()
		}
	}

	const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target

		if (!isNaN(+value)) setValue(e.target.value)
	}

	const isButtonDisabled = !accounts || loading || pickWinnerLoading || !+value

	return (
		<form className={s.form} onSubmit={handleSubmit}>
			<h4>Lets try your luck</h4>
			<div className={s.input_wrapper}>
				<label htmlFor="ether">Amount of ether</label>
				<div>
					{!loading ? (
						<input
							disabled={pickWinnerLoading}
							type="text"
							name="ether"
							value={value}
							onChange={handleValueChange}
						/>
					) : (
						<GridLoader size="13" color="#61dafb" speedMultiplier={1} />
					)}
				</div>
			</div>
			<button disabled={isButtonDisabled} style={{ marginTop: 16, width: 240 }}>
				{!loading ? <span>enter</span> : <PulseLoader size="10" speedMultiplier={0.75} color="#282c34" />}
			</button>
		</form>
	)
}

export default EnterLottery
