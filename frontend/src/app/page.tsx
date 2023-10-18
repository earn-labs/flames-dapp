import AccountInfo from "@/components/accountInfo/accountInfo";
import Minter from "@/components/minter/minter";
import Navbar from "@/components/navigation/navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black p-4 text-white">
      <Navbar></Navbar>

      <AccountInfo></AccountInfo>
    </main>
  );
}
