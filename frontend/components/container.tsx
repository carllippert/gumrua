import cx from "classnames";
import React, { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={twMerge(cx("max-w-[34rem] mx-auto px-4 sm:px-6", className))}
    >
      {children}
    </div>
  );
};

export default Container;
