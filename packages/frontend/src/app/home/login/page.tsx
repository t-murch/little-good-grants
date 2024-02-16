import { Login } from '@/app/ui/admin/Login';

export default async function Page() {
  return (
    <main className="flex flex-col w-full h-screen items-center justify-center bg-secondary">
      <section className="flex flex-col items-center min-h-[16rem] gap-4 text-3xl font-bold">
        <div className="flex flex-col w-auto items-center">
          <h2>Log In to View</h2>
          <h2>Admin Dashboard</h2>
        </div>
        {/* <SignUp /> */}
        <Login />
      </section>
    </main>
  );
}
