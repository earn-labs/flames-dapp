"use client";
import { nftABI } from "@/assets/nftABI";
import React, { useState } from "react";
import {
  useAccount,
  useContractReads,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";

type Props = {};

export default function AdminPanel({}: Props) {
  const [batchLimit, setBatchLimit] = useState<string>("");
  const [maxPerWallet, setMaxPerWallet] = useState<string>("");

  // get account address
  const { address, isConnecting, isDisconnected, isConnected } = useAccount({});

  // get chain
  const { chain } = useNetwork();

  // define contract config
  const nftContract = {
    address: process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`,
    abi: nftABI,
    chainId: chain?.id,
  };

  // read current limits
  const {
    data: readLimitData,
    isSuccess: readLimitSuccess,
    isError: readLimitError,
    isLoading: readLimitLoading,
  } = useContractReads({
    contracts: [
      {
        ...nftContract,
        functionName: "maxPerWallet",
      },
      {
        ...nftContract,
        functionName: "batchLimit",
      },
    ],
    watch: true,
    cacheTime: 3000,
  });

  // set max per wallet
  const { config: maxPerWalletConfig, error: maxPerWalletError } =
    usePrepareContractWrite({
      ...nftContract,
      functionName: "setMaxPerWallet",
      account: address,
      args: [BigInt(maxPerWallet)],
    });
  const { write: writeMaxPerWallet } = useContractWrite(maxPerWalletConfig);

  // set batch limit
  const { config: batchLimitConfig, error: batchLimitError } =
    usePrepareContractWrite({
      ...nftContract,
      functionName: "setBatchLimit",
      account: address,
      args: [BigInt(batchLimit)],
    });
  const { write: writeBatchLimit } = useContractWrite(batchLimitConfig);

  return (
    <div>
      <div className="flex">
        <div className="mx-2 flex">
          <h4>Max Per Wallet:</h4>
          <p>
            {readLimitLoading
              ? "Loading..."
              : Number(readLimitData?.[0].result)}
          </p>
        </div>
        <div className="mx-2 flex">
          <h4>Batch Limit:</h4>
          <p>
            {readLimitLoading
              ? "Loading..."
              : Number(readLimitData?.[1].result)}
          </p>
        </div>
      </div>
      <div>
        <form>
          <label>
            Enter max per wallet:
            <input
              type="number"
              value={maxPerWallet}
              min={readLimitSuccess ? Number(readLimitData?.[1].result) : "0"}
              placeholder={
                readLimitSuccess
                  ? Number(readLimitData?.[0].result).toString()
                  : "1"
              }
              onChange={(e) => {
                setMaxPerWallet(e.target.value);
              }}
            />
          </label>
        </form>
        <button
          disabled={
            !writeMaxPerWallet ||
            (readLimitSuccess &&
              Number(maxPerWallet) < Number(readLimitData?.[1].result))
          }
          onClick={() => {
            writeMaxPerWallet?.();
          }}
        >
          Set Max Per Wallet
        </button>
      </div>
      <div>
        <form>
          <label>
            Enter batch limit:
            <input
              type="number"
              value={batchLimit}
              min="0"
              max={Math.min(
                20,
                readLimitSuccess ? Number(readLimitData?.[0].result) : 20,
              )}
              placeholder={
                readLimitSuccess
                  ? Number(readLimitData?.[1].result).toString()
                  : "1"
              }
              onChange={(e) => {
                setBatchLimit(e.target.value);
              }}
            />
          </label>
        </form>
        <button
          disabled={
            !writeBatchLimit ||
            (readLimitSuccess &&
              Number(readLimitData?.[0].result) < Number(batchLimit))
          }
          onClick={() => {
            writeBatchLimit?.();
          }}
        >
          Set Batch Limit
        </button>
      </div>
    </div>
  );
}
