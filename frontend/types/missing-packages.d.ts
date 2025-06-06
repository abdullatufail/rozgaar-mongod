// Type stubs for packages that may not be installed or have type issues

// React Router (if used somewhere but not installed)
declare module "react-router-dom" {
  export const Navigate: any;
  export const useLocation: any;
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export const Link: any;
  export const useNavigate: any;
  export const useParams: any;
  export const Outlet: any;
}

// Zod validation library
declare module "zod" {
  export const z: any;
  export type ZodSchema = any;
  export type ZodError = any;
  export default any;
}

// Form handling
declare module "react-hook-form" {
  export const useForm: any;
  export const Controller: any;
  export const FormProvider: any;
  export const useFormContext: any;
  export const useController: any;
  export const useWatch: any;
  export const useFieldArray: any;
  export type FieldValues = any;
  export type SubmitHandler = any;
  export type UseFormReturn = any;
}

// Day picker for calendars
declare module "react-day-picker" {
  export const DayPicker: any;
  export type DayPickerProps = any;
  export default any;
}

// Command palette
declare module "cmdk" {
  export const Command: any;
  export default any;
}

// Theme handling
declare module "next-themes" {
  export const useTheme: any;
  export const ThemeProvider: any;
  export type ThemeProviderProps = any;
}

// Toast notifications
declare module "sonner" {
  export const Toaster: any;
  export const toast: any;
  export type ToasterProps = any;
  export default any;
}

// All Radix UI components
declare module "@radix-ui/*" {
  const component: any;
  export = component;
}

declare module "@radix-ui/react-*" {
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
  export const Item: any;
  export const Indicator: any;
  export const Thumb: any;
  export const Track: any;
  export const Range: any;
  export const Viewport: any;
  export const Scrollbar: any;
  export const Corner: any;
  export const Image: any;
  export const Fallback: any;
  export const List: any;
  export const Link: any;
  export const Arrow: any;
  export const Anchor: any;
  export const Close: any;
  export const Provider: any;
  export default any;
}

// Specific Radix modules
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

declare module "@radix-ui/react-checkbox" {
  export const Root: any;
  export const Indicator: any;
  export default any;
}

declare module "@radix-ui/react-label" {
  export const Root: any;
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
