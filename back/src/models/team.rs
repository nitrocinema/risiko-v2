use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize};
use std::fmt::Debug;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Debug, Default)]
#[serde(crate = "near_sdk::serde")]
pub struct Team {
    army: u8,
    dead: bool,
    account_id: String,
    dices: [u8; 3],
    can_throw_dices: bool
}

impl Team{
    pub(crate) fn new() -> Self{
        Self{
            army: 10,
            dead: false,
            account_id: "".to_string(),
            dices: [0, 0, 0],
            can_throw_dices: true
        }
    }

    pub fn get_army(&self) -> u8{
        self.army
    }

    pub fn receive_hit(&mut self, hit: u8){
        self.army -= hit;
        if self.army <= 0 {
            self.dead = true;
            self.army = 0;
        }
    }

    pub fn set_dead(&mut self, dead :bool) {
        self.dead = dead;
    }


    pub fn account_id(&self) -> &str {
        &self.account_id
    }

    pub fn set_account_id(&mut self, account_id: &String) {
        self.account_id = account_id.to_string();
    }

    pub fn has_owner(&self) -> bool{
        self.account_id != "".to_string()
    }

    pub fn set_dices(&mut self, dices: [u8; 3]) {
        self.dices = dices;
    }
    pub fn dices(&self) -> [u8; 3] {
        self.dices
    }

    pub fn is_dead(&self) -> bool {
        self.dead
    }

    pub fn can_throw_dices(&self) -> bool {
        self.can_throw_dices
    }

    pub fn set_can_throw_dices(&mut self, can:bool){
        self.can_throw_dices = can;
    }

}