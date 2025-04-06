import { Card } from "@/components/ui/card";
import { platformDetails } from "@/config/platform-details";
import { platformFormConfigs } from "@/config/platform-form-fields";
import { PlatformFormField } from "@/components/platform-form-field";
import type { PlatformFormState } from "@/app/(app)/posting/page.client";

interface PlatformSettingsProps {
	platform: string;
	formState: PlatformFormState;
	onChange: (platform: string, field: string, value: any) => void;
}

export function PlatformSettings({
	platform,
	formState,
	onChange,
}: PlatformSettingsProps) {
	const PlatformLogo =
		platformDetails[platform as keyof typeof platformDetails]?.logo;
	const platformName =
		platformDetails[platform as keyof typeof platformDetails]?.name ?? platform;
	const config = platformFormConfigs[platform];

	// Render platform-specific form fields
	const renderPlatformFields = () => {
		if (!config) return null;

		return (
			<div className="space-y-6">
				{config.sections.map((section) => (
					<div key={section.fields.join(",")}>
						{section.title && (
							<h3 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-3">
								{section.title}
							</h3>
						)}
						<div className="space-y-4">
							{section.fields.map((fieldName) => {
								const field = config.fields.find((f) => f.name === fieldName);
								if (!field) return null;

								// Check if field should be shown based on conditions
								if (field.conditional) {
									const [parentField, childField] =
										field.conditional.field.split(".");
									const parentKey = `${parentField}` as keyof PlatformFormState;
									const parentObj = formState[parentKey] as Record<string, any>;
									const parentValue = childField
										? parentObj?.[childField]
										: formState[parentKey];

									if (parentValue !== field.conditional.value) return null;
								}

								// Get the value from the nested state
								const stateKey = field.name.includes(".")
									? field.name.split(".")[0]
									: field.name;

								const fullKey = `${stateKey}` as keyof PlatformFormState;
								let value: any = undefined;

								if (field.name.includes(".")) {
									const [parent, child] = field.name.split(".");
									const parentObj = formState[fullKey] as Record<string, any>;
									value = parentObj?.[child];
								} else {
									value = formState[fullKey];
								}

								return (
									<div
										key={field.name}
										className={
											field.type === "checkbox"
												? "bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3"
												: ""
										}
									>
										<PlatformFormField
											{...field}
											value={value}
											onChange={(newValue: any) => {
												// Handle nested state updates
												if (field.name.includes(".")) {
													const [parent, child] = field.name.split(".");
													onChange(platform, `${parent}.${child}`, newValue);
												} else {
													onChange(platform, field.name, newValue);
												}
											}}
										/>
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>
		);
	};

	if (!config?.sections || config?.sections.length === 0) return null;

	return (
		<Card>
			<div className="p-4">
				<div className="flex items-center gap-2 mb-4">
					{PlatformLogo && <PlatformLogo className="size-5" />}
					<h3 className="text-base font-medium">{platformName} Settings</h3>
				</div>
				{renderPlatformFields()}
			</div>
		</Card>
	);
}
