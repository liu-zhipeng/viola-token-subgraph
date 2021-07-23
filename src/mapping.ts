import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  ViolaToken,
  Approval,
  BurnRateUpdated,
  DelegateChanged,
  DelegateVotesChanged,
  MaxTransferAmountRateUpdated,
  OperatorTransferred,
  OwnershipTransferred,
  Transfer
} from "../generated/ViolaToken/ViolaToken"

import { TransferEntity, BurnEntity } from "../generated/schema"

export function handleApproval(event: Approval): void {
}

export function handleBurnRateUpdated(event: BurnRateUpdated): void {}

export function handleDelegateChanged(event: DelegateChanged): void {}

export function handleDelegateVotesChanged(event: DelegateVotesChanged): void {}

export function handleMaxTransferAmountRateUpdated(
  event: MaxTransferAmountRateUpdated
): void {}

export function handleOperatorTransferred(event: OperatorTransferred): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTransfer(event: Transfer): void {
  
  let transferEntity = TransferEntity.load(event.transaction.hash.toHex() + "-" + event.params.to.toHexString())
  if (transferEntity == null) {
    transferEntity = new TransferEntity(event.transaction.hash.toHex() + "-" + event.params.to.toHexString())
  }

  transferEntity.from = event.params.from
  transferEntity.to = event.params.to
  transferEntity.amount = event.params.value
  transferEntity.timestamp = event.block.timestamp
  transferEntity.save()

  if (event.params.to == Address.fromHexString('0x0000000000000000000000000000000000000000')){
    let burnEntity = BurnEntity.load("1")
    if (burnEntity == null) {
      burnEntity = new BurnEntity("1")
      burnEntity.totalBurned = new BigInt(0)
    }

    burnEntity.txHash = event.block.hash
    burnEntity.amount = event.params.value
    burnEntity.totalBurned = burnEntity.totalBurned.plus(event.params.value)
    burnEntity.timestamp = event.block.timestamp
    burnEntity.save()
  } 
}
