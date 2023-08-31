import { TransactionExecuted as TransactionExecutedEvent } from "../generated/CharacterAccount/CharacterAccount"
import { TransactionExecuted } from "../generated/schema"

export function handleTransactionExecuted(
  event: TransactionExecutedEvent
): void {
  let entity = new TransactionExecuted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.target = event.params.target
  entity.value = event.params.value
  entity.data = event.params.data

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
