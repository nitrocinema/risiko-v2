use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Default)]
#[serde(crate = "near_sdk::serde")]
pub struct DeleteBattleResponse {
    message: String,
    is_deleted: bool
}

impl DeleteBattleResponse {
    pub fn new(message: String, is_deleted: bool) -> Self {
        Self {
            message,
            is_deleted
        }
    }
}