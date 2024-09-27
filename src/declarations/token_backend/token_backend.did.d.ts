import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Currency { 'name' : string, 'symbol' : string }
export interface _SERVICE {
  'balance_of' : ActorMethod<[Principal], bigint>,
  'get_currency_info' : ActorMethod<[], Currency>,
  'get_current_user' : ActorMethod<[], Principal>,
  'get_faucet_amount' : ActorMethod<[], bigint>,
  'pay_out' : ActorMethod<[], string>,
  'transfer' : ActorMethod<[Principal, bigint], string>,
  'user_principal' : ActorMethod<[], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
