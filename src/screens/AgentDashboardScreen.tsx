import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OccurrenceCard } from '../components/OccurrenceCard';
import { CATEGORIES, STATUS_META, STATUS_ORDER } from '../data/mockData';
import { useIoT } from '../contexts/IoTContext';
import { useOccurrences } from '../contexts/OccurrencesContext';
import { COLORS, FONTS, RADII } from '../theme/theme';
import { Occurrence, OccurrenceStatus } from '../types';

interface AgentDashboardScreenProps {
  onNavigateIoTSimulator: () => void;
}

const PRESET_TECH_NOTES: Record<OccurrenceStatus, string[]> = {
  ABERTA: [
    'Chamado reclassificado para triagem prioritária na regional.',
  ],
  EM_ANALISE: [
    'Vistoria técnica validada via imagem e GPS. Insumos solicitados ao almoxarifado.',
    'Laudo IoT confirmado: falha no driver LED 120W. Programado caminhão cesto aéreo.',
  ],
  EM_ANDAMENTO: [
    'Equipe de campo #04 no local executando manutenção corretiva e sinalização.',
    'Eletricistas realizando substituição do relé fotocélula e módulo luminária LED.',
  ],
  RESOLVIDA: [
    'Intervenção concluída com sucesso. Pista/calçada liberada e auditada.',
    'Poste Inteligente #PZ-042 reparado: circuito LED restabelecido (124.5W nominal).',
  ],
};

export const AgentDashboardScreen: React.FC<AgentDashboardScreenProps> = ({
  onNavigateIoTSimulator,
}) => {
  const {
    occurrences,
    updateOccurrenceStatus,
    resetOccurrencesData,
  } = useOccurrences();
  const {
    activeIoTOccurrence,
    restoreNormalPoleOperation,
    triggerNightFailureSimulation,
  } = useIoT();

  const [statusFilter, setStatusFilter] = useState<
    OccurrenceStatus | 'ALL' | 'IOT_ONLY'
  >('ALL');
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<
    string | null
  >(null);
  const [customNote, setCustomNote] = useState('');

  const filteredQueue = useMemo(() => {
    if (statusFilter === 'ALL') return occurrences;
    if (statusFilter === 'IOT_ONLY') {
      return occurrences.filter((o) => o.origin === 'IOT_AUTO');
    }
    return occurrences.filter((o) => o.status === statusFilter);
  }, [occurrences, statusFilter]);

  // Keep a valid occurrence selected in the right-hand inspector
  useEffect(() => {
    if (
      !selectedOccurrenceId ||
      !occurrences.some((o) => o.id === selectedOccurrenceId)
    ) {
      if (activeIoTOccurrence) {
        setSelectedOccurrenceId(activeIoTOccurrence.id);
      } else if (occurrences.length > 0) {
        setSelectedOccurrenceId(occurrences[0].id);
      }
    }
  }, [occurrences, selectedOccurrenceId, activeIoTOccurrence]);

  // Automatically focus the new IoT occurrence when triggered
  useEffect(() => {
    if (activeIoTOccurrence) {
      setSelectedOccurrenceId(activeIoTOccurrence.id);
    }
  }, [activeIoTOccurrence?.id]);

  const inspectedOccurrence: Occurrence | null = useMemo(
    () =>
      occurrences.find((o) => o.id === selectedOccurrenceId) ||
      filteredQueue[0] ||
      null,
    [occurrences, selectedOccurrenceId, filteredQueue]
  );

  const counts = useMemo(() => {
    return {
      ABERTA: occurrences.filter((o) => o.status === 'ABERTA').length,
      EM_ANALISE: occurrences.filter((o) => o.status === 'EM_ANALISE').length,
      EM_ANDAMENTO: occurrences.filter((o) => o.status === 'EM_ANDAMENTO')
        .length,
      RESOLVIDA: occurrences.filter((o) => o.status === 'RESOLVIDA').length,
      IOT: occurrences.filter((o) => o.origin === 'IOT_AUTO').length,
    };
  }, [occurrences]);

  const handleStatusDispatch = async (
    occurrenceId: string,
    nextStatus: OccurrenceStatus,
    noteOverride?: string
  ) => {
    const target = occurrences.find((o) => o.id === occurrenceId);
    const noteToUse = noteOverride ?? customNote;
    await updateOccurrenceStatus(occurrenceId, nextStatus, noteToUse);
    setCustomNote('');

    // If Agent marks the Smart Streetlight occurrence as RESOLVIDA, restore hardware
    if (target?.origin === 'IOT_AUTO' && nextStatus === 'RESOLVIDA') {
      await restoreNormalPoleOperation();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Engineering Command Header (Sharp Charcoal Console) */}
        <View style={styles.commandBar}>
          <View style={styles.commandTopRow}>
            <View>
              <Text style={styles.commandKickerMono}>
                MESA DE DESPACHO OPERACIONAL // ENGENHARIA MUNICIPAL
              </Text>
              <Text style={styles.commandTitle}>
                Fila de Ordens de Serviço & Telemetria IoT
              </Text>
            </View>

            <View style={styles.commandActionsRight}>
              <TouchableOpacity
                style={styles.simulateIoTBtn}
                onPress={triggerNightFailureSimulation}
              >
                <Ionicons name="flash" size={13} color={COLORS.cream} />
                <Text style={styles.simulateIoTBtnText}>
                  DISPARAR FALHA POSTE IoT
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetDemoBtn}
                onPress={resetOccurrencesData}
              >
                <Ionicons name="refresh" size={13} color={COLORS.cream} />
                <Text style={styles.resetDemoBtnText}>RESETAR DADOS</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 5-Column Architectural Filter & SLA Matrix */}
          <View style={styles.kpiMatrixRow}>
            <TouchableOpacity
              style={[
                styles.kpiCell,
                statusFilter === 'ALL' && styles.kpiCellActive,
              ]}
              onPress={() => setStatusFilter('ALL')}
            >
              <Text style={styles.kpiCellCode}>[00] FILA TOTAL</Text>
              <Text style={styles.kpiCellNumber}>{occurrences.length}</Text>
              <Text style={styles.kpiCellSub}>Todos os chamados</Text>
            </TouchableOpacity>

            {STATUS_ORDER.map((st, idx) => {
              const meta = STATUS_META[st];
              const active = statusFilter === st;
              return (
                <TouchableOpacity
                  key={st}
                  style={[
                    styles.kpiCell,
                    active && styles.kpiCellActive,
                    { borderTopWidth: 3, borderTopColor: meta.color },
                  ]}
                  onPress={() =>
                    setStatusFilter((prev) => (prev === st ? 'ALL' : st))
                  }
                >
                  <Text style={[styles.kpiCellCode, { color: meta.color }]}>
                    [0{idx + 1}] {meta.label.toUpperCase()}
                  </Text>
                  <Text style={styles.kpiCellNumber}>{counts[st]}</Text>
                  <Text style={styles.kpiCellSub} numberOfLines={1}>
                    {meta.description}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[
                styles.kpiCell,
                statusFilter === 'IOT_ONLY' && styles.kpiCellActive,
                { borderTopWidth: 3, borderTopColor: COLORS.clayLight },
              ]}
              onPress={() =>
                setStatusFilter((prev) =>
                  prev === 'IOT_ONLY' ? 'ALL' : 'IOT_ONLY'
                )
              }
            >
              <Text style={[styles.kpiCellCode, { color: COLORS.clayLight }]}>
                [IoT] AUTÔNOMOS
              </Text>
              <Text style={styles.kpiCellNumber}>{counts.IOT}</Text>
              <Text style={styles.kpiCellSub}>Sensores de iluminação</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Master-Detail Split Workbench */}
        <View style={styles.workbenchGrid}>
          {/* =============================================================== */}
          {/* LEFT PANE: SERVICE ORDER QUEUE LIST                             */}
          {/* =============================================================== */}
          <View style={styles.queueCol}>
            <View style={styles.paneHeaderRow}>
              <Text style={styles.paneHeaderTitle}>
                FILA DE PRIORIDADE ({filteredQueue.length} ORDENS)
              </Text>
              <Text style={styles.paneHeaderHint}>
                Clique em um chamado para inspecionar ao lado
              </Text>
            </View>

            {activeIoTOccurrence && (
              <TouchableOpacity
                style={styles.priorityIoTCallout}
                onPress={() => setSelectedOccurrenceId(activeIoTOccurrence.id)}
              >
                <View style={styles.priorityIoTTop}>
                  <View style={styles.priorityBadgeBox}>
                    <Ionicons name="warning" size={12} color={COLORS.cream} />
                    <Text style={styles.priorityBadgeText}>
                      URGENTE // SENSOR IoT POSTE #{activeIoTOccurrence.iotMetadata?.poleId}
                    </Text>
                  </View>
                  <Text style={styles.priorityProtocolMono}>
                    #{activeIoTOccurrence.protocol}
                  </Text>
                </View>
                <Text style={styles.priorityTitle}>
                  {activeIoTOccurrence.title}
                </Text>
                <Text style={styles.prioritySub}>
                  Status atual:{' '}
                  {STATUS_META[activeIoTOccurrence.status].label.toUpperCase()}{' '}
                  — Clique para despachar equipe elétrica.
                </Text>
              </TouchableOpacity>
            )}

            {filteredQueue.length === 0 ? (
              <View style={styles.emptyQueueBox}>
                <Text style={styles.emptyQueueTitle}>
                  Nenhuma ordem de serviço neste filtro
                </Text>
                <TouchableOpacity
                  style={styles.emptyQueueResetFilter}
                  onPress={() => setStatusFilter('ALL')}
                >
                  <Text style={styles.emptyQueueResetText}>
                    EXIBIR TODA A FILA
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredQueue.map((occ) => (
                <OccurrenceCard
                  key={occ.id}
                  occurrence={occ}
                  isAgentView={true}
                  isSelected={inspectedOccurrence?.id === occ.id}
                  onPressDetail={(o) => setSelectedOccurrenceId(o.id)}
                  onQuickStatusChange={(id, nextSt) =>
                    handleStatusDispatch(id, nextSt)
                  }
                />
              ))
            )}
          </View>

          {/* =============================================================== */}
          {/* RIGHT PANE: PERSISTENT TECHNICAL INSPECTOR & DISPATCH PANEL     */}
          {/* =============================================================== */}
          <View style={styles.inspectorCol}>
            {inspectedOccurrence ? (
              <View style={styles.inspectorPanel}>
                {/* Inspector Top Header */}
                <View style={styles.inspectorHeader}>
                  <View>
                    <Text style={styles.inspectorProtocolMono}>
                      PRONTUÁRIO TÉCNICO // #{inspectedOccurrence.protocol}
                    </Text>
                    <Text style={styles.inspectorMainTitle}>
                      {inspectedOccurrence.title}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.inspectorStatusTag,
                      {
                        backgroundColor:
                          STATUS_META[inspectedOccurrence.status].color,
                      },
                    ]}
                  >
                    <Text style={styles.inspectorStatusTagText}>
                      {STATUS_META[
                        inspectedOccurrence.status
                      ].label.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Evidence Photo & Location Metadata */}
                <View style={styles.inspectorMediaRow}>
                  <Image
                    source={{ uri: inspectedOccurrence.photoUri }}
                    style={styles.inspectorPhoto}
                  />
                  <View style={styles.inspectorMetaTable}>
                    <View style={styles.metaRowItem}>
                      <Text style={styles.metaKeyMono}>CATEGORIA:</Text>
                      <Text style={styles.metaValText}>
                        [{CATEGORIES[inspectedOccurrence.category].code}]{' '}
                        {CATEGORIES[inspectedOccurrence.category].shortLabel}
                      </Text>
                    </View>
                    <View style={styles.metaRowItem}>
                      <Text style={styles.metaKeyMono}>ORIGEM:</Text>
                      <Text style={styles.metaValText}>
                        {inspectedOccurrence.origin === 'IOT_AUTO'
                          ? 'Disparo Autônomo IoT'
                          : `Cidadão (${inspectedOccurrence.reporterName})`}
                      </Text>
                    </View>
                    <View style={styles.metaRowItem}>
                      <Text style={styles.metaKeyMono}>ENDEREÇO:</Text>
                      <Text style={styles.metaValText}>
                        {inspectedOccurrence.location.address}
                      </Text>
                    </View>
                    <View style={styles.metaRowItem}>
                      <Text style={styles.metaKeyMono}>COORDENADAS:</Text>
                      <Text style={styles.metaValMono}>
                        {inspectedOccurrence.location.coordinates}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.inspectorDescription}>
                  {inspectedOccurrence.description}
                </Text>

                {/* IoT Diagnostic Box (if origin === IOT_AUTO) */}
                {inspectedOccurrence.origin === 'IOT_AUTO' &&
                  inspectedOccurrence.iotMetadata && (
                    <View style={styles.iotDiagBox}>
                      <View style={styles.iotDiagHeader}>
                        <Text style={styles.iotDiagTitle}>
                          TELEMETRIA DO POSTE INTELIGENTE #
                          {inspectedOccurrence.iotMetadata.poleId}
                        </Text>
                        <TouchableOpacity onPress={onNavigateIoTSimulator}>
                          <Text style={styles.iotDiagLink}>
                            ABRIR SIMULADOR IoT →
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.iotDiagGrid}>
                        <View style={styles.iotDiagCell}>
                          <Text style={styles.iotDiagLabel}>FOTOCÉLULA</Text>
                          <Text style={styles.iotDiagValue}>
                            {inspectedOccurrence.iotMetadata.ambientLux} lx
                            (Escuro)
                          </Text>
                        </View>
                        <View style={styles.iotDiagCell}>
                          <Text style={styles.iotDiagLabel}>TENSÃO REDE</Text>
                          <Text style={styles.iotDiagValue}>
                            {inspectedOccurrence.iotMetadata.voltageV} V
                          </Text>
                        </View>
                        <View style={styles.iotDiagCell}>
                          <Text style={styles.iotDiagLabel}>POTÊNCIA LED</Text>
                          <Text
                            style={[
                              styles.iotDiagValue,
                              { color: COLORS.clayLight },
                            ]}
                          >
                            {inspectedOccurrence.iotMetadata.powerDrawWatts} W
                            (Apagado)
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}

                {/* ========================================================= */}
                {/* AGENT STATUS CONTROL & TECHNICAL NOTE DISPATCH            */}
                {/* ========================================================= */}
                <View style={styles.dispatchControlBox}>
                  <Text style={styles.dispatchSectionTitle}>
                    ATUALIZAR STATUS DA ORDEM DE SERVIÇO
                  </Text>

                  {/* 4 Direct Status Buttons */}
                  <View style={styles.statusButtonsGrid}>
                    {STATUS_ORDER.map((st, idx) => {
                      const meta = STATUS_META[st];
                      const isCurrent = inspectedOccurrence.status === st;
                      return (
                        <TouchableOpacity
                          key={st}
                          style={[
                            styles.statusControlBtn,
                            isCurrent && {
                              backgroundColor: meta.color,
                              borderColor: meta.color,
                            },
                          ]}
                          onPress={() =>
                            handleStatusDispatch(inspectedOccurrence.id, st)
                          }
                        >
                          <Text
                            style={[
                              styles.statusControlStepMono,
                              isCurrent && { color: COLORS.cream },
                            ]}
                          >
                            ETAPA 0{idx + 1}
                          </Text>
                          <Text
                            style={[
                              styles.statusControlLabel,
                              isCurrent && { color: COLORS.cream },
                            ]}
                          >
                            {meta.label.toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Technical Note Input + Quick Engineering Templates */}
                  <Text style={styles.noteInputLabel}>
                    PARECER TÉCNICO DO AGENTE (OPCIONAL):
                  </Text>
                  <TextInput
                    style={styles.techNoteInput}
                    value={customNote}
                    onChangeText={setCustomNote}
                    placeholder="Digite o despacho da engenharia ou selecione um parecer rápido abaixo..."
                    placeholderTextColor={COLORS.charcoalMuted}
                    multiline
                  />

                  <View style={styles.presetNotesWrap}>
                    {Object.entries(PRESET_TECH_NOTES).map(([st, notes]) =>
                      notes.map((n, idx) => (
                        <TouchableOpacity
                          key={`${st}-${idx}`}
                          style={styles.presetNoteChip}
                          onPress={() =>
                            handleStatusDispatch(
                              inspectedOccurrence.id,
                              st as OccurrenceStatus,
                              n
                            )
                          }
                        >
                          <Text style={styles.presetNoteTag}>
                            [{STATUS_META[st as OccurrenceStatus].label}]
                          </Text>
                          <Text
                            style={styles.presetNoteText}
                            numberOfLines={1}
                          >
                            {n}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </View>

                {/* Audit History Log */}
                <View style={styles.historyBlock}>
                  <Text style={styles.historyBlockTitle}>
                    HISTÓRICO DE AUDITORIA ({inspectedOccurrence.history.length}{' '}
                    REGISTROS)
                  </Text>
                  {inspectedOccurrence.history.map((h) => {
                    const stMeta = STATUS_META[h.status];
                    return (
                      <View
                        key={h.id}
                        style={[
                          styles.historyEntryRow,
                          { borderLeftColor: stMeta.color },
                        ]}
                      >
                        <View style={styles.historyEntryHeader}>
                          <Text
                            style={[
                              styles.historyStatusMono,
                              { color: stMeta.color },
                            ]}
                          >
                            {stMeta.label.toUpperCase()} — {h.actorName}
                          </Text>
                          <Text style={styles.historyTimeMono}>
                            {new Date(h.timestamp).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </View>
                        <Text style={styles.historyNoteText}>{h.note}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    width: '100%',
    maxWidth: 1380,
    alignSelf: 'center',
    padding: 18,
    paddingBottom: 64,
  },
  commandBar: {
    backgroundColor: COLORS.charcoal,
    borderRadius: RADII.md,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.charcoalBorder,
  },
  commandTopRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  commandKickerMono: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.telemetryGreen,
    letterSpacing: 0.8,
  },
  commandTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.cream,
    marginTop: 2,
  },
  commandActionsRight: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  simulateIoTBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.clay,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADII.sm,
    gap: 6,
  },
  simulateIoTBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  resetDemoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.charcoalElevated,
    borderWidth: 1,
    borderColor: COLORS.charcoalBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADII.sm,
    gap: 6,
  },
  resetDemoBtnText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  kpiMatrixRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  kpiCell: {
    flex: 1,
    minWidth: 150,
    backgroundColor: COLORS.charcoalElevated,
    borderWidth: 1,
    borderColor: COLORS.charcoalBorder,
    borderRadius: RADII.sm,
    padding: 12,
  },
  kpiCellActive: {
    backgroundColor: '#2E3430',
    borderColor: COLORS.cream,
  },
  kpiCellCode: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
  },
  kpiCellNumber: {
    fontFamily: FONTS.mono,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
  },
  kpiCellSub: {
    fontFamily: FONTS.sansRegular,
    fontSize: 11,
    color: 'rgba(242, 240, 233, 0.58)',
    marginTop: 2,
  },
  workbenchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 18,
  },
  queueCol: {
    flex: 1.05,
    minWidth: 340,
  },
  inspectorCol: {
    flex: 1.15,
    minWidth: 340,
  },
  paneHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  paneHeaderTitle: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  paneHeaderHint: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.charcoalMuted,
  },
  priorityIoTCallout: {
    backgroundColor: COLORS.clayMuted,
    borderWidth: 1.5,
    borderColor: COLORS.clay,
    borderRadius: RADII.sm,
    padding: 12,
    marginBottom: 12,
  },
  priorityIoTTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priorityBadgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.clay,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADII.sm,
    gap: 5,
  },
  priorityBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.cream,
  },
  priorityProtocolMono: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.clayDark,
  },
  priorityTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.charcoal,
  },
  prioritySub: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.charcoalMuted,
    marginTop: 2,
  },
  emptyQueueBox: {
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.sm,
    padding: 24,
    alignItems: 'center',
  },
  emptyQueueTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: COLORS.charcoalMuted,
    marginBottom: 10,
  },
  emptyQueueResetFilter: {
    backgroundColor: COLORS.moss,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADII.sm,
  },
  emptyQueueResetText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  inspectorPanel: {
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.md,
    padding: 18,
  },
  inspectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.creamBorder,
    paddingBottom: 12,
    marginBottom: 14,
    gap: 10,
  },
  inspectorProtocolMono: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.clay,
    marginBottom: 3,
  },
  inspectorMainTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.charcoal,
    maxWidth: 460,
  },
  inspectorStatusTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.sm,
  },
  inspectorStatusTagText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  inspectorMediaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 12,
  },
  inspectorPhoto: {
    width: 170,
    height: 118,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.creamSubtle,
  },
  inspectorMetaTable: {
    flex: 1,
    minWidth: 200,
    justifyContent: 'space-between',
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.sm,
    padding: 10,
  },
  metaRowItem: {
    marginBottom: 4,
  },
  metaKeyMono: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.charcoalMuted,
  },
  metaValText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  metaValMono: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.moss,
  },
  inspectorDescription: {
    fontFamily: FONTS.sansRegular,
    fontSize: 13,
    color: COLORS.charcoal,
    lineHeight: 19,
    marginBottom: 14,
    backgroundColor: COLORS.cream,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.sm,
  },
  iotDiagBox: {
    backgroundColor: COLORS.charcoal,
    borderRadius: RADII.sm,
    padding: 12,
    marginBottom: 14,
  },
  iotDiagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iotDiagTitle: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  iotDiagLink: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.telemetryGreen,
  },
  iotDiagGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  iotDiagCell: {
    flex: 1,
    backgroundColor: COLORS.charcoalElevated,
    padding: 8,
    borderRadius: RADII.sm,
  },
  iotDiagLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: 'rgba(242, 240, 233, 0.55)',
    marginBottom: 2,
  },
  iotDiagValue: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cream,
  },
  dispatchControlBox: {
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.moss,
    borderRadius: RADII.sm,
    padding: 14,
    marginBottom: 16,
  },
  dispatchSectionTitle: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.moss,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  statusButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  statusControlBtn: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.sm,
    paddingVertical: 9,
    paddingHorizontal: 8,
  },
  statusControlStepMono: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.charcoalMuted,
    marginBottom: 2,
  },
  statusControlLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  noteInputLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.charcoalMuted,
    marginBottom: 5,
  },
  techNoteInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.sm,
    padding: 10,
    fontSize: 12,
    color: COLORS.charcoal,
    minHeight: 54,
    marginBottom: 8,
    textAlignVertical: 'top',
  },
  presetNotesWrap: {
    gap: 4,
  },
  presetNoteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: RADII.sm,
    gap: 6,
  },
  presetNoteTag: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.moss,
  },
  presetNoteText: {
    fontFamily: FONTS.sansRegular,
    fontSize: 11,
    color: COLORS.charcoal,
    flex: 1,
  },
  historyBlock: {
    borderTopWidth: 1,
    borderTopColor: COLORS.creamBorder,
    paddingTop: 12,
  },
  historyBlockTitle: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.charcoalMuted,
    marginBottom: 8,
  },
  historyEntryRow: {
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderLeftWidth: 3,
    borderRadius: RADII.sm,
    padding: 10,
    marginBottom: 6,
  },
  historyEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  historyStatusMono: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
  },
  historyTimeMono: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.charcoalMuted,
  },
  historyNoteText: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    color: COLORS.charcoal,
  },
});
