"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useContractRead, useNetwork } from "wagmi";

import { tokenABI } from "@/assets/tokenABI";
import { nftABI } from "@/assets/nftABI";

import Image from "next/image";

import { Alchemy, Network } from "alchemy-sdk";
import CopyToClipboard from "../copyToClipboard";

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`;
const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT as `0x${string}`;

const contractAddresses = [NFT_CONTRACT];

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network:
    process.env.NEXT_PUBLIC_TESTNET == "true"
      ? Network.ETH_GOERLI
      : Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

interface NFTMeta {
  name: string;
  description: string;
  path: string;
  id: number;
}

type Props = {};

export default function Nfts({}: Props) {
  const [totalSupply, setTotalSupply] = useState<number | undefined>(undefined);
  const [nftPaths, setNftPaths] = useState<string[]>([]);
  const [imagePath, setImagePath] = useState<string>("/logo.jpg");
  const [nftsOwned, setNftsOwned] = useState<NFTMeta[] | null>(null);

  // get account address
  const { address, isConnecting, isDisconnected, isConnected } = useAccount({});

  // get chain
  const { chain } = useNetwork();

  // define token contract config
  const nftContract = {
    address: NFT_CONTRACT,
    abi: nftABI,
    chainId: chain?.id,
  };

  // read current limits
  const { data, isSuccess, isError, isLoading } = useContractRead({
    ...nftContract,
    functionName: "totalSupply",
    watch: true,
    cacheTime: 1000,
  });

  useEffect(() => {
    if (data != undefined) {
      setTotalSupply(Number(data));
    }
  }, [data]);

  // set image path
  useEffect(() => {
    async function getNFT() {
      fetch("/api")
        .then((response) => response.json())
        .then((data) => {
          return data.lines;
          // setNftPaths(data.lines);
        })
        .then((nftpaths) => {
          alchemy.nft
            .getNftsForOwner(address as string, {
              contractAddresses,
            })
            .then((nfts) => {
              let nftArray: NFTMeta[] = [
                {
                  name: "Flame #?",
                  id: 0,
                  description: "",
                  path: "/unrevealed.jpg",
                },
                {
                  name: "Flame #?",
                  id: 1,
                  description: "",
                  path: "/unrevealed.jpg",
                },
              ];
              for (let index = 1; index <= 2; index++) {
                const nft = nfts["ownedNfts"].at(-index);
                const pathExists = nft != undefined;
                if (pathExists) {
                  const [suffix, path] =
                    nftpaths[Number(nft.tokenId)].split(": ");
                  nftArray[index - 1].name = nft.title;
                  nftArray[index - 1].description = nft.description;
                  nftArray[index - 1].id = Number(nft.tokenId);
                  nftArray[index - 1].path = "/images/" + path;
                }
              }
              setNftsOwned(nftArray);
            });
        });
    }

    if (isConnected) {
      getNFT();
    } else {
      setNftsOwned([
        {
          name: "Flame #?",
          id: 0,
          description: "",
          path: "/unrevealed.jpg",
        },
        {
          name: "Flame #?",
          id: 1,
          description: "",
          path: "/unrevealed.jpg",
        },
      ]);
    }
  }, [isConnected, totalSupply, address]);

  return (
    <div className="mx-auto w-full pb-8 md:ml-0 ">
      <div className="mx-auto max-w-sm rounded-md bg-black p-8">
        {/* <Image
          className="mb-4 h-16 w-full overflow-hidden object-cover"
          src={"/featured_image.jpg"}
          width={100}
          height={100}
          alt="Flame NFTs"
        /> */}

        <h2 className="border-b-2 border-yellow-500 py-2 pb-2 text-xl uppercase">
          Your NFTs
        </h2>
        <div className="my-4 min-h-max">
          <div className="grid grid-cols-2 place-content-center gap-4 ">
            {nftsOwned != null &&
              nftsOwned.map(function (nft) {
                return (
                  <div
                    key={nft.id}
                    className="my-2 overflow-hidden rounded-md border-2 border-white bg-white shadow"
                  >
                    {
                      <Image
                        alt={nft.name || ""}
                        src={`${nft.path}` as string}
                        width={100}
                        height={100}
                        layout="responsive"
                      />
                    }
                    <div className="m-2 text-xs font-bold text-black">
                      {nft.name}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
