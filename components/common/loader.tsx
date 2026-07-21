import Image from "next/image";
import { loader } from "@assets";

const Loader = () => {
  return <Image alt="Loader" height={128} src={loader} width={128} />;
};

export default Loader;
