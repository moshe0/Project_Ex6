"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function GetType(Obj) {
    for (let propName in Obj) {
        if (propName === 'Members')
            return 'group';
    }
    return 'user';
}
exports.GetType = GetType;
//# sourceMappingURL=MainHelpers.js.map