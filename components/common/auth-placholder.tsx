import Image from "next/image";
import { logo } from "@assets";

const AuthPlacholder = () => {
    return (
        <div className="hidden lg:flex flex-1 relative bg-primary/10 rounded-l-[45px] overflow-hidden">
            <Image
                src={logo}
                alt="Auth Illustration"
                fill
                className="object-cover"
                priority
            />
        </div>
    );
};

export default AuthPlacholder;