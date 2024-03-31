import * as React from 'react';
import { createContext, useContext, useCallback } from 'react';
import { getNameAndIndexKey } from '../utils';
var ValidationsContext = createContext(null);
export function ValidationsProvider(_a) {
    var children = _a.children, _b = _a.validations, validations = _b === void 0 ? {} : _b;
    var getValidation = useCallback(function (_name) {
        var name = getNameAndIndexKey(_name).name;
        return validations === null || validations === void 0 ? void 0 : validations[name];
    }, [validations]);
    return (React.createElement(ValidationsContext.Provider, { value: { validations: validations, getValidation: getValidation } }, children));
}
export function useValidations() {
    var context = useContext(ValidationsContext);
    if (!context) {
        console.error('useValidations must be used within a ValidationsProvider');
    }
    return context;
}
