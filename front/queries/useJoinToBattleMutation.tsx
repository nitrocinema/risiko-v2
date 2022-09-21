import useNearContext from "@context/NearContext";
import {useMutation} from "@tanstack/react-query";
import useAuthContext from "@context/AuthContext";
import {utils} from "near-api-js";

export default function useJoinToBattleMutation() {
    const {contract} = useNearContext();
    const {isSignedIn} = useAuthContext();
    if (!isSignedIn()) {
        throw Error("Not signed in");
    }
    return useMutation(async function join_to_battle({battle_id, amount}: { battle_id: string; amount: any; }) {
        return contract?.join_to_battle?.({
            amount: utils.format.parseNearAmount(amount.toString()),
            args: {battle_id},
        });
    });
}
