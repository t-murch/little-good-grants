/**
 *
 * DONT FORGET MOBILE FIRST AND TO ACCOUNT FOR
 * BOTH: _____(MOBILE) && MD:_______(DESKTOP)
 */

import Image from 'next/image';

export function HeaderNav() {
  return (
    <div className="space-y-4 md:space-x-4">
      <div className="flex flex-col md:flex-row h-full w-full p-4 items-center md:items-end rounded-md bg-neutral-500 shadow-2xl opacity-75">
        <div className="flex h-20 grow md:grow-0 items-center md:items-end justify-center rounded-md md:h-40">
          {/* <a className="md:w-32" href="/home"> */}
          {/*   <Image */}
          {/*     src={'/Blow_Logo_Medium_Black.svg'} */}
          {/*     alt="Blow Candle Co Logo" */}
          {/*     width={132} */}
          {/*     height={95} */}
          {/*     priority */}
          {/*   /> */}
          {/* </a> */}
        </div>
        <div className="grow justify-between space-x-2  md:flex-col md:space-x-0 md:space-y-2 rounded-md">
          <h1 className="font-bold md:text-4xl">Grants for Small Businesses</h1>
        </div>
      </div>
    </div>
  );
}
