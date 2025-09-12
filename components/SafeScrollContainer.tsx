import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';

import {useHeaderHeight} from '@react-navigation/elements';
import {useNavigationState} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {sizes} from '@/constants/theme';

const SafeScrollContainer = ({children, style, fullHeight = true}) => {
  const headerHeight = useHeaderHeight();
  const {type} = useNavigationState(state => state);
  const safeInsets = useSafeAreaInsets();

  console.log(headerHeight);
  if (type === 'stack') {
    return (
      <ScrollView>
        <View
          style={[
            styles.stackContainerRoot({safeInsets, headerHeight, fullHeight}),
            style,
          ]}
        >
          {children}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.tabContainerRoot({safeInsets, fullHeight})}>
      <ScrollView>{children}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  stackContainerRoot: ({safeInsets, headerHeight, fullHeight}) => ({
    flex: 1,
    minWidth: '100%',
    // not minHeight: '100%' to keep 100% height on iPhone also when keyboard is opened
    minHeight: fullHeight
      ? Dimensions.get('window').height - headerHeight
      : null,
    paddingTop: safeInsets.top + sizes.lg,
    paddingBottom: safeInsets.bottom + sizes.lg,
  }),
  tabContainerRoot: ({safeInsets, fullHeight}) => ({
    flex: 1,
    width: '100%',
    minHeight: fullHeight ? '100%' : null,
    paddingTop: safeInsets.top + sizes.sm,
  }),
});

export default SafeScrollContainer;
