"use client";
import { nftABI } from "@/assets/nftABI";
import React, { useState } from "react";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`;

type Props = {};

export default function AdminPanel({}: Props) {
  const [batchLimit, setBatchLimit] = useState<string>("");
  const [maxPerWallet, setMaxPerWallet] = useState<string>("");

  // get account address
  const { address, isConnecting, isDisconnected, isConnected } = useAccount({});

  // get chain
  const { chain } = useNetwork();

  // set max per wallet
  const { config: maxPerWalletConfig, error: maxPerWalletError } =
    usePrepareContractWrite({
      address: NFT_CONTRACT as `0x${string}`,
      abi: nftABI,
      functionName: "setMaxPerWallet",
      account: address,
      chainId: chain?.id,
      args: [BigInt(maxPerWallet)],
    });
  const { write: writeMaxPerWallet } = useContractWrite(maxPerWalletConfig);

  // set batch limit
  const { config: batchLimitConfig, error: batchLimitError } =
    usePrepareContractWrite({
      address: NFT_CONTRACT as `0x${string}`,
      abi: nftABI,
      functionName: "setBatchLimit",
      account: address,
      chainId: chain?.id,
      args: [BigInt(batchLimit)],
    });
  const { write: writeBatchLimit } = useContractWrite(batchLimitConfig);

  return (
    <div>
      <div>
        <form>
          <label>
            Enter max per wallet:
            <input
              type="number"
              value={maxPerWallet}
              min={batchLimit}
              placeholder="1"
              onChange={(e) => {
                setMaxPerWallet(e.target.value);
              }}
            />
          </label>
        </form>
        <button
          disabled={
            !writeMaxPerWallet || Number(maxPerWallet) < Number(batchLimit)
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
              max={"20" || maxPerWallet}
              placeholder="1"
              onChange={(e) => {
                setBatchLimit(e.target.value);
              }}
            />
          </label>
        </form>
        <button
          disabled={
            !writeBatchLimit || Number(maxPerWallet) < Number(batchLimit)
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
