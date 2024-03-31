"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidations = exports.ValidationsProvider = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var utils_1 = require("../utils");
var ValidationsContext = (0, react_1.createContext)(null);
function ValidationsProvider(_a) {
    var children = _a.children, _b = _a.validations, validations = _b === void 0 ? {} : _b;
    var getValidation = (0, react_1.useCallback)(function (_name) {
        var name = (0, utils_1.getNameAndIndexKey)(_name).name;
        return validations === null || validations === void 0 ? void 0 : validations[name];
    }, [validations]);
    return (React.createElement(ValidationsContext.Provider, { value: { validations: validations, getValidation: getValidation } }, children));
}
exports.ValidationsProvider = ValidationsProvider;
function useValidations() {
    var context = (0, react_1.useContext)(ValidationsContext);
    if (!context) {
        console.error('useValidations must be used within a ValidationsProvider');
    }
    return context;
}
exports.useValidations = useValidations;
