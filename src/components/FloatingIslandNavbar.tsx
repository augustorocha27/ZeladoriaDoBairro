import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useIoT } from '../contexts/IoTContext';
import { useOccurrences } from '../contexts/OccurrencesContext';
import { COLORS, FONTS, RADII } from '../theme/theme';

export type ActiveSectionTab =
  | 'CITIZEN_PORTAL'
  | 'NEW_OCCURRENCE'
  | 'AGENT_CONSOLE'
  | 'IOT_LAB'
  | 'INSTRUMENT_HOME';

interface FloatingIslandNavbarProps {
  activeTab: ActiveSectionTab;
  onSelectTab: (tab: ActiveSectionTab) => void;
  isScrolled: boolean;
}

/**
 * Architectural Top Command Bar (Sharp geometry, zero bubble excess)
 * Allows instant switching between Real Citizen Use, Real Agent Dispatch Console,
 * Smart Streetlight IoT Telemetry, and System Architecture Overview.
 */
export const FloatingIslandNavbar: React.FC<FloatingIslandNavbarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const { user, loginAs } = useAuth();
  const { occurrences } = useOccurrences();
  const {
    pole,
    isAnomalyActive,
    lastTriggeredAlert,
    dismissAlertBanner,
    triggerNightFailureSimulation,
    restoreNormalPoleOperation,
  } = useIoT();

  const openCount = occurrences.filter((o) => o.status !== 'RESOLVIDA').length;
  const iotOpenCount = occurrences.filter(
    (o) => o.origin === 'IOT_AUTO' && o.status !== 'RESOLVIDA'
  ).length;

  const handleSelectCitizen = async () => {
    await loginAs('CITIZEN');
    onSelectTab('CITIZEN_PORTAL');
  };

  const handleSelectAgent = async () => {
    await loginAs('AGENT');
    onSelectTab('AGENT_CONSOLE');
  };

  return (
    <View style={styles.headerWrapper}>
      {/* Top Telemetry Micro-Strip (Charcoal #1A1A1A) */}
      <View style={styles.telemetrySubBar}>
        <View style={styles.telemetrySubInner}>
          <View style={styles.telemetryLeftGroup}>
            <View style={styles.statusIndicatorGroup}>
              <View
                style={[
                  styles.squareLed,
                  {
                    backgroundColor: isAnomalyActive
                      ? COLORS.clay
                      : COLORS.telemetryGreen,
                  },
                ]}
              />
              <Text style={styles.telemetryBarMono}>
                SUBPREFEITURA JARDIM BOTÂNICO // REGIONAL 04
              </Text>
            </View>
            <Text style={styles.telemetryDividerText}>|</Text>
            <Text style={styles.telemetryBarMonoMuted}>
              PERSISTÊNCIA: ASYNCSTORAGE LOCAL ({occurrences.length} REGISTROS)
            </Text>
          </View>

          {/* Live Smart Streetlight Quick Control right in the top bar */}
          <View style={styles.telemetryRightGroup}>
            <View style={styles.poleStatusReadout}>
              <Ionicons
                name={isAnomalyActive ? 'warning' : 'bulb-outline'}
                size={12}
                color={
                  isAnomalyActive ? COLORS.clayLight : COLORS.telemetryGreen
                }
              />
              <Text style={styles.poleStatusText}>
                POSTE #{pole.poleId}: {pole.ambientLux} lx •{' '}
                {isAnomalyActive
                  ? 'FALHA (APAGADO NO ESCURO)'
                  : pole.isLightEmitting
                  ? 'ACESO (NOITE)'
                  : 'STANDBY (DIA)'}
              </Text>
            </View>

            {!isAnomalyActive ? (
              <TouchableOpacity
                style={styles.quickFaultTriggerBtn}
                onPress={triggerNightFailureSimulation}
                activeOpacity={0.85}
              >
                <Ionicons name="flash" size={11} color={COLORS.cream} />
                <Text style={styles.quickFaultTriggerText}>
                  SIMULAR QUEDA DE LUZ IoT
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.quickRestoreBtn}
                onPress={restoreNormalPoleOperation}
                activeOpacity={0.85}
              >
                <Ionicons name="refresh" size={11} color={COLORS.charcoal} />
                <Text style={styles.quickRestoreText}>RESTAURAR LÂMPADA</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Main Architectural Navigation Bar */}
      <View style={styles.mainNavBar}>
        <View style={styles.mainNavInner}>
          {/* Brand / System Title */}
          <TouchableOpacity
            style={styles.brandBlock}
            onPress={handleSelectCitizen}
            activeOpacity={0.85}
          >
            <View style={styles.brandEmblem}>
              <Text style={styles.brandEmblemCode}>ZU</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>ZELADORIA URBANA</Text>
              <Text style={styles.brandSubtitle}>
                SISTEMA OPERACIONAL CIDADÃO & ENGENHARIA
              </Text>
            </View>
          </TouchableOpacity>

          {/* Architectural Segmented Workspace Tabs */}
          <View style={styles.tabsGroup}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                (activeTab === 'CITIZEN_PORTAL' ||
                  activeTab === 'NEW_OCCURRENCE') &&
                  styles.tabButtonActiveMoss,
              ]}
              onPress={handleSelectCitizen}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.tabIndexMono,
                  (activeTab === 'CITIZEN_PORTAL' ||
                    activeTab === 'NEW_OCCURRENCE') && {
                    color: COLORS.clayLight,
                  },
                ]}
              >
                01
              </Text>
              <View>
                <Text
                  style={[
                    styles.tabMainLabel,
                    (activeTab === 'CITIZEN_PORTAL' ||
                      activeTab === 'NEW_OCCURRENCE') && {
                      color: COLORS.cream,
                    },
                  ]}
                >
                  VISÃO DO CIDADÃO
                </Text>
                <Text
                  style={[
                    styles.tabSubLabel,
                    (activeTab === 'CITIZEN_PORTAL' ||
                      activeTab === 'NEW_OCCURRENCE') && {
                      color: 'rgba(242, 240, 233, 0.72)',
                    },
                  ]}
                >
                  Abrir & Acompanhar Chamados
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'AGENT_CONSOLE' && styles.tabButtonActiveMoss,
              ]}
              onPress={handleSelectAgent}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.tabIndexMono,
                  activeTab === 'AGENT_CONSOLE' && { color: COLORS.clayLight },
                ]}
              >
                02
              </Text>
              <View>
                <View style={styles.tabTitleWithBadge}>
                  <Text
                    style={[
                      styles.tabMainLabel,
                      activeTab === 'AGENT_CONSOLE' && { color: COLORS.cream },
                    ]}
                  >
                    MESA DO AGENTE
                  </Text>
                  <View
                    style={[
                      styles.queueCountBadge,
                      iotOpenCount > 0 && { backgroundColor: COLORS.clay },
                    ]}
                  >
                    <Text style={styles.queueCountText}>{openCount}</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.tabSubLabel,
                    activeTab === 'AGENT_CONSOLE' && {
                      color: 'rgba(242, 240, 233, 0.72)',
                    },
                  ]}
                >
                  Fila de Ordens & Despacho
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'IOT_LAB' && styles.tabButtonActiveClay,
              ]}
              onPress={() => onSelectTab('IOT_LAB')}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.tabIndexMono,
                  activeTab === 'IOT_LAB' && { color: COLORS.cream },
                ]}
              >
                03
              </Text>
              <View>
                <Text
                  style={[
                    styles.tabMainLabel,
                    activeTab === 'IOT_LAB' && { color: COLORS.cream },
                  ]}
                >
                  POSTE INTELIGENTE IoT
                </Text>
                <Text
                  style={[
                    styles.tabSubLabel,
                    activeTab === 'IOT_LAB' && {
                      color: 'rgba(242, 240, 233, 0.82)',
                    },
                  ]}
                >
                  Simulador Sensor #{pole.poleId}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButtonCompact,
                activeTab === 'INSTRUMENT_HOME' && styles.tabButtonActiveMoss,
              ]}
              onPress={() => onSelectTab('INSTRUMENT_HOME')}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.tabIndexMono,
                  activeTab === 'INSTRUMENT_HOME' && {
                    color: COLORS.clayLight,
                  },
                ]}
              >
                04
              </Text>
              <Text
                style={[
                  styles.tabMainLabel,
                  activeTab === 'INSTRUMENT_HOME' && { color: COLORS.cream },
                ]}
              >
                MANIFESTO & MICRO-UI
              </Text>
            </TouchableOpacity>
          </View>

          {/* Active Credential Readout */}
          <View style={styles.credentialBox}>
            <Text style={styles.credentialLabelMono}>CREDENCIAL ATIVA</Text>
            <Text style={styles.credentialUserText}>
              {user?.role === 'AGENT'
                ? 'Eng. Marcos (AGT-0419)'
                : 'Clara Vasconcelos (CID-8842)'}
            </Text>
          </View>
        </View>
      </View>

      {/* Auto-Triggered IoT Alert Banner (Sharp Architectural Callout) */}
      {lastTriggeredAlert && (
        <View style={styles.iotAlertStrip}>
          <View style={styles.iotAlertStripInner}>
            <View style={styles.iotAlertLeft}>
              <View style={styles.iotAlertTagBox}>
                <Text style={styles.iotAlertTagText}>ALERTA AUTOMÁTICO IoT</Text>
              </View>
              <Text style={styles.iotAlertText}>
                O sensor do <Text style={{ fontWeight: '800' }}>Poste #{pole.poleId}</Text> detectou escuridão ({pole.ambientLux} lx) com luminária apagada (0.4W) e abriu automaticamente a ocorrência{' '}
                <Text style={{ fontFamily: FONTS.mono, fontWeight: '700' }}>
                  #{lastTriggeredAlert.protocol}
                </Text>{' '}
                no AsyncStorage.
              </Text>
            </View>
            <View style={styles.iotAlertActions}>
              <TouchableOpacity
                style={styles.iotAlertInspectBtn}
                onPress={() => {
                  dismissAlertBanner();
                  handleSelectAgent();
                }}
              >
                <Text style={styles.iotAlertInspectText}>
                  ATENDER NA MESA DO AGENTE →
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={dismissAlertBanner}
                style={styles.iotAlertCloseBtn}
              >
                <Ionicons name="close" size={16} color={COLORS.cream} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: COLORS.creamElevated,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.creamBorder,
    zIndex: 100,
  },
  telemetrySubBar: {
    backgroundColor: COLORS.charcoal,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.charcoalBorder,
  },
  telemetrySubInner: {
    width: '100%',
    maxWidth: 1380,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  telemetryLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusIndicatorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  squareLed: {
    width: 7,
    height: 7,
    borderRadius: 1,
  },
  telemetryBarMono: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
    letterSpacing: 0.6,
  },
  telemetryDividerText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.charcoalBorder,
  },
  telemetryBarMonoMuted: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: 'rgba(242, 240, 233, 0.58)',
  },
  telemetryRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  poleStatusReadout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.charcoalElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.charcoalBorder,
    gap: 6,
  },
  poleStatusText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.cream,
  },
  quickFaultTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.clay,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.sm,
    gap: 5,
  },
  quickFaultTriggerText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  quickRestoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.telemetryGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.sm,
    gap: 5,
  },
  quickRestoreText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  mainNavBar: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: COLORS.creamElevated,
  },
  mainNavInner: {
    width: '100%',
    maxWidth: 1380,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandEmblem: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.moss,
    borderRadius: RADII.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.mossDark,
  },
  brandEmblemCode: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cream,
    letterSpacing: 0.8,
  },
  brandTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.charcoal,
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.charcoalMuted,
    letterSpacing: 0.5,
  },
  tabsGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.md,
    paddingVertical: 8,
    paddingHorizontal: 13,
    gap: 10,
  },
  tabButtonCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.md,
    paddingVertical: 11,
    paddingHorizontal: 12,
    gap: 8,
  },
  tabButtonActiveMoss: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.mossDark,
  },
  tabButtonActiveClay: {
    backgroundColor: COLORS.clay,
    borderColor: COLORS.clayDark,
  },
  tabIndexMono: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.clay,
  },
  tabTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabMainLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.charcoal,
    letterSpacing: -0.2,
  },
  tabSubLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.charcoalMuted,
    marginTop: 1,
  },
  queueCountBadge: {
    backgroundColor: COLORS.charcoal,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADII.sm,
  },
  queueCountText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  credentialBox: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.moss,
    paddingLeft: 10,
  },
  credentialLabelMono: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.charcoalMuted,
    letterSpacing: 0.6,
  },
  credentialUserText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  iotAlertStrip: {
    backgroundColor: COLORS.clay,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.clayDark,
  },
  iotAlertStripInner: {
    width: '100%',
    maxWidth: 1380,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  iotAlertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    flex: 1,
  },
  iotAlertTagBox: {
    backgroundColor: COLORS.charcoal,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADII.sm,
  },
  iotAlertTagText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.cream,
  },
  iotAlertText: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    color: COLORS.cream,
    flex: 1,
  },
  iotAlertActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iotAlertInspectBtn: {
    backgroundColor: COLORS.charcoal,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADII.sm,
  },
  iotAlertInspectText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  iotAlertCloseBtn: {
    padding: 4,
  },
});
