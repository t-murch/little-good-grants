/**
 *
 * DONT FORGET MOBILE FIRST AND TO ACCOUNT FOR
 * BOTH: _____(MOBILE) && MD:_______(DESKTOP)
 */

import Image from "next/image";

export default function HeaderNav() {
  return (
    <>
      <div className="flex flex-col md:flex-row h-full w-full items-center md:items-end px-3 py-4 space-y-4 md:space-x-4 bg-gray-500">
        <div className="flex h-20 grow md:grow-0 items-center md:items-end justify-center rounded-md p-4 md:h-40 border-2 border-solid border-red-500">
          <a className="md:w-32" href="/home">
            <Image src={"/Blow_Logo_Medium_Black.svg"} alt="Blow Candle Co Logo" width={132} height={95} priority />
          </a>
        </div>
        <div className="grow justify-between mb-2 p-4 space-x-2 font-bold md:text-4xl md:flex-col md:space-x-0 md:space-y-2 border-2 border-solid border-blue-500">
          <h1>Small Business Grants for Black-Led Entrepreneurs</h1>
        </div>
      </div>
    </>
  );
}
