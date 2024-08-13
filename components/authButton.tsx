import React from "react";
import { Button } from "./ui/button";

interface buttonProps {
  onClick ?: () => void;
  image: React.JSX.Element;
  name: string;
  classname: string;
}

function AuthButton(props: buttonProps) {
  return (
    <Button
      type="button"
      className={`flex gap-2 p-2 border-primary_colors-github-dark ${props.classname} `}
      onClick={props.onClick}
    >
      {props.image}
      Continue With {props.name}
    </Button>
  );
}

export default AuthButton;
