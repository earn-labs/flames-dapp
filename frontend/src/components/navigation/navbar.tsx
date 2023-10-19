import Image from "next/image";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="mx-auto mb-8 mt-3 flex justify-between gap-5 align-middle md:w-3/5">
      <div className="my-auto h-fit w-36 flex-row justify-between rounded-md border-2 border-white bg-white font-bold text-black hover:bg-slate-400">
        <a
          className="pointer-events-none mx-auto flex items-center gap-4 text-right align-middle text-lg uppercase lg:pointer-events-auto lg:p-0"
          href="https://buyholdearn.com"
          rel="noopener noreferrer"
        >
          <Image
            src="/featured_image.jpg"
            alt="EARN logo"
            className="ml-0 h-10 w-auto overflow-hidden rounded-md"
            width={40}
            height={40}
            priority
          />
          Home
        </a>
      </div>
      <div className="my-auto h-fit w-36 flex-row justify-center rounded-md border-2 border-white bg-white text-center font-bold text-black hover:bg-slate-400 ">
        <a
          className="pointer-events-none mx-auto flex h-10 items-center justify-center gap-4 align-middle text-lg uppercase lg:pointer-events-auto lg:p-0"
          href="https://app.uniswap.org/swap?outputCurrency=0x0b61C4f33BCdEF83359ab97673Cb5961c6435F4E"
          target={"_blank"}
        >
          <p>BUY $EARN</p>
        </a>
      </div>
    </nav>
  );
}
