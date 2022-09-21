use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Default)]
#[serde(crate = "near_sdk::serde")]
pub struct JoinBattleResponse{
    message: String,
    is_join: bool,
    team: String
}

impl JoinBattleResponse {
    pub fn new(message: String, is_join: bool,team: String) -> Self {
        Self {
            message,
            is_join,
            team
        }
    }

    pub fn is_join(&self) -> bool {
        self.is_join
    }
}