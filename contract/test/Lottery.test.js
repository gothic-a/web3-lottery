import assert from 'assert'
import Web3 from 'web3'
import Ganache from 'ganache'
import { abi, bytecode } from '../compile.js'

const web3 = new Web3(Ganache.provider())

let lottery
let accounts

beforeEach(async () => {
	accounts = await web3.eth.getAccounts()
	const [manager] = accounts

	lottery = await new web3.eth.Contract(abi)
		.deploy({ data: bytecode })
		.send({ from: manager, gas: 1e6 })
})

describe('Lottery Contract', () => {
	it('contract deployed', () => {
		assert.ok(lottery.options.address)
	})

	it('requires a minimum amount of ether', async () => {
		const [_, account] = accounts

		try {
			await lottery.methods.enter().send({
				from: account,
				value: web3.utils.toWei('0.009', 'ether'),
			})

			assert.fail()
		} catch (e) {
			assert.ok(e.receipt)
		}
	})

	it('allows one account to enter', async () => {
		const [manager, player] = accounts

		await lottery.methods.enter().send({
			from: player,
			value: web3.utils.toWei('1', 'ether'),
		})

		const players = await lottery.methods
			.getPlayers()
			.call({ from: manager })

		assert.equal(1, players.length)
		assert.equal(player, players[0])
	})

	it('allows miltiple accounts to enter', async () => {
		const [manager, player1, player2, player3] = accounts

		const enterLottery = async (from) => {
			await lottery.methods.enter().send({
				from,
				value: web3.utils.toWei('1', 'ether'),
			})
		}

		await enterLottery(player1)
		await enterLottery(player2)
		await enterLottery(player3)

		const players = await lottery.methods
			.getPlayers()
			.call({ from: manager })

		assert.equal(3, players.length)
		players.forEach((i, idx) => assert.equal(accounts[idx + 1], i))
	})

	it('only manager can pick winner', async () => {
		const [_, notAllowedAccount] = accounts

		try {
			await lottery.methods.pickWinner().send({ from: notAllowedAccount })
			assert.fail()
		} catch (e) {
			assert.ok(e.receipt)
		}
	})

	it('sends money to the winner and resets the players array', async () => {
		const [manager, player] = accounts

		await lottery.methods
			.enter()
			.send({ from: player, value: web3.utils.toWei('2', 'ether') })

		const afterEnterBalance = await web3.eth.getBalance(player)
		await lottery.methods.pickWinner().send({ from: manager })
		const finalBalance = await web3.eth.getBalance(player)
		const difference = finalBalance - afterEnterBalance

		assert(difference > web3.utils.toWei('1.9', 'ether'))

		const players = await lottery.methods
			.getPlayers()
			.call({ from: manager })

		assert.equal(players.length, 0)

		const contractBalance = await web3.eth.getBalance(
			lottery.options.address,
		)

		assert.equal(contractBalance, 0)
	})

	it('set latest lottery winner', async () => {
		const [manager, player] = accounts

		await lottery.methods
			.enter()
			.send({ from: player, value: web3.utils.toWei('2', 'ether') })

		await lottery.methods.pickWinner().send({ from: manager })

		const winnerAddress = await lottery.methods
			.lastWinner()
			.call({ from: manager })

		assert.ok(winnerAddress)
		assert.equal(player, winnerAddress)
	})
})
