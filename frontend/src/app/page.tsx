import AccountInfo from "@/components/accountInfo/accountInfo";
import CollectionInfo from "@/components/collectionInfo/collectionInfo";
import Minter from "@/components/minter/minter";
import Navbar from "@/components/navigation/navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-hero-pattern flex min-h-screen flex-col bg-scroll p-8 text-white bg-blend-darken">
      <div className="w-full flex-col items-center justify-between">
        <Navbar></Navbar>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CollectionInfo></CollectionInfo>
          <Minter></Minter>
        </div>

        <AccountInfo></AccountInfo>
      </div>
    </main>
  );
}

