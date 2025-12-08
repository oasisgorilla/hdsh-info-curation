/**
 * Hyundai Color System
 * 현대중공업그룹의 공식 브랜드 컬러 팔레트를 기반으로 한 통합 컬러 시스템
 */

// 브랜드 컬러 팔레트
export const hdPalette = {
  ecoGreen: {
    main: "#00E600",
    contrastText: "#ffffff",
  },
  heritageGreen: {
    main: "#00AD1D",
    contrastText: "#ffffff",
  },
  prosperityGreen: {
    main: "#008233",
    contrastText: "#ffffff",
  },
  discoveryBlue: {
    main: "#003087",
    contrastText: "#ffffff",
  },
  trustBlue: {
    main: "#002554",
    contrastText: "#ffffff",
  },
};

// 확장 컬러 시스템
export const colors = {
  // Primary: Trust Blue를 기본 Primary로 사용
  primary: {
    main: hdPalette.trustBlue.main,
    light: "#003087", // Discovery Blue
    dark: "#001F4D",
    contrastText: hdPalette.trustBlue.contrastText,
  },

  // Secondary: Heritage Green을 기본 Secondary로 사용
  secondary: {
    main: hdPalette.heritageGreen.main,
    light: "#00E600", // Eco Green
    dark: hdPalette.prosperityGreen.main,
    contrastText: hdPalette.heritageGreen.contrastText,
  },

  // 배경 색상
  background: {
    default: "#FAFAFA",
    paper: "#FFFFFF",
    grey: "#F5F5F5",
    lightGrey: "#F9FAFB",
  },

  // 텍스트 색상
  text: {
    primary: "#171717",
    secondary: "#525252",
    disabled: "#9CA3AF",
    white: "#FFFFFF",
  },

  // Border 색상
  border: {
    light: "#E5E7EB",
    main: "#D1D5DB",
    dark: "#9CA3AF",
  },

  // Status 색상
  status: {
    completed: {
      background: "#ECFDF5",
      text: "#047857",
      border: "#A7F3D0",
    },
    read: {
      background: "#F9FAFB",
      text: "#374151",
      border: "#E5E7EB",
    },
  },

  // Category 색상 (IssueBar 및 Tag에 사용)
  category: {
    domestic: {
      main: hdPalette.heritageGreen.main, // #00AD1D
      light: "#E8F5F1",
      text: hdPalette.heritageGreen.main,
      border: "#B8E5D7",
    },
    overseas: {
      main: "#1976D2",
      light: "#E3F2FD",
      text: "#1976D2",
      border: "#90CAF9",
    },
    china: {
      main: "#2D9CDB",
      light: "#E3F2FD",
      text: "#2D9CDB",
      border: "#90CAF9",
    },
    market: {
      main: "#F57C00",
      light: "#FFF3E0",
      text: "#F57C00",
      border: "#FFCC80",
    },
    risk: {
      main: "#F2994A",
      light: "#FFEBEE",
      text: "#C62828",
      border: "#EF9A9A",
    },
    rnd: {
      main: "#9B51E0",
      light: "#F3E5F5",
      text: "#7B1FA2",
      border: "#CE93D8",
    },
    regulation: {
      main: "#EB5757",
      light: "#FFF9C4",
      text: "#F57F17",
      border: "#FFF59D",
    },
  },

  // Issue/Keyword 타입별 색상
  issue: {
    major: {
      background: `rgba(0, 37, 84, 0.1)`, // Trust Blue 기반
      text: hdPalette.trustBlue.main,
      border: `rgba(0, 37, 84, 0.2)`,
    },
    category: {
      background: `rgba(0, 173, 29, 0.1)`, // Heritage Green 기반
      text: hdPalette.heritageGreen.main,
      border: `rgba(0, 173, 29, 0.2)`,
    },
    other: {
      background: "#F3F4F6",
      text: "#374151",
      border: "#E5E7EB",
    },
  },

  // UI 요소별 색상
  ui: {
    success: "#10B981",
    successHover: "#059669",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    // Hero Banner, Report 등에 사용되는 그라데이션
    gradient: {
      primary: `linear-gradient(to bottom right, ${hdPalette.trustBlue.main}, ${hdPalette.discoveryBlue.main}, #0056B8)`,
      secondary: `linear-gradient(to bottom right, ${hdPalette.trustBlue.main}, ${hdPalette.heritageGreen.main})`,
      overlay1: "linear-gradient(to bottom right, rgba(255,255,255,0.05), transparent)",
      overlay2: "linear-gradient(to top right, rgba(255,255,255,0.05), transparent)",
      weekBadge: "linear-gradient(to bottom right, #52525b, #3f3f46)",
      aiSummary: "linear-gradient(to bottom right, #EFF6FF, #F0F9FF)",
    },
  },

  // Grey Scale (MUI와 호환)
  grey: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Shadow
  shadow: {
    card: "0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
    button: "0 1px 2px rgba(0, 0, 0, 0.05)",
    focus: "0 4px 6px rgba(0, 0, 0, 0.05), 0 0 0 2px rgba(0, 37, 84, 0.1)",
  },
};

// 카테고리 이름을 키로 사용하는 매핑 (한글 지원)
export const categoryColorMap: Record<string, typeof colors.category.domestic> = {
  국내동향: colors.category.domestic,
  해외동향: colors.category.overseas,
  중국동향: colors.category.china,
  원자재·RISK: colors.category.risk,
  "기술·R&D": colors.category.rnd,
  정책·규제: colors.category.regulation,
};

// 타입 안전성을 위한 카테고리 타입
export type CategoryType = "domestic" | "overseas" | "china" | "market" | "risk" | "rnd" | "regulation";
export type IssueType = "major" | "category" | "other";
export type StatusType = "completed" | "read";
