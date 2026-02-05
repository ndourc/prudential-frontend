import * as React from "react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

type AnyProps = Record<string, any>;

export function Form<T extends Record<string, any> = Record<string, any>>(
  props: AnyProps
) {
  // This component is intentionally permissive so callers can pass the
  // `UseFormReturn` object as props (e.g. <Form {...form}>). We don't
  // forward those props to DOM nodes to avoid warnings.
  const { children } = props;
  return <>{children}</>;
}

export function FormField(props: AnyProps) {
  const { control, name, render } = props;
  return <Controller control={control} name={name} render={render} />;
}

export function FormItem({ className, children, ...rest }: AnyProps) {
  return (
    <div className={cn("space-y-1", className)} {...rest}>
      {children}
    </div>
  );
}

export function FormControl({ className, children, ...rest }: AnyProps) {
  return (
    <div className={cn("flex w-full", className)} {...rest}>
      {children}
    </div>
  );
}

export function FormLabel({ className, children, ...rest }: AnyProps) {
  return (
    <label className={cn("block text-sm font-medium", className)} {...rest}>
      {children}
    </label>
  );
}

export function FormMessage({ className, children, ...rest }: AnyProps) {
  return (
    <p className={cn("text-sm text-destructive mt-1", className)} {...rest}>
      {children}
    </p>
  );
}

export default Form;
