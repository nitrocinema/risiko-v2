import useNearContext from "@context/NearContext";
import {useMutation} from "@tanstack/react-query";

export default function useCreateBattleMutation() {
    const {contract} = useNearContext();

    return useMutation(async function add_battle({battle_id, fee }: {battle_id: string;fee: number;}) {
        return contract?.add_battle?.({args: {battle_id: battle_id, fee: fee}});
    });
}
