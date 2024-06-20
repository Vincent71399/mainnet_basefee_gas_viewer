'use client'
import React, {useEffect, useState } from 'react';
import ChartContent from './components/ChartContent';
import {TOKEN_ADDRESS_MAP, TOKEN_LIST} from './config/ERC20_Config';


export default function Home() {
  const [contractAddress, setContractAddress] = useState<string>();

  useEffect(() => {
      setContractAddress(TOKEN_ADDRESS_MAP.get(TOKEN_LIST[0]))
  }, []);

  const setActiveToken = (name:string) => {
      setContractAddress(TOKEN_ADDRESS_MAP.get(name))
  }

  return (
      <main className="bg-gray-100 min-h-screen flex flex-col">
          <nav className="flex md:flex-col lg:flex-row items-center justify-between bg-blue-400 p-6 gap-2">
              <h1 className="text-2xl text-amber-50 font-semibold">Alchemy Charts</h1>
              <div className="space-x-5">
                  <label htmlFor="accounts">Choose an User:</label>
                  <select name="accounts"
                          id="accounts"
                          className="w-40 p-1 border"
                          onChange={(event) => {setActiveToken(event.target.value)}}>
                      {TOKEN_LIST.map((name: string, index: number) => (
                          <option key={index} value={name}>{name}</option>
                      ))}
                  </select>
              </div>
          </nav>
          <div className={"m-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1"}>
              {contractAddress && <ChartContent contractAddress={contractAddress}/>}
          </div>
      </main>
  )
}

