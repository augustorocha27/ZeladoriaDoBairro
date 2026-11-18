import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActiveSectionTab } from '../components/FloatingIslandNavbar';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, FONTS, RADII, SHADOWS } from '../theme/theme';
import { useResponsive } from '../theme/useResponsive';
import { UserRole } from '../types';

interface LoginScreenProps {
  onSelectTab?: (tab: ActiveSectionTab) => void;
}

const DEMO_CREDENTIALS = {
  CITIZEN: {
    name: 'Clara Vasconcelos',
    identifier: 'clara.moradora@bairro.com.br',
    badge: 'CID-8842',
    password: '123456',
  },
  AGENT: {
    name: 'Eng. Marcos Silveira',
    identifier: 'marcos.silveira@zeladoria.gov.br',
    badge: 'AGT-0419',
    password: '123456',
  },
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSelectTab }) => {
  const { loginAs } = useAuth();
  const { isSmallPhone, pagePadding } = useResponsive();

  const [selectedRole, setSelectedRole] = useState<UserRole>('CITIZEN');
  const [nameInput, setNameInput] = useState(DEMO_CREDENTIALS.CITIZEN.name);
  const [identifierInput, setIdentifierInput] = useState(
    DEMO_CREDENTIALS.CITIZEN.identifier
  );
  const [passwordInput, setPasswordInput] = useState(
    DEMO_CREDENTIALS.CITIZEN.password
  );
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectRoleTab = (role: UserRole) => {
    setSelectedRole(role);
    setNameInput(DEMO_CREDENTIALS[role].name);
    setIdentifierInput(DEMO_CREDENTIALS[role].identifier);
    setPasswordInput(DEMO_CREDENTIALS[role].password);
    setErrorMsg(null);
  };

  const handleFormLogin = async () => {
    if (!identifierInput.trim() || !passwordInput.trim()) {
      setErrorMsg('Preencha o login e a senha para entrar.');
      return;
    }

    await loginAs(
      selectedRole,
      nameInput.trim() || DEMO_CREDENTIALS[selectedRole].name,
      DEMO_CREDENTIALS[selectedRole].badge
    );

    if (onSelectTab) {
      onSelectTab(
        selectedRole === 'CITIZEN' ? 'CITIZEN_PORTAL' : 'AGENT_CONSOLE'
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingHorizontal: pagePadding },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.centerStage}>
        {/* App Header / Brand */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBox}>
            <Ionicons name="business-outline" size={26} color={COLORS.cream} />
          </View>
          <Text
            style={[
              styles.appTitle,
              isSmallPhone && { fontSize: 22 },
            ]}
          >
            Zeladoria do Bairro
          </Text>
          <Text style={styles.appSubtitle}>
            Canal direto entre moradores, agentes da prefeitura e iluminação
            pública inteligente.
          </Text>
        </View>

        {/* Main Login Card */}
        <View
          style={[
            styles.loginCard,
            isSmallPhone && { padding: 16 },
          ]}
        >
          <Text style={styles.sectionLabel}>1. ESCOLHA SEU PERFIL DE ACESSO</Text>

          {/* 2 Role Tabs */}
          <View
            style={[
              styles.roleTabsRow,
              isSmallPhone && { flexDirection: 'column' },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.roleTab,
                selectedRole === 'CITIZEN' && styles.roleTabActiveMoss,
              ]}
              onPress={() => handleSelectRoleTab('CITIZEN')}
              activeOpacity={0.85}
            >
              <Ionicons
                name="person"
                size={18}
                color={
                  selectedRole === 'CITIZEN' ? COLORS.cream : COLORS.charcoal
                }
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.roleTabTitle,
                    selectedRole === 'CITIZEN' && { color: COLORS.cream },
                  ]}
                >
                  Sou Morador
                </Text>
                <Text
                  style={[
                    styles.roleTabSub,
                    selectedRole === 'CITIZEN' && {
                      color: 'rgba(242,240,233,0.8)',
                    },
                  ]}
                >
                  Abrir e acompanhar
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleTab,
                selectedRole === 'AGENT' && styles.roleTabActiveMoss,
              ]}
              onPress={() => handleSelectRoleTab('AGENT')}
              activeOpacity={0.85}
            >
              <Ionicons
                name="construct"
                size={18}
                color={
                  selectedRole === 'AGENT' ? COLORS.cream : COLORS.charcoal
                }
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.roleTabTitle,
                    selectedRole === 'AGENT' && { color: COLORS.cream },
                  ]}
                >
                  Sou Agente
                </Text>
                <Text
                  style={[
                    styles.roleTabSub,
                    selectedRole === 'AGENT' && {
                      color: 'rgba(242,240,233,0.8)',
                    },
                  ]}
                >
                  Atender chamados
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Role Context Explanation */}
          <View style={styles.roleHintBox}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={COLORS.moss}
            />
            <Text style={styles.roleHintText}>
              {selectedRole === 'CITIZEN'
                ? 'No perfil Cidadão você pode enviar fotos de buracos, lixo ou postes apagados e ver o status de cada chamado.'
                : 'No perfil Agente você visualiza a fila de problemas do bairro (incluindo alertas do Poste Inteligente) e atualiza o andamento.'}
            </Text>
          </View>

          {/* Login Form Inputs */}
          <Text style={styles.sectionLabel}>2. CREDENCIAIS DE ACESSO</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Nome de Exibição</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={16}
                color={COLORS.charcoalMuted}
              />
              <TextInput
                style={styles.textInput}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Digite seu nome"
                placeholderTextColor={COLORS.charcoalMuted}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>
              {selectedRole === 'CITIZEN'
                ? 'E-mail ou CPF do Morador'
                : 'E-mail Institucional ou Matrícula'}
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={16}
                color={COLORS.charcoalMuted}
              />
              <TextInput
                style={styles.textInput}
                value={identifierInput}
                onChangeText={setIdentifierInput}
                autoCapitalize="none"
                placeholder="seu.email@exemplo.com"
                placeholderTextColor={COLORS.charcoalMuted}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color={COLORS.charcoalMuted}
              />
              <TextInput
                style={styles.textInput}
                value={passwordInput}
                onChangeText={setPasswordInput}
                secureTextEntry={!showPassword}
                placeholder="Digite sua senha"
                placeholderTextColor={COLORS.charcoalMuted}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={COLORS.charcoalMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

          {/* Main Submit Button */}
          <TouchableOpacity
            style={[
              styles.loginSubmitBtn,
              selectedRole === 'AGENT' && { backgroundColor: COLORS.charcoal },
            ]}
            onPress={handleFormLogin}
            activeOpacity={0.86}
          >
            <Text style={styles.loginSubmitText}>
              {selectedRole === 'CITIZEN'
                ? 'Entrar como Cidadão'
                : 'Entrar no Painel do Agente'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.cream} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 28,
  },
  centerStage: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBox: {
    width: 50,
    height: 50,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.moss,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  appTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.charcoal,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  appSubtitle: {
    fontFamily: FONTS.sansRegular,
    fontSize: 13,
    color: COLORS.charcoalMuted,
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 19,
  },
  loginCard: {
    backgroundColor: COLORS.creamElevated,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.lg,
    padding: 22,
    ...SHADOWS.card,
  },
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.moss,
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  roleTabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.md,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
  },
  roleTabActiveMoss: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.mossDark,
  },
  roleTabTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.charcoal,
  },
  roleTabSub: {
    fontFamily: FONTS.sansRegular,
    fontSize: 11,
    color: COLORS.charcoalMuted,
    marginTop: 1,
  },
  roleHintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.mossMuted,
    borderRadius: RADII.md,
    padding: 11,
    gap: 8,
    marginBottom: 18,
  },
  roleHintText: {
    flex: 1,
    fontFamily: FONTS.sansRegular,
    fontSize: 12,
    color: COLORS.mossDark,
    lineHeight: 17,
  },
  fieldGroup: {
    marginBottom: 13,
  },
  inputLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal,
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.creamBorder,
    borderRadius: RADII.md,
    paddingHorizontal: 12,
    gap: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 11,
    fontFamily: FONTS.sansRegular,
    fontSize: 14,
    color: COLORS.charcoal,
  },
  eyeBtn: {
    padding: 4,
  },
  errorText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    color: COLORS.clay,
    marginBottom: 10,
  },
  loginSubmitBtn: {
    marginTop: 6,
    backgroundColor: COLORS.clay,
    borderRadius: RADII.md,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginSubmitText: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.cream,
  },
  systemStatusBox: {
    marginTop: 16,
    backgroundColor: COLORS.charcoal,
    borderRadius: RADII.md,
    padding: 14,
  },
  statusLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  statusBoxTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.cream,
    flex: 1,
  },
  statusBoxSub: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: 'rgba(242, 240, 233, 0.65)',
  },
});
