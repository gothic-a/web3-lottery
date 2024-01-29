import { GridLoader } from 'react-spinners'
import s from './pick-winner.module.scss'
import useEnterLotteryStore from '../EnterLottery/store'
import usePickWinnerStore from './store'
import useLotteryStore from '../App/store'

interface EnterFormProps {
	onPickSuccess: () => void
}

const Loader = () => {
	return (
		<div>
			<GridLoader size="12" color="#61dafb" speedMultiplier={1} />
			<GridLoader size="12" color="#61dafb" speedMultiplier={1} />
			<GridLoader size="12" color="#61dafb" speedMultiplier={1} />
			<GridLoader size="12" color="#61dafb" speedMultiplier={1} />
		</div>
	)
}

const PickWinner = ({ onPickSuccess }: EnterFormProps) => {
	const { accounts, manager, players } = useLotteryStore()
	const { loading, pickWinner } = usePickWinnerStore()
	const enterLoading = useEnterLotteryStore((state) => state.loading)

	if (!players?.length || !manager || !accounts?.includes(manager)) return null

	const handleClick = async () => {
		if (manager) {
			await pickWinner(manager)

			onPickSuccess()
		}
	}

	return (
		<div className={s.pick_winner}>
			{loading ? (
				<Loader />
			) : (
				<button disabled={enterLoading} style={{ marginTop: 16, width: 240 }} onClick={handleClick}>
					pick winner
				</button>
			)}
		</div>
	)
}

export default PickWinner
