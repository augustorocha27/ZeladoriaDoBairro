import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActiveSectionTab } from '../components/FloatingIslandNavbar';
import { ManifestoAndProtocolSection } from '../components/ManifestoAndProtocolSection';
import { OperationalTriadAndFooter } from '../components/OperationalTriadAndFooter';
import { PrecisionMicroUIDashboard } from '../components/PrecisionMicroUIDashboard';
import { useAuth } from '../contexts/AuthContext';
import { useIoT } from '../contexts/IoTContext';
import { useOccurrences } from '../contexts/OccurrencesContext';
import { COLORS, FONTS, RADII, SHADOWS } from '../theme/theme';

interface LoginScreenProps {
  onSelectTab?: (tab: ActiveSectionTab) => void;
}

/**
 * Implements Prompt.Md Complete Digital Instrument Experience:
 * - B. HERO SECTION ("A Cidade é o Algoritmo." - 100dvh, moody forest, bottom-left third layout, staggered fade-up)
 * - C. FEATURES (PrecisionMicroUIDashboard - Diagnostic Shuffler, Telemetry Typewriter, Mock Cursor Scheduler)
 * - D. PHILOSOPHY (The Manifesto - Charcoal + organic texture comparison)
 * - E. PROTOCOL (Sticky Stacking Archive - Rotating Helix Gear, Laser Matrix Scan, Pulsing EKG)
 * - F. OPERATIONAL TRIAD & FOOTER (Three-tier deck with Moss/Clay middle pop + rounded-t-[4rem] Footer)
 */
export const LoginScreen: React.FC<LoginScreenProps> = ({ onSelectTab }) => {
  const { loginAs } = useAuth();
  const { occurrences } = useOccurrences();
  const { pole, isAnomalyActive, triggerNightFailureSimulation } = useIoT();

  // Staggered fade-up animation (Prompt.Md Section 2.B)
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const translateY1 = useRef(new Animated.Value(24)).current;
  const translateY2 = useRef(new Animated.Value(28)).current;
  const translateY3 = useRef(new Animated.Value(32)).current;

  useEffect(() => {
    Animated.stagger(160, [
      Animated.parallel([
        Animated.timing(fadeAnim1, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(translateY1, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(translateY2, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim3, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(translateY3, {
          toValue: 0,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeAnim1, fadeAnim2, fadeAnim3, translateY1, translateY2, translateY3]);

  const navigateTo = (tab: ActiveSectionTab) => {
    if (onSelectTab) {
      onSelectTab(tab);
    }
  };

  const handleTriggerIoT = async () => {
    await triggerNightFailureSimulation();
  };

  const openCount = occurrences.filter((o) => o.status !== 'RESOLVIDA').length;

  return (
    <View style={styles.root}>
      {/* =================================================================== */}
      {/* B. HERO SECTION (Nature/City is the Algorithm - 100dvh height)      */}
      {/* =================================================================== */}
      <View style={styles.heroOuterPadding}>
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=1800&q=85',
          }}
          style={styles.heroViewportContainer}
          imageStyle={styles.heroBackgroundImage}
        >
          {/* Heavy Moss-to-Black Gradient Overlay */}
          <View style={styles.heroGradientOverlay}>
            {/* Top Telemetry Metadata Row (below Floating Island Navbar) */}
            <View style={styles.heroTopSpacer}>
              <View style={styles.clinicalTelemetryPill}>
                <View
                  style={[
                    styles.telemetryPulseDot,
                    {
                      backgroundColor: isAnomalyActive
                        ? COLORS.clay
                        : COLORS.telemetryGreen,
                    },
                  ]}
                />
                <Text style={styles.clinicalTelemetryText}>
                  TELEMETRY ONLINE • NODE #{pole.poleId}: {pole.ambientLux} LX •{' '}
                  {openCount} CHAMADOS ATIVOS
                </Text>
              </View>
            </View>

            {/* Bottom-Left Third Layout (Prompt.Md Section 2.B) */}
            <View style={styles.heroBottomLeftThird}>
              <Animated.View
                style={{
                  opacity: fadeAnim1,
                  transform: [{ translateY: translateY1 }],
                }}
              >
                <Text style={styles.heroKickerMono}>
                  HIGH-END ORGANIC CIVIC TECH // ZELADORIA & IoT
                </Text>
                <Text style={styles.heroTitleBoldSans}>
                  A Cidade é o
                </Text>
                <Text style={styles.heroTitleMassiveSerif}>
                  Algoritmo.
                </Text>
              </Animated.View>

              <Animated.View
                style={{
                  opacity: fadeAnim2,
                  transform: [{ translateY: translateY2 }],
                }}
              >
                <Text style={styles.heroLeadParagraph}>
                  Um instrumento digital de precisão que conecta moradores,
                  engenharia pública e sensores ópticos de iluminação urbana em
                  uma arquitetura de 3 camadas com persistência local em tempo
                  real.
                </Text>
              </Animated.View>

              {/* Magnetic CTA Buttons Row */}
              <Animated.View
                style={[
                  styles.heroCtaRow,
                  {
                    opacity: fadeAnim3,
                    transform: [{ translateY: translateY3 }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.magneticPrimaryBtnClay}
                  onPress={async () => {
                    await loginAs('CITIZEN');
                    navigateTo('CITIZEN_PORTAL');
                  }}
                  activeOpacity={0.86}
                >
                  <Ionicons name="person" size={16} color={COLORS.cream} />
                  <Text style={styles.magneticPrimaryBtnText}>
                    Entrar como Cidadão
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={COLORS.cream}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.magneticSecondaryBtnMoss}
                  onPress={async () => {
                    await loginAs('AGENT');
                    navigateTo('AGENT_CONSOLE');
                  }}
                  activeOpacity={0.86}
                >
                  <Ionicons name="construct" size={16} color={COLORS.cream} />
                  <Text style={styles.magneticPrimaryBtnText}>
                    Painel do Agente ({openCount})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.magneticGhostBtn}
                  onPress={() => navigateTo('IOT_LAB')}
                  activeOpacity={0.86}
                >
                  <Ionicons
                    name="hardware-chip-outline"
                    size={16}
                    color={COLORS.cream}
                  />
                  <Text style={styles.magneticGhostBtnText}>
                    Simular Poste IoT #{pole.poleId}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* =================================================================== */}
      {/* C. FEATURES (THE PRECISION MICRO-UI DASHBOARD)                      */}
      {/* =================================================================== */}
      <PrecisionMicroUIDashboard onTriggerIoT={handleTriggerIoT} />

      {/* =================================================================== */}
      {/* D. PHILOSOPHY & E. PROTOCOL (STICKY STACKING ARCHIVE)               */}
      {/* =================================================================== */}
      <ManifestoAndProtocolSection
        onSelectTab={navigateTo}
        onTriggerIoTFailure={handleTriggerIoT}
      />

      {/* =================================================================== */}
      {/* F. MEMBERSHIP / OPERATIONAL TRIAD & ROUNDED-T-[4REM] FOOTER         */}
      {/* =================================================================== */}
      <OperationalTriadAndFooter
        onSelectTab={navigateTo}
        onTriggerIoT={handleTriggerIoT}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  heroOuterPadding: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  heroViewportContainer: {
    width: '100%',
    minHeight: Platform.OS === 'web' ? ('94vh' as any) : 640,
    borderRadius: RADII.xxxl,
    overflow: 'hidden',
    ...SHADOWS.floatingIsland,
  },
  heroBackgroundImage: {
    borderRadius: RADII.xxxl,
  },
  heroGradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 30, 24, 0.76)',
    paddingHorizontal: 32,
    paddingTop: 88,
    paddingBottom: 46,
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? ({
          backgroundImage:
            'linear-gradient(180deg, rgba(46,64,54,0.58) 0%, rgba(18,24,20,0.88) 68%, rgba(12,15,13,0.96) 100%)',
        } as any)
      : {}),
  },
  heroTopSpacer: {
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  clinicalTelemetryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.62)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: 'rgba(242, 240, 233, 0.2)',
    gap: 8,
  },
  telemetryPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  clinicalTelemetryText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
    letterSpacing: 0.9,
  },
  heroBottomLeftThird: {
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
    marginTop: 'auto',
    paddingTop: 48,
  },
  heroKickerMono: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.clayLight,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  heroTitleBoldSans: {
    fontFamily: FONTS.sansBold,
    fontSize: Platform.OS === 'web' ? 62 : 42,
    fontWeight: '800',
    color: COLORS.cream,
    letterSpacing: -1.8,
    lineHeight: Platform.OS === 'web' ? 66 : 46,
  },
  heroTitleMassiveSerif: {
    fontFamily: FONTS.serifItalic,
    fontSize: Platform.OS === 'web' ? 86 : 56,
    fontStyle: 'italic',
    fontWeight: '600',
    color: COLORS.cream,
    lineHeight: Platform.OS === 'web' ? 88 : 58,
    marginTop: -6,
    marginBottom: 18,
  },
  heroLeadParagraph: {
    fontFamily: FONTS.sansRegular,
    fontSize: 16,
    color: 'rgba(242, 240, 233, 0.84)',
    maxWidth: 640,
    lineHeight: 25,
    marginBottom: 28,
  },
  heroCtaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  magneticPrimaryBtnClay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.clay,
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: RADII.pill,
    gap: 9,
    ...SHADOWS.clayGlow,
  },
  magneticSecondaryBtnMoss: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.moss,
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: 'rgba(242, 240, 233, 0.25)',
    gap: 9,
  },
  magneticPrimaryBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.cream,
  },
  magneticGhostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(242, 240, 233, 0.12)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: 'rgba(242, 240, 233, 0.24)',
    gap: 8,
  },
  magneticGhostBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.cream,
  },
});
