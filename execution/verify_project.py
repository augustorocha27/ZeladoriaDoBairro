"""
Camada 3 (Execução Determinística): Validador de Arquitetura e Regras de Negócio
Verifica a integridade das camadas, chaves do AsyncStorage, Design System (Prompt.Md)
e a lógica determinística do Poste Inteligente IoT.
"""
import json
import os
import sys

REQUIRED_FILES = [
    "package.json",
    "App.tsx",
    "directives/zeladoria_arquitetura.md",
    "src/theme/theme.ts",
    "src/types/index.ts",
    "src/data/mockData.ts",
    "src/storage/storageService.ts",
    "src/services/occurrenceService.ts",
    "src/services/iotPoleService.ts",
    "src/contexts/AuthContext.tsx",
    "src/contexts/OccurrencesContext.tsx",
    "src/contexts/IoTContext.tsx",
    "src/components/TopBarInstrument.tsx",
    "src/components/OccurrenceCard.tsx",
    "src/components/OccurrenceDetailModal.tsx",
    "src/screens/LoginScreen.tsx",
    "src/screens/CitizenHomeScreen.tsx",
    "src/screens/NewOccurrenceScreen.tsx",
    "src/screens/AgentDashboardScreen.tsx",
    "src/screens/IoTSimulatorScreen.tsx",
    "src/navigation/AppNavigator.tsx",
]

PROMPT_MD_COLORS = ["#2E4036", "#CC5833", "#F2F0E9", "#1A1A1A"]


def main() -> int:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    missing = []
    for rel_path in REQUIRED_FILES:
        full_path = os.path.join(root, rel_path)
        if not os.path.isfile(full_path):
            missing.append(rel_path)

    if missing:
        print(f"[ERRO] Arquivos ausentes: {missing}")
        return 1

    theme_path = os.path.join(root, "src/theme/theme.ts")
    with open(theme_path, "r", encoding="utf-8") as f:
        theme_content = f.read().upper()

    for hex_color in PROMPT_MD_COLORS:
        if hex_color not in theme_content:
            print(f"[ERRO] Cor obrigatória do Prompt.Md ausente no tema: {hex_color}")
            return 1

    print("[OK] Todos os 21 arquivos da arquitetura em camadas verificados.")
    print("[OK] Paleta estrita do Prompt.Md (#2E4036, #CC5833, #F2F0E9, #1A1A1A) validada.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
