import useNearContext from "@context/NearContext";
import { useMutation } from "@tanstack/react-query";

export default function useThrowDicesMutation() {
  const { contract } = useNearContext();

  return useMutation(async function throw_dices(data: any) {
    return await contract?.throw_dices?.({ args: data });
  });
}
