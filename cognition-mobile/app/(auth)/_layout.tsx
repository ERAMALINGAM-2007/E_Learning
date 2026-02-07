// Auth layout
import { Stack } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';

export default function AuthLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_bottom',
            }}
        >
            <Stack.Screen name="login" />
            <Stack.Screen name="reset-password" />
        </Stack>
    );
}
