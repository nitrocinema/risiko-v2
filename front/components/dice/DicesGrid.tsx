import {Button, Grid} from "@nextui-org/react";
import {useState} from "react";
import useNearContext, {Team} from "@context/NearContext";
import Dice from "./Dice";
import useThrowDicesMutation from "../../queries/useThrowDicesMutation";

export default function DicesGrid(props: { team: string, thrownDices: any, army: Team | any, battle_id: any}) {
    const { accountId } = useNearContext();
    const throwDicesMutation = useThrowDicesMutation();

    //const [blueDices, setBlueDices] = useState(props.army?.dices);
    //const [redDices, setRedDices] = useState(props.army?.dices);

    const throwDices = async () => {
        const thrownDices = [getRandom(), getRandomOrZero(3), getRandomOrZero(4)];
        await throwDicesMutation.mutateAsync({dices: thrownDices, battle_id: props.battle_id});
        props.thrownDices();
    }

    const getRandom = () => {
        return Math.floor(Math.random() * (6 - 1 + 1) + 1);
    }

    const getRandomOrZero = (num: number) => {
        if (props.team == "blue") {
            return props.army.army < num ? 0 : getRandom();
        }
        return props.army.army < (--num) ? 0 : getRandom();
    }

    console.log("DicesGrid")
    console.log(props.army);

    return (
        <Grid.Container gap={2} justify="center">
            <Grid xs>
                <Dice num={props.army?.dices[0]} team={props.team}/>
            </Grid>
            <Grid xs>
                <Dice num={props.army?.dices[1]} team={props.team}/>
            </Grid>
            <Grid xs>
                <Dice num={props.army?.dices[2]} team={props.team}/>
            </Grid>
            <Grid xs justify="center" alignContent="center">
                {props.army?.account_id == accountId &&
                    <Button bordered color={props.team == "blue" ? "primary" : "error"} auto onPress={throwDices}
                            disabled={!props.army?.can_throw_dices}>
                        Throw dices
                    </Button>
                }

            </Grid>
        </Grid.Container>
    );
}
