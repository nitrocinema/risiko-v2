import Layout from "@components/Layout";
import useAuthContext from "@context/AuthContext";
import {Container, Button, Grid} from "@nextui-org/react";
import type {NextPage} from "next";
import Dashboard from "@components/Dashboard";

const Home: NextPage = () => {
    const { isSignedIn, signIn } = useAuthContext();

    if (isSignedIn()) {
        return <Dashboard />;
    }
    return (
        <Layout>
            <Container>
                <Grid.Container gap={2} justify="center" css={{mt: 10}}>
                    Please Login
                </Grid.Container>
            </Container>
        </Layout>
    );
};

export default Home;
