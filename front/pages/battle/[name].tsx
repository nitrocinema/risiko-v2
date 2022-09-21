import Layout from "@components/Layout";
import {Container, Card, Button, Grid, Spinner, red, Text, Loading} from "@nextui-org/react";
import type {NextPage} from "next";
import DicesGrid from "@components/dice/DicesGrid";
import ArmyInfo from "@components/army/ArmyInfo";
import {useRouter} from "next/router";
import BattleInfo from "@components/battle/BattleInfo";
import useGetBattleInfoQuery from "../../queries/useGetBattleInfoQuery";

const Home: NextPage = () => {
    var router = useRouter();
    var battle_id = router.query['name'];

    let {data: battle, isLoading, refetch} = useGetBattleInfoQuery({battle_id: battle_id});

    const thrownDices = async () => {
        refetch();
    }

    setInterval(function() {
        refetch();
    }, 5000);
    console.log("battle")
    console.log(battle)
    console.log("battle")
    return (
        <Layout>
            <Container>
                {isLoading ? (
                    <>
                        <Loading type="points" color="success"/>
                    </>
                ) : (
                    <>
                        <Grid.Container gap={2} justify="center">
                            <Grid xs={3}>
                                <ArmyInfo army={battle?.blue} name={"blue"}/>
                                <ArmyInfo army={battle?.red} name={"red"}/>
                            </Grid>
                            <Grid xs={6} justify="center">
                                <BattleInfo message={battle?.info.message}/>
                            </Grid>
                        </Grid.Container>
                        <Card css={{mt: 10}}>
                            <Card.Body>
                                <DicesGrid team="blue"thrownDices={thrownDices} army={battle?.blue} battle_id={battle_id}/>
                            </Card.Body>
                        </Card>

                        <Card css={{mt: 10}}>
                            <Card.Body>
                                <DicesGrid team="red" thrownDices={thrownDices} army={battle?.red} battle_id={battle_id}/>
                            </Card.Body>
                        </Card>
                    </>
                )}
            </Container>
        </Layout>
    );
};

export default Home;
