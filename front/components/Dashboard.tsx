import {Button, Container, Grid} from "@nextui-org/react";
import Layout from "@components/Layout";
import CreateBattleModal from "@components/modals/CreateBattleModal";
import React from "react";
import Battles from "./battle/Battles";
import useGetBattlesQuery from "../queries/useGetBattlesQuery";


export default function Dashboard() {
    const [visible, setVisible] = React.useState(false);
    const {data, isLoading, refetch} = useGetBattlesQuery();
    const openHandler = () => setVisible(true);
    const closeHandler = () => {
        refetch();
        setVisible(false);
    };
    return (
        <Layout>
            <Container>
                <Button flat color="secondary" auto onPress={openHandler}>
                    Create Battle
                </Button>
                <CreateBattleModal
                    closeHandler={closeHandler}
                    openHandler={openHandler}
                    visible={visible}
                />
                <Battles data={data} isLoading={isLoading}/>
            </Container>
        </Layout>
    );
}
