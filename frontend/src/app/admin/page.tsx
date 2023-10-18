import Navbar from "@/components/navigation/navbar";
import React from "react";
import AdminPanel from "./adminPanel";

type Props = {};

export default function Admin({}: Props) {
  return (
    <main>
      <section>
        <Navbar></Navbar>
        <AdminPanel></AdminPanel>
      </section>
    </main>
  );
}
