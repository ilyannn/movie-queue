import { useCallback, useMemo } from "react";
import {
  HStack,
  Box,
  createListCollection,
  SelectValueText,
} from "@chakra-ui/react";
import { Tag, Field } from "@/components/ui";
import {
  SelectRoot,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LuPlus } from "react-icons/lu";
import { useLocale } from "@/lib/services/i18n";
import { languageList } from "@/lib/services/tmdb/languages";
import { TMDBLanguageCode } from "@/lib/services/tmdb";

interface LanguageTagsProps {
  languages: TMDBLanguageCode[];
  onChange: (languages: TMDBLanguageCode[]) => void;
}

export default function LanguageTags({
  languages,
  onChange,
}: LanguageTagsProps) {
  const { locale, t, tLang } = useLocale();

  const collection = useMemo(
    () =>
      createListCollection({
        items: languageList
          .map((lang) => ({
            value: lang,
            label: tLang(lang),
          }))
          .sort((a, b) => a.label.localeCompare(b.label, locale)),
      }),
    [locale]
  );

  const updateTags = useCallback(
    (newTags: TMDBLanguageCode[]) => {
      onChange(newTags);
    },
    [onChange]
  );

  //   const onDragEnd = (result: DropResult) => {
  //     if (!result.destination) return;
  //     const newTags = Array.from(tags);
  //     const [moved] = newTags.splice(result.source.index, 1);
  //     newTags.splice(result.destination.index, 0, moved);
  //     updateTags(newTags);
  //   };

  const onSelectionChange = (items: Array<{ value: TMDBLanguageCode }>) => {
    const selectedTags = new Set(items.map((item) => item.value));
    const currentTags = new Set(languages);
    const newTags = Array.from(selectedTags.difference(currentTags));
    updateTags([
      ...languages.filter((tag) => selectedTags.has(tag)),
      ...newTags,
    ]);
  };

  const removeTag = (lang: string) => {
    updateTags(languages.filter((tag) => tag !== lang));
  };

  return (
    <Field label={t("profile.movieLanguages")}>
      <HStack wrap="wrap">
        {languages.map((tag) => (
          <Tag key={tag} closable onClose={() => removeTag(tag)}>
            {tLang(tag)}
          </Tag>
        ))}

        <Box display={"inline"}>
          <SelectRoot
            size={"xs"}
            w={40}
            multiple
            value={languages}
            onValueChange={(val) => onSelectionChange(val.items)}
            collection={collection}
          >
            <SelectTrigger>
              <SelectValueText>
                {languages.length === 0
                  ? t("LanguageTags.add")
                  : t("LanguageTags.change")}
              </SelectValueText>
            </SelectTrigger>

            <SelectContent>
              {collection.items.map((lang) => (
                <SelectItem key={lang.value} item={lang}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Box>
      </HStack>
    </Field>
  );
}
