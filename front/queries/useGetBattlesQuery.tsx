import useNearContext from "@context/NearContext";
import {useQuery} from "@tanstack/react-query";

export default function useGetBattlesQuery() {
    const {contract} = useNearContext();

    return useQuery(
        ["risiko", "battles"],
        () => {
            return  contract?.get_battles?.();
        }
    );
}
