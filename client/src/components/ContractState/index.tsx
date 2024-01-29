import useLotteryStore from '../App/store'
import s from './contract-state.module.scss'

const ContractState = () => {
	const { manager, balance, players, lastWinner } = useLotteryStore()

	const isLastWinnerPresent = lastWinner && parseInt(lastWinner, 16)

	return (
		<div>
			<div>
				{players && players.length > 0 && (
					<div>
						Already entered to the lottery: <b className="blue">{players.length}</b> users
					</div>
				)}
				{!!balance && (
					<div className="blue">
						Prize pool: <b>{balance}</b> ETH
					</div>
				)}
			</div>
			<div className={s.label}>
				{manager && (
					<div>
						<div>Contract managed by:</div>
						<div>{manager}</div>
					</div>
				)}
				{!!isLastWinnerPresent && (
					<div className={s.last_winner}>
						<div>Previous round winner:</div>
						<div className="blue">{lastWinner}</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default ContractState
