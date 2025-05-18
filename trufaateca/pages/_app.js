import "@/styles/globals.css";

import { Layaout } from "@/components";

export default function App({ Component, pageProps }) {
  return(
    <Layaout>
      <Component {...pageProps} />;
    </Layaout>
    
  ) 
}
