import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useIoT } from '../contexts/IoTContext';
import { useOccurrences } from '../contexts/OccurrencesContext';
import { COLORS, FONTS, RADII } from '../theme/theme';
import { useResponsive } from '../theme/useResponsive';

export type ActiveSectionTab =
  | 'CITIZEN_PORTAL'
  | 'NEW_OCCURRENCE'
  | 'AGENT_CONSOLE'
  | 'IOT_LAB';

interface FloatingIslandNavbarProps {
  activeTab: ActiveSectionTab;
  onSelectTab: (tab: ActiveSectionTab) => void;
}

export const FloatingIslandNavbar: React.FC<FloatingIslandNavbarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const { user, logout } = useAuth();
  const { occurrences } = useOccurrences();
  const {
    pole,
    isAnomalyActive,
    lastTriggeredAlert,
    dismissAlertBanner,
    triggerNightFailureSimulation,
    restoreNormalPoleOperation,
  } = useIoT();
  const { isMobile, isSmallPhone, pagePadding } = useResponsive();

  if (!user) {
    return null;
  }

  const isCitizen = user.role === 'CITIZEN';
  const isAgent = user.role === 'AGENT';
  const openCount = occurrences.filter((o) => o.status !== 'RESOLVIDA').length;

  const homeTab: ActiveSectionTab = isCitizen
    ? 'CITIZEN_PORTAL'
    : 'AGENT_CONSOLE';

  return (
    <View style={styles.headerWrapper}>
      <View
        style={[
          styles.mainNavBar,
          { paddingHorizontal: pagePadding },
        ]}
      >
        <View
          style={[
            styles.mainNavInner,
            isMobile && styles.mainNavInnerMobile,
          ]}
        >
          {/* Top Row on Mobile / Left Block on Desktop */}
          <View style={[styles.topBarRow, isMobile && styles.topBarRowMobile]}>
            <TouchableOpacity
              style={styles.brandBlock}
              onPress={() => onSelectTab(homeTab)}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.brandEmblem,
                  isAgent && { backgroundColor: COLORS.charcoal },
                ]}
              >
                <Ionicons
                  name={isAgent ? 'construct' : 'business'}
                  size={16}
                  color={COLORS.cream}
                />
              </View>
              <View style={{ flexShrink: 1 }}>
                <View style={styles.brandTitleRow}>
                  <Text
                    style={[
                      styles.brandTitle,
                      isSmallPhone && { fontSize: 13 },
                    ]}
                    numberOfLines={1}
                  >
                    Zeladoria do Bairro
                  </Text>
                  <View
                    style={[
                      styles.rolePill,
                      isAgent ? styles.rolePillAgent : styles.rolePillCitizen,
                    ]}
                  >
                    <Text
                      style={[
                        styles.rolePillText,
                        isAgent && { color: COLORS.cream },
                      ]}
                    >
                      {isAgent ? 'AGENTE' : 'CIDADÃO'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.brandSubtitle} numberOfLines={1}>
                  {user.name} • {user.badgeCode}
                </Text>
              </View>
            </TouchableOpacity>

            {/* On Mobile, render right controls in the top row beside brand */}
            {isMobile && (
              <View style={styles.rightControls}>
                {isAgent &&
                  (!isAnomalyActive ? (
                    <TouchableOpacity
                      style={styles.quickFaultBtn}
                      onPress={triggerNightFailureSimulation}
                    >
                      <Ionicons name="flash" size={12} color={COLORS.cream} />
                      {!isSmallPhone && (
                        <Text style={styles.quickFaultText}>Falha IoT</Text>
                      )}
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.quickRestoreBtn}
                      onPress={restoreNormalPoleOperation}
                    >
                      <Ionicons
                        name="refresh"
                        size={12}
                        color={COLORS.charcoal}
                      />
                      {!isSmallPhone && (
                        <Text style={styles.quickRestoreText}>Restaurar</Text>
                      )}
                    </TouchableOpacity>
                  ))}

                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={logout}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={16}
                    color={COLORS.charcoal}
                  />
                  <Text style={styles.logoutBtnText}>Sair</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Navigation Tabs (Full-width segmented bar on Mobile, Center pills on Desktop) */}
          <View
            style={[
              styles.tabsGroup,
              isMobile && styles.tabsGroupMobile,
            ]}
          >
            {isCitizen && (
              <>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    isMobile && styles.tabButtonMobile,
                    activeTab === 'CITIZEN_PORTAL' &&
                      styles.tabButtonActiveMoss,
                  ]}
                  onPress={() => onSelectTab('CITIZEN_PORTAL')}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="home-outline"
                    size={15}
                    color={
                      activeTab === 'CITIZEN_PORTAL'
                        ? COLORS.cream
                        : COLORS.charcoal
                    }
                  />
                  <Text
                    style={[
                      styles.tabMainLabel,
                      activeTab === 'CITIZEN_PORTAL' && {
                        color: COLORS.cream,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    Meus Chamados
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    isMobile && styles.tabButtonMobile,
                    activeTab === 'NEW_OCCURRENCE' &&
                      styles.tabButtonActiveMoss,
                  ]}
                  onPress={() => onSelectTab('NEW_OCCURRENCE')}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={15}
                    color={
                      activeTab === 'NEW_OCCURRENCE'
                        ? COLORS.cream
                        : COLORS.charcoal
                    }
                  />
                  <Text
                    style={[
                      styles.tabMainLabel,
                      activeTab === 'NEW_OCCURRENCE' && {
                        color: COLORS.cream,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    Nova Ocorrência
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {isAgent && (
              <>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    isMobile && styles.tabButtonMobile,
                    activeTab === 'AGENT_CONSOLE' && styles.tabButtonActiveMoss,
                  ]}
                  onPress={() => onSelectTab('AGENT_CONSOLE')}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="layers-outline"
                    size={15}
                    color={
                      activeTab === 'AGENT_CONSOLE'
                        ? COLORS.cream
                        : COLORS.charcoal
                    }
                  />
                  <Text
                    style={[
                      styles.tabMainLabel,
                      activeTab === 'AGENT_CONSOLE' && { color: COLORS.cream },
                    ]}
                    numberOfLines={1}
                  >
                    Fila ({openCount})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    isMobile && styles.tabButtonMobile,
                    activeTab === 'IOT_LAB' && styles.tabButtonActiveClay,
                  ]}
                  onPress={() => onSelectTab('IOT_LAB')}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.iotDot,
                      {
                        backgroundColor: isAnomalyActive
                          ? COLORS.clayLight
                          : COLORS.telemetryGreen,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.tabMainLabel,
                      activeTab === 'IOT_LAB' && { color: COLORS.cream },
                    ]}
                    numberOfLines={1}
                  >
                    Poste IoT #{pole.poleId}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Desktop Right Controls */}
          {!isMobile && (
            <View style={styles.rightControls}>
              {isAgent &&
                (!isAnomalyActive ? (
                  <TouchableOpacity
                    style={styles.quickFaultBtn}
                    onPress={triggerNightFailureSimulation}
                  >
                    <Ionicons name="flash" size={12} color={COLORS.cream} />
                    <Text style={styles.quickFaultText}>
                      Simular Poste Apagado
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.quickRestoreBtn}
                    onPress={restoreNormalPoleOperation}
                  >
                    <Ionicons
                      name="refresh"
                      size={12}
                      color={COLORS.charcoal}
                    />
                    <Text style={styles.quickRestoreText}>Restaurar Poste</Text>
                  </TouchableOpacity>
                ))}

              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={logout}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="log-out-outline"
                  size={16}
                  color={COLORS.charcoal}
                />
                <Text style={styles.logoutBtnText}>Sair</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Auto-Triggered IoT Alert Banner (ONLY shown to AGENT) */}
      {isAgent && lastTriggeredAlert && (
        <View
          style={[
            styles.iotAlertStrip,
            { paddingHorizontal: pagePadding },
          ]}
        >
          <View style={styles.iotAlertStripInner}>
            <View style={styles.iotAlertLeft}>
              <Ionicons name="warning" size={18} color={COLORS.cream} />
              <Text style={styles.iotAlertText}>
                <Text style={{ fontWeight: '800' }}>
                  Alerta Automático do Poste #{pole.poleId}:
                </Text>{' '}
                Escuridão ({pole.ambientLux} lx) + lâmpada apagada. Chamado #
                {lastTriggeredAlert.protocol} gerado.
              </Text>
            </View>
            <View style={styles.iotAlertActions}>
              {activeTab !== 'AGENT_CONSOLE' && (
                <TouchableOpacity
                  style={styles.iotAlertInspectBtn}
                  onPress={() => {
                    dismissAlertBanner();
                    onSelectTab('AGENT_CONSOLE');
                  }}
                >
                  <Text style={styles.iotAlertInspectText}>
                    Atender na Fila →
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={dismissAlertBanner}
                style={styles.iotAlertCloseBtn}
              >
                <Ionicons name="close" size={18} color={COLORS.cream} />
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
  mainNavBar: {
    paddingVertical: 10,
    backgroundColor: COLORS.creamElevated,
  },
  mainNavInner: {
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  mainNavInnerMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 10,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarRowMobile: {
    justifyContent: 'space-between',
    width: '100%',
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  brandEmblem: {
    width: 34,
    height: 34,
    backgroundColor: COLORS.moss,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  brandTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.charcoal,
  },
  rolePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADII.sm,
  },
  rolePillCitizen: {
    backgroundColor: COLORS.mossMuted,
  },
  rolePillAgent: {
    backgroundColor: COLORS.charcoal,
  },
  rolePillText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.moss,
  },
  brandSubtitle: {
    fontFamily: FONTS.sansRegular,
    fontSize: 11,
    color: COLORS.charcoalMuted,
    marginTop: 1,
  },
  tabsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabsGroupMobile: {
    width: '100%',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  tabButtonMobile: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 8,
  },
  tabButtonActiveMoss: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.mossDark,
  },
  tabButtonActiveClay: {
    backgroundColor: COLORS.clay,
    borderColor: COLORS.clayDark,
  },
  tabMainLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  iotDot: {
    width: 7,
    height: 7,
    borderRadius: 2,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickFaultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.clay,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADII.sm,
    gap: 5,
  },
  quickFaultText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cream,
  },
  quickRestoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.telemetryGreen,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADII.sm,
    gap: 5,
  },
  quickRestoreText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADII.sm,
    gap: 4,
  },
  logoutBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  iotAlertStrip: {
    backgroundColor: COLORS.clay,
    paddingVertical: 10,
  },
  iotAlertStripInner: {
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  iotAlertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 240,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADII.sm,
  },
  iotAlertInspectText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cream,
  },
  iotAlertCloseBtn: {
    padding: 4,
  },
});
