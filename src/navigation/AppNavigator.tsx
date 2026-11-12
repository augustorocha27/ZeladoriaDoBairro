import React, { useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActiveSectionTab,
  FloatingIslandNavbar,
} from '../components/FloatingIslandNavbar';
import { GlobalStylesAndNoise } from '../components/GlobalStylesAndNoise';
import { AgentDashboardScreen } from '../screens/AgentDashboardScreen';
import { CitizenHomeScreen } from '../screens/CitizenHomeScreen';
import { IoTSimulatorScreen } from '../screens/IoTSimulatorScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { NewOccurrenceScreen } from '../screens/NewOccurrenceScreen';
import { COLORS } from '../theme/theme';

export const AppNavigator: React.FC = () => {
  // Starts directly in the real Citizen Operational Portal; switchable via the Top Command Bar
  const [activeTab, setActiveTab] =
    useState<ActiveSectionTab>('CITIZEN_PORTAL');
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (offsetY > 40 && !isScrolled) {
      setIsScrolled(true);
    } else if (offsetY <= 40 && isScrolled) {
      setIsScrolled(false);
    }
  };

  return (
    <View style={styles.rootContainer}>
      {/* Global CSS Noise Overlay (0.05 SVG Turbulence) & Google Fonts */}
      <GlobalStylesAndNoise />

      {/* Architectural Top Command Header */}
      <FloatingIslandNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isScrolled={isScrolled}
      />

      {/* Main Active Workspace */}
      <View style={styles.workspaceStage}>
        {activeTab === 'CITIZEN_PORTAL' && (
          <CitizenHomeScreen
            onNavigateNewOccurrence={() => setActiveTab('NEW_OCCURRENCE')}
            onNavigateIoTSimulator={() => setActiveTab('IOT_LAB')}
          />
        )}

        {activeTab === 'NEW_OCCURRENCE' && (
          <NewOccurrenceScreen
            onSuccessNavigateBack={() => setActiveTab('CITIZEN_PORTAL')}
          />
        )}

        {activeTab === 'AGENT_CONSOLE' && (
          <AgentDashboardScreen
            onNavigateIoTSimulator={() => setActiveTab('IOT_LAB')}
          />
        )}

        {activeTab === 'IOT_LAB' && <IoTSimulatorScreen />}

        {activeTab === 'INSTRUMENT_HOME' && (
          <ScrollView
            style={{ flex: 1 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            <LoginScreen onSelectTab={setActiveTab} />
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  workspaceStage: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
});
