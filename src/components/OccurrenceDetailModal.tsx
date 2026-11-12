import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, STATUS_META, STATUS_ORDER } from '../data/mockData';
import { COLORS, FONTS, RADII } from '../theme/theme';
import { Occurrence, OccurrenceStatus } from '../types';

interface OccurrenceDetailModalProps {
  occurrence: Occurrence | null;
  visible: boolean;
  isAgent: boolean;
  onClose: () => void;
  onUpdateStatus: (
    occurrenceId: string,
    nextStatus: OccurrenceStatus,
    note?: string
  ) => Promise<void>;
}

export const OccurrenceDetailModal: React.FC<OccurrenceDetailModalProps> = ({
  occurrence,
  visible,
  isAgent,
  onClose,
  onUpdateStatus,
}) => {
  const [agentNote, setAgentNote] = useState('');

  if (!occurrence) return null;

  const category = CATEGORIES[occurrence.category];
  const currentStatus = STATUS_META[occurrence.status];
  const isIoT = occurrence.origin === 'IOT_AUTO';

  const handleSelectStatus = async (status: OccurrenceStatus) => {
    await onUpdateStatus(occurrence.id, status, agentNote);
    setAgentNote('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Top Handle & Close */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.monoProtocol}>
                PROTOCOLO #{occurrence.protocol}
              </Text>
              <Text style={styles.sheetTitle}>Prontuário da Ocorrência</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.charcoal} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Hero Image + Overlay Badge */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: occurrence.photoUri }}
                style={styles.heroImage}
              />
              <View
                style={[
                  styles.floatingStatusBadge,
                  { backgroundColor: currentStatus.color },
                ]}
              >
                <Text style={styles.floatingStatusText}>
                  {currentStatus.label.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Category & Title */}
            <View style={styles.section}>
              <Text style={styles.categoryTag}>
                [{category.code}] {category.label}
              </Text>
              <Text style={styles.occurrenceTitle}>{occurrence.title}</Text>
              <Text style={styles.descriptionText}>
                {occurrence.description}
              </Text>
            </View>

            {/* Location Box */}
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={18} color={COLORS.clay} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>ENDEREÇO & REFERÊNCIA</Text>
                  <Text style={styles.infoValue}>
                    {occurrence.location.address}
                  </Text>
                  <Text style={styles.infoSub}>
                    {occurrence.location.reference}
                  </Text>
                </View>
              </View>
              <View style={styles.coordsBadge}>
                <Text style={styles.coordsText}>
                  GPS: {occurrence.location.coordinates}
                </Text>
              </View>
            </View>

            {/* IoT Telemetry Card if applicable */}
            {isIoT && occurrence.iotMetadata && (
              <View style={styles.iotTelemetryBox}>
                <View style={styles.iotHeaderRow}>
                  <Ionicons
                    name="hardware-chip"
                    size={16}
                    color={COLORS.clay}
                  />
                  <Text style={styles.iotBoxTitle}>
                    TELEMETRIA DO POSTE INTELIGENTE #{occurrence.iotMetadata.poleId}
                  </Text>
                </View>
                <View style={styles.iotMetricsGrid}>
                  <View style={styles.iotMetricItem}>
                    <Text style={styles.iotMetricLabel}>SENSOR LUX</Text>
                    <Text style={styles.iotMetricVal}>
                      {occurrence.iotMetadata.ambientLux} lx (Escuro)
                    </Text>
                  </View>
                  <View style={styles.iotMetricItem}>
                    <Text style={styles.iotMetricLabel}>CONSUMO LED</Text>
                    <Text style={styles.iotMetricVal}>
                      {occurrence.iotMetadata.powerDrawWatts} W (Apagado)
                    </Text>
                  </View>
                  <View style={styles.iotMetricItem}>
                    <Text style={styles.iotMetricLabel}>DIAGNÓSTICO</Text>
                    <Text style={styles.iotMetricVal}>
                      {occurrence.iotMetadata.sensorDiagnosticCode}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Agent Action Panel (Only for Agent Role or switchable) */}
            {isAgent ? (
              <View style={styles.agentPanel}>
                <Text style={styles.agentPanelTitle}>
                  PAINEL DE DESPACHO DO AGENTE
                </Text>
                <Text style={styles.agentPanelSub}>
                  Atualize o andamento da ocorrência para notificar o cidadão:
                </Text>

                <TextInput
                  style={styles.noteInput}
                  placeholder="Parecer técnico opcional (ex: Equipe #02 enviou caminhão cesto aéreo)..."
                  placeholderTextColor={COLORS.charcoalMuted}
                  value={agentNote}
                  onChangeText={setAgentNote}
                  multiline
                />

                <View style={styles.statusButtonsGrid}>
                  {STATUS_ORDER.map((st) => {
                    const meta = STATUS_META[st];
                    const isSelected = occurrence.status === st;
                    return (
                      <TouchableOpacity
                        key={st}
                        style={[
                          styles.statusOptionBtn,
                          isSelected && {
                            backgroundColor: meta.color,
                            borderColor: meta.color,
                          },
                        ]}
                        onPress={() => handleSelectStatus(st)}
                      >
                        <Text
                          style={[
                            styles.statusOptionText,
                            isSelected && { color: COLORS.cream },
                          ]}
                        >
                          {meta.step}. {meta.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : (
              <View style={styles.citizenNoticeBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={COLORS.moss}
                />
                <Text style={styles.citizenNoticeText}>
                  Você está visualizando como <Text style={{ fontWeight: '700' }}>Cidadão</Text>. Para alterar o status desta ocorrência, alterne para o perfil <Text style={{ fontWeight: '700' }}>Agente</Text> no topo da tela.
                </Text>
              </View>
            )}

            {/* Full Status History Timeline */}
            <View style={styles.timelineSection}>
              <Text style={styles.timelineTitle}>
                HISTÓRICO DE AUDITORIA ({occurrence.history.length} EVENTOS)
              </Text>
              {occurrence.history.map((item, index) => {
                const stMeta = STATUS_META[item.status];
                const isLast = index === occurrence.history.length - 1;
                return (
                  <View key={item.id} style={styles.timelineRow}>
                    <View style={styles.timelineIndicatorCol}>
                      <View
                        style={[
                          styles.timelineDot,
                          { backgroundColor: stMeta.color },
                        ]}
                      />
                      {!isLast && <View style={styles.timelineLine} />}
                    </View>
                    <View style={styles.timelineCard}>
                      <View style={styles.timelineCardHeader}>
                        <Text
                          style={[
                            styles.timelineStatusLabel,
                            { color: stMeta.color },
                          ]}
                        >
                          {stMeta.label.toUpperCase()}
                        </Text>
                        <Text style={styles.timelineTime}>
                          {new Date(item.timestamp).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                      <Text style={styles.timelineActor}>
                        Responsável: {item.actorName}
                      </Text>
                      <Text style={styles.timelineNote}>{item.note}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: RADII.xxxl,
    borderTopRightRadius: RADII.xxxl,
    maxHeight: '92%',
    paddingTop: 18,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.creamBorder,
  },
  monoProtocol: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.clay,
    fontWeight: '700',
  },
  sheetTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.creamSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 22,
    paddingBottom: 42,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: 190,
    borderRadius: RADII.xl,
    backgroundColor: COLORS.creamSubtle,
  },
  floatingStatusBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADII.pill,
  },
  floatingStatusText: {
    color: COLORS.cream,
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  section: {
    marginBottom: 16,
  },
  categoryTag: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.moss,
    fontWeight: '700',
    marginBottom: 4,
  },
  occurrenceTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.charcoal,
    marginBottom: 8,
  },
  descriptionText: {
    fontFamily: FONTS.sansRegular,
    fontSize: 14,
    color: COLORS.charcoalMuted,
    lineHeight: 21,
  },
  infoBox: {
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.charcoalMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  infoSub: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    color: COLORS.charcoalMuted,
    marginTop: 2,
  },
  coordsBadge: {
    marginTop: 10,
    backgroundColor: COLORS.creamSubtle,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.sm,
    alignSelf: 'flex-start',
  },
  coordsText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.charcoal,
  },
  iotTelemetryBox: {
    backgroundColor: COLORS.charcoal,
    borderRadius: RADII.lg,
    padding: 16,
    marginBottom: 16,
  },
  iotHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  iotBoxTitle: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cream,
  },
  iotMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  iotMetricItem: {
    flex: 1,
    backgroundColor: COLORS.charcoalElevated,
    padding: 10,
    borderRadius: RADII.sm,
  },
  iotMetricLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.clay,
    marginBottom: 4,
  },
  iotMetricVal: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.cream,
    fontWeight: '700',
  },
  agentPanel: {
    backgroundColor: COLORS.mossMuted,
    borderRadius: RADII.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.moss,
    marginBottom: 20,
  },
  agentPanelTitle: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.moss,
    marginBottom: 4,
  },
  agentPanelSub: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    color: COLORS.charcoal,
    marginBottom: 10,
  },
  noteInput: {
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    padding: 12,
    fontSize: 13,
    color: COLORS.charcoal,
    minHeight: 60,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  statusButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOptionBtn: {
    flexGrow: 1,
    minWidth: '45%',
    backgroundColor: COLORS.creamElevated,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    alignItems: 'center',
  },
  statusOptionText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  citizenNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.mossMuted,
    padding: 12,
    borderRadius: RADII.md,
    gap: 8,
    marginBottom: 20,
  },
  citizenNoticeText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.moss,
    lineHeight: 17,
  },
  timelineSection: {
    marginTop: 4,
  },
  timelineTitle: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.charcoalMuted,
    marginBottom: 12,
    letterSpacing: 0.6,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineIndicatorCol: {
    alignItems: 'center',
    width: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.creamBorder,
    marginVertical: 4,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.md,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
  },
  timelineCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timelineStatusLabel: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
  },
  timelineTime: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.charcoalMuted,
  },
  timelineActor: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal,
    marginBottom: 3,
  },
  timelineNote: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    color: COLORS.charcoalMuted,
    lineHeight: 17,
  },
});
