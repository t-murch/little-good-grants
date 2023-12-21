import { getUnapprovedSubmissions } from '@/app/actions/grants';

export default async function Page() {
  const allSubmissions = (await getUnapprovedSubmissions()) ?? [];
  console.log('Grant Rows Count = ', allSubmissions?.length);

  return (
    <main className="flex p-10 min-h-screen w-screen flex-col items-center justify-between bg-back">
      <section className="lg:h-auto lg:w-full p-2 flex flex-col rounded-md border border-purple-600">
        <article>
          <h2 className="font-bold text-xl">Welcome, __USER__</h2>
        </article>
        <nav>
          <a className="font-bold text-xl">Grants</a>
        </nav>
      </section>
      <section className="lg:h-auto lg:w-full p-2 flex flex-col rounded-md border border-purple-600">
        <div>{allSubmissions.length}</div>
        <p>The admin Page</p>
      </section>
    </main>
  );
}
