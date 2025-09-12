import {Stack} from 'expo-router';
import DevModeToggle from '@/components/DevModeToggle';
import StatusIndicator from '@/components/StatusIndicator';
import {sizes} from '@/constants/theme';

export default function IncomeSummaryLayout() {
  return (
    <Stack
      screenOptions={{
        title: 'Wpływy',
        headerRightContainerStyle: {paddingRight: sizes.xxl},
        headerRight: () => (
          <DevModeToggle>
            <StatusIndicator />
          </DevModeToggle>
        ),
      }}
    />
  );
}
