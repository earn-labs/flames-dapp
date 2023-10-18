import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="flex-col justify-center">
      <div className="flex">
        <a
          className="pointer-events-none mx-auto flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          By{" "}
          <Image
            src="/vercel.svg"
            alt="EARN logo"
            className="dark:invert"
            width={100}
            height={24}
            priority
          />
        </a>
      </div>
      <div className="flex">
        <a
          className="mx-auto"
          href="https://app.uniswap.org/swap?outputCurrency=0x0b61C4f33BCdEF83359ab97673Cb5961c6435F4E"
          target={"_blank"}
        >
          <p>BUY $EARN</p>
        </a>
      </div>
      <div className="my-5">
        <ConnectButton />
      </div>
    </nav>
  );
}
