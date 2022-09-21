import {Button, Card, Grid, Row, Text} from "@nextui-org/react";
import useJoinToBattleMutation from "queries/useJoinToBattleMutation";
import useNearContext from "@context/NearContext";
import Router from 'next/router'
import useDeleteBattleMutation from "../../queries/useDeleteBattleMutation";

export default function Army(props: { battle: any, name: string }) {
    const {accountId} = useNearContext();
    const joinToBattleMutation = useJoinToBattleMutation();
    const deleteGameMutation = useDeleteBattleMutation();
    const isPlayer = props.battle[1].blue.account_id == accountId || props.battle[1].red.account_id == accountId;
    const canJoin = props.battle[1].blue.account_id == '' || props.battle[1].red.account_id == '';
    const battleEnd = props.battle[1].info.battle_end;

    const join = () => {
        joinToBattleMutation.mutate({
            battle_id: props.name,
            amount: props.battle[1].fee,
        });
    }

    const goToBattle = () => {
        Router.push('/battle/' + props.name);
    }

    const deleteBattle = () => {
        deleteGameMutation.mutate(props.name);
    }

    const getButton = () => {
        if (battleEnd) {
            return <Button bordered color="error" auto onPress={deleteBattle}> Delete battle </Button>
        } else if (isPlayer) {
            return <Button bordered color="warning" auto onPress={goToBattle}> Go to battle </Button>
        } else if (canJoin) {
            return <Button bordered color="success" auto onPress={join}> Join to battle </Button>
        } else {
            <></>
        }
    };

    const getInfo = (army: any, blue: boolean) => {
        let armyColor = blue ? "Blue" : "Red";
        return <>
                <Grid xs={6}>
                    <Card>
                        <Card.Body>
                            <Text h2 color={blue ? "primary" : "error"}>{armyColor} army: {army.army}</Text>
                        </Card.Body>
                    </Card>
                </Grid>
                <Grid xs={6}>
                    <Card>
                        <Card.Body>
                            <Text
                                h2> {army.account_id == '' ? "No commandant" : "Commandant: " + army.account_id}
                            </Text>
                        </Card.Body>
                    </Card>
                </Grid>
            </>
    }
    return (
        <>
            <Grid.Container gap={2}>
                <Row justify={"center"} align={"center"}>
                    <Text h1 color="default">{props.name} ({props.battle[1].fee} NEAR) </Text>
                </Row>
                {getInfo(props.battle[1].blue, true)}
            </Grid.Container>
            <Grid.Container gap={2}>
                {getInfo(props.battle[1].red, false)}
            </Grid.Container>
            {getButton()}
        </>
    );
}
