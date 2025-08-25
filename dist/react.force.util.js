"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeoutPromiser = void 0;
const react_native_timer_1 = __importDefault(require("react-native-timer"));
const timeoutPromiser = (millis) => {
    return new Promise((resolve) => {
        react_native_timer_1.default.setTimeout("timeoutTimer", () => {
            resolve();
        }, millis);
    });
};
exports.timeoutPromiser = timeoutPromiser;
//# sourceMappingURL=react.force.util.js.map