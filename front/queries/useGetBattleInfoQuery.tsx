import useNearContext from "@context/NearContext";
import {useQuery} from "@tanstack/react-query";

export default function useGetBattleInfoQuery({battle_id}: { battle_id: string | any; }) {
    const {contract} = useNearContext();

    return useQuery(
        ["risiko", "battle"],
        () => {
            return  contract?.get_battle_info?.({battle_id});
        }
    );
}
