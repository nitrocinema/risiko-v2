use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize};

use std::fmt::Debug;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Debug, Default)]
#[serde(crate = "near_sdk::serde")]
pub struct Info {
    battle_end: bool,
    message: String
}

impl Info{
    pub(crate) fn new() -> Self{
        Self {
            battle_end: false,
            message: "The battle is on!".to_string()
        }
    }

    pub fn is_battle_end(&self) -> bool {
        self.battle_end
    }

    pub fn battle_end(&mut self, message: String) {
        self.message = message;
        self.battle_end = true;
    }
}