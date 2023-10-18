"use client";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { Alchemy, Network } from "alchemy-sdk";

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`;
const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT as `0x${string}`;

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(config);

type Props = {};

export default function Minter({}: Props) {
  const [tokenIDs, setTokenIDs] = useState<number[] | null>(null);

  // get account address
  const { address, isConnecting, isDisconnected, isConnected } = useAccount({});

  useEffect(() => {
    // React advises to declare the async function directly inside useEffect
    async function getNFTs() {
      const nfts = await alchemy.nft.getNftsForOwner(address as string);
      const numNfts = nfts["totalCount"];
      const nftList = nfts["ownedNfts"];

      let ids: number[] = [];
      for (let nft of nftList) {
        ids.push(Number(nft.tokenId));
      }
      setTokenIDs(ids);
    }

    if (tokenIDs == null) {
      getNFTs();
    }
  }, []);

  console.log(tokenIDs);
  // Print NFTs
  //   console.log(nfts.ownedNfts[0].tokenId);

  //   // check balance
  //   const {
  //     data: tokenBalanceData,
  //     isError: tokenBalanceError,
  //     isLoading: tokenBalanceLoading,
  //     isSuccess: tokenBalanceSuccess,
  //   } = useContractRead({
  //     address: TOKEN_CONTRACT,
  //     abi: tokenABI,
  //     functionName: "balanceOf",
  //     args: [address as `0x${string}`],
  //     enabled: address != null,
  //     watch: true,
  //     onSuccess(data: bigint) {
  //       setTokenBalance(Number(formatEther(data)));
  //     },
  //   });

  return <div>Minter</div>;
}
