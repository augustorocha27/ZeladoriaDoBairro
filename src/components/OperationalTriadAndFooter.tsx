import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useIoT } from '../contexts/IoTContext';
import { useOccurrences } from '../contexts/OccurrencesContext';
import { COLORS, FONTS, RADII, SHADOWS } from '../theme/theme';
import { ActiveSectionTab } from './FloatingIslandNavbar';

interface OperationalTriadAndFooterProps {
  onSelectTab: (tab: ActiveSectionTab) => void;
  onTriggerIoT: () => void;
}

/**
 * Implements Prompt.Md Section 2.F:
 * - Three-tier grid where the middle card ("Performance IoT") pops with a Moss background and Clay button.
 * - Deep Charcoal Footer with rounded-t-[4rem], utility links, and "System Operational" pulsing green dot.
 */
export const OperationalTriadAndFooter: React.FC<
  OperationalTriadAndFooterProps
> = ({ onSelectTab, onTriggerIoT }) => {
  const { loginAs } = useAuth();
  const { occurrences, resetOccurrencesData } = useOccurrences();
  const { pole, isAnomalyActive, activeIoTOccurrence } = useIoT();

  const openCount = occurrences.filter((o) => o.status !== 'RESOLVIDA').length;

  return (
    <View>
      {/* =================================================================== */}
      {/* F.1 THREE-TIER OPERATIONAL GRID (Middle Card Pops in Moss + Clay)   */}
      {/* =================================================================== */}
      <View style={styles.triadWrapper}>
        <View style={styles.triadHeader}>
          <Text style={styles.kickerMono}>
            04 // OPERATIONAL ACCESS TIERS
          </Text>
          <View style={styles.titleRow}>
            <Text style={styles.titleSans}>Selecione o </Text>
            <Text style={styles.titleSerif}>Terminal de Operação.</Text>
          </View>
          <Text style={styles.subtitle}>
            Três módulos integrados via Context API e AsyncStorage local:
            Morador, Telemetria IoT Autônoma e Engenharia de Campo.
          </Text>
        </View>

        <View style={styles.triadGrid}>
          {/* TIER 1: CITIZEN */}
          <View style={styles.tierCardStandard}>
            <View style={styles.tierTopRow}>
              <Text style={styles.tierTagMono}>TIER 01 // MORADOR</Text>
              <View style={styles.tierIconCircle}>
                <Ionicons name="person-outline" size={18} color={COLORS.moss} />
              </View>
            </View>

            <Text style={styles.tierTitle}>Canal do Cidadão</Text>
            <Text style={styles.tierPriceLike}>
              Clara Vasconcelos{' '}
              <Text style={styles.tierSubBadge}>• CID-8842</Text>
            </Text>
            <Text style={styles.tierDesc}>
              Abertura rápida de chamados urbanos com evidência fotográfica e
              rastreamento transparente do ciclo de resolução.
            </Text>

            <View style={styles.featureList}>
              {[
                'Relato com Foto (Câmera / Galeria)',
                '5 Categorias de Zeladoria Urbana',
                'Coordenadas GPS & Ponto de Referência',
                'Linha do Tempo Auditável em 4 Etapas',
              ].map((feat) => (
                <View key={feat} style={styles.featureRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={COLORS.moss}
                  />
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tierActionsCol}>
              <TouchableOpacity
                style={styles.tierBtnMoss}
                onPress={async () => {
                  await loginAs('CITIZEN');
                  onSelectTab('CITIZEN_PORTAL');
                }}
              >
                <Text style={styles.tierBtnTextCream}>
                  Entrar como Cidadão
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={COLORS.cream}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tierBtnOutline}
                onPress={async () => {
                  await loginAs('CITIZEN');
                  onSelectTab('NEW_OCCURRENCE');
                }}
              >
                <Text style={styles.tierBtnOutlineText}>
                  + Abrir Nova Ocorrência Direto
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* TIER 2: PERFORMANCE IoT (MIDDLE POP CARD - MOSS BG + CLAY BTN) */}
          <View style={styles.tierCardPerformancePop}>
            <View style={styles.tierTopRow}>
              <View style={styles.featuredPill}>
                <View style={styles.pulsingWhiteDot} />
                <Text style={styles.featuredPillText}>
                  PERFORMANCE IoT // AUTÔNOMO
                </Text>
              </View>
              <View style={styles.tierIconCirclePop}>
                <Ionicons name="hardware-chip" size={18} color={COLORS.cream} />
              </View>
            </View>

            <Text style={[styles.tierTitle, { color: COLORS.cream }]}>
              Poste Inteligente
            </Text>
            <Text style={[styles.tierPriceLike, { color: COLORS.clayLight }]}>
              Nó #{pole.poleId}{' '}
              <Text style={{ color: 'rgba(242,240,233,0.7)', fontSize: 13 }}>
                • {pole.ambientLux} lx ({pole.powerDrawWatts}W)
              </Text>
            </Text>
            <Text
              style={[
                styles.tierDesc,
                { color: 'rgba(242, 240, 233, 0.82)' },
              ]}
            >
              Simulador de hardware IoT embarcado. Detecta escuridão (&lt; 25
              lx) combinada com falha na luminária LED e gera chamado automático.
            </Text>

            <View style={styles.featureList}>
              {[
                `Sensor Fotocélula Ativo (${pole.ambientLux} lx)`,
                `Estado LED: ${
                  pole.isLampHardwareOk ? 'Operante (OK)' : 'QUEIMADO (FALHA)'
                }`,
                activeIoTOccurrence
                  ? `Chamado Ativo: #${activeIoTOccurrence.protocol}`
                  : 'Geração Automática no AsyncStorage',
                'Console Serial 115200 Baud em Tempo Real',
              ].map((feat) => (
                <View key={feat} style={styles.featureRow}>
                  <Ionicons
                    name="flash"
                    size={16}
                    color={
                      isAnomalyActive
                        ? COLORS.clayLight
                        : COLORS.telemetryGreen
                    }
                  />
                  <Text style={[styles.featureText, { color: COLORS.cream }]}>
                    {feat}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.tierActionsCol}>
              <TouchableOpacity
                style={styles.tierBtnClayPop}
                onPress={() => onSelectTab('IOT_LAB')}
                activeOpacity={0.86}
              >
                <Text style={styles.tierBtnTextCream}>
                  Abrir Laboratório do Poste IoT
                </Text>
                <Ionicons
                  name="options-outline"
                  size={16}
                  color={COLORS.cream}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tierBtnGhostLight}
                onPress={onTriggerIoT}
              >
                <Ionicons
                  name="thunderstorm-outline"
                  size={14}
                  color={COLORS.cream}
                />
                <Text style={styles.tierBtnGhostLightText}>
                  Simular Escuridão + Lâmpada Apagada (1-Clique)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* TIER 3: AGENT */}
          <View style={styles.tierCardStandard}>
            <View style={styles.tierTopRow}>
              <Text style={styles.tierTagMono}>TIER 03 // ENGENHARIA</Text>
              <View style={styles.tierIconCircle}>
                <Ionicons
                  name="construct-outline"
                  size={18}
                  color={COLORS.moss}
                />
              </View>
            </View>

            <Text style={styles.tierTitle}>Painel do Agente</Text>
            <Text style={styles.tierPriceLike}>
              Eng. Marcos Silveira{' '}
              <Text style={styles.tierSubBadge}>• AGT-0419</Text>
            </Text>
            <Text style={styles.tierDesc}>
              Central de despacho para priorizar alertas IoT e ocorrências de
              moradores, atualizando status e pareceres técnicos.
            </Text>

            <View style={styles.featureList}>
              {[
                `${openCount} Chamados Aguardando Resolução`,
                'Destaque Prioritário para Falhas IoT',
                'Transição: Aberta → Análise → Andamento → Resolvida',
                'Registro de Parecer Técnico Auditável',
              ].map((feat) => (
                <View key={feat} style={styles.featureRow}>
                  <Ionicons
                    name="shield-checkmark"
                    size={16}
                    color={COLORS.moss}
                  />
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tierActionsCol}>
              <TouchableOpacity
                style={styles.tierBtnMoss}
                onPress={async () => {
                  await loginAs('AGENT');
                  onSelectTab('AGENT_CONSOLE');
                }}
              >
                <Text style={styles.tierBtnTextCream}>
                  Entrar na Fila do Agente
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={COLORS.cream}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tierBtnOutline}
                onPress={resetOccurrencesData}
              >
                <Text style={styles.tierBtnOutlineText}>
                  Restaurar Dados de Demonstração
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* =================================================================== */}
      {/* F.2 FOOTER (Deep Charcoal, rounded-t-[4rem], System Operational)    */}
      {/* =================================================================== */}
      <View style={styles.footerContainer}>
        <View style={styles.footerInner}>
          <View style={styles.footerTopRow}>
            <View style={styles.footerBrandCol}>
              <Text style={styles.footerLogo}>NURA•ZELADORIA</Text>
              <Text style={styles.footerTaglineSerif}>
                Instrumento Digital de Zeladoria Urbana & Telemetria IoT.
              </Text>
              <View style={styles.systemOperationalPill}>
                <View style={styles.pulsingGreenDot} />
                <Text style={styles.systemOperationalText}>
                  SYSTEM OPERATIONAL • ASYNCSTORAGE + CONTEXT API
                </Text>
              </View>
            </View>

            <View style={styles.footerLinksCols}>
              <View style={styles.footerCol}>
                <Text style={styles.footerColHeading}>TERMINAIS</Text>
                <TouchableOpacity
                  onPress={() => onSelectTab('CITIZEN_PORTAL')}
                >
                  <Text style={styles.footerLink}>Canal do Cidadão</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSelectTab('NEW_OCCURRENCE')}
                >
                  <Text style={styles.footerLink}>Abrir Ocorrência</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onSelectTab('IOT_LAB')}>
                  <Text style={styles.footerLink}>
                    Simulador Poste IoT #{pole.poleId}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSelectTab('AGENT_CONSOLE')}
                >
                  <Text style={styles.footerLink}>Fila do Agente</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footerCol}>
                <Text style={styles.footerColHeading}>ARQUITETURA</Text>
                <Text style={styles.footerMetaItem}>Camada 1: Diretivas SOP</Text>
                <Text style={styles.footerMetaItem}>Camada 2: Orquestração</Text>
                <Text style={styles.footerMetaItem}>
                  Camada 3: Scripts Determinísticos
                </Text>
                <Text style={styles.footerMetaItem}>
                  Paleta: #2E4036 • #CC5833 • #F2F0E9
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footerDivider} />

          <View style={styles.footerBottomRow}>
            <Text style={styles.footerCopyright}>
              © 2026 NURA ZELADORIA • HIGH-END ORGANIC CIVIC TECH
            </Text>
            <Text style={styles.footerCopyright}>
              NODE #{pole.poleId} • LUX: {pole.ambientLux} lx •{' '}
              {occurrences.length} REGISTROS PERSISTIDOS
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  triadWrapper: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 64,
  },
  triadHeader: {
    marginBottom: 32,
  },
  kickerMono: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.clay,
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  titleSans: {
    fontFamily: FONTS.sansBold,
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.charcoal,
    letterSpacing: -0.8,
  },
  titleSerif: {
    fontFamily: FONTS.serifItalic,
    fontSize: 40,
    fontStyle: 'italic',
    fontWeight: '600',
    color: COLORS.moss,
  },
  subtitle: {
    fontFamily: FONTS.sansRegular,
    fontSize: 15,
    color: COLORS.charcoalMuted,
    marginTop: 6,
    maxWidth: 680,
    lineHeight: 22,
  },
  triadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    alignItems: 'stretch',
  },
  tierCardStandard: {
    flex: 1,
    minWidth: 300,
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.xxxl,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    justifyContent: 'space-between',
    ...SHADOWS.card,
  },
  tierCardPerformancePop: {
    flex: 1.08,
    minWidth: 310,
    backgroundColor: COLORS.moss,
    borderRadius: RADII.xxxl,
    padding: 30,
    borderWidth: 1.5,
    borderColor: COLORS.mossLight,
    justifyContent: 'space-between',
    ...SHADOWS.floatingIsland,
  },
  tierTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierTagMono: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.moss,
    letterSpacing: 0.9,
  },
  tierIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.mossMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierIconCirclePop: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.clay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(242, 240, 233, 0.14)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    gap: 6,
  },
  pulsingWhiteDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.telemetryGreen,
  },
  featuredPillText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.cream,
    letterSpacing: 0.6,
  },
  tierTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.charcoal,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  tierPriceLike: {
    fontFamily: FONTS.serifItalic,
    fontSize: 18,
    fontStyle: 'italic',
    color: COLORS.clay,
    marginBottom: 10,
  },
  tierSubBadge: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontStyle: 'normal',
    color: COLORS.charcoalMuted,
  },
  tierDesc: {
    fontFamily: FONTS.sansRegular,
    fontSize: 13,
    color: COLORS.charcoalMuted,
    lineHeight: 20,
    marginBottom: 20,
  },
  featureList: {
    gap: 10,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  featureText: {
    fontFamily: FONTS.sansRegular,
    fontSize: 13,
    color: COLORS.charcoal,
    flex: 1,
  },
  tierActionsCol: {
    gap: 10,
  },
  tierBtnMoss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.moss,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: RADII.pill,
  },
  tierBtnClayPop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.clay,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: RADII.pill,
    ...SHADOWS.clayGlow,
  },
  tierBtnTextCream: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.cream,
  },
  tierBtnOutline: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    backgroundColor: COLORS.cream,
  },
  tierBtnOutlineText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.moss,
  },
  tierBtnGhostLight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(242, 240, 233, 0.12)',
    gap: 6,
  },
  tierBtnGhostLightText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  footerContainer: {
    backgroundColor: COLORS.charcoal,
    borderTopLeftRadius: RADII.lg,
    borderTopRightRadius: RADII.lg,
    paddingTop: 52,
    paddingBottom: 42,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  footerInner: {
    width: '100%',
    maxWidth: 1140,
    alignSelf: 'center',
  },
  footerTopRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 32,
    marginBottom: 36,
  },
  footerBrandCol: {
    maxWidth: 420,
  },
  footerLogo: {
    fontFamily: FONTS.sansBold,
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.cream,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  footerTaglineSerif: {
    fontFamily: FONTS.serifItalic,
    fontSize: 20,
    fontStyle: 'italic',
    color: 'rgba(242, 240, 233, 0.78)',
    lineHeight: 26,
    marginBottom: 16,
  },
  systemOperationalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.charcoalElevated,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.charcoalBorder,
    gap: 8,
  },
  pulsingGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.telemetryGreen,
  },
  systemOperationalText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.telemetryGreen,
    letterSpacing: 0.7,
  },
  footerLinksCols: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 48,
  },
  footerCol: {
    gap: 10,
  },
  footerColHeading: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.clayLight,
    letterSpacing: 1,
    marginBottom: 4,
  },
  footerLink: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    color: COLORS.cream,
  },
  footerMetaItem: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: 'rgba(242, 240, 233, 0.6)',
  },
  footerDivider: {
    height: 1,
    backgroundColor: COLORS.charcoalBorder,
    marginBottom: 20,
  },
  footerBottomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  footerCopyright: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: 'rgba(242, 240, 233, 0.48)',
    letterSpacing: 0.5,
  },
});
