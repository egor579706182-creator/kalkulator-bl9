import React, { useState, useCallback, useEffect } from 'react';
import { CalculatorState, Operation, ButtonVariant } from '../types';
import { Button } from './Button';
import { Delete } from 'lucide-react';

const INITIAL_STATE: CalculatorState = {
  currentOperand: '0',
  previousOperand: '',
  operation: null,
  overwrite: false,
};

export const Calculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

  const formatOperand = (operand: string) => {
    if (operand === '') return '';
    if (operand === '-') return '-';
    // Split by decimal to format integer part
    const [integer, decimal] = operand.split('.');
    if (decimal == null) {
      return new Intl.NumberFormat('ru-RU').format(BigInt(integer));
    }
    return `${new Intl.NumberFormat('ru-RU').format(BigInt(integer))}.${decimal}`;
  };

  const addDigit = useCallback((digit: string) => {
    setState(prev => {
      if (prev.overwrite) {
        return {
          ...prev,
          currentOperand: digit,
          overwrite: false,
        };
      }
      if (digit === '0' && prev.currentOperand === '0') return prev;
      if (digit === '.' && prev.currentOperand.includes('.')) return prev;
      if (prev.currentOperand === '0' && digit !== '.') {
        return { ...prev, currentOperand: digit };
      }
      
      // Limit length to prevent overflow
      if (prev.currentOperand.length > 12) return prev;

      return {
        ...prev,
        currentOperand: `${prev.currentOperand}${digit}`,
      };
    });
  }, []);

  const clear = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const deleteDigit = useCallback(() => {
    setState(prev => {
      if (prev.overwrite) {
        return {
          ...prev,
          currentOperand: '0',
          overwrite: false,
        };
      }
      if (prev.currentOperand.length === 1) {
        return { ...prev, currentOperand: '0' };
      }
      return {
        ...prev,
        currentOperand: prev.currentOperand.slice(0, -1),
      };
    });
  }, []);

  const evaluate = (state: CalculatorState): string => {
    const prev = parseFloat(state.previousOperand);
    const current = parseFloat(state.currentOperand);
    if (isNaN(prev) || isNaN(current)) return '';
    let computation = 0;
    switch (state.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        if (current === 0) return 'Error';
        computation = prev / current;
        break;
    }
    // Round to avoid floating point issues, convert back to string
    return computation.toString();
  };

  const chooseOperation = useCallback((operation: Operation) => {
    setState(prev => {
      if (prev.currentOperand === 'Error') return INITIAL_STATE;
      
      if (prev.currentOperand === '' && prev.previousOperand === '') return prev;

      if (prev.previousOperand !== '') {
        // If we switch operation before entering new number
        if (prev.overwrite) {
            return {
                ...prev,
                operation: operation
            }
        }
        
        const result = evaluate(prev);
        return {
          previousOperand: result,
          operation,
          currentOperand: result,
          overwrite: true,
        };
      }

      return {
        operation,
        previousOperand: prev.currentOperand,
        currentOperand: prev.currentOperand,
        overwrite: true,
      };
    });
  }, []);

  const calculateResult = useCallback(() => {
    setState(prev => {
      if (prev.operation == null || prev.previousOperand === '') return prev;

      const result = evaluate(prev);
      return {
        overwrite: true,
        previousOperand: '',
        operation: null,
        currentOperand: result,
      };
    });
  }, []);

  const handlePercent = useCallback(() => {
      setState(prev => {
          const current = parseFloat(prev.currentOperand);
          if (isNaN(current)) return prev;
          return {
              ...prev,
              currentOperand: (current / 100).toString(),
              overwrite: true
          }
      })
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') addDigit(e.key);
      if (e.key === '.') addDigit('.');
      if (e.key === '=' || e.key === 'Enter') calculateResult();
      if (e.key === 'Backspace') deleteDigit();
      if (e.key === 'Escape') clear();
      if (e.key === '+') chooseOperation('+');
      if (e.key === '-') chooseOperation('-');
      if (e.key === '*') chooseOperation('*');
      if (e.key === '/') chooseOperation('/');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addDigit, calculateResult, deleteDigit, clear, chooseOperation]);


  return (
    <div className="w-full max-w-sm bg-black rounded-[3rem] p-6 shadow-2xl border border-gray-800">
      {/* Display Screen */}
      <div className="flex flex-col items-end justify-end h-32 mb-4 px-4 break-all">
        <div className="text-gray-400 text-lg h-6 font-medium">
          {state.previousOperand !== '' && (
              <>
              {formatOperand(state.previousOperand)} {state.operation}
              </>
          )}
        </div>
        <div className={`text-white font-light tracking-wide ${state.currentOperand.length > 8 ? 'text-4xl' : 'text-6xl'}`}>
          {formatOperand(state.currentOperand)}
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        <Button label="AC" onClick={clear} variant={ButtonVariant.SECONDARY} />
        <Button label={<Delete size={24} />} onClick={deleteDigit} variant={ButtonVariant.SECONDARY} />
        <Button label="%" onClick={handlePercent} variant={ButtonVariant.SECONDARY} />
        <Button label="÷" onClick={() => chooseOperation('/')} variant={ButtonVariant.ACCENT} />

        <Button label="7" onClick={() => addDigit('7')} />
        <Button label="8" onClick={() => addDigit('8')} />
        <Button label="9" onClick={() => addDigit('9')} />
        <Button label="×" onClick={() => chooseOperation('*')} variant={ButtonVariant.ACCENT} />

        <Button label="4" onClick={() => addDigit('4')} />
        <Button label="5" onClick={() => addDigit('5')} />
        <Button label="6" onClick={() => addDigit('6')} />
        <Button label="-" onClick={() => chooseOperation('-')} variant={ButtonVariant.ACCENT} />

        <Button label="1" onClick={() => addDigit('1')} />
        <Button label="2" onClick={() => addDigit('2')} />
        <Button label="3" onClick={() => addDigit('3')} />
        <Button label="+" onClick={() => chooseOperation('+')} variant={ButtonVariant.ACCENT} />

        <Button label="0" onClick={() => addDigit('0')} className="col-span-2 w-full !rounded-full aspect-auto pl-8 !justify-start" />
        <Button label="." onClick={() => addDigit('.')} />
        <Button label="=" onClick={calculateResult} variant={ButtonVariant.ACCENT} />
      </div>
    </div>
  );
};