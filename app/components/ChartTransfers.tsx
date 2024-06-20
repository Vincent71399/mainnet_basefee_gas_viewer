'use client'
import React, { useEffect, useState } from 'react';
//third party
import {VictoryAxis, VictoryBar, VictoryChart, VictoryLegend} from "victory";
import { Alchemy } from 'alchemy-sdk';
//constants
import {ALCHEMY_CONFIG, BLOCK_LOOK_BACK} from '../alchemy/config';
import { ChartProps } from '../interfaces/ChartInterface';
//functions
import { Number2Hex } from '../functions/commonFuncs';
//components
import BaseChart from "@/app/components/BaseChart";


type BlockVolume = {
    blockNum: number;
    volume: number;
}

const CHART_COLOR = "#007AFF"

const ChartTransfers: React.FC<ChartProps> = (props) => {

    const {contractAddress,latestBlockNumber} = props

    const [data, setData] = useState<BlockVolume[]>([])

    useEffect(() => {
        const alchemy = new Alchemy(ALCHEMY_CONFIG);

        (async () => {
            const startBlock = Number2Hex(latestBlockNumber - BLOCK_LOOK_BACK)
            const endBlock = Number2Hex(latestBlockNumber)

            const getTransfers= await alchemy.core.getAssetTransfers({
                fromBlock: startBlock,
                toBlock: endBlock,
                contractAddresses: [contractAddress],
                excludeZeroValue: true,
                // @ts-ignore
                category: ["erc20"],
            });

            const result: BlockVolume[] = [];
            for (let i: number = latestBlockNumber - BLOCK_LOOK_BACK; i <= latestBlockNumber; i++) {
                const filteredData = getTransfers.transfers.filter(item => parseInt(item.blockNum, 16) === i);
                // @ts-ignore
                const accumulatedB = filteredData.reduce((sum, item) => sum + parseInt(item.rawContract.value, 16), 0);
                result.push({ blockNum: i, volume: accumulatedB });
            }
            console.log(result)
            setData(result)

        })()
    }, [contractAddress, latestBlockNumber]);

    return <>
        {data.length > 0 && <BaseChart>
            <VictoryChart domainPadding={10}>
                <VictoryLegend x={200} y={10}
                               title=""
                               centerTitle
                               orientation="horizontal"
                               gutter={20}
                               style={{ border: { stroke: "black" }, title: {fontSize: 20 } }}
                               data={[
                                   { name: "Volume", symbol: { fill: CHART_COLOR, type: "square" } },
                               ]}
                />
                <VictoryAxis dependentAxis tickFormat={(y) => (`${y / 1e9}b`)} />
                <VictoryAxis tickFormat={(x) => (``)} label="Last 10 blocks in real time" />
                <VictoryBar
                    data={data}
                    style={{ data: { fill: CHART_COLOR } }}
                    x="blockNum"
                    y="volume"
                />
            </VictoryChart>
        </BaseChart>}
    </>
};

export default ChartTransfers;