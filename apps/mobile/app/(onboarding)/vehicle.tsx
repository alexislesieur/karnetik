import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Svg, {
  Circle,
  Path,
} from 'react-native-svg';

import {
  completeVehicle,
  getVehicleBrands,
  getVehicleModels,
  type VehicleBrand,
  type VehicleModel,
} from '@/api/client';

import { Colors } from '@/constants/colors';

type SelectType = 'brand' | 'model' | null;

export default function OnboardingVehicleScreen() {
  const insets = useSafeAreaInsets();

  const [brands, setBrands] =
    useState<VehicleBrand[]>([]);

  const [models, setModels] =
    useState<VehicleModel[]>([]);

  const [selectedBrand, setSelectedBrand] =
    useState<VehicleBrand | null>(null);

  const [selectedModel, setSelectedModel] =
    useState<VehicleModel | null>(null);

  const [immatriculation, setImmatriculation] =
    useState('');

  const [kilometrage, setKilometrage] =
    useState('');

  const [dateCirc, setDateCirc] =
    useState('');

  const [openSelect, setOpenSelect] =
    useState<SelectType>(null);

  const [showHelp, setShowHelp] =
    useState(false);

  const [isLoadingBrands, setIsLoadingBrands] =
    useState(true);

  const [isLoadingModels, setIsLoadingModels] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [brandError, setBrandError] =
    useState(false);

  const [modelError, setModelError] =
    useState(false);

  const [plateError, setPlateError] =
    useState(false);

  const [kmError, setKmError] =
    useState(false);

  const [dateError, setDateError] =
    useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    try {
      setIsLoadingBrands(true);

      const response =
        await getVehicleBrands();

      setBrands(response);
    } catch {
      setBrands([]);
    } finally {
      setIsLoadingBrands(false);
    }
  }

  async function handleBrandSelect(
    brand: VehicleBrand,
  ) {
    setSelectedBrand(brand);
    setSelectedModel(null);
    setModels([]);

    setBrandError(false);
    setModelError(false);
    setOpenSelect(null);

    try {
      setIsLoadingModels(true);

      const response =
        await getVehicleModels(brand.id);

      setModels(response);
    } catch {
      setModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  }

  function handleModelSelect(
    model: VehicleModel,
  ) {
    setSelectedModel(model);
    setModelError(false);
    setOpenSelect(null);
  }

  function formatPlate(value: string): string {
    const cleaned = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 7);

    if (cleaned.length <= 2) {
      return cleaned;
    }

    if (cleaned.length <= 5) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    }

    return `${cleaned.slice(0, 2)}-${cleaned.slice(
      2,
      5,
    )}-${cleaned.slice(5, 7)}`;
  }

  function handlePlateChange(
    value: string,
  ) {
    const formatted =
      formatPlate(value);

    setImmatriculation(formatted);

    if (plateError) {
      setPlateError(false);
    }
  }

  function formatDate(value: string): string {
    const cleaned = value
      .replace(/[^0-9]/g, '')
      .slice(0, 6);

    if (cleaned.length <= 2) {
      return cleaned;
    }

    return `${cleaned.slice(
      0,
      2,
    )}/${cleaned.slice(2, 6)}`;
  }

  function handleDateChange(
    value: string,
  ) {
    setDateCirc(formatDate(value));

    if (dateError) {
      setDateError(false);
    }
  }

  function validateDate(
    value: string,
  ): string | null {
    const match =
      /^(\d{2})\/(\d{4})$/.exec(value);

    if (!match) {
      return null;
    }

    const month = Number(match[1]);
    const year = Number(match[2]);

    if (month < 1 || month > 12) {
      return null;
    }

    const date = new Date(
      year,
      month - 1,
      1,
    );

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1
    ) {
      return null;
    }

    const now = new Date();

    const currentMonth =
      now.getFullYear() * 12 +
      now.getMonth();

    const selectedMonth =
      year * 12 + month - 1;

    if (selectedMonth > currentMonth) {
      return null;
    }

    return `${year}-${match[1]}-01`;
  }

  async function handleSubmit() {
    Keyboard.dismiss();

    let valid = true;

    if (!selectedBrand) {
      setBrandError(true);
      valid = false;
    }

    if (!selectedModel) {
      setModelError(true);
      valid = false;
    }

    const normalizedPlate =
      immatriculation
        .trim()
        .toUpperCase();

    if (
      !/^[A-Z]{2}-\d{3}-[A-Z]{2}$/.test(
        normalizedPlate,
      )
    ) {
      setPlateError(true);
      valid = false;
    }

    const km = Number(
      kilometrage.replace(
        /[^0-9]/g,
        '',
      ),
    );

    if (
      kilometrage.trim().length === 0 ||
      !Number.isInteger(km) ||
      km < 0
    ) {
      setKmError(true);
      valid = false;
    }

    const formattedDate =
      validateDate(dateCirc);

    if (!formattedDate) {
      setDateError(true);
      valid = false;
    }

    if (
      !valid ||
      !selectedBrand ||
      !selectedModel ||
      !formattedDate
    ) {
      return;
    }

    try {
      setIsSubmitting(true);

      await completeVehicle({
        vehicle_brand_id:
          selectedBrand.id,

        vehicle_model_id:
          selectedModel.id,

        immatriculation:
          normalizedPlate,

        kilometrage_actuel:
          km,

        mise_en_circulation:
          formattedDate,
      });

      router.replace('/(app)/home');
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message
            .toLowerCase()
            .includes('immatriculation')
        ) {
          setPlateError(true);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectTitle =
    openSelect === 'brand'
      ? 'Choisissez une marque'
      : 'Choisissez un modèle';

  const selectItems =
    openSelect === 'brand'
      ? brands
      : models;

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.hero}>
        <View style={styles.stepIndicator}>
          <View
            style={[
              styles.stepDot,
              styles.stepDotActive,
            ]}
          />

          <View
            style={[
              styles.stepDot,
              styles.stepDotActive,
            ]}
          />

          <Text style={styles.stepLabel}>
            Étape 2 sur 2
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.sheet}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.carIcon}>
          <Svg
            width={30}
            height={30}
            viewBox="0 0 24 24"
            fill="none"
          >
            <Path
              d="M4 12h16M4 12a2 2 0 0 1 2-2h1l1.5-4h7L17 10h1a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 1 1-4 0H10a2 2 0 1 1-4 0H5a1 1 0 0 1-1-1z"
              stroke={Colors.accent}
              strokeWidth={1.6}
            />

            <Circle
              cx="7.5"
              cy="16"
              r="0.6"
              fill={Colors.accent}
            />

            <Circle
              cx="16.5"
              cy="16"
              r="0.6"
              fill={Colors.accent}
            />
          </Svg>
        </View>

        <Text style={styles.formTitle}>
          Ajoutez votre véhicule
        </Text>

        <Text style={styles.formSub}>
          Dernière étape avant de retrouver
          votre carnet.
        </Text>

        <View style={styles.fieldRow}>
          <View style={styles.field}>
            <Text style={styles.label}>
              Marque
            </Text>

            <Pressable
              style={[
                styles.selectWrap,
                brandError &&
                  styles.inputWrapInvalid,
              ]}
              onPress={() =>
                setOpenSelect('brand')
              }
              disabled={isSubmitting}
            >
              <Text
                style={[
                  styles.selectText,
                  !selectedBrand &&
                    styles.placeholder,
                ]}
                numberOfLines={1}
              >
                {selectedBrand?.nom ??
                  'Peugeot'}
              </Text>

              <Text style={styles.chevron}>
                ‹
              </Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Modèle
            </Text>

            <Pressable
              style={[
                styles.selectWrap,
                modelError &&
                  styles.inputWrapInvalid,
                !selectedBrand &&
                  styles.selectDisabled,
              ]}
              onPress={() =>
                selectedBrand &&
                setOpenSelect('model')
              }
              disabled={
                !selectedBrand ||
                isSubmitting
              }
            >
              <Text
                style={[
                  styles.selectText,
                  !selectedModel &&
                    styles.placeholder,
                ]}
                numberOfLines={1}
              >
                {selectedModel?.nom ??
                  '308'}
              </Text>

              <Text style={styles.chevron}>
                ‹
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={styles.helpLink}
          onPress={() =>
            setShowHelp((value) => !value)
          }
        >
          <Text style={styles.helpLinkText}>
            Je ne trouve pas mon véhicule
          </Text>
        </Pressable>

        {showHelp && (
          <View style={styles.helpPanel}>
            <Text style={styles.helpText}>
              Pas de souci — vous pouvez
              remplir ces informations de façon
              approximative et les corriger plus
              tard depuis la fiche du véhicule.
              Besoin d'aide ?{' '}

              <Text style={styles.supportText}>
                Contactez le support
              </Text>
              .
            </Text>
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>
            Immatriculation
          </Text>

          <View
            style={[
              styles.inputWrap,
              styles.plateInput,
              plateError &&
                styles.inputWrapInvalid,
            ]}
          >
            <TextInput
              style={[
                styles.textInput,
                styles.plateTextInput,
              ]}
              value={immatriculation}
              onChangeText={
                handlePlateChange
              }
              placeholder="AA-123-AA"
              placeholderTextColor="#A9AFAD"
              autoCapitalize="characters"
              autoCorrect={false}
              spellCheck={false}
              keyboardType="ascii-capable"
              maxLength={9}
              editable={!isSubmitting}
            />
          </View>

          {plateError && (
            <View style={styles.errorContainer}>
              <Svg
                width={11}
                height={11}
                viewBox="0 0 24 24"
                fill="none"
              >
                <Circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke={Colors.erreur}
                  strokeWidth={2.5}
                />

                <Path
                  d="M12 8v5M12 16h.01"
                  stroke={Colors.erreur}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </Svg>

              <Text style={styles.errorText}>
                Format attendu : AA-123-AA
              </Text>
            </View>
          )}
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.field}>
            <Text style={styles.label}>
              Kilométrage
            </Text>

            <View
              style={[
                styles.inputWrap,
                kmError &&
                  styles.inputWrapInvalid,
              ]}
            >
              <TextInput
                style={[
                  styles.textInput,
                  styles.monoInput,
                ]}
                value={kilometrage}
                onChangeText={(value) => {
                  setKilometrage(
                    value.replace(
                      /[^0-9]/g,
                      '',
                    ),
                  );

                  if (kmError) {
                    setKmError(false);
                  }
                }}
                placeholder="45000"
                placeholderTextColor="#A9AFAD"
                keyboardType="number-pad"
                inputMode="numeric"
                editable={!isSubmitting}
              />

              <Text style={styles.suffix}>
                km
              </Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Mise en circulation
            </Text>

            <View
              style={[
                styles.inputWrap,
                dateError &&
                  styles.inputWrapInvalid,
              ]}
            >
              <TextInput
                style={[
                  styles.textInput,
                  styles.monoInput,
                ]}
                value={dateCirc}
                onChangeText={
                  handleDateChange
                }
                placeholder="03/2021"
                placeholderTextColor="#A9AFAD"
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={7}
                editable={!isSubmitting}
              />
            </View>
          </View>
        </View>

        {(kmError || dateError) && (
          <View style={styles.generalErrors}>
            {kmError && (
              <Text style={styles.errorText}>
                Merci de renseigner un
                kilométrage valide.
              </Text>
            )}

            {dateError && (
              <Text style={styles.errorText}>
                Merci de renseigner une date
                de mise en circulation valide.
              </Text>
            )}
          </View>
        )}

        <Pressable
          style={[
            styles.primaryButton,
            isSubmitting &&
              styles.primaryButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator
              color={Colors.surface}
            />
          ) : (
            <Text
              style={styles.primaryButtonText}
            >
              Terminer
            </Text>
          )}
        </Pressable>
      </ScrollView>

      <Modal
        visible={openSelect !== null}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setOpenSelect(null)
        }
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modal,
              {
                paddingBottom:
                  Math.max(
                    insets.bottom,
                    20,
                  ),
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectTitle}
              </Text>

              <Pressable
                onPress={() =>
                  setOpenSelect(null)
                }
              >
                <Text style={styles.closeText}>
                  Fermer
                </Text>
              </Pressable>
            </View>

            {(
              openSelect === 'brand'
                ? isLoadingBrands
                : isLoadingModels
            ) ? (
              <View
                style={
                  styles.loadingContainer
                }
              >
                <ActivityIndicator
                  color={Colors.accent}
                />
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={
                  false
                }
              >
                {selectItems.map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.option}
                    onPress={() => {
                      if (
                        openSelect ===
                        'brand'
                      ) {
                        handleBrandSelect(
                          item as VehicleBrand,
                        );
                      } else {
                        handleModelSelect(
                          item as VehicleModel,
                        );
                      }
                    }}
                  >
                    <Text
                      style={
                        styles.optionText
                      }
                    >
                      {item.nom}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surface,
  },

  hero: {
    height: 56,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stepDot: {
    width: 22,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.bordure,
    marginRight: 6,
  },

  stepDotActive: {
    backgroundColor: Colors.accent,
  },

  stepLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: Colors.attenue,
    marginLeft: 2,
  },

  scroll: {
    flex: 1,
  },

  sheet: {
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 30,
  },

  carIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.accentClair,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  formTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 22,
    color: Colors.texte,
    marginBottom: 6,
  },

  formSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14.5,
    lineHeight: 22,
    color: Colors.attenue,
    marginBottom: 16,
  },

  fieldRow: {
    flexDirection: 'row',
    gap: 10,
  },

  field: {
    flex: 1,
    minWidth: 0,
    marginBottom: 10,
  },

  label: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13.5,
    color: Colors.texte,
    marginBottom: 6,
  },

  selectWrap: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.fond,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 12,
    paddingLeft: 13,
    paddingRight: 10,
  },

  selectDisabled: {
    opacity: 0.5,
  },

  selectText: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: Colors.texte,
  },

  placeholder: {
    color: '#A9AFAD',
  },

  chevron: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 26,
    lineHeight: 22,
    color: Colors.attenue,
    transform: [
      {
        rotate: '270deg',
      },
    ],
  },

  inputWrap: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.fond,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 12,
  },

  inputWrapInvalid: {
    borderColor: Colors.erreur,
  },

  textInput: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: Colors.texte,
  },

  plateInput: {
    paddingRight: 0,
  },

  plateTextInput: {
    fontFamily: 'Roboto_Mono_500Medium',
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  monoInput: {
    fontFamily: 'Roboto_Mono_500Medium',
  },

  suffix: {
    paddingRight: 13,
    fontFamily: 'Roboto_Mono_500Medium',
    fontSize: 14,
    color: Colors.attenue,
  },

  helpLink: {
    alignSelf: 'flex-start',
    marginTop: -2,
    marginBottom: 10,
    paddingVertical: 4,
  },

  helpLinkText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13.5,
    color: Colors.accent,
  },

  helpPanel: {
    backgroundColor: Colors.fond,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: -4,
    marginBottom: 12,
  },

  helpText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: Colors.attenue,
  },

  supportText: {
    color: Colors.accent,
    fontFamily: 'Roboto_500Medium',
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },

  errorText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: Colors.erreur,
  },

  generalErrors: {
    marginTop: -2,
    marginBottom: 6,
    gap: 4,
  },

  primaryButton: {
    width: '100%',
    minHeight: 44,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },

  primaryButtonDisabled: {
    opacity: 0.7,
  },

  primaryButtonText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: Colors.surface,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor:
      'rgba(17, 21, 22, 0.35)',
  },

  modal: {
    maxHeight: '75%',
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bordure,
  },

  modalTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    color: Colors.texte,
  },

  closeText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: Colors.accent,
  },

  option: {
    minHeight: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.bordure,
  },

  optionText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: Colors.texte,
  },

  loadingContainer: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
