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



type BlockBaseFee = {
    blockNum: number;
    baseFee: number;
}

type BlockRate = {
    blockNum: number;
    rate: number;
}

const CHART_COLOR = "#74D99F"
const CHART_COLOR_LINE = 'rgb(220 38 38)'

const ChartBaseFee: React.FC<ChartCommonProps> = (props) => {
    const {latestBlockNumber} = props

    const [baseFeesData, setBaseFeesData] = useState<BlockBaseFee[]>([])
    const [blockRatesData, setBlockRatesData] = useState<BlockRate[]>([])

    useEffect(() => {
        const alchemy = new Alchemy(ALCHEMY_CONFIG);

        (async () => {
            const startBlock: number = latestBlockNumber - BLOCK_LOOK_BACK
            const endBlock: number = latestBlockNumber

            const baseFees: BlockBaseFee[] = []
            const blockRates: BlockRate[] = []

            for(let i=startBlock; i<=endBlock; i++){
                let block = await alchemy.core.getBlock(i)
                baseFees.push({
                    blockNum: block.number,
                    // @ts-ignore
                    baseFee: parseInt((block.baseFeePerGas).toString())
                })
                const maxBaseFees = baseFees.reduce((max, obj) => (obj.baseFee > max ? obj.baseFee : max), -Infinity);

                blockRates.push({
                    blockNum: block.number,
                    // @ts-ignore
                    rate: block.gasUsed / block.gasLimit * maxBaseFees
                })
            }

            setBaseFeesData(baseFees)
            setBlockRatesData(blockRates)
        })()
    }, [latestBlockNumber])

    return <>
        {baseFeesData.length > 0 && <BaseChart>
            <VictoryChart domainPadding={10}>
                <VictoryLegend x={200} y={0}
                               title=""
                               centerTitle
                               orientation="vertical"
                               gutter={20}
                               style={{ border: { stroke: "black" }, title: {fontSize: 20 } }}
                               data={[
                                   { name: "Base Fee per Gas", symbol: { fill: CHART_COLOR, type: "square" } },
                                   { name: "Gas used vs limit", symbol: { fill: CHART_COLOR_LINE, type: "square" } },
                               ]}
                />
                <VictoryAxis dependentAxis tickFormat={(y) => (`${y / 1e9}b`)} />
                <VictoryAxis tickFormat={(x) => (``)} label="Last 10 blocks in real time" />
                <VictoryBar
                    data={baseFeesData}
                    style={{ data: { fill: CHART_COLOR } }}
                    x="blockNum"
                    y="baseFee"
                />
                <VictoryLine
                    style={{
                        data: { stroke: CHART_COLOR_LINE },
                        parent: { border: "1px solid #ccc"}
                    }}
                    data={blockRatesData}
                    x="blockNum"
                    y="rate"
                />
            </VictoryChart>
        </BaseChart>}
    </>
}

export default ChartBaseFee