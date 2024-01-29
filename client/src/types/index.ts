import { FormatType, TransactionReceipt, DEFAULT_RETURN_FORMAT } from 'web3'

export type SendTransactionReturnType = FormatType<TransactionReceipt, typeof DEFAULT_RETURN_FORMAT> | undefined
