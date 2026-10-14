import { CALCULATOR_OPERATORS, OPERATOR_REGEX } from "@/constants/calculator";
import { evaluate } from 'mathjs';
import { useEffect, useState } from "react";


export const useCalculator = () => {

    const [formula, setFormula] = useState('0');
    const [result, setResult] = useState('0');

    
    useEffect(() => {
        if( formula !== '0' ){
            calculateResult();
        }
    }, [formula] );


    const getLastNumber = (): string => {
        // Separate each number (splited by operators) to get the last one
        const parts = formula.split(OPERATOR_REGEX);
        return parts[ parts.length - 1 ];
    }

    const clean = () => {
        setFormula('0');
        setResult('0');
    }

    const deleteLast = () => {
        if (formula.length === 1) {
            setFormula('0');
        } else {
            setFormula(formula.slice(0, -1));
        }
    }

    const buildFormula = ( newDigit: string ) => {
        let lastNumber = getLastNumber();

        // To avoid formula = operator ( except for "-")
        if( formula === '0' && ['x', '÷', '+'].includes( newDigit ) ) return;
        if( formula === '-' && ['x', '÷', '+'].includes( newDigit ) ) return;
        
        // To delete the first 0 when a new digit (not 0) is added, to have lastNumber = 5 instead = 05
        if( lastNumber === '0' && newDigit !== '.'){
            setFormula(formula.slice(0, -1) + newDigit);
            return;
        }

        // To put a 0 before a point when lastNumber is empty
        if( lastNumber === '' && newDigit === '.'){
            return setFormula( formula + '0' + newDigit );
        }

        // To avoid having more than one period
        if( lastNumber.includes('.') && newDigit === '.' ) return;

        // To avoid lastNumber = 0000 when it's not 0.000
        if( lastNumber === '0' && newDigit === '0') return;

        // To replace the last sign for the new one instead of adding it to the formula
        if( CALCULATOR_OPERATORS.includes(formula.slice(-1)) && CALCULATOR_OPERATORS.includes( newDigit ) ){
            setFormula( formula.slice(0, -1) + newDigit );
            return;
        }
    
        
        setFormula( formula + newDigit );
    }

    const calculateResult = () => {

        if( formula === '-' ) return;

        // To get the qty of the numeric values
        const parts = formula.split(OPERATOR_REGEX);
        const nonEmptyParts = parts.filter( part => part !== '' ).length;

        if( nonEmptyParts === 1 ){
            setResult('0');
            return;
        }

        let expr = formula;
        
        if( CALCULATOR_OPERATORS.includes( formula.slice(-1)) ){
            expr = expr.slice(0, -1);
        }

        const expression = expr
            .replace(/x/g, '*')
            .replace(/÷/g, '/');
        
        const res = evaluate(expression);
        const resFixed = parseFloat(res.toFixed(5));
        setResult( resFixed.toString() );
    }

    const newStart = () => {
        setFormula( result.toString() );
        setResult('0');
    }


    return {
        formula,
        result,

        buildFormula,
        clean,
        deleteLast,
        newStart,
    }
}