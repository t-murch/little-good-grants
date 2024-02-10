/**
 *
 * DONT FORGET MOBILE FIRST AND TO ACCOUNT FOR
 * BOTH: _____(MOBILE) && MD:_______(DESKTOP)
 */

export function HeaderNav() {
  return (
    <div className="space-y-4 md:space-x-4">
      <div className="flex flex-col md:flex-row h-full w-full p-4 items-center md:items-end rounded-md bg-gray-50 shadow-lg shadow-gray-50/50 opacity-75">
        <div className="grow justify-between space-x-2  md:flex-col md:space-x-0 md:space-y-2 rounded-md">
          <h1 className="font-bold md:text-4xl">Grants for Small Businesses</h1>
        </div>
      </div>
    </div>
  );
}
