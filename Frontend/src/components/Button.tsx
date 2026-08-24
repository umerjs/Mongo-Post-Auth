import React from "react";

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

const Button = ({ onClick, children, type = "submit" }: ButtonProps) => {
  return (
    <button
      type={type}
      className=" position-relative left-20 bg-blue-500 rounded-sm w-70 cursor-pointer text-white h-10 flex justify-center items-center"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
