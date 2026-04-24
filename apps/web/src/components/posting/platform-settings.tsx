import { Checkbox } from "@sotsial/ui/components/checkbox";
import { Field, FieldLabel } from "@sotsial/ui/components/field";
import { Input } from "@sotsial/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@sotsial/ui/components/select";
import { Textarea } from "@sotsial/ui/components/textarea";
import { useMemo } from "react";
import {
  getPath,
  type PathState,
  setPath,
} from "@/components/posting/path-state";
import {
  type FormField,
  type PlatformConfig,
  platformFormConfigs,
} from "@/config/platform-form-fields";

export function PlatformSettings({
  platforms,
  state,
  onChange,
}: {
  /** Unique platforms currently selected. */
  platforms: string[];
  state: Record<string, PathState>;
  onChange: (next: Record<string, PathState>) => void;
}) {
  const configured = useMemo(
    () => platforms.filter((p) => Boolean(platformFormConfigs[p])),
    [platforms]
  );

  if (configured.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {configured.map((platform) => {
        const config = platformFormConfigs[platform];
        if (!config) {
          return null;
        }
        return (
          <PlatformCard
            config={config}
            key={platform}
            onChange={(next) => onChange({ ...state, [platform]: next })}
            platform={platform}
            state={state[platform] ?? {}}
          />
        );
      })}
    </div>
  );
}

function PlatformCard({
  platform,
  config,
  state,
  onChange,
}: {
  platform: string;
  config: PlatformConfig;
  state: PathState;
  onChange: (next: PathState) => void;
}) {
  const fieldByName = useMemo(
    () => new Map(config.fields.map((field) => [field.name, field])),
    [config.fields]
  );

  const readField = (name: string): unknown => {
    const value = getPath(state, name);
    if (value !== undefined) {
      return value;
    }
    return fieldByName.get(name)?.defaultValue;
  };

  const writeField = (name: string, value: unknown) => {
    onChange(setPath(state, name, value));
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <header className="flex items-center justify-between">
        <h3 className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
          {platform}
        </h3>
      </header>
      <div className="mt-4 space-y-5">
        {config.sections.map((section, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: stable config ordering
          <div className="space-y-3" key={idx}>
            {section.title ? (
              <p className="font-medium text-sm">{section.title}</p>
            ) : null}
            {section.fields.map((name) => {
              const field = fieldByName.get(name);
              if (!field) {
                return null;
              }
              if (!shouldShowField(field, readField)) {
                return null;
              }
              return (
                <FieldRenderer
                  field={field}
                  key={field.name}
                  onChange={(value) => writeField(field.name, value)}
                  value={readField(field.name)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function shouldShowField(
  field: FormField,
  read: (name: string) => unknown
): boolean {
  if (!field.conditional) {
    return true;
  }
  return read(field.conditional.field) === field.conditional.value;
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const id = `field-${field.name.replace(/\./g, "-")}`;

  if (field.type === "select") {
    const items = Object.fromEntries(
      (field.options ?? []).map((option) => [option.value, option.label])
    );
    return (
      <Field>
        <FieldLabel htmlFor={id}>{field.label}</FieldLabel>
        <Select
          items={items}
          onValueChange={(next) => onChange(next ?? "")}
          value={(value as string) ?? ""}
        >
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label
        className="flex cursor-pointer items-center gap-2 text-sm"
        htmlFor={id}
      >
        <Checkbox
          checked={Boolean(value)}
          id={id}
          onCheckedChange={(next) => onChange(next === true)}
        />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <Field>
        <FieldLabel htmlFor={id}>{field.label}</FieldLabel>
        <Textarea
          id={id}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          value={(value as string) ?? ""}
        />
      </Field>
    );
  }

  // text and url
  return (
    <Field>
      <FieldLabel htmlFor={id}>{field.label}</FieldLabel>
      <Input
        id={id}
        onChange={(e) => onChange(e.target.value)}
        type={field.type === "url" ? "url" : "text"}
        value={(value as string) ?? ""}
      />
    </Field>
  );
}
