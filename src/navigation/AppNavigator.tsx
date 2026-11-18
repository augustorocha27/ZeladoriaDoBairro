import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ActiveSectionTab,
  FloatingIslandNavbar,
} from '../components/FloatingIslandNavbar';
import { GlobalStylesAndNoise } from '../components/GlobalStylesAndNoise';
import { useAuth } from '../contexts/AuthContext';
import { AgentDashboardScreen } from '../screens/AgentDashboardScreen';
import { CitizenHomeScreen } from '../screens/CitizenHomeScreen';
import { IoTSimulatorScreen } from '../screens/IoTSimulatorScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { NewOccurrenceScreen } from '../screens/NewOccurrenceScreen';
import { COLORS } from '../theme/theme';

/**
 * Production Role-Isolated Navigation:
 * - Unauthenticated (!user): renders ONLY LoginScreen.
 * - Authenticated as CITIZEN: accesses ONLY CITIZEN_PORTAL and NEW_OCCURRENCE (IoT page is restricted to AGENT).
 * - Authenticated as AGENT: accesses AGENT_CONSOLE and IOT_LAB.
 * - Clicking "Sair" in the navbar clears `user`, returning immediately to LoginScreen.
 */
export const AppNavigator: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] =
    useState<ActiveSectionTab>('CITIZEN_PORTAL');

  useEffect(() => {
    if (!user) return;
    if (user.role === 'CITIZEN') {
      setActiveTab('CITIZEN_PORTAL');
    } else if (user.role === 'AGENT') {
      setActiveTab('AGENT_CONSOLE');
    }
  }, [user?.role]);

  // Enforce strict role guards:
  // - CITIZEN can only visit CITIZEN_PORTAL or NEW_OCCURRENCE
  // - AGENT can only visit AGENT_CONSOLE or IOT_LAB
  const handleSafeSelectTab = (nextTab: ActiveSectionTab) => {
    if (!user) return;
    if (user.role === 'CITIZEN') {
      if (nextTab === 'CITIZEN_PORTAL' || nextTab === 'NEW_OCCURRENCE') {
        setActiveTab(nextTab);
      } else {
        setActiveTab('CITIZEN_PORTAL');
      }
      return;
    }

    if (user.role === 'AGENT') {
      if (nextTab === 'AGENT_CONSOLE' || nextTab === 'IOT_LAB') {
        setActiveTab(nextTab);
      } else {
        setActiveTab('AGENT_CONSOLE');
      }
    }
  };

  if (!user) {
    return (
      <View style={styles.rootContainer}>
        <GlobalStylesAndNoise />
        <LoginScreen />
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <GlobalStylesAndNoise />

      <FloatingIslandNavbar
        activeTab={activeTab}
        onSelectTab={handleSafeSelectTab}
      />

      <View style={styles.workspaceStage}>
        {user.role === 'CITIZEN' && (
          <>
            {activeTab === 'NEW_OCCURRENCE' ? (
              <NewOccurrenceScreen
                onSuccessNavigateBack={() => setActiveTab('CITIZEN_PORTAL')}
              />
            ) : (
              <CitizenHomeScreen
                onNavigateNewOccurrence={() => setActiveTab('NEW_OCCURRENCE')}
              />
            )}
          </>
        )}

        {user.role === 'AGENT' && (
          <>
            {activeTab === 'IOT_LAB' ? (
              <IoTSimulatorScreen />
            ) : (
              <AgentDashboardScreen
                onNavigateIoTSimulator={() => setActiveTab('IOT_LAB')}
              />
            )}
          </>
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
