"use client";
import { JSX, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const usePasswordToggle = () => {
  const [visibility, setVisibility] = useState<boolean>(false);

  const inputIcon: JSX.Element = visibility ? (
    <Eye
      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-50 peer-disabled:cursor-not-allowed"
      onClick={() => setVisibility((visibility) => !visibility)}
      size={16}
    />
  ) : (
    <EyeOff
      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-50 peer-disabled:cursor-not-allowed"
      onClick={() => setVisibility((visibility) => !visibility)}
      size={16}
    />
  );
  const inputType: "text" | "password" = visibility ? "text" : "password";
  return { inputIcon, inputType };
};

export default usePasswordToggle;
