export interface ColorSuggestion {
  name: string;
  colors: {
    [key: string]: string | boolean | number | undefined;
    // Core color properties
    primaryColor: string;
    primaryDarkColor: string;
    primaryLightColor: string;
    secondaryColor: string;
    secondaryDarkColor: string;
    secondaryLightColor: string;
    tertiaryColor: string;
    tertiaryDarkColor: string;
    tertiaryLightColor: string;
    
    // Extended properties for Glass Liquid and other schemes
    backgroundColor?: string;
    backgroundSecondaryColor?: string;
    borderColor?: string;
    textPrimaryColor?: string;
    textSecondaryColor?: string;
    textMutedColor?: string;
    dangerColor?: string;
    successColor?: string;
    warningColor?: string;
    infoColor?: string;
    
    // Typography
    fontFamily?: string;
    fontSize?: string;
    fontSizeSmall?: string;
    fontSizeLarge?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    
    // Visual effects
    textShadow?: string;
    borderRadius?: string;
    borderRadiusSmall?: string;
    borderRadiusLarge?: string;
    boxShadow?: string;
    backdropBlur?: string;
    backgroundOpacity?: string;
    glassEffect?: boolean;
    
    // Input styles
    inputBackgroundColor?: string;
    inputBorderColor?: string;
    inputFocusColor?: string;
    inputPadding?: string;
  };
  description: string;
}

export class ColorHarmonyGenerator {
  
  /**
   * Convierte un color hex a HSL
   */
  static hexToHsl(hex: string): { h: number; s: number; l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  /**
   * Convierte HSL a hex
   */
  static hslToHex(h: number, s: number, l: number): string {
    h = h % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`.toUpperCase();
  }

  /**
   * Ajusta la saturación y luminosidad de un color
   */
  static adjustColor(hex: string, saturationDelta = 0, lightnessDelta = 0): string {
    const { h, s, l } = this.hexToHsl(hex);
    const newS = Math.max(0, Math.min(100, s + saturationDelta));
    const newL = Math.max(0, Math.min(100, l + lightnessDelta));
    return this.hslToHex(h, newS, newL);
  }

  /**
   * Genera colores complementarios (opuestos en el círculo cromático)
   */
  static generateComplementary(baseColor: string): ColorSuggestion {
    const { h, s, l } = this.hexToHsl(baseColor);
    const complementaryH = (h + 180) % 360;
    
    const primaryColor = baseColor;
    const primaryDark = this.adjustColor(baseColor, 0, -20);
    const primaryLight = this.adjustColor(baseColor, -30, 30);
    
    const secondaryColor = this.hslToHex(complementaryH, s, l);
    const secondaryDark = this.adjustColor(secondaryColor, 0, -20);
    const secondaryLight = this.adjustColor(secondaryColor, -30, 30);

    return {
      name: 'Esquema Complementario',
      description: 'Colores opuestos que crean alto contraste y vibración visual',
      colors: {
        primaryColor,
        primaryDarkColor: primaryDark,
        primaryLightColor: primaryLight,
        secondaryColor,
        secondaryDarkColor: secondaryDark,
        secondaryLightColor: secondaryLight,
        tertiaryColor: this.hslToHex((h + 60) % 360, Math.max(40, s - 20), Math.max(30, l - 10)),
        tertiaryDarkColor: this.hslToHex((h + 60) % 360, Math.max(50, s - 10), Math.max(20, l - 20)),
        tertiaryLightColor: this.hslToHex((h + 60) % 360, Math.max(20, s - 40), Math.min(80, l + 20))
      }
    };
  }

  /**
   * Genera colores triádicos (3 colores equidistantes)
   */
  static generateTriadic(baseColor: string): ColorSuggestion {
    const { h, s, l } = this.hexToHsl(baseColor);
    
    const primaryColor = baseColor;
    const primaryDark = this.adjustColor(baseColor, 0, -20);
    const primaryLight = this.adjustColor(baseColor, -30, 30);
    
    const secondaryColor = this.hslToHex((h + 120) % 360, s, l);
    const secondaryDark = this.adjustColor(secondaryColor, 0, -20);
    const secondaryLight = this.adjustColor(secondaryColor, -30, 30);
    
    const tertiaryColor = this.hslToHex((h + 240) % 360, s, l);
    const tertiaryDark = this.adjustColor(tertiaryColor, 0, -20);
    const tertiaryLight = this.adjustColor(tertiaryColor, -30, 30);

    return {
      name: 'Esquema Triádico',
      description: 'Tres colores equidistantes que crean armonía vibrante y equilibrada',
      colors: {
        primaryColor,
        primaryDarkColor: primaryDark,
        primaryLightColor: primaryLight,
        secondaryColor,
        secondaryDarkColor: secondaryDark,
        secondaryLightColor: secondaryLight,
        tertiaryColor,
        tertiaryDarkColor: tertiaryDark,
        tertiaryLightColor: tertiaryLight
      }
    };
  }

  /**
   * Genera colores análogos (vecinos en el círculo cromático)
   */
  static generateAnalogous(baseColor: string): ColorSuggestion {
    const { h, s, l } = this.hexToHsl(baseColor);
    
    const primaryColor = baseColor;
    const primaryDark = this.adjustColor(baseColor, 0, -20);
    const primaryLight = this.adjustColor(baseColor, -30, 30);
    
    const secondaryColor = this.hslToHex((h + 30) % 360, s, l);
    const secondaryDark = this.adjustColor(secondaryColor, 0, -20);
    const secondaryLight = this.adjustColor(secondaryColor, -30, 30);
    
    const tertiaryColor = this.hslToHex((h - 30 + 360) % 360, s, l);
    const tertiaryDark = this.adjustColor(tertiaryColor, 0, -20);
    const tertiaryLight = this.adjustColor(tertiaryColor, -30, 30);

    return {
      name: 'Esquema Análogo',
      description: 'Colores vecinos que crean armonía suave y natural',
      colors: {
        primaryColor,
        primaryDarkColor: primaryDark,
        primaryLightColor: primaryLight,
        secondaryColor,
        secondaryDarkColor: secondaryDark,
        secondaryLightColor: secondaryLight,
        tertiaryColor,
        tertiaryDarkColor: tertiaryDark,
        tertiaryLightColor: tertiaryLight
      }
    };
  }

  /**
   * Genera una paleta monocromática (variaciones del mismo color)
   */
  static generateMonochromatic(baseColor: string): ColorSuggestion {
    const { h, s, l } = this.hexToHsl(baseColor);
    
    const primaryColor = baseColor;
    const primaryDark = this.hslToHex(h, Math.min(100, s + 20), Math.max(10, l - 30));
    const primaryLight = this.hslToHex(h, Math.max(10, s - 40), Math.min(90, l + 40));
    
    const secondaryColor = this.hslToHex(h, Math.max(30, s - 10), Math.max(20, l - 15));
    const secondaryDark = this.hslToHex(h, Math.min(100, s + 10), Math.max(5, l - 40));
    const secondaryLight = this.hslToHex(h, Math.max(15, s - 30), Math.min(85, l + 30));
    
    const tertiaryColor = this.hslToHex(h, Math.max(40, s - 5), Math.min(70, l + 10));
    const tertiaryDark = this.hslToHex(h, Math.min(90, s + 15), Math.max(15, l - 25));
    const tertiaryLight = this.hslToHex(h, Math.max(20, s - 35), Math.min(80, l + 25));

    return {
      name: 'Esquema Monocromático',
      description: 'Variaciones elegantes del mismo color con diferentes saturaciones y luminosidades',
      colors: {
        primaryColor,
        primaryDarkColor: primaryDark,
        primaryLightColor: primaryLight,
        secondaryColor,
        secondaryDarkColor: secondaryDark,
        secondaryLightColor: secondaryLight,
        tertiaryColor,
        tertiaryDarkColor: tertiaryDark,
        tertiaryLightColor: tertiaryLight
      }
    };
  }

  /**
   * Genera un esquema Glass/Liquid con efectos translúcidos y cristalinos
   */
  static generateGlassLiquid(baseColor: string): ColorSuggestion {
    const { h, s, l } = this.hexToHsl(baseColor);
    
    // Colores primarios con efecto cristal - alta luminosidad, baja saturación
    const primaryColor = this.hslToHex(h, Math.max(20, s - 30), Math.min(85, l + 15));
    const primaryDark = this.hslToHex(h, Math.max(40, s - 10), Math.max(25, l - 20));
    const primaryLight = this.hslToHex(h, Math.max(10, s - 50), Math.min(95, l + 25));
    
    // Colores secundarios con toque líquido - tonos azul/cyan para efecto glass
    const glassH = (h + 180) % 360; // Usar complementario pero suavizado
    const secondaryColor = this.hslToHex(glassH, Math.max(15, s - 40), Math.min(80, l + 10));
    const secondaryDark = this.hslToHex(glassH, Math.max(30, s - 20), Math.max(30, l - 15));
    const secondaryLight = this.hslToHex(glassH, Math.max(5, s - 55), Math.min(92, l + 20));
    
    // Colores terciarios con efecto holográfico - tonos iridiscentes
    const iridiscentH = (h + 60) % 360;
    const tertiaryColor = this.hslToHex(iridiscentH, Math.max(25, s - 35), Math.min(75, l + 5));
    const tertiaryDark = this.hslToHex(iridiscentH, Math.max(45, s - 15), Math.max(35, l - 10));
    const tertiaryLight = this.hslToHex(iridiscentH, Math.max(8, s - 52), Math.min(90, l + 18));

    return {
      name: 'Esquema Glass Liquid',
      description: 'Paleta translúcida con efectos cristalinos y líquidos, perfecta para glassmorphism',
      colors: {
        // Core colors
        primaryColor,
        primaryDarkColor: primaryDark,
        primaryLightColor: primaryLight,
        secondaryColor,
        secondaryDarkColor: secondaryDark,
        secondaryLightColor: secondaryLight,
        tertiaryColor,
        tertiaryDarkColor: tertiaryDark,
        tertiaryLightColor: tertiaryLight,
        
        // Background colors with transparency
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backgroundSecondaryColor: 'rgba(248, 250, 252, 0.7)',
        borderColor: 'rgba(255, 255, 255, 0.18)',
        
        // Text colors optimized for glass effect
        textPrimaryColor: '#1a202c',
        textSecondaryColor: '#4a5568',
        textMutedColor: '#718096',
        
        // Status colors with glass effect
        dangerColor: '#f56565',
        successColor: '#48bb78',
        warningColor: '#ed8936',
        infoColor: '#4299e1',
        
        // Typography optimized for glass
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontSize: '16px',
        fontSizeSmall: '14px',
        fontSizeLarge: '18px',
        fontWeight: '400',
        lineHeight: '1.6',
        letterSpacing: '0.2px',
        
        // Glass visual effects
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        borderRadius: '16px',
        borderRadiusSmall: '8px',
        borderRadiusLarge: '24px',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
        backdropBlur: '12px',
        backgroundOpacity: '0.85',
        glassEffect: true,
        
        // Input styles for glass theme
        inputBackgroundColor: 'rgba(255, 255, 255, 0.25)',
        inputBorderColor: 'rgba(255, 255, 255, 0.18)',
        inputFocusColor: primaryColor,
        inputPadding: '14px 18px'
      }
    };
  }

  /**
   * Genera todas las sugerencias posibles para un color base
   */
  static generateAllSuggestions(baseColor: string): ColorSuggestion[] {
    if (!baseColor || !baseColor.match(/^#[0-9A-Fa-f]{6}$/)) {
      return [];
    }

    return [
      this.generateComplementary(baseColor),
      this.generateTriadic(baseColor),
      this.generateAnalogous(baseColor),
      this.generateMonochromatic(baseColor),
      this.generateGlassLiquid(baseColor)
    ];
  }

  /**
   * Genera colores de estado automáticos basados en el color primario
   */
  static generateStatusColors(baseColor: string): { [key: string]: string } {
    const { h } = this.hexToHsl(baseColor);
    
    return {
      successColor: this.hslToHex(120, 60, 50), // Verde
      warningColor: this.hslToHex(45, 90, 55),  // Amarillo/Naranja
      dangerColor: this.hslToHex(0, 70, 55),    // Rojo
      infoColor: baseColor // Usar el color base como info
    };
  }

  /**
   * Genera colores de fondo y texto automáticos
   */
  static generateBackgroundAndTextColors(): { [key: string]: string } {
    return {
      backgroundColor: '#FFFFFF',
      backgroundSecondaryColor: '#F8FAFC',
      borderColor: '#E2E8F0',
      textPrimaryColor: '#111827',
      textSecondaryColor: '#6B7280',
      textMutedColor: '#9CA3AF'
    };
  }
}