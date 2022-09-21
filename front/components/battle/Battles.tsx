import {Button, Card, Container, Grid, Loading, Row, Text} from "@nextui-org/react";
import Army from "@components/army/Army";

export default function Battles({data, isLoading}: { data: any, isLoading: any }) {
    if (isLoading) {
        return <Loading type="points" color="success"/>;
    }
    let array = data ? Object.entries(data?.battles) : [];

    return (
        <>
            {array.length ? (
                <>
                    <Container>
                        {array.map((battle) => (
                            <Card key={battle[0]} css={{margin: "10px"}}>
                                <Card.Body>
                                    <Army battle={battle} name={battle[0]}/>
                                </Card.Body>
                            </Card>
                        ))}
                    </Container>
                </>
            ) : (
                <Grid.Container gap={2} justify="center">
                    <Grid>
                        <Text h2>No Battles</Text>
                    </Grid>
                </Grid.Container>
            )}
        </>
    );
}
