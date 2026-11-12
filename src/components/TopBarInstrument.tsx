import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useIoT } from '../contexts/IoTContext';
import { COLORS, FONTS, RADII, SHADOWS } from '../theme/theme';

export const TopBarInstrument: React.FC = () => {
  const { user, switchRole, logout } = useAuth();
  const { isAnomalyActive, lastTriggeredAlert, dismissAlertBanner } = useIoT();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  if (!user) return null;

  const isAgent = user.role === 'AGENT';

  return (
    <View style={styles.wrapper}>
      {/* Floating Pill Island Navbar (from Prompt.Md Section 2.A) */}
      <View
        style={[
          styles.islandContainer,
          isAgent && styles.islandContainerAgent,
        ]}
      >
        <View style={styles.leftRow}>
          <View
            style={[
              styles.avatarBadge,
              { backgroundColor: isAgent ? COLORS.clay : COLORS.moss },
            ]}
          >
            <Text style={styles.avatarText}>{user.avatarInitials}</Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.statusDotRow}>
              <Animated.View
                style={[
                  styles.liveDot,
                  {
                    opacity: pulseAnim,
                    backgroundColor: isAnomalyActive
                      ? COLORS.clay
                      : COLORS.telemetryGreen,
                  },
                ]}
              />
              <Text
                style={[
                  styles.monoTag,
                  isAgent && { color: 'rgba(242, 240, 233, 0.7)' },
                ]}
              >
                {user.badgeCode} • {isAgent ? 'MODO AGENTE' : 'MODO CIDADÃO'}
              </Text>
            </View>
            <Text
              style={[styles.userName, isAgent && { color: COLORS.cream }]}
              numberOfLines={1}
            >
              {user.name}
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.switchRoleBtn,
              isAgent ? styles.switchRoleBtnAgent : styles.switchRoleBtnCitizen,
            ]}
            onPress={switchRole}
            activeOpacity={0.82}
          >
            <Ionicons
              name="swap-horizontal"
              size={14}
              color={isAgent ? COLORS.charcoal : COLORS.cream}
            />
            <Text
              style={[
                styles.switchRoleText,
                { color: isAgent ? COLORS.charcoal : COLORS.cream },
              ]}
            >
              {isAgent ? 'Ver Cidadão' : 'Ver Agente'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={logout}
            accessibilityLabel="Sair do perfil"
          >
            <Ionicons
              name="log-out-outline"
              size={18}
              color={isAgent ? COLORS.cream : COLORS.charcoal}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Auto-Triggered IoT Toast Banner */}
      {lastTriggeredAlert && (
        <View style={styles.iotBanner}>
          <View style={styles.iotBannerLeft}>
            <Ionicons name="warning" size={18} color={COLORS.cream} />
            <View style={{ flex: 1 }}>
              <Text style={styles.iotBannerTitle}>
                ALERTA AUTÔNOMO IoT DISPARADO ({lastTriggeredAlert.protocol})
              </Text>
              <Text style={styles.iotBannerSub}>
                Sensor detectou escuridão com poste apagado. Chamado aberto automaticamente!
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={dismissAlertBanner}
            style={styles.iotBannerClose}
          >
            <Ionicons name="close" size={18} color={COLORS.cream} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: COLORS.cream,
    zIndex: 20,
  },
  islandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    ...SHADOWS.card,
  },
  islandContainerAgent: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.mossLight,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: COLORS.cream,
    fontFamily: FONTS.mono,
    fontWeight: '700',
    fontSize: 13,
  },
  userInfo: {
    flex: 1,
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  monoTag: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 0.6,
    color: COLORS.charcoalMuted,
    fontWeight: '600',
  },
  userName: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADII.pill,
    gap: 5,
  },
  switchRoleBtnCitizen: {
    backgroundColor: COLORS.moss,
  },
  switchRoleBtnAgent: {
    backgroundColor: COLORS.cream,
  },
  switchRoleText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    fontWeight: '700',
  },
  logoutBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iotBanner: {
    marginTop: 8,
    backgroundColor: COLORS.clay,
    borderRadius: RADII.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.clayGlow,
  },
  iotBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iotBannerTitle: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cream,
    letterSpacing: 0.4,
  },
  iotBannerSub: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    color: COLORS.creamElevated,
    marginTop: 1,
  },
  iotBannerClose: {
    padding: 4,
    marginLeft: 8,
  },
});
