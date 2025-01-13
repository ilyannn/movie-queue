import {
  SelectRoot,
  SelectContent,
  SelectItem,
  SelectProps,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { createListCollection } from "@ark-ui/react";
import { type Locale, localeOptions } from "@/locales";
import { useLocale } from "@/lib/services/i18n";

interface LocaleSelectProps
  extends Omit<SelectProps, "value" | "onChange" | "collection"> {
  value: Locale;
  onChange: (newValue: Locale) => void;
}

const LocaleSelect = ({ value, onChange, ...props }: LocaleSelectProps) => {
  const { t, locale } = useLocale();

  const locales = createListCollection({
    items: localeOptions
      .map((lang) => {
        return {
          value: lang.locale,
          label:
            lang.locale == locale
              ? lang.native
              : `${t(lang.i18n_key)} – ${lang.native}`,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label, locale)),
  });

  return (
    <SelectRoot
      collection={locales}
      value={[value]}
      onValueChange={(change) => {
        onChange(change.items[0].value);
      }}
      {...props}
    >
      <SelectTrigger>
        <SelectValueText placeholder="Select locale" />
      </SelectTrigger>
      <SelectContent>
        {locales.items.map((lang) => (
          <SelectItem item={lang} key={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default LocaleSelect;
