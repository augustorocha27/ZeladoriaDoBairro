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
import { useResponsive } from '../theme/useResponsive';
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

const COMPACT_STEP_LABELS: Record<OccurrenceStatus, string> = {
  ABERTA: 'Aberta',
  EM_ANALISE: 'Análise',
  EM_ANDAMENTO: 'Andamento',
  RESOLVIDA: 'Resolvida',
};

export const OccurrenceCard: React.FC<OccurrenceCardProps> = ({
  occurrence,
  isAgentView = false,
  isSelected = false,
  onPressDetail,
  onQuickStatusChange,
}) => {
  const { isMobile, isSmallPhone } = useResponsive();
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
        isSmallPhone && { padding: 12 },
        { borderLeftColor: status.color },
        isIoT && styles.cardIoT,
        isSelected && styles.cardSelected,
      ]}
      onPress={() => onPressDetail(occurrence)}
      activeOpacity={0.88}
    >
      {/* Top Row: Category / Origin + Status Badge */}
      <View style={styles.topRow}>
        <View style={styles.badgesLeft}>
          <View
            style={[
              styles.categoryBadge,
              isIoT && { backgroundColor: COLORS.clay },
            ]}
          >
            <Ionicons
              name={
                isIoT ? 'hardware-chip-outline' : (category.iconName as any)
              }
              size={13}
              color={isIoT ? COLORS.cream : COLORS.moss}
            />
            <Text
              style={[
                styles.categoryBadgeText,
                isIoT && { color: COLORS.cream },
              ]}
            >
              {isIoT
                ? isSmallPhone
                  ? 'Poste IoT'
                  : 'Poste Inteligente (Auto)'
                : category.shortLabel}
            </Text>
          </View>
          <Text style={styles.protocolText}>#{occurrence.protocol}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: status.bgColor, borderColor: status.color },
          ]}
        >
          <View
            style={[styles.statusDot, { backgroundColor: status.color }]}
          />
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>

      {/* Main Content: Photo + Title + Street */}
      <View style={styles.bodyRow}>
        <Image
          source={{ uri: occurrence.photoUri }}
          style={[
            styles.thumbnail,
            isSmallPhone && { width: 68, height: 64 },
          ]}
        />
        <View style={styles.infoColumn}>
          <Text
            style={[styles.title, isSmallPhone && { fontSize: 14, lineHeight: 19 }]}
            numberOfLines={2}
          >
            {occurrence.title}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.clay} />
            <Text style={styles.locationText} numberOfLines={1}>
              {occurrence.location.address}
            </Text>
          </View>
          <Text style={styles.referenceText} numberOfLines={1}>
            {occurrence.location.reference}
          </Text>
        </View>
      </View>

      {/* Simple 4-Step Progress Bar */}
      <View style={styles.stepsContainer}>
        <View style={styles.stepsTrack}>
          {STATUS_ORDER.map((stepStatus, idx) => {
            const stepMeta = STATUS_META[stepStatus];
            const isCompleted = status.step >= stepMeta.step;
            const isCurrent = occurrence.status === stepStatus;
            const displayLabel = isMobile
              ? COMPACT_STEP_LABELS[stepStatus]
              : stepMeta.label;

            return (
              <View key={stepStatus} style={styles.stepCol}>
                <View
                  style={[
                    styles.stepBar,
                    isCompleted
                      ? { backgroundColor: status.color }
                      : { backgroundColor: COLORS.creamSubtle },
                  ]}
                />
                <Text
                  style={[
                    styles.stepLabel,
                    isSmallPhone && { fontSize: 10 },
                    isCurrent && {
                      color: status.color,
                      fontWeight: '700',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {idx + 1}. {displayLabel}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Latest Update Note & Action Footer */}
      <View
        style={[
          styles.footerRow,
          isSmallPhone && styles.footerRowStacked,
        ]}
      >
        <View style={{ flex: 1 }}>
          {latestHistory && (
            <Text style={styles.latestNote} numberOfLines={2}>
              <Text style={styles.latestActor}>Última atualização: </Text>
              {latestHistory.note}
            </Text>
          )}
          <Text style={styles.timestampText}>Atualizado em {formattedDate}</Text>
        </View>

        {isAgentView && nextStatus && onQuickStatusChange ? (
          <TouchableOpacity
            style={[
              styles.agentAdvanceBtn,
              isSmallPhone && { alignSelf: 'stretch', alignItems: 'center' },
            ]}
            onPress={() => onQuickStatusChange(occurrence.id, nextStatus)}
            activeOpacity={0.85}
          >
            <Text style={styles.agentAdvanceBtnText}>
              Mudar p/ {STATUS_META[nextStatus].label} →
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.detailBtn}>
            <Text style={styles.detailBtnText}>Ver histórico</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.moss} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.creamElevated,
    borderRadius: RADII.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderLeftWidth: 4,
  },
  cardIoT: {
    backgroundColor: '#FCF8F6',
    borderColor: 'rgba(204, 88, 51, 0.4)',
  },
  cardSelected: {
    borderColor: COLORS.charcoal,
    backgroundColor: COLORS.white,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  badgesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.mossMuted,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADII.sm,
    gap: 5,
  },
  categoryBadgeText: {
    color: COLORS.moss,
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    fontWeight: '700',
  },
  protocolText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.charcoalMuted,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.sm,
    borderWidth: 1,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 2,
  },
  statusText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
  },
  bodyRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  thumbnail: {
    width: 84,
    height: 72,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.creamSubtle,
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.sansBold,
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.charcoal,
    lineHeight: 21,
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.charcoal,
    flex: 1,
  },
  referenceText: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    color: COLORS.charcoalMuted,
    marginTop: 2,
  },
  stepsContainer: {
    marginBottom: 12,
  },
  stepsTrack: {
    flexDirection: 'row',
    gap: 6,
  },
  stepCol: {
    flex: 1,
  },
  stepBar: {
    height: 5,
    borderRadius: 2,
    marginBottom: 4,
  },
  stepLabel: {
    fontFamily: FONTS.sansRegular,
    fontSize: 11,
    color: COLORS.charcoalMuted,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.creamSubtle,
    gap: 10,
  },
  footerRowStacked: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  latestNote: {
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    color: COLORS.charcoal,
    lineHeight: 17,
    marginBottom: 3,
  },
  latestActor: {
    fontFamily: FONTS.sansBold,
    fontWeight: '700',
    color: COLORS.moss,
  },
  timestampText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.charcoalMuted,
  },
  agentAdvanceBtn: {
    backgroundColor: COLORS.moss,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADII.sm,
  },
  agentAdvanceBtnText: {
    color: COLORS.cream,
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  detailBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    color: COLORS.moss,
    fontWeight: '700',
  },
});
