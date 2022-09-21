import {Button, Checkbox, Row, Modal, Input, Text, useInput} from "@nextui-org/react";
import useCreateBattleMutation from "queries/useCreateBattleMutation";
import React from "react";

export default function CreateBattleModal(props: { openHandler: any, closeHandler: any , visible: boolean}) {
    const createGameMutation = useCreateBattleMutation();
    const [value, setValue] = React.useState("")
    const [fee, setFee] = React.useState(4);
    const create = () => {
        if (value == "" || fee == undefined){
            props.closeHandler();
            return false;
        }
        createGameMutation.mutate( {battle_id: value, fee: fee})
        setValue("");
        setFee(4);
        props.closeHandler();
    }
    return (
        <>
            <Modal
                closeButton
                blur
                aria-labelledby="modal-title"
                open={props.visible}
                onClose={props.closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        Enter Battle name
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input
                        value={value}
                        clearable
                        bordered
                        fullWidth
                        color="warning"
                        size="lg"
                        placeholder="Battle name"
                        underlined
                        onChange={e => setValue(e.target.value)}
                    />
                    <Input
                        value={fee}
                        clearable
                        bordered
                        fullWidth
                        color="warning"
                        size="lg"
                        placeholder="Battle fee"
                        type="number"
                        underlined
                        onChange={e => setFee(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onPress={props.closeHandler}>
                        Close
                    </Button>
                    <Button color="gradient" auto onPress={create}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
