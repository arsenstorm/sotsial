import type { PlatformFormState } from "@/app/(app)/posting/page.client";
import { PlatformFormField } from "@/components/platform-form-field";
import { Card } from "@/components/ui/card";
import { platformDetails } from "@/config/platform-details";
import { platformFormConfigs } from "@/config/platform-form-fields";

interface PlatformSettingsProps {
  formState: PlatformFormState;
  onChange: (platform: string, field: string, value: any) => void;
  platform: string;
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
    if (!config) {
      return null;
    }

    return (
      <div className="space-y-6">
        {config.sections.map((section) => (
          <div key={section.fields.join(",")}>
            {section.title && (
              <h3 className="mb-3 font-medium text-sm text-zinc-500 uppercase tracking-wide dark:text-zinc-400">
                {section.title}
              </h3>
            )}
            <div className="space-y-4">
              {section.fields.map((fieldName) => {
                const field = config.fields.find((f) => f.name === fieldName);
                if (!field) {
                  return null;
                }

                // Check if field should be shown based on conditions
                if (field.conditional) {
                  const [parentField, childField] =
                    field.conditional.field.split(".");
                  const parentKey = `${parentField}` as keyof PlatformFormState;
                  const parentObj = formState[parentKey] as Record<string, any>;
                  const parentValue = childField
                    ? parentObj?.[childField]
                    : formState[parentKey];

                  if (parentValue !== field.conditional.value) {
                    return null;
                  }
                }

                // Get the value from the nested state
                const stateKey = field.name.includes(".")
                  ? field.name.split(".")[0]
                  : field.name;

                const fullKey = `${stateKey}` as keyof PlatformFormState;
                let value: any;

                if (field.name.includes(".")) {
                  const [parent, child] = field.name.split(".");
                  const parentObj = formState[fullKey] as Record<string, any>;
                  value = parentObj?.[child];
                } else {
                  value = formState[fullKey];
                }

                return (
                  <div
                    className={
                      field.type === "checkbox"
                        ? "rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/50"
                        : ""
                    }
                    key={field.name}
                  >
                    <PlatformFormField
                      {...field}
                      onChange={(newValue: any) => {
                        // Handle nested state updates
                        if (field.name.includes(".")) {
                          const [parent, child] = field.name.split(".");
                          onChange(platform, `${parent}.${child}`, newValue);
                        } else {
                          onChange(platform, field.name, newValue);
                        }
                      }}
                      value={value}
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

  if (!config?.sections || config?.sections.length === 0) {
    return null;
  }

  return (
    <Card>
      <div className="p-4">
        <div className="mb-4 flex items-center gap-2">
          {PlatformLogo && <PlatformLogo className="size-5" />}
          <h3 className="font-medium text-base">{platformName} Settings</h3>
        </div>
        {renderPlatformFields()}
      </div>
    </Card>
  );
}
