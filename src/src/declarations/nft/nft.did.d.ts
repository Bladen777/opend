import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface NFT {
  'get_asset' : ActorMethod<[], Uint8Array | number[]>,
  'get_canister_id' : ActorMethod<[], Principal>,
  'get_name' : ActorMethod<[], string>,
  'get_owner' : ActorMethod<[], Principal>,
  'transfer_ownership' : ActorMethod<[Principal], string>,
}
export interface _SERVICE extends NFT {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
