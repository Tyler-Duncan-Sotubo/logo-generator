import Link from "next/link";
import Image from "next/image";

export const ApplicationLogo = () => (
  <Link href="/" className="flex items-center">
    <span className="text-xl font-semibold">
      <Image src="/logo.png" alt="website logo" width={80} height={60} />
    </span>
  </Link>
);
