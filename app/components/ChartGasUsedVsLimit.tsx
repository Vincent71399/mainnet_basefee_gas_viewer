'use client'
import React, {useEffect, useState } from "react"
//third party
import { Alchemy } from "alchemy-sdk";
import {VictoryAxis, VictoryBar, VictoryChart, VictoryLegend, VictoryLine } from "victory";
//constants
import {ChartCommonProps, ChartProps} from "../interfaces/ChartInterface"
import { ALCHEMY_CONFIG, BLOCK_LOOK_BACK } from "../alchemy/config";
//components
import BaseChart from "./BaseChart";


type BlockRate = {
    blockNum: number;
    rate: number;
}

const CHART_COLOR_UP = 'rgb(220 38 38)'
const CHART_COLOR_NEUTRAL = 'rgb(253 224 71)'
const CHART_COLOR_DOWN = 'rgb(74 222 128)'

const ChartGasUsedVsLimit: React.FC<ChartCommonProps> = (props) => {
    const {latestBlockNumber} = props

    const [blockRatesData, setBlockRatesData] = useState<BlockRate[]>([])

    useEffect(() => {
        const alchemy = new Alchemy(ALCHEMY_CONFIG);

        (async () => {
            const startBlock: number = latestBlockNumber - BLOCK_LOOK_BACK
            const endBlock: number = latestBlockNumber

            const blockRates: BlockRate[] = []

            for(let i=startBlock; i<=endBlock; i++){
                let block = await alchemy.core.getBlock(i)
                blockRates.push({
                    blockNum: block.number,
                    // @ts-ignore
                    rate: block.gasUsed / block.gasLimit * 100
                })
            }

            console.log(blockRates)
            setBlockRatesData(blockRates)
        })()
    }, [latestBlockNumber])

    return <>
        {blockRatesData.length > 0 && <BaseChart>
            <VictoryChart domainPadding={10}>
                <VictoryLegend x={100} y={0}
                               title=""
                               centerTitle
                               orientation="horizontal"
                               gutter={20}
                               style={{ border: { stroke: "black" }, title: {fontSize: 20 } }}
                               data={[
                                   { name: "Gas Used over Gas Limit >50%", symbol: { fill: CHART_COLOR_UP, type: "square" } },
                                   { name: "<50%", symbol: { fill: CHART_COLOR_DOWN, type: "square" } }
                               ]}
                />
                <VictoryAxis dependentAxis tickFormat={(y) => (`${y}%`)} />
                <VictoryAxis tickFormat={(x) => (``)} label="Last 10 blocks in real time" />
                <VictoryBar
                    data={blockRatesData}
                    style={{ data: { fill: ({datum })  =>
                        // @ts-ignore
                        datum.rate > 50 ? CHART_COLOR_UP : datum.rate < 50 ? CHART_COLOR_DOWN : CHART_COLOR_NEUTRAL
                    } }}
                    x="blockNum"
                    y="rate"
                />
            </VictoryChart>
        </BaseChart>}
    </>
}

export default ChartGasUsedVsLimit