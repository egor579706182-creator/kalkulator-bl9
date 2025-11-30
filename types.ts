export type Operation = '+' | '-' | '*' | '/' | null;

export interface CalculatorState {
  currentOperand: string;
  previousOperand: string;
  operation: Operation;
  overwrite: boolean;
}

export enum ButtonVariant {
  PRIMARY = 'primary',   // Numbers
  SECONDARY = 'secondary', // Top row (AC, +/-)
  ACCENT = 'accent',     // Operations (+, -, =)
}