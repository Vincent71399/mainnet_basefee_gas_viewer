'use client'
import React, {useEffect, useState } from "react";
//third party
import { Alchemy } from "alchemy-sdk";
//config
import { ALCHEMY_CONFIG } from "../alchemy/config";
import { ChartContentProps } from "../interfaces/ChartInterface";
//components
import ChartBaseFee from "./ChartBaseFee";
import ChartGasUsedVsLimit from "./ChartGasUsedVsLimit";
import ChartTransfersByLog from "./ChartTransfersByLog";


const ChartContent: React.FC<ChartContentProps> = (props) => {
    const {contractAddress} = props;

    const [latestBlockNumber, setLatestBlockNumber] = useState<number>();

    useEffect(() => {
        const alchemy = new Alchemy(ALCHEMY_CONFIG);
        const listener = (blockNumber: number) => {
            console.log("The latest block number is", blockNumber)
            setLatestBlockNumber(blockNumber)
        }

        (async () => {
            console.log("add listener")
            const latestBlockNumber = await alchemy.core.getBlockNumber()
            console.log("The init block number is", latestBlockNumber)
            setLatestBlockNumber(latestBlockNumber)
            alchemy.ws.on("block", listener);
        })()
        return () => {
            console.log("remove listener")
            alchemy.ws.off("block", listener)
        }
    }, []);

    return <>
        {/*{latestBlockNumber && <ChartTransfers contractAddress={contractAddress} latestBlockNumber={latestBlockNumber} />}*/}
        {latestBlockNumber && <ChartTransfersByLog contractAddress={contractAddress} latestBlockNumber={latestBlockNumber} />}
        {latestBlockNumber && <ChartBaseFee latestBlockNumber={latestBlockNumber} />}
        {/*{latestBlockNumber && <ChartGasUsedVsLimit latestBlockNumber={latestBlockNumber} />}*/}
    </>
}

export default ChartContent