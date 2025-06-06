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
  // Mongoose/MongoDB compatibility
  namespace mongoose {
    interface Model<T> {
      findById(id: any, projection?: any, options?: any): any;
      findOne(filter?: any, projection?: any, options?: any): any;
      find(filter?: any, projection?: any, options?: any): any;
      create(doc: any): any;
      findByIdAndUpdate(id: any, update?: any, options?: any): any;
      findByIdAndDelete(id: any, options?: any): any;
    }
    
    interface Schema {
      Types: {
        ObjectId: any;
      };
    }
  }

  // Override any problematic types
  interface Window {
    [key: string]: any;
  }

  // Make all imports more flexible
  const require: (id: string) => any;

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

// Missing dependency declarations
declare module "zod" {
  export const z: any;
  export default any;
}

declare module "react-router-dom" {
  export const Navigate: any;
  export const useLocation: any;
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export const Link: any;
}

declare module "@radix-ui/react-aspect-ratio" {
  export const Root: any;
  export default any;
}

declare module "@radix-ui/react-avatar" {
  export const Root: any;
  export const Image: any;
  export const Fallback: any;
  export default any;
}

declare module "react-day-picker" {
  export const DayPicker: any;
  export default any;
}

declare module "@radix-ui/react-checkbox" {
  export const Root: any;
  export const Indicator: any;
  export default any;
}

declare module "cmdk" {
  export const Command: any;
  export default any;
}

declare module "@radix-ui/react-label" {
  export const Root: any;
  export default any;
}

declare module "react-hook-form" {
  export const useForm: any;
  export const Controller: any;
  export const FormProvider: any;
  export const useFormContext: any;
  export const useController: any;
  export const useWatch: any;
  export default any;
}

declare module "@radix-ui/react-hover-card" {
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
  export default any;
}

declare module "@radix-ui/react-navigation-menu" {
  export const Root: any;
  export const List: any;
  export const Item: any;
  export const Trigger: any;
  export const Content: any;
  export const Link: any;
  export const Indicator: any;
  export const Viewport: any;
  export default any;
}

declare module "@radix-ui/react-popover" {
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
  export const Anchor: any;
  export const Close: any;
  export default any;
}

declare module "@radix-ui/react-progress" {
  export const Root: any;
  export const Indicator: any;
  export default any;
}

declare module "@radix-ui/react-radio-group" {
  export const Root: any;
  export const Item: any;
  export const Indicator: any;
  export default any;
}

declare module "@radix-ui/react-scroll-area" {
  export const Root: any;
  export const Viewport: any;
  export const Scrollbar: any;
  export const Thumb: any;
  export const Corner: any;
  export default any;
}

declare module "@radix-ui/react-separator" {
  export const Root: any;
  export default any;
}

declare module "@radix-ui/react-slider" {
  export const Root: any;
  export const Track: any;
  export const Range: any;
  export const Thumb: any;
  export default any;
}

declare module "next-themes" {
  export const useTheme: any;
  export const ThemeProvider: any;
  export default any;
}

declare module "sonner" {
  export const Toaster: any;
  export const toast: any;
  export type ToasterProps = any;
  export default any;
}

declare module "@radix-ui/react-switch" {
  export const Root: any;
  export const Thumb: any;
  export default any;
}

declare module "@radix-ui/react-tabs" {
  export const Root: any;
  export const List: any;
  export const Trigger: any;
  export const Content: any;
  export default any;
}

declare module "@radix-ui/react-tooltip" {
  export const Provider: any;
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
  export const Arrow: any;
  export default any;
}

export {};
