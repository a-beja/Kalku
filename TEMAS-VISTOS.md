# Temas vistos

## Resumen

- **Expo Router:** `Slot` muestra la pantalla de la ruta.
- **Hooks:** `useState` guarda fórmula, resultado y visibilidad; `useEffect` recalcula y gestiona la suscripción al sensor; `useFonts` carga SpaceMono; `useCalculator` y `useShake` encapsulan lógica reutilizable.
- **Funciones de la calculadora:** `buildFormula`, `clean`, `deleteLast` y `newStart` gestionan las acciones; `getLastNumber` y `calculateResult` apoyan el cálculo.
- **Callbacks:** `onPress` conecta el botón con una acción; `onRequestClose` cierra el modal; `onShake` responde al movimiento. No hay `onLongPress`.
- **Métodos y utilidades:** `split`, `slice`, `includes`, `map`, `filter` y `replace` manipulan la fórmula; `evaluate` calcula la expresión; `toFixed` limita decimales. `addListener` y `remove` gestionan el sensor; `Dimensions.get` mide la pantalla.
- **React Native:** `View`, `Text`, `Pressable` y `Modal` forman la interfaz.
- **TypeScript:** interfaces y tipos limitan las props y opciones permitidas.
- **Estilos:** `StyleSheet.create` agrupa estilos; arreglos y callbacks permiten combinarlos y cambiarlos dinámicamente.
- **Expo:** `expo-font`, `expo-haptics` y `expo-sensors` cargan fuentes, dan respuesta háptica y leen el acelerómetro.
- **Plataforma:** `Platform.OS` evita usar el acelerómetro en web; no hay lógica separada para iOS y Android.
- **Bun:** `bun.lock` registra dependencias y Bun ejecuta los scripts del proyecto.

## 1. Archivos principales

- **Pantalla y layout:** [app/index.tsx](./app/index.tsx) muestra la calculadora; [app/_layout.tsx](./app/_layout.tsx) carga la fuente y monta ruta, modal y barra de estado.
  ```tsx
  <Slot />
  <ShakeModal />
  ```
- **Componentes:** [components/CalculatorButton.tsx](./components/CalculatorButton.tsx), [components/ThemeText.tsx](./components/ThemeText.tsx) y [components/ShakeModal.tsx](./components/ShakeModal.tsx) encapsulan botones, texto temático y modal.
- **Lógica:** [hooks/useCalculator.tsx](./hooks/useCalculator.tsx) y [hooks/useShaker.tsx](./hooks/useShaker.tsx) contienen los hooks personalizados.
- **Estilos y constantes:** [styles/global-styles.ts](./styles/global-styles.ts), [constants/theme.ts](./constants/theme.ts), [constants/fonts.ts](./constants/fonts.ts) y [constants/calculator.ts](./constants/calculator.ts).

## 2. React y TS

- **Estado y setters:** `useState` guarda fórmula y resultado; `setFormula` y `setResult` los actualizan. En `ShakeModal`, `visible` controla la apertura.
  ```tsx
  const [formula, setFormula] = useState('0');
  setFormula(formula + newDigit);
  ```
- **Efectos:** `useEffect` vuelve a calcular al cambiar la fórmula; en `useShake` crea y limpia la suscripción al acelerómetro.
  ```tsx
  useEffect(() => { if (formula !== '0') calculateResult(); }, [formula]);
  ```
- **Funciones de acción:** `buildFormula` agrega o reemplaza caracteres; `clean` reinicia; `deleteLast` borra; `newStart` pasa el resultado a la fórmula. `getLastNumber` y `calculateResult` son funciones internas del hook.
  ```tsx
  const clean = () => { setFormula('0'); setResult('0'); };
  ```
- **Props e interfaces:** `CalculatorButton` requiere `label` y callback `onPress`; `color`, `blackText` y `doubleSize` son opcionales. Valores predeterminados: `'darkGray'`, `false` y `false`.
  ```tsx
  interface Props {
    label: string;
    color?: 'lightGray' | 'darkGray' | 'cherry' | 'blueberry';
    blackText?: boolean;
    doubleSize?: boolean;
    onPress: () => void;
  }
  const CalculatorButton = ({
    label,
    color = 'darkGray',
    blackText = false,
    doubleSize = false,
    onPress
  }: Props) => {
  ```
- **Tipos extendidos:** `ThemeText` extiende `TextProps` y agrega `variant` y `children`.
  ```tsx
  interface Props extends TextProps { variant?: 'h1' | 'h2'; children: string; }
  ```
- **Callbacks:** `onPress`, `onRequestClose` y la función `onShake` son callbacks, no métodos de clase.
  ```tsx
  onPress={() => buildFormula('7')}
  useShake(() => setVisible(true));
  ```
- **Procesamiento y cálculo:** `split` separa operadores; `slice` recorta; `includes` comprueba; `map` genera texto coloreado; `filter` cuenta operandos; `replace` adapta signos para `evaluate`.
  ```tsx
  expr.replace(/x/g, '*').replace(/÷/g, '/');
  ```
  `toFixed(5)`, `parseFloat` y `toString` preparan el resultado mostrado.

## 3. Componentes de RN

- **Estructura y texto:** `View` agrupa elementos y `Text` muestra contenido.
  ```tsx
  <View style={globalStyles.row}>
  ```
- **Pressable, callbacks y háptica:** el callback de estilo recibe `pressed`; `onPress` ejecuta la vibración y luego la acción recibida. No se usa `onLongPress`.
  ```tsx
  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  ```
- **Modal:** `visible` controla su estado; `onRequestClose` y el callback `onPress` del botón llaman a `close`.
  ```tsx
  <Modal visible={visible} transparent onRequestClose={close}>
  ```
- **Texto adaptable y barra:** `numberOfLines` limita líneas; `adjustsFontSizeToFit` ajusta texto; `StatusBar` usa estilo claro.
  ```tsx
  numberOfLines={3}
  adjustsFontSizeToFit
  ```

## 4. Estilos y diseño

- **Estilos globales:** `StyleSheet.create` agrupa estilos; [constants/theme.ts](./constants/theme.ts) y [constants/fonts.ts](./constants/fonts.ts) centralizan colores y tipografía.
  ```tsx
  export const globalStyles = StyleSheet.create({ background: { flex: 1 } });
  ```
- **Estilos combinados y dinámicos:** `ThemeText` pasa un arreglo; el botón modal añade el estilo presionado condicionalmente.
  ```tsx
  style={[globalStyles.buttonModal, pressed && globalStyles.buttonModalPressed]}
  ```
  En el botón calculadora, `pressed`, `color` y `doubleSize` determinan opacidad, color y ancho.
- **Dimensiones:** `Dimensions.get('window')` determina el tamaño base de los botones.
  ```tsx
  const buttonSize = (width - 80) / 4;
  ```
- **Colores constantes:** `as const` conserva los valores literales del tema.
  ```tsx
  export const Colors = { darkGray: '#2D2D2D' } as const;
  ```

## 5. Expo y configuración

- **Fuente personalizada:** `useFonts` carga SpaceMono; hasta que termina, el layout devuelve `null`.
  ```tsx
  const [loaded] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf') });
  ```
- **Sensor y plataforma:** `Accelerometer.addListener` escucha movimiento; `Math.sqrt` calcula su magnitud y `sub.remove()` limpia la suscripción. `Platform.OS` omite el sensor en web; no hay ramas específicas para iOS o Android.
  ```tsx
  if (Platform.OS === 'web') return;
  ```
- **Paquetes:** `expo-haptics` está declarado en [package.json](./package.json) y se importa para la respuesta háptica; `bun.lock` registra las dependencias. El repositorio no muestra el comando con que se instaló.
- **Configuración:** [app.json](./app.json) define Expo Router, splash screen, orientación vertical, web estática y rutas tipadas. [package.json](./package.json) declara Expo `~54.0.34`; [eas.json](./eas.json) define perfiles development, preview y production.
- **Bun:** [package.json](./package.json) declara los scripts; por ejemplo, `bun run start` y `bun run lint`. `bun.lock` guarda el lockfile.
- **Código no usado:** no se identificó estado relevante sin uso; `onLongPress` no está implementado.
