import { Divider } from "@mantine/core";
import { Faq } from "./components/FAQ";
import { HeroText } from "./components/Hero";

export default function Home() {
  return (
    <>
      <HeroText/>
      <Divider my='md'/>
      <Faq/>
    </>
  );
}
