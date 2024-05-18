import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface IPasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const PasswordInput = ({
  value,
  onChange,
  placeholder,
}: IPasswordInputProps) => {
  const [isShowPassowrd, setIsShowPassword] = useState<boolean>(false);
  const toggleShowPassowrd = () => {
    setIsShowPassword(!isShowPassowrd);
  };

  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
      <input
        type={isShowPassowrd ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />

      {isShowPassowrd ? (
        <FaRegEye
          size={22}
          className="text-primary cursor-pointer"
          onClick={() => toggleShowPassowrd()}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-primary cursor-pointer"
          onClick={() => toggleShowPassowrd()}
        />
      )}
    </div>
  );
};

export default PasswordInput;
