"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useContractRead } from "wagmi";

import { Alchemy, Network } from "alchemy-sdk";
import { tokenABI } from "@/assets/tokenABI";
import { formatEther } from "viem";
import { xdc } from "viem/chains";

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
  // const [tokenIDs, setTokenIDs] = useState<number[] | null>(null);
  // const [imageUrls, setImageUrls] = useState<string[] | null>(null);
  // const [tokenNames, setTokenNames] = useState<string[] | null>(null);
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

    getNFTs();
  }, [isConnected]);

  // check balance
  const {} = useContractRead({
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

  return (
    <div>
      <div className="py-4">
        <h2 className="pb-2 text-xl">ACCOUNT INFO</h2>
        <div className="flex justify-between">
          <h3>Balance: </h3>
          <p>{tokenBalance ? tokenBalance : "Loading..."}</p>
        </div>
        <div className="flex justify-between">
          <h3>NFTs: </h3>
          <p>{nftsOwned ? nftsOwned.length : "Loading..."}</p>
        </div>
      </div>
      <h2 className="py-2">Your Gallery</h2>
      <div className="xs:flex-col sm:flex sm:gap-4">
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
    </div>
  );
}
