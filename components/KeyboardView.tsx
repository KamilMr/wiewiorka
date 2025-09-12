import {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';

const ANIMATION_DELAY = 500;

// TODO: Fix bug with different animation speed on views and on inputs
const KeyboardView = ({children, style, offset = 100, ...props}) => {
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ios: 'padding', android: 'height'})}
      keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : offset}
      style={[{flex: 1}, style]}
      enabled
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const KeyboardViewForDialog = ({children, enabled, style, ...props}) => {
  const [isMounted, setIsMounted] = useState(enabled);

  useEffect(() => {
    if (enabled && enabled !== isMounted) {
      setIsMounted(true);
    } else if (!enabled && enabled !== isMounted) {
      setTimeout(() => setIsMounted(false), ANIMATION_DELAY);
    }
  }, [enabled, isMounted]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[{flex: 1, display: isMounted ? 'flex' : 'none'}, style]}
      enabled={Platform.OS === 'ios' && isMounted}
      {...props}
    >
      <ScrollView
        style={{display: isMounted ? 'flex' : 'none'}}
        contentContainerStyle={{flex: 1}}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export {KeyboardViewForDialog};

export default KeyboardView;
