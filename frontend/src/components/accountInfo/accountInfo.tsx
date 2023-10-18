"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useContractRead } from "wagmi";

import { Alchemy, Network } from "alchemy-sdk";
import { tokenABI } from "@/assets/tokenABI";
import { formatEther } from "viem";

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`;
const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT as `0x${string}`;

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(config);

interface NFTMeta {
  name: string;
  description: number;
  image: string;
  attributes: any;
}

type Props = {};

export default function AccountInfo({}: Props) {
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [tokenIDs, setTokenIDs] = useState<number[] | null>(null);
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);
  const [nftBalance, setNftBalance] = useState<number | null>(null);

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

      let ids: number[] = [];
      let urls: string[] = [];
      for (let nft of nftList) {
        ids.push(Number(nft.tokenId));
        fetch(
          `https://bafybeieokkbwo2hp3eqkfa5chypmevxjii275icwxnuc7dmuexi3qsuvu4.ipfs.nftstorage.link/${nft.tokenId}`,
        )
          .then((res) => res.json())
          .then((json) => {
            const [prefix, separator, url, color, name] = json.image.split("/");
            const imageURL = `https://bafybeifzdbsgwpnj37c3tzj4pkut3b2pgf2u75mf3zmbto657ep2ubwf6a.ipfs.nftstorage.link/${color}/${name}`;
            urls.push(imageURL);
          });
      }
      setTokenIDs(ids);
      setImageUrls(urls);
      setNftBalance(ids.length);
    }

    if (tokenIDs == null) {
      getNFTs();
    }
  }, [isConnected]);

  console.log(tokenIDs);
  console.log(imageUrls?.[0]);
  console.log(nftBalance);

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

  console.log(tokenBalance);

  return (
    <div>
      {typeof imageUrls?.[0] == "string" && (
        <Image
          alt="nft"
          src={`${imageUrls?.[0]}` as string}
          width={200}
          height={200}
          layout="responsive"
        />
      )}
    </div>
  );
}
