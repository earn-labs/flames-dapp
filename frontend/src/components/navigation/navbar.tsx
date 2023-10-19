import Image from "next/image";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="mx-auto mb-8 mt-3 flex justify-between gap-5 align-middle md:w-3/5">
      <div>
        <a
          className="pointer-events-none mx-auto gap-2 lg:pointer-events-auto lg:p-0"
          href="https://buyholdearn.com"
          rel="noopener noreferrer"
        >
          <Image
            src="/logo.jpg"
            alt="EARN logo"
            className="rounded-xl"
            width={45}
            height={45}
            priority
          />
        </a>
      </div>
      <div className="my-auto h-10 rounded-md bg-white px-4 py-2 font-bold text-black hover:bg-slate-400">
        <a
          className="mx-auto"
          href="https://app.uniswap.org/swap?outputCurrency=0x0b61C4f33BCdEF83359ab97673Cb5961c6435F4E"
          target={"_blank"}
        >
          <p>BUY $EARN</p>
        </a>
      </div>
    </nav>
  );
}
