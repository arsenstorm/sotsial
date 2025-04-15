import { Listbox, ListboxOption } from "@/components/ui/listbox";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Switch } from "@/components/ui/switch";
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
					<label htmlFor={id} className="block text-sm font-medium">
						{label}
						{required && <span className="text-red-500 ml-1">*</span>}
					</label>
					{description && (
						<Text className="text-xs text-zinc-500 dark:text-zinc-400">
							{description}
						</Text>
					)}
					<Listbox
						value={value ?? defaultValue}
						onChange={onChange}
						className="w-full"
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
						<label htmlFor={id} className="text-sm font-medium cursor-pointer">
							{label}
							{required && <span className="text-red-500 ml-1">*</span>}
						</label>
						<Switch id={id} checked={value ?? false} onChange={onChange} />
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
					<label htmlFor={id} className="block text-sm font-medium">
						{label}
						{required && <span className="text-red-500 ml-1">*</span>}
					</label>
					{description && (
						<Text className="text-xs text-zinc-500 dark:text-zinc-400">
							{description}
						</Text>
					)}
					<Input
						id={id}
						type={type}
						value={value ?? ""}
						onChange={(e) => onChange(e.target.value)}
						className="w-full"
					/>
				</div>
			);

		case "textarea":
			return (
				<div className="space-y-2">
					<label htmlFor={id} className="block text-sm font-medium">
						{label}
						{required && <span className="text-red-500 ml-1">*</span>}
					</label>
					<Textarea
						id={id}
						value={value ?? ""}
						onChange={(e) => onChange(e.target.value)}
						className="w-full"
					/>
				</div>
			);

		default:
			return null;
	}
}
