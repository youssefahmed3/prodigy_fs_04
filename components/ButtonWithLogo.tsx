import React from "react";
import { Button } from "@/components/ui/button";

interface ButtonProps {
  name?: string;
  onClick?: () => void;
  image?: React.ReactElement;
  variant?: "primary" | "secondary" | "danger"; // Extend the interface to include a variant prop
  disabled?: boolean;
  classname?: string;
  type?: string;
}

function ButtonWithLogo(props: ButtonProps) {
  // Define a function or a mapping object to get Tailwind classes based on the variant
  const variantClasses: { primary: string; secondary: string; danger: string } = {
    primary: "bg-primary_colors-blue_2 text-primary_colors-white_1 hover:bg-primary_colors-blue_1 ",
    secondary: "bg-primary_colors-white_1  text-customColors-black_1 hover:bg-primary_colors-white_2",
    danger: "bg-primary_colors-red_1 hover:bg-primary_colors-red_2",
  };

  // Use the variant to select the appropriate class names
  const buttonClasses = `flex justify-around ${variantClasses[props.variant!]}`;

  return (
    <Button type={props.type} className={`${buttonClasses} flex items-center justify-center gap-2 font-bold ${props.classname}`} onClick={props.onClick} disabled={props.disabled}>
        {props.image ? <div>{props.image}</div> : null}
        {props.name ? <div>{props.name}</div> : null}
    </Button>
  );
}

export default ButtonWithLogo;
