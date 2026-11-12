import './src/polyfills';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { IoTProvider } from './src/contexts/IoTContext';
import { OccurrencesProvider } from './src/contexts/OccurrencesContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { COLORS, FONTS, RADII } from './src/theme/theme';

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      errorMessage: error?.message || String(error),
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Erro de Inicialização</Text>
          <Text style={styles.errorText}>{this.state.errorMessage}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => this.setState({ hasError: false, errorMessage: '' })}
          >
            <Text style={styles.retryBtnText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <SafeAreaProvider style={styles.root}>
        <AuthProvider>
          <OccurrencesProvider>
            <IoTProvider>
              <View style={styles.root}>
                <StatusBar style="dark" />
                <AppNavigator />
              </View>
            </IoTProvider>
          </OccurrencesProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.cream,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.clay,
    marginBottom: 8,
  },
  errorText: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: COLORS.charcoal,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: COLORS.moss,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: RADII.pill,
  },
  retryBtnText: {
    color: COLORS.cream,
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
});
