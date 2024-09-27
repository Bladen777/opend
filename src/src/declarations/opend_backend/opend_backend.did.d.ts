import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Currency { 'name' : string, 'symbol' : string }
export interface _SERVICE {
  'complete_purchase' : ActorMethod<[Principal, Principal, Principal], string>,
  'get_currency_info' : ActorMethod<[], Currency>,
  'get_listed_NFTs' : ActorMethod<[], Array<Principal>>,
  'get_listed_price' : ActorMethod<[Principal], bigint>,
  'get_opend_canister_id' : ActorMethod<[], Principal>,
  'get_original_owner' : ActorMethod<[Principal], Principal>,
  'get_owned_NFTs' : ActorMethod<[Principal], Array<Principal>>,
  'is_listed' : ActorMethod<[Principal], boolean>,
  'list_item' : ActorMethod<[Principal, bigint], string>,
  'mint' : ActorMethod<[Uint8Array | number[], string], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
