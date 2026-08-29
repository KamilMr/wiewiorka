import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, StyleSheet, Switch, View} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Text} from '@/components';
import {normalize} from '@/common';
import {warmColors, warmRadius, warmShadow} from '@/constants/warmTheme';
import CustomDatePicker from './DatePicker';

export interface FilterState {
  categories: string[];
  dateFrom: Date | null;
  dateTo: Date | null;
  holidayTag: boolean;
}

type CategoryItem = {label: string; value: string; color?: string};

interface FilterDrawerProps {
  visible: boolean;
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onClearAll: () => void;
  onClose: () => void;
  categoryItems: CategoryItem[];
}

const FilterDrawer = ({
  visible,
  filters,
  onFiltersChange,
  onClearAll,
  onClose,
  categoryItems,
}: FilterDrawerProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const snapPoints = useMemo(() => ['88%'], []);

  const closeCategoryList = useCallback(() => {
    setCategoriesExpanded(false);
    setSearchQuery('');
  }, []);

  useEffect(() => {
    if (visible) bottomSheetRef.current?.snapToIndex(0);
    else {
      bottomSheetRef.current?.close();
      closeCategoryList();
    }
  }, [visible, closeCategoryList]);

  const filteredCategories = categoryItems.filter(item =>
    normalize(item.label.toLowerCase()).includes(
      normalize(searchQuery.toLowerCase()),
    ),
  );
  const selectedCategories = filters.categories.map(
    value =>
      categoryItems.find(item => item.value === value) || {
        label: value,
        value,
      },
  );

  const toggleCategory = (value: string) => {
    onFiltersChange({
      categories: filters.categories.includes(value)
        ? filters.categories.filter(category => category !== value)
        : [...filters.categories, value],
    });
  };

  const handleSheetChange = (index: number) => {
    if (index === -1) {
      closeCategoryList();
      if (visible) onClose();
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      onChange={handleSheetChange}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          opacity={0.45}
        />
      )}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Filtry</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Wyczyść filtry"
          onPress={onClearAll}
          hitSlop={8}
          style={({pressed}) => [styles.clearButton, pressed && styles.pressed]}
        >
          <Text style={styles.clearButtonText}>Wyczyść filtry</Text>
        </Pressable>
      </View>

      <BottomSheetScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zakres dat</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateControl}>
              <CustomDatePicker
                label="Od"
                value={filters.dateFrom}
                onChange={date => onFiltersChange({dateFrom: date || null})}
                style={styles.datePicker}
              />
            </View>
            <View style={styles.dateControl}>
              <CustomDatePicker
                label="Do"
                value={filters.dateTo}
                onChange={date => onFiltersChange({dateTo: date || null})}
                style={styles.datePicker}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategorie</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Wybierz kategorie"
            accessibilityState={{expanded: categoriesExpanded}}
            onPress={() => setCategoriesExpanded(expanded => !expanded)}
            style={({pressed}) => [
              styles.categoryTrigger,
              categoriesExpanded && styles.categoryTriggerActive,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.categoryTriggerLeft}>
              <FontAwesome6
                name="list-check"
                size={16}
                color={warmColors.primary}
                iconStyle="solid"
              />
              <Text style={styles.categoryTriggerText}>
                {filters.categories.length
                  ? `Wybrano ${filters.categories.length}`
                  : 'Wybierz kategorie'}
              </Text>
            </View>
            <FontAwesome6
              name={categoriesExpanded ? 'chevron-up' : 'chevron-down'}
              size={13}
              color={warmColors.mutedForeground}
              iconStyle="solid"
            />
          </Pressable>

          {selectedCategories.length > 0 && (
            <View style={styles.chips}>
              {selectedCategories.map(item => (
                <View key={item.value} style={styles.chip}>
                  {!!item.color && (
                    <View
                      style={[styles.colorDot, {backgroundColor: item.color}]}
                    />
                  )}
                  <Text style={styles.chipText}>{item.label}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Usuń kategorię ${item.label}`}
                    onPress={() => toggleCategory(item.value)}
                    hitSlop={8}
                    style={styles.removeChip}
                  >
                    <FontAwesome6
                      name="xmark"
                      size={11}
                      color={warmColors.mutedForeground}
                      iconStyle="solid"
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {categoriesExpanded && (
            <View style={styles.categoryList}>
              <View style={styles.searchRow}>
                <FontAwesome6
                  name="magnifying-glass"
                  size={14}
                  color={warmColors.mutedForeground}
                  iconStyle="solid"
                />
                <BottomSheetTextInput
                  accessibilityLabel="Szukaj kategorii"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Szukaj kategorii"
                  placeholderTextColor={warmColors.mutedForeground}
                  style={styles.searchInput}
                />
              </View>
              {filteredCategories.length ? (
                filteredCategories.map(item => {
                  const selected = filters.categories.includes(item.value);
                  return (
                    <Pressable
                      key={item.value}
                      accessibilityRole="checkbox"
                      accessibilityLabel={item.label}
                      accessibilityState={{checked: selected}}
                      onPress={() => toggleCategory(item.value)}
                      style={({pressed}) => [
                        styles.categoryRow,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View style={styles.categoryName}>
                        <View
                          style={[
                            styles.colorDot,
                            {
                              backgroundColor:
                                item.color || warmColors.secondary,
                            },
                          ]}
                        />
                        <Text style={styles.categoryNameText}>
                          {item.label}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.checkbox,
                          selected && styles.checkboxSelected,
                        ]}
                      >
                        {selected && (
                          <FontAwesome6
                            name="check"
                            size={11}
                            color={warmColors.primaryForeground}
                            iconStyle="solid"
                          />
                        )}
                      </View>
                    </Pressable>
                  );
                })
              ) : (
                <Text style={styles.noResults}>Brak wyników</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Pressable
            accessibilityRole="switch"
            accessibilityLabel="Urlop"
            accessibilityState={{checked: filters.holidayTag}}
            onPress={() => onFiltersChange({holidayTag: !filters.holidayTag})}
            style={({pressed}) => [
              styles.holidayRow,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.holidayLabel}>
              <View style={styles.holidayIcon}>
                <FontAwesome6
                  name="umbrella-beach"
                  size={16}
                  color={warmColors.primary}
                  iconStyle="solid"
                />
              </View>
              <Text style={styles.categoryNameText}>Urlop</Text>
            </View>
            <Switch
              value={filters.holidayTag}
              onValueChange={holidayTag => onFiltersChange({holidayTag})}
              trackColor={{false: warmColors.border, true: warmColors.primary}}
              thumbColor={warmColors.primaryForeground}
              accessibilityLabel="Urlop"
              pointerEvents="none"
            />
          </Pressable>
        </View>
      </BottomSheetScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 12}]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zamknij filtry"
          onPress={onClose}
          style={({pressed}) => [styles.closeButton, pressed && styles.pressed]}
        >
          <Text style={styles.closeButtonText}>Zamknij</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
};

export default FilterDrawer;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: warmColors.background,
    borderRadius: warmRadius.xxl,
    ...warmShadow.md,
  },
  handleIndicator: {
    backgroundColor: warmColors.border,
    width: 42,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: warmColors.cardBorder,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: warmColors.foreground,
  },
  clearButton: {paddingVertical: 8, minHeight: 40, justifyContent: 'center'},
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: warmColors.destructive,
  },
  body: {flex: 1},
  scrollContent: {paddingHorizontal: 24, paddingVertical: 20},
  section: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: warmColors.cardBorder,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: warmColors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  dateRow: {flexDirection: 'row', gap: 12},
  dateControl: {flex: 1},
  datePicker: {backgroundColor: 'transparent', width: '100%'},
  categoryTrigger: {
    minHeight: 52,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: warmColors.cardBorder,
    borderRadius: warmRadius.lg,
    backgroundColor: warmColors.cardSolid,
  },
  categoryTriggerActive: {borderColor: warmColors.ring},
  categoryTriggerLeft: {flexDirection: 'row', alignItems: 'center', gap: 10},
  categoryTriggerText: {fontSize: 15, color: warmColors.foreground},
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12},
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 32,
    paddingLeft: 10,
    paddingRight: 6,
    borderRadius: warmRadius.pill,
    backgroundColor: warmColors.accent,
  },
  chipText: {fontSize: 13, color: warmColors.accentForeground},
  removeChip: {padding: 6, marginLeft: 2},
  colorDot: {
    width: 9,
    height: 9,
    borderRadius: warmRadius.pill,
    marginRight: 8,
  },
  categoryList: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: warmColors.cardBorder,
    borderRadius: warmRadius.lg,
    overflow: 'hidden',
    backgroundColor: warmColors.cardSolid,
  },
  searchRow: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: warmColors.cardBorder,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: warmColors.foreground,
  },
  categoryRow: {
    minHeight: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: warmColors.cardBorder,
  },
  categoryName: {flexDirection: 'row', alignItems: 'center', flex: 1},
  categoryNameText: {fontSize: 15, color: warmColors.foreground},
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: warmRadius.sm,
    borderWidth: 1,
    borderColor: warmColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: warmColors.primary,
    borderColor: warmColors.primary,
  },
  noResults: {
    padding: 16,
    textAlign: 'center',
    color: warmColors.mutedForeground,
    fontSize: 14,
  },
  holidayRow: {
    minHeight: 52,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: warmRadius.lg,
    backgroundColor: warmColors.cardSolid,
    borderWidth: 1,
    borderColor: warmColors.cardBorder,
  },
  holidayLabel: {flexDirection: 'row', alignItems: 'center', gap: 10},
  holidayIcon: {
    width: 30,
    height: 30,
    borderRadius: warmRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: warmColors.accent,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: warmColors.cardBorder,
    backgroundColor: warmColors.background,
  },
  closeButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: warmRadius.lg,
    backgroundColor: warmColors.primary,
    ...warmShadow.sm,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: warmColors.primaryForeground,
  },
  pressed: {opacity: 0.82},
});
