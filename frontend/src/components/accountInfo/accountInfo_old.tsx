"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useContractRead } from "wagmi";

import { Alchemy, Network } from "alchemy-sdk";
import { tokenABI } from "@/assets/tokenABI";
import { formatEther } from "viem";
import { xdc } from "viem/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`;
const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT as `0x${string}`;

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(config);

interface NFTMeta {
  name: string;
  description: string;
  url: string;
  id: number;
}

type Props = {};

export default function AccountInfo({}: Props) {
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [nftBalance, setNftBalance] = useState<number | null>(null);
  const [nftsOwned, setNftsOwned] = useState<NFTMeta[] | null>(null);

  const contractAddresses = [NFT_CONTRACT];

  // get account address
  const { address, isConnecting, isDisconnected, isConnected } = useAccount({});

  // fetch owned NFTs
  useEffect(() => {
    async function getNFTs() {
      const nfts = await alchemy.nft.getNftsForOwner(address as string, {
        contractAddresses,
      });
      const nftList = nfts["ownedNfts"];

      let nftData: NFTMeta[] = [];
      for (let nft of nftList) {
        let imageURL: string = "";
        fetch(
          `https://bafybeieokkbwo2hp3eqkfa5chypmevxjii275icwxnuc7dmuexi3qsuvu4.ipfs.nftstorage.link/${nft.tokenId}`,
        )
          .then((res) => res.json())
          .then((json) => {
            const [prefix, separator, url, color, name] = json.image.split("/");
            imageURL = `https://bafybeifzdbsgwpnj37c3tzj4pkut3b2pgf2u75mf3zmbto657ep2ubwf6a.ipfs.nftstorage.link/${color}/${name}`;
            const iNFT = {
              name: nft.title,
              id: Number(nft.tokenId),
              description: nft.description,
              url: imageURL,
            };

            nftData.push(iNFT);
          });
      }

      setNftBalance(nftData.length);
      setNftsOwned(nftData);
    }
    if (isConnected) {
      getNFTs();
    }
  }, [isConnected]);

  // check balance
  const { isLoading, isSuccess, isError } = useContractRead({
    address: TOKEN_CONTRACT,
    abi: tokenABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    enabled: isConnected && address != null,
    watch: true,
    onSuccess(data: bigint) {
      setTokenBalance(Number(formatEther(data)));
    },
  });

  function getBalanceString() {
    let text: string = "---";
    if (isLoading) {
      text = "Loading...";
    } else if (isSuccess && tokenBalance != null) {
      text = `${tokenBalance} EARN`;
    } else {
      text = "---";
    }
    return text;
  }

  function getNftBalanceString() {
    let text: string = "---";
    if (isConnected && nftsOwned == null) {
      text = "Loading...";
    } else if (nftsOwned != null) {
      text = `${nftsOwned.length} FLAME`;
    } else {
      text = "---";
    }
    return text;
  }

  return (
    <div className="w-full px-4">
      <div className="max-w-sm rounded-md border-2 border-slate-400 p-4">
        <div className="py-2">
          <ConnectButton />
        </div>

        <h2 className="pb-2 text-xl">ACCOUNT INFO</h2>
        <div className="flex justify-between">
          <h3>Balance: </h3>
          <p>{getBalanceString()}</p>
        </div>
        <div className="flex justify-between">
          <h3>NFTs: </h3>
          <p>{getNftBalanceString()}</p>
        </div>
      </div>
      {/* <div className="my-4 min-h-max">
        <h2 className="border-b-2 border-yellow-500 py-2">Your Gallery</h2>
        <div className="grid grid-cols-1 place-content-center gap-4 sm:grid-cols-2 md:grid-cols-4">
          {nftsOwned?.map(function (nft) {
            return (
              <div
                key={nft.id}
                className="my-4 max-w-xs overflow-hidden rounded-md bg-white shadow"
              >
                {typeof nft.url == "string" && (
                  <Image
                    alt={nft.name || ""}
                    src={`${nft.url}` as string}
                    width={200}
                    height={200}
                    layout="responsive"
                  />
                )}
                <div className="m-4 font-bold text-black">
                  {nft.name || "Loading..."}
                </div>
                <div className="m-4 text-black">
                  {nft.description || "Loading..."}
                </div>
              </div>
            );
          })}
        </div>
      </div> */}
    </div>
  );
}
