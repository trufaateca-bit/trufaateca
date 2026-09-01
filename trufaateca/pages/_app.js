import "@/styles/globals.css";
import { Layaout } from "@/components";
import { StateContext } from "@/context/StateContext";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <StateContext>
      <Layaout heroBanner={pageProps.bannerData?.[0]}>
        <Component {...pageProps} />
      </Layaout>
    </StateContext>
  );
}
