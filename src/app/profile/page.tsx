"use client";

import { useAuth } from "@services/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { getUser, createOrUpdateUser } from "@/lib/services/backend";
import type { UserCreateData, UserSchema } from "@/lib/services/backend";
import { Box, Code, Input, VStack } from "@chakra-ui/react";
import { Button, Field } from "@/components/ui";
import LocaleSelect from "./LocaleSelect";
import { GrContactInfo } from "react-icons/gr";
import { useLocale } from "@services/i18n";

import {
  TMDBLanguageCode,
  TMDBCountryCode,
  TMDBCountryCodeNotSelected,
  convertToTMDBLanguageCodes,
} from "@services/tmdb";
import { ExpandingInfo } from "@/components/ExpandingInfo";
import LanguageTags from "./LanguageTags";
import { Locale } from "@/locales";

export default function ProfilePage() {
  const { t, locale, setLocale } = useLocale();
  const { authUser, authUserUUID } = useAuth();
  const [user, setUser] = useState<UserSchema | null>(null);
  const [name, setName] = useState("");
  const [languages, setLanguages] = useState<TMDBLanguageCode[]>([]);
  const [region, setRegion] = useState<TMDBCountryCode>(
    TMDBCountryCodeNotSelected
  );
  const [isLoading, setIsLoading] = useState(false);

  const clearData = useCallback(() => {
    setUser(null);
    setName("");
    setLanguages([]);
    setRegion(TMDBCountryCodeNotSelected);
  }, []);

  const onChangeLocale = useCallback(
    (newLocale: Locale) => {
      setLocale(newLocale);
      const newLanguage = newLocale.split("-")[0] as TMDBLanguageCode;
      if (!languages.includes(newLanguage)) {
        setLanguages([newLanguage, ...languages]);
      }
    },
    [languages]
  );

  useEffect(() => {
    if (!authUserUUID) {
      clearData();
      return;
    }
    getUser(authUserUUID).then((userData) => {
      if (userData) {
        setUser(userData);
        setName(userData.user_name);
        setLocale(userData.user_locale);
        setLanguages(convertToTMDBLanguageCodes(userData.languages));
        setRegion(userData.region);
      } else {
        clearData();
      }
    });
  }, [authUserUUID]);

  const handleSubmit = async () => {
    if (!authUserUUID) return;
    setIsLoading(true);
    try {
      const userData = {
        user_name: name,
        user_locale: locale,
        languages: languages.join(" "),
        region,
      } as UserCreateData;
      const updatedUser = await createOrUpdateUser(authUserUUID, userData);
      setUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <VStack gap={4}>
        <Field label={t("profile.displayName")} required>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        <Field label={t("profile.locale")} required>
          <LocaleSelect value={locale} onChange={onChangeLocale} />
        </Field>

        <LanguageTags languages={languages} onChange={setLanguages} />

        <ExpandingInfo
          icon={<GrContactInfo />}
          title={t("profile.technicalInfo")}
        >
          <Code>
            <pre>{JSON.stringify(authUser, null, 2)}</pre>
          </Code>
        </ExpandingInfo>

        <Button
          colorScheme="blue"
          loading={isLoading}
          disabled={!name}
          onClick={handleSubmit}
          w="full"
          colorPalette="blue"
        >
          {user ? t("profile.updateCTA") : t("profile.createCTA")}
        </Button>
      </VStack>
    </Box>
  );
}
