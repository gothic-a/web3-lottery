import instance from './contract.instance.json'
import web3 from '../'

const { address, abi } = instance

const lotteryContract = new web3.eth.Contract(abi, address)

export default lotteryContract
