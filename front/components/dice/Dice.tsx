import {Image} from "@nextui-org/react";

export default function Dice(props: { num: number | undefined, team: string}) {
    let src = `/dices/${props.num}-${props.team}.PNG`;
    if (props.num == 0 || props.num == undefined){
        src = `/dices/1-${props.team}.PNG`;
    }
    return (
        <Image
            width={150}
            height={150}
            src={src}
            alt="Dice"
            objectFit="cover"
        />
    );
}
