import {BCS, getMetadata, getSuiMoveConfig, Obelisk, TransactionBlock} from "@0xobelisk/client";
import {useWallet} from '@suiet/wallet-kit';
import {useEffect} from "react";
import {useAtom} from "jotai";
import {Value} from "../../jotai";
import { useRouter } from "next/router";
import {NETWORK, PACKAGE_ID, WORLD_ID} from "../../chain/config";
import {obeliskConfig} from "../../../obelisk.config";

import {ConnectButton} from "@suiet/wallet-kit";

type data = {
    type:string;
    fields:Record<string, any>;
    hasPublicTransfer:boolean;
    dataType:"moveObject";
}

const Home = () =>{
    const router = useRouter()
    const wallet = useWallet()
    const [value,setValue] = useAtom(Value)

    const counter = async (wallet:any) => {
        const metadata = await getMetadata(NETWORK, PACKAGE_ID);
        const obelisk = new Obelisk({
            networkType: NETWORK,
            packageId: PACKAGE_ID,
            metadata: metadata,
        });
        const tx = new TransactionBlock()
        const world = tx.pure(WORLD_ID)
        const params = [
            world,

        ]
        const new_tx = await obelisk.tx.counter_system.inc(tx, params,true) as TransactionBlock;
        const response = await wallet.signAndExecuteTransactionBlock({
            transactionBlock:new_tx,
            options: {
                showEffects:true,
                showObjectChanges: true,
            }
        })
        if (response.effects.status.status == 'success') {
            const metadata = await getMetadata(NETWORK, PACKAGE_ID);
            const obelisk = new Obelisk({
                networkType: NETWORK,
                packageId: PACKAGE_ID,
                metadata: metadata,
            });

            const component_name = Object.keys(obeliskConfig.singletonComponents)[0]
            const component_value = await obelisk.getComponentByName(WORLD_ID,component_name)
            const content = component_value.data!.content as data;
            const res = content.fields!.value!.fields.data;
            const bcs = new BCS(getSuiMoveConfig());
            const byteArray = new Uint8Array(res);
            const value = bcs.de(obeliskConfig.singletonComponents[component_name].type, byteArray);
            setValue(value)
        }
    }

    useEffect(() => {
        if (router.isReady){
            const query_counter = async () => {
                const metadata = await getMetadata(NETWORK, PACKAGE_ID);
                const obelisk = new Obelisk({
                    networkType: NETWORK,
                    packageId: PACKAGE_ID,
                    metadata: metadata,
                });
                // home component name
                const component_name = Object.keys(obeliskConfig.singletonComponents)[0]
                const component_value = await obelisk.getComponentByName(WORLD_ID,component_name)
                const content = component_value.data!.content as data;
                const res = content.fields!.value!.fields.data;
                const bcs = new BCS(getSuiMoveConfig());
                const byteArray = new Uint8Array(res);
                const value = bcs.de(obeliskConfig.singletonComponents[component_name].type, byteArray);
                setValue(value)
            }
            query_counter()
        }
    }, [router.isReady]);

    useEffect(() => {
        if (!wallet.connected) return;
        console.log('connected wallet name: ', wallet.name)
        console.log('account address: ', wallet.account?.address)
        console.log('account publicKey: ', wallet.account?.publicKey)
    }, [wallet.connected])


    return (
        <div className="flex justify-between items-start">
            <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8 flex-6">
                {!wallet.connected ? (
                    <ConnectButton/>
                ) : (
                    <>
                        <div >
                            <ConnectButton/>
                        </div>
                        <div className="flex flex-col gap-6 mt-12">
                            <div className="flex flex-col gap-4">
                                First, fund this wallet from the Sui faucet:
                                <div className="flex flex-col gap-6 text-2xl text-green-600 mt-6 ">
                                    Counter: {value}
                                </div>
                                <div className='flex flex-col gap-6'>
                                    <button
                                        type="button"
                                        className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        onClick={()=>{
                                            counter(wallet)
                                        }}>
                                        Increment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Home


