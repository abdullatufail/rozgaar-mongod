// Global type declarations to reduce TypeScript errors

declare global {
  // Extend the Error interface to handle unknown error types
  interface Error {
    stack?: string;
    message: string;
  }

  // Allow any type for catch blocks
  type ErrorType = Error | unknown | any;

  // Common component props
  interface ComponentProps {
    children?: React.ReactNode;
    className?: string;
    [key: string]: any;
  }

  // Button component props
  interface ButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    variant?: string;
    size?: string;
    asChild?: boolean; // For shadcn/ui Button component
  }
}

// Module declarations for common imports
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

export {};
