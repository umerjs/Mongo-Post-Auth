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
      className="bg-blue-500 rounded-sm w-50 cursor-pointer text-white"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
