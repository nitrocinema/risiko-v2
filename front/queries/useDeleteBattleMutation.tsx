import useNearContext from "@context/NearContext";
import {useMutation} from "@tanstack/react-query";

export default function useDeleteBattleMutation() {
    const {contract} = useNearContext();

    return useMutation(async function delete_battle(battle_id: string) {
        return contract?.delete_battle?.({args: {battle_id: battle_id}});
    });
}
