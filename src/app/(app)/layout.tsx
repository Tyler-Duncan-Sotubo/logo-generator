import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import React from "react";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <header>
        <Header />
      </header>
      <main className="mx-auto my-16 w-[90%]">{children}</main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default AppLayout;
