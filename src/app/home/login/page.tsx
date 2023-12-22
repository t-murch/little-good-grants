import { Login } from '@/app/ui/admin/Login';

export default async function Page() {
  return (
    <main className="flex flex-col w-full h-screen items-center pb-28 justify-center border-4 border-purple-700 bg-secondary">
      <section className="flex flex-col items-center min-h-[16rem] gap-4 text-2xl font-semibold">
        <div className="flex flex-col w-auto items-center">
          <h2>Log In to View</h2>
          <h2>Admin Dashboard</h2>
        </div>
        <Login />
      </section>
    </main>
  );
}
