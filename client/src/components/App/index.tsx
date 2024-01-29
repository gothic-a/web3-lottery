import { useEffect } from 'react'
import { ReactComponent as Logo } from '../../svg/logo.svg'
import './index.scss'
import ContractState from '../ContractState'
import EnterLottery from '../EnterLottery'
import PickWinner from '../PickWinner'
import useLotteryStore from './store'

const App = () => {
	const { isConnected, getManager, getBalance, getPlayers, getLastWinner, getAccounts } = useLotteryStore()

	const getContractMutableState = () => {
		getBalance()
		getPlayers()
		getLastWinner()
	}

	useEffect(() => {
		if (isConnected) {
			getAccounts()
			getManager()
			getContractMutableState()
		}
	}, [])

	return (
		<div className="App">
			{isConnected && (
				<div className="App-header">
					<ContractState />
					<EnterLottery onSubmitSuccess={getContractMutableState} />
				</div>
			)}
			<Logo className="App-logo" />
			<PickWinner onPickSuccess={getContractMutableState} />
		</div>
	)
}

export default App
