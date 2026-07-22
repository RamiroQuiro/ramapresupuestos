import { cn } from "@/utils/cn";
import * as React from "react";
import { Text } from "./Text";

type InputVariant = "default" | "error" | "success" | "ghost";
type InputType = "text" | "number" | "email" | "password" | "tel" | "url" | "date" | "time" | "file";

const variantStyles: Record<InputVariant, string> = {
  default:
    "border-gray-300 focus:border-primary-100 focus:ring-primary-100/30",
  error:
    "border-red-400 focus:border-red-500 focus:ring-red-500/30 bg-red-50/30",
  success:
    "border-green-400 focus:border-green-500 focus:ring-green-500/30 bg-green-50/30",
  ghost:
    "border-transparent bg-transparent focus:border-gray-300 focus:ring-gray-300/30",
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  inputVariant?: InputVariant;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, inputVariant = "default", className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <Text as="label" htmlFor={inputId} size="sm" weight="semibold">
            {label}
          </Text>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
            variantStyles[inputVariant],
            error && variantStyles.error,
            className,
          )}
          {...props}
        />
        {error && (
          <Text as="span" variant="error" size="xs">
            {error}
          </Text>
        )}
        {hint && !error && (
          <Text as="span" variant="caption" size="xs">
            {hint}
          </Text>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

// ─── TEXTAREA ───────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  inputVariant?: InputVariant;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, inputVariant = "default", className, id, ...props }, ref) => {
    const textareaId = id || props.name;
    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <Text as="label" htmlFor={textareaId} size="sm" weight="semibold">
            {label}
          </Text>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
            "resize-y min-h-[80px]",
            variantStyles[inputVariant],
            error && variantStyles.error,
            className,
          )}
          {...props}
        />
        {error && (
          <Text as="span" variant="error" size="xs">
            {error}
          </Text>
        )}
        {hint && !error && (
          <Text as="span" variant="caption" size="xs">
            {hint}
          </Text>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

// ─── SELECT ─────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  inputVariant?: InputVariant;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, inputVariant = "default", options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <Text as="label" htmlFor={selectId} size="sm" weight="semibold">
            {label}
          </Text>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
            variantStyles[inputVariant],
            error && variantStyles.error,
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <Text as="span" variant="error" size="xs">
            {error}
          </Text>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";

export default Input;
