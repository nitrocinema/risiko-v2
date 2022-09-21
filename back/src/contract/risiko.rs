use std::collections::HashMap;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{Balance, env, near_bindgen, Promise};
use near_sdk::serde::{Serialize};
use std::fmt::Debug;
use crate::models::battle::Battle;
use crate::responses::add_battle_response::AddBattleResponse;
use crate::responses::delete_battle_response::DeleteBattleResponse;
use crate::responses::join_battle_response::JoinBattleResponse;

near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct Risiko {
    battles: HashMap<String, Battle>,
}

impl Default for Risiko {
    fn default() -> Self {
        Self {
            battles: HashMap::new()
        }
    }
}

#[near_bindgen]
impl Risiko {
    #[init]
    pub fn new() -> Self {
        Self {
            battles: HashMap::new()
        }
    }

    pub fn get_battle_info(&self, battle_id: String) -> &Battle {
        self.battles.get(battle_id.as_str()).unwrap()
    }

    pub fn get_battles(&self) -> &Risiko {
        self
    }

    pub fn add_battle(&mut self, battle_id: String, fee: u128) -> AddBattleResponse {
        if self.battles.contains_key(&battle_id) {
            return AddBattleResponse::new("Battle already exists!".to_string(), false);
        }
        let battle_length: usize = self.battles.len();
        let mut battle = Battle::new();
        battle.set_fee(fee);
        self.battles.insert(battle_id, battle);
        if battle_length == self.battles.len() {
            return AddBattleResponse::new("Something went wrong!".to_string(), false);
        }
        AddBattleResponse::new("Battle added".to_string(), true)
    }


    pub fn throw_dices(&mut self, dices: [u8; 3], battle_id: String) -> &mut Battle {
        let acc = env::predecessor_account_id();
        let battle = self.battles.get_mut(battle_id.as_str()).unwrap();
        let team = battle.get_team_by_account_id(acc.to_string());
        if team.is_none() {
            env::panic(b"Team doesn't exists");
        }
        let team = team.unwrap();
        team.set_dices(dices);
        team.set_can_throw_dices(false);
        battle.battle()
    }

    #[payable]
    pub fn join_to_battle(&mut self, battle_id: String) -> JoinBattleResponse {
        let battle = self.battles.get_mut(&battle_id);
        if battle.is_none() {
            return JoinBattleResponse::new("Battle doesn't exists".to_string(), false,"".to_string());
        }
        let battle = battle.unwrap();

        if !Risiko::check_deposit(battle.get_fee()) {
            Risiko::return_deposit();
            let msg = "Deposit is not enough. Got ".to_string() + &env::attached_deposit().to_string() +" expected " + &battle.get_fee().to_string();
            env::panic(msg.as_ref());
        }
        let response = battle.join(env::predecessor_account_id());
        if !response.is_join() {
            Risiko::return_deposit();
        }
        response
    }

    pub fn delete_battle(&mut self, battle_id: String) -> DeleteBattleResponse {
        if !self.battles.get_mut(battle_id.as_str()).unwrap().is_battle_end() {
            return DeleteBattleResponse::new("Battle is on".to_string(), false);
        }
        self.battles.remove(battle_id.as_str());
        DeleteBattleResponse::new("Battle deleted!".to_string(), true)
    }

    fn return_deposit(){
        Promise::new(env::predecessor_account_id().parse().unwrap()).transfer(env::attached_deposit());
    }

    fn check_deposit(expected: u128) -> bool {
        env::attached_deposit() == (expected * 10u128.pow(24)) as Balance
    }
}