import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, STATUS_META, STATUS_ORDER } from '../data/mockData';
import { COLORS, FONTS, RADII } from '../theme/theme';
import { Occurrence, OccurrenceStatus } from '../types';

interface OccurrenceCardProps {
  occurrence: Occurrence;
  isAgentView?: boolean;
  isSelected?: boolean;
  onPressDetail: (occurrence: Occurrence) => void;
  onQuickStatusChange?: (
    occurrenceId: string,
    nextStatus: OccurrenceStatus
  ) => void;
}

export const OccurrenceCard: React.FC<OccurrenceCardProps> = ({
  occurrence,
  isAgentView = false,
  isSelected = false,
  onPressDetail,
  onQuickStatusChange,
}) => {
  const category = CATEGORIES[occurrence.category];
  const status = STATUS_META[occurrence.status];
  const isIoT = occurrence.origin === 'IOT_AUTO';

  const latestHistory =
    occurrence.history[occurrence.history.length - 1] || null;

  const formattedDate = new Date(occurrence.updatedAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const currentIdx = STATUS_ORDER.indexOf(occurrence.status);
  const nextStatus =
    currentIdx >= 0 && currentIdx < STATUS_ORDER.length - 1
      ? STATUS_ORDER[currentIdx + 1]
      : null;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderLeftColor: status.color },
        isIoT && styles.cardIoT,
        isSelected && styles.cardSelected,
      ]}
      onPress={() => onPressDetail(occurrence)}
      activeOpacity={0.88}
    >
      {/* Top Technical Row: Origin + Protocol + Status Tag */}
      <View style={styles.topRow}>
        <View style={styles.badgesLeft}>
          {isIoT ? (
            <View style={styles.iotTag}>
              <Ionicons name="hardware-chip" size={11} color={COLORS.cream} />
              <Text style={styles.iotTagText}>SENSOR IoT AUTÔNOMO</Text>
            </View>
          ) : (
            <View style={styles.citizenTag}>
              <Text style={styles.citizenTagText}>RELATO DO MORADOR</Text>
            </View>
          )}
          <Text style={styles.protocolText}>#{occurrence.protocol}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: status.bgColor, borderColor: status.color },
          ]}
        >
          <View
            style={[styles.statusSquare, { backgroundColor: status.color }]}
          />
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.step}/4 • {status.label.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Main Content Row */}
      <View style={styles.bodyRow}>
        <Image
          source={{ uri: occurrence.photoUri }}
          style={styles.thumbnail}
        />
        <View style={styles.infoColumn}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryCode}>[{category.code}]</Text>
            <Text style={styles.categoryLabel}>{category.label}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {occurrence.title}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={12} color={COLORS.clay} />
            <Text style={styles.locationText} numberOfLines={1}>
              {occurrence.location.address} ({occurrence.location.coordinates})
            </Text>
          </View>
        </View>
      </View>

      {/* IoT Telemetry Diagnostic Strip */}
      {isIoT && occurrence.iotMetadata && (
        <View style={styles.telemetryStrip}>
          <Ionicons name="pulse" size={13} color={COLORS.clayLight} />
          <Text style={styles.telemetryStripText}>
            NÓ #{occurrence.iotMetadata.poleId} | LUMINOSIDADE:{' '}
            {occurrence.iotMetadata.ambientLux} lx (ESCURO) | CONSUMO LED:{' '}
            {occurrence.iotMetadata.powerDrawWatts}W | DIAG:{' '}
            {occurrence.iotMetadata.sensorDiagnosticCode}
          </Text>
        </View>
      )}

      {/* 4-Stage Architectural Pipeline */}
      <View style={styles.pipelineTrack}>
        {STATUS_ORDER.map((stepStatus, idx) => {
          const stepMeta = STATUS_META[stepStatus];
          const isCompleted = status.step >= stepMeta.step;
          const isCurrent = occurrence.status === stepStatus;
          return (
            <View key={stepStatus} style={styles.pipelineStepWrapper}>
              <View
                style={[
                  styles.pipelineBar,
                  isCompleted
                    ? { backgroundColor: status.color }
                    : { backgroundColor: COLORS.creamSubtle },
                ]}
              />
              <Text
                style={[
                  styles.pipelineStepLabel,
                  isCurrent && {
                    color: status.color,
                    fontWeight: '700',
                  },
                ]}
              >
                0{idx + 1} {stepMeta.label.toUpperCase()}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Footer Note & Action */}
      <View style={styles.footerRow}>
        <View style={{ flex: 1, marginRight: 10 }}>
          {latestHistory && (
            <Text style={styles.latestNote} numberOfLines={1}>
              <Text style={styles.latestActorMono}>
                [{latestHistory.actorName}]:{' '}
              </Text>
              {latestHistory.note}
            </Text>
          )}
          <Text style={styles.timestampText}>
            ÚLTIMA ATUALIZAÇÃO: {formattedDate}
          </Text>
        </View>

        {isAgentView && nextStatus && onQuickStatusChange ? (
          <TouchableOpacity
            style={styles.agentAdvanceBtn}
            onPress={() => onQuickStatusChange(occurrence.id, nextStatus)}
            activeOpacity={0.85}
          >
            <Text style={styles.agentAdvanceBtnText}>
              AVANÇAR → {STATUS_META[nextStatus].label.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.detailPrompt}>
            <Text style={styles.detailPromptText}>PRONTUÁRIO</Text>
            <Ionicons name="arrow-forward" size={12} color={COLORS.moss} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.sm,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderLeftWidth: 4,
  },
  cardIoT: {
    backgroundColor: '#FCF8F6',
    borderColor: 'rgba(204, 88, 51, 0.45)',
  },
  cardSelected: {
    borderColor: COLORS.charcoal,
    backgroundColor: COLORS.white,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  badgesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iotTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.clay,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADII.sm,
    gap: 4,
  },
  iotTagText: {
    color: COLORS.cream,
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
  },
  citizenTag: {
    backgroundColor: COLORS.mossMuted,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADII.sm,
  },
  citizenTagText: {
    color: COLORS.moss,
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: '700',
  },
  protocolText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.charcoal,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADII.sm,
    borderWidth: 1,
    gap: 5,
  },
  statusSquare: {
    width: 6,
    height: 6,
    borderRadius: 1,
  },
  statusText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
  },
  bodyRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  thumbnail: {
    width: 82,
    height: 68,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.creamSubtle,
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  categoryCode: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.clay,
    fontWeight: '700',
  },
  categoryLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.moss,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.charcoal,
    lineHeight: 19,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.charcoalMuted,
    flex: 1,
  },
  telemetryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.charcoal,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADII.sm,
    marginBottom: 10,
    gap: 8,
  },
  telemetryStripText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.cream,
    flex: 1,
  },
  pipelineTrack: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 10,
  },
  pipelineStepWrapper: {
    flex: 1,
  },
  pipelineBar: {
    height: 4,
    borderRadius: 1,
    marginBottom: 3,
  },
  pipelineStepLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.charcoalMuted,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.creamSubtle,
  },
  latestNote: {
    fontFamily: FONTS.sansRegular,
    fontSize: 11,
    color: COLORS.charcoal,
    marginBottom: 2,
  },
  latestActorMono: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.moss,
  },
  timestampText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.charcoalMuted,
  },
  agentAdvanceBtn: {
    backgroundColor: COLORS.moss,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADII.sm,
  },
  agentAdvanceBtnText: {
    color: COLORS.cream,
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
  },
  detailPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.cream,
  },
  detailPromptText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.moss,
    fontWeight: '700',
  },
});
