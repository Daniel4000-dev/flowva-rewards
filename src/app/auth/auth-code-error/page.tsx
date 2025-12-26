import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold bg-white text-destructive">Authentication Error</h1>
      <p className="text-muted-foreground bg-white text-black p-4 rounded-lg">
        There was an error signing you in. Please try again.
      </p>
      <Link href="/signin" className="underline text-primary text-white bg-black p-4 rounded-lg">
        Back to Login
      </Link>
    </div>
  );
}
