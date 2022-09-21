import {getNearConfig, NEAR_ENV} from "@config/near";
import {
    connect,
    Contract,
    keyStores,
    Near,
    WalletConnection,
} from "near-api-js";
import {NearConfig} from "near-api-js/lib/near";
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";

interface Context {
    near: Near | undefined;
    walletConnection: WalletConnection | undefined;
    accountId: any;
    contract: Partial<ContractInterface> | undefined;
    config: any;
    loading: boolean;

    reset(): void;
}

export interface Risiko {
    battles: []
}

export interface Battle{
    blue: Team,
    red: Team,
    info: Info,
    fee: number,
}

export interface Team {
    army: number,
    dead: boolean,
    account_id: String,
    dices: [],
    can_throw_dices: boolean
}

export interface Info {
    battle_end: boolean;
    message: string;
}

export interface AddBattleResponse {
    message: String;
    added_battle: boolean;
}

export interface DeleteBattleResponse {
    message: String;
    is_deleted: boolean;
}

export const NearContext = createContext<Context | undefined>(undefined);

export default function useNearContext(): Context {
    return useContext(NearContext) ?? ({} as Context);
}

interface ChangeMethodOptions {
    callbackUrl?: string;
    meta?: string;
    args: Record<string, string | number>;
    gas?: string;
    amount?: string | null;
}

type ViewMethodOptions = Record<string, string | number>;

export interface ContractInterface extends Contract {
    get_battles(opts?: ViewMethodOptions): Promise<Risiko>;
    add_battle(opts?: ChangeMethodOptions): Promise<AddBattleResponse>;
    delete_battle(opts?: ChangeMethodOptions): Promise<DeleteBattleResponse>;
    join_to_battle(opts?: ChangeMethodOptions): Promise<Risiko>;
    get_battle_info(opts?: ViewMethodOptions): Promise<Battle>;
    throw_dices(opts?: ChangeMethodOptions): Promise<Battle>;
}

export function NearProvider({children}: PropsWithChildren<unknown>) {
    const [near, setNear] = useState<Near>();
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<NearConfig>();
    const [walletConnection, setWalletConnection] = useState<WalletConnection>();
    const [accountId, setAccountId] = useState();
    const [contract, setContract] = useState<Partial<ContractInterface>>();

    const viewMethods: string[] = [
        "get_battles",
        "get_battle_info"
    ];
    const changeMethods: string[] = [
        "join_to_battle",
        "add_battle",
        "throw_dices",
        "delete_battle"
    ];

    useEffect(() => {
        async function main() {
            const config = {
                ...getNearConfig(NEAR_ENV.DEVELOPMENT),
                deps: {keyStore: new keyStores.BrowserLocalStorageKeyStore()},
                headers: {},
            };

            if (!config.contractName) {
                throw Error("[NearContext]: No contract provided!");
            }

            const near = await connect(config);

            const walletConnection = new WalletConnection(near, config.contractName);

            const contract = await new Contract(
                walletConnection.account(),
                config.contractName,
                {
                    viewMethods,
                    changeMethods,
                }
            );


            setNear(near);
            setConfig(config);
            setWalletConnection(walletConnection);
            setAccountId(walletConnection.getAccountId());
            setContract(contract);
            setLoading(false);
        }

        main();
    }, []);

    function reset() {
        setNear(undefined);
        setConfig(undefined);
        setWalletConnection(undefined);
        setAccountId(undefined);
        setContract(undefined);
    }

    const value = {
        near,
        walletConnection,
        accountId,
        contract,
        config,
        loading,
        reset,
    };

    return <NearContext.Provider value={value}>{children}</NearContext.Provider>;
}
