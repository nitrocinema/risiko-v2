use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Default)]
#[serde(crate = "near_sdk::serde")]
pub struct AddBattleResponse {
    message: String,
    added_battle: bool
}

impl AddBattleResponse {
    pub fn new(message: String, added_battle: bool) -> Self {
        Self {
            message,
            added_battle
        }
    }
}