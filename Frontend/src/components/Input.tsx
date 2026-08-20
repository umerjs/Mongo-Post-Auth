import React from "react";
interface ButtonProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "number";
  placeholder?: string;
  value?: string | number;
  label?: string;
}
const Input = ({
  placeholder,
  type = "text",
  onChange,
  value,
  label,
}: ButtonProps) => {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="border border-blue-600 rounded-sm px-2"
      />
    </div>
  );
};

export default Input;
