import React, { useEffect, useState } from "react";
import Image from "next/image";

import { Alchemy, Network } from "alchemy-sdk";

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`;

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(config);

interface NFTMeta {
  name: string;
  description: string;
  path: string;
  id: number;
}

type Props = {
  count: number;
  address: string;
};

export default function MintedNfts({ count, address }: Props) {
  const [nftsMinted, setNftsMinted] = useState<NFTMeta[] | null>(null);
  const [nftPaths, setNftPaths] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        setNftPaths(data.lines);
      });
  }, []);

  // fetch minted NFTs
  useEffect(() => {
    async function getNFTs() {
      const contractAddresses = [NFT_CONTRACT];
      const nfts = await alchemy.nft.getNftsForOwner(address, {
        contractAddresses,
      });
      const nftList = nfts["ownedNfts"];

      let nftData: NFTMeta[] = [];
      let index = 0;
      for (let nft of nftList.slice(-count)) {
        const pathExists = nftPaths[Number(nft.tokenId)] != undefined;
        if (pathExists) {
          const [index, path] = nftPaths[Number(nft.tokenId)].split(": ");
          console.log(path);
          const iNFT = {
            name: nft.title,
            id: Number(nft.tokenId),
            description: nft.description,
            path: "/images/" + path,
          };
          nftData.push(iNFT);
        }
      }
      if (nftData.length > 0) setNftsMinted(nftData);
      else setNftsMinted(null);
    }
    if (nftPaths != undefined) {
      getNFTs();
    }
  }, [nftPaths]);

  return (
    <div className="grid grid-cols-1 place-content-center gap-4 sm:grid-cols-2">
      {nftsMinted != null &&
        nftsMinted?.map(function (nft) {
          return (
            <div
              key={nft.id}
              className="my-4 max-w-xs overflow-hidden rounded-md bg-white shadow"
            >
              {typeof nft.path == "string" && (
                <Image
                  alt={nft.name || ""}
                  src={`${nft.path}`}
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
  );
}
