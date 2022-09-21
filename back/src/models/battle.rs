use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize};
use std::fmt::Debug;
use near_sdk::{Balance, Promise};
use crate::info::Info;
use crate::models::team::Team;
use crate::responses::join_battle_response::JoinBattleResponse;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct Battle {
    blue: Team,
    red: Team,
    info: Info,
    fee: u128,
}

impl Default for Battle {
    fn default() -> Self {
        Self {
            blue: Team::new(),
            red: Team::new(),
            info: Info::new(),
            fee: 4,
        }
    }
}

impl Battle {
    pub fn new() -> Self {
        Self {
            blue: Team::new(),
            red: Team::new(),
            info: Info::new(),
            fee: 4,
        }
    }

    pub fn get_team_by_account_id(&mut self, account_id: String) -> Option<&mut Team> {
        if self.blue.account_id() == account_id {
            return Option::from(&mut self.blue);
        }
        if self.red.account_id() == account_id {
            return Option::from(&mut self.red);
        }
        None
    }

    pub fn get_fee(&self) -> u128 {
        self.fee
    }

    pub fn set_fee(&mut self, fee: u128) {
        self.fee = fee;
    }

    pub fn info(&self) -> &Battle {
        self
    }

    pub fn battle(&mut self) -> &mut Battle {
        if self.info.is_battle_end() {
            return self;
        }

        if self.red.can_throw_dices() || self.blue.can_throw_dices(){
            return self;
        }

        let hits: [u8; 2] = Battle::calculate_hits(self.blue.dices(), self.red.dices());
        self.blue.receive_hit(hits[0]);
        self.red.receive_hit(hits[1]);
        self.check_army();
        self.blue.set_can_throw_dices(true);
        self.red.set_can_throw_dices(true);
        self
    }

    fn send_tokens_to_winner(&self, winner: String) {
        let winner = winner.parse().unwrap();
        Promise::new(winner).transfer((2 * self.fee * 10u128.pow(24)) as Balance);
    }

    fn calculate_hits(mut blue_dices: [u8; 3], mut red_dices: [u8; 3]) -> [u8; 2] {
        let mut response: [u8; 2] = [0, 0];
        blue_dices.sort();
        red_dices.sort();
        for x in 0..3 {
            if blue_dices[x] == 0 || red_dices[x] == 0 {
                continue;
            }

            if blue_dices[x] <= red_dices[x] {
                response[0] += 1;
            } else {
                response[1] += 1;
            }
        }

        response
    }

    pub fn reset(&mut self) {
        self.blue = Team::new();
        self.red = Team::new();
        self.info = Info::new();
    }

    fn check_army(&mut self) {
        if self.info.is_battle_end() {
            return;
        }

        if self.blue.get_army() > 1 && self.red.get_army() > 0 {
            return;
        }

        if self.blue.get_army() < 2 && self.red.get_army() > 1 {
            if self.blue.get_army() < 1 {
                self.blue.set_dead(true);
            }
            self.send_tokens_to_winner(self.red.account_id().to_string());
            self.info.battle_end("Red army is winner! Blue army doesn't have enough army for attack!".to_string());
        }

        if self.red.get_army() == 0 {
            self.red.set_dead(true);
            self.send_tokens_to_winner(self.blue.account_id().to_string());
            self.info.battle_end("Blue army is winner!".to_string());
        }
    }

    pub fn join(&mut self, account_id: String) -> JoinBattleResponse {
        if !self.blue.has_owner() {
            self.blue.set_account_id(&account_id);
            return JoinBattleResponse::new("Have a good luck!".to_string(), true, "blue".to_string());
        }
        if !self.red.has_owner() {
            self.red.set_account_id(&account_id);
            return JoinBattleResponse::new("Have a good luck!".to_string(), true, "red".to_string());
        }
        JoinBattleResponse::new("Battle already has players!".to_string(), false, "".to_string())
    }

    pub fn is_battle_end(&self) -> bool {
        self.info.is_battle_end()
    }
}