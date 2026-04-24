import { Input } from "@/components/ui/input";
import { Listbox, ListboxOption } from "@/components/ui/listbox";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";

type FormFieldProps = {
  type: "select" | "checkbox" | "text" | "url" | "toggle" | "textarea";
  label: string;
  name: string;
  value: any;
  onChange: (value: any) => void;
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: any;
  description?: string;
};

export function PlatformFormField({
  type,
  label,
  name,
  value,
  onChange,
  options,
  required,
  defaultValue,
  description,
}: FormFieldProps) {
  const id = `field-${name.replace(/\./g, "-")}`;

  switch (type) {
    case "select":
      return (
        <div className="space-y-2">
          <label className="block font-medium text-sm" htmlFor={id}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
          {description && (
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">
              {description}
            </Text>
          )}
          <Listbox
            className="w-full"
            onChange={onChange}
            value={value ?? defaultValue}
          >
            {options?.map((option) => (
              <ListboxOption key={option.value} value={option.value}>
                {option.label}
              </ListboxOption>
            ))}
          </Listbox>
        </div>
      );

    case "checkbox":
    case "toggle":
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="cursor-pointer font-medium text-sm" htmlFor={id}>
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <Switch checked={value ?? false} id={id} onChange={onChange} />
          </div>
          {description && (
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">
              {description}
            </Text>
          )}
        </div>
      );

    case "text":
    case "url":
      return (
        <div className="space-y-2">
          <label className="block font-medium text-sm" htmlFor={id}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
          {description && (
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">
              {description}
            </Text>
          )}
          <Input
            className="w-full"
            id={id}
            onChange={(e) => onChange(e.target.value)}
            type={type}
            value={value ?? ""}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-2">
          <label className="block font-medium text-sm" htmlFor={id}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
          <Textarea
            className="w-full"
            id={id}
            onChange={(e) => onChange(e.target.value)}
            value={value ?? ""}
          />
        </div>
      );

    default:
      return null;
  }
}
