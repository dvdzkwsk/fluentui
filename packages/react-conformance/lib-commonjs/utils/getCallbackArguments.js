"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getCallbackArguments", {
    enumerable: true,
    get: function() {
        return getCallbackArguments;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _typescript = /*#__PURE__*/ _interop_require_wildcard._(require("typescript"));
// ---
/**
 * Returns an identifier as a string.
 */ function identifierToString(node) {
    if (typeof node.escapedText !== 'string') {
        throw new Error('An identifier is not a string, this could be a bug or an unhandled scenario. Please report it if it happens');
    }
    return node.escapedText;
}
/**
 * Converts AST node that has "*Keyword" kind to a primitive value.
 */ function keywordNodeToPrimitive(node) {
    if (node.kind === _typescript.SyntaxKind.BooleanKeyword) {
        return 'boolean';
    }
    if (node.kind === _typescript.SyntaxKind.NumberKeyword) {
        return 'number';
    }
    if (node.kind === _typescript.SyntaxKind.StringKeyword) {
        return 'string';
    }
    if (node.kind === _typescript.SyntaxKind.UndefinedKeyword) {
        return undefined;
    }
    throw new Error([
        `Found unexpected ${node.kind} node: "${node.getText()}".`,
        'This could be a bug or an unhandled scenario, please report it if it happens'
    ].join(' '));
}
/**
 * Converts AST node with "LiteralType" that has "*Keyword" kind to a primitive value.
 */ function literalNodeToPrimitive(node) {
    if (node.kind === _typescript.SyntaxKind.NullKeyword) {
        return null;
    }
    if (node.kind === _typescript.SyntaxKind.FalseKeyword) {
        return false;
    }
    if (node.kind === _typescript.SyntaxKind.TrueKeyword) {
        return true;
    }
    if (node.kind === _typescript.SyntaxKind.StringLiteral) {
        return node.getText();
    }
    throw new Error(`Unexpected kind of node is passed (${node.kind}), this could be a bug or an unhandled scenario. ` + `Please report it if it happens.`);
}
// ---
/**
 * Parses an argument in a callback.
 *
 * @example
 * {
 *   onToggle: (event: Event, data: Data) => void
 *              ^             ^
 *              parses these nodes
 * }
 */ function parseArgumentName(name) {
    if (!name) {
        throw new Error(`We received ${typeof name} instead of a node from TS AST, please report this if it happens`);
    }
    if (!_typescript.isIdentifier(name)) {
        throw new Error([
            'An argument in a callback should be an identifier',
            'This could be a bug or an unhandled scenario. Please report it if it happens'
        ].join(' '));
    }
    return identifierToString(name);
}
/**
 * TS does not export "IntrinsicType".
 * See https://github.com/microsoft/TypeScript/issues/22269
 */ function isIntrinsicType(type) {
    return Object.prototype.hasOwnProperty.call(type, 'intrinsicName');
}
function typeHasSubtypes(type) {
    return Array.isArray(type.types);
}
function typeToString(typeChecker, type) {
    var _type_symbol_declarations, _type_symbol;
    if (isIntrinsicType(type)) {
        return type.intrinsicName;
    }
    if ((_type_symbol = type.symbol) === null || _type_symbol === void 0 ? void 0 : (_type_symbol_declarations = _type_symbol.declarations) === null || _type_symbol_declarations === void 0 ? void 0 : _type_symbol_declarations.length) {
        const firstDeclaration = type.symbol.declarations[0];
        const fileName = firstDeclaration.parent.getSourceFile().fileName;
        // If types are coming from "node_modules" we want don't want to expand them, otherwise "Event" becomes an object
        // with properties.
        // "React" types are handled separately to add "React." prefix otherwise it's impossible to distinguish
        // "React.MouseEvent" and "MouseEvent" types.
        if (/\/node_modules\/@types\/react\//.test(fileName)) {
            return 'React.' + type.symbol.escapedName;
        }
        if (/\/node_modules\//.test(fileName)) {
            const escapedName = type.symbol.escapedName;
            if (escapedName === '__type') {
                throw new Error([
                    `We received a type "${typeChecker.typeToString(type)}" that is too complex to resolve.`,
                    'Please simply it, for example remove usage of "Pick".'
                ].join(' '));
            }
            return escapedName;
        }
        return parseArgumentType(typeChecker, type.symbol.declarations[0]);
    }
    if (typeHasSubtypes(type)) {
        return type.types.map((t)=>typeToString(typeChecker, t));
    }
    return typeChecker.typeToString(type);
}
/**
 * Parses a value in a callback.
 *
 * @example
 * {
 *   onToggle: (event: Event, data: Data) => void
 *                     ^            ^
 *              parses these nodes
 * }
 */ function parseArgumentType(typeChecker, typeNode) {
    if (!typeNode) {
        throw new Error(`We received ${typeof typeNode} instead of a node from TS AST, please report this if it happens`);
    }
    // Handles a case when a node is an object
    // { onChange: (data: { value: string }) => void }
    //                    ^
    if (_typescript.isTypeLiteralNode(typeNode)) {
        return typeNode.members.reduce((acc, member)=>{
            if (!_typescript.isPropertySignature(member)) {
                throw new Error('We met an unhandled case, please report it');
            }
            return {
                ...acc,
                [parseArgumentName(member.name)]: parseArgumentType(typeChecker, member.type)
            };
        }, {});
    }
    // Handles a case when a node is a reference to another type
    // { onChange: (data: MouseEvent) => void }
    //                    ^
    // { onChange: (data: React.MouseEvent) => void }
    //                    ^
    if (_typescript.isTypeReferenceNode(typeNode)) {
        return typeToString(typeChecker, typeChecker.getTypeAtLocation(typeNode));
    }
    // Handles a case when a node is an array
    // { onChange: (data: string[] }
    //                    ^
    if (_typescript.isArrayTypeNode(typeNode)) {
        return 'Array';
    }
    // Handles a case when a node is a union of types
    // { onChange: (data: MouseEvent | KeyboardEvent) => void }
    //                    ^
    if (_typescript.isUnionTypeNode(typeNode)) {
        return typeNode.types.map((typeFromUnion)=>parseArgumentType(typeChecker, typeFromUnion));
    }
    // Handles a case when a node is a literal
    // { onChange: (data: false) => void }
    //                    ^
    if (_typescript.isLiteralTypeNode(typeNode)) {
        return literalNodeToPrimitive(typeNode.literal);
    }
    // Handles a case when a node is a class declaration
    // class Item {}
    // ...
    // { onChange: (data: Item) => void }
    //
    if (_typescript.isClassDeclaration(typeNode)) {
        var _typeNode_name;
        return (_typeNode_name = typeNode.name) === null || _typeNode_name === void 0 ? void 0 : _typeNode_name.escapedText;
    }
    // Handles a case when a node is an interface declaration
    // interface Item {}
    // ...
    // { onChange: (data: Item) => void }
    //
    if (_typescript.isInterfaceDeclaration(typeNode)) {
        return typeNode.members.reduce((acc, member)=>{
            const propertyName = parseArgumentName(member.name);
            const propertyType = member.type;
            return {
                ...acc,
                [propertyName]: parseArgumentType(typeChecker, propertyType)
            };
        }, {});
    }
    // Handles a case when a node is a keyword
    // { onChange: (data: boolean) => void }
    //                    ^
    // { onChange: (data: string) => void }
    //                    ^
    // eslint-disable-next-line no-bitwise
    if (typeNode.kind & _typescript.SyntaxKind.IsKeyword) {
        return keywordNodeToPrimitive(typeNode);
    }
    throw new Error(`Failed to parse an unknown argument type (${typeNode}), please report if it happens`);
}
/**
 * Parses callbacks arguments and values.
 */ function parseFunctionArguments(typeChecker, typeNode) {
    if (!_typescript.isFunctionTypeNode(typeNode)) {
        throw new Error(`We received an AST node with wrong kind (${typeNode.kind}), please report this as a bug`);
    }
    return typeNode.parameters.reduce((acc, parameter)=>{
        acc.push([
            parseArgumentName(parameter.name),
            parseArgumentType(typeChecker, parameter.type)
        ]);
        return acc;
    }, []);
}
/**
 * Find a property signature for a type, class, or interface.
 */ const findPropertySignature = (typeChecker, sourceFile, typeName, propertyName, seen)=>{
    // avoid infinte recursion looking up types
    if (seen.some((x)=>x.fileName === sourceFile.fileName && x.typeName === typeName)) {
        return undefined;
    }
    seen.push({
        typeName,
        fileName: sourceFile.fileName
    });
    for(let i = 0; i < sourceFile.statements.length; i++){
        var _statement_name, _statement_name1;
        const statement = sourceFile.statements[i];
        if (_typescript.isInterfaceDeclaration(statement) && (statement === null || statement === void 0 ? void 0 : (_statement_name = statement.name) === null || _statement_name === void 0 ? void 0 : _statement_name.escapedText) === typeName) {
            return statement.members.find((member)=>{
                if (_typescript.isPropertySignature(member) && _typescript.isIdentifier(member.name)) {
                    return member.name.escapedText === propertyName;
                }
                return false;
            });
        }
        if (_typescript.isClassDeclaration(statement) && (statement === null || statement === void 0 ? void 0 : (_statement_name1 = statement.name) === null || _statement_name1 === void 0 ? void 0 : _statement_name1.escapedText) === typeName) {
            // Class members are of a different type than interfaces, so the find is repeated
            return statement.members.find((member)=>{
                if (_typescript.isPropertySignature(member) && _typescript.isIdentifier(member.name)) {
                    return member.name.escapedText === propertyName;
                }
                return false;
            });
        }
        if (_typescript.isTypeAliasDeclaration(statement)) {
            if (statement.name.escapedText === typeName) {
                // The can be Union, Intersection, or regular types
                // This uses the type checker to inspect across the composite type.
                const statementType = typeChecker.getTypeFromTypeNode(statement.type);
                const property = typeChecker.getPropertyOfType(statementType, propertyName);
                if ((property === null || property === void 0 ? void 0 : property.valueDeclaration) && _typescript.isPropertySignature(property.valueDeclaration)) {
                    return property.valueDeclaration;
                }
            } else {
                // If the type name does not match, it may be a type alias
                // so follow the statement.type to resolve the underlying type.
                const propertySignature = findPropertySignature(typeChecker, statement.type.getSourceFile(), statement.name.escapedText, propertyName, seen);
                if (propertySignature) {
                    return propertySignature;
                }
            }
        }
    }
    return undefined;
};
function getCallbackArguments(program, filename, typeName, propertyName) {
    const typeChecker = program.getTypeChecker();
    const sourceFile = program.getSourceFiles().find((file)=>file.fileName.includes(filename));
    if (!sourceFile) {
        throw new Error(`A file (${filename}) was not found in TS program, this looks like an invocation problem, check your params`);
    }
    const propertySignature = findPropertySignature(program.getTypeChecker(), sourceFile, typeName, propertyName, []);
    if (!propertySignature) {
        throw new Error(`A file (${filename}) does not contain definition for type "${typeName}.${propertyName}".`);
    }
    if (!propertySignature.type) {
        throw new Error([
            `A definition for "${typeName}.${propertyName}" does not have a type, this is not expected.`,
            'Please report it if it happens'
        ].join(' '));
    }
    // Handles a case when a type is defined by reference
    //
    // export type Callback = () => {}
    // export type ComponentProps = { onClick: Callback }
    if (_typescript.isTypeReferenceNode(propertySignature.type)) {
        const typeAtLocation = typeChecker.getTypeAtLocation(propertySignature.type);
        const typeDeclarations = typeAtLocation.symbol.declarations;
        if ((typeDeclarations === null || typeDeclarations === void 0 ? void 0 : typeDeclarations.length) !== 1) {
            throw new Error([
                `A definition for "${typeName}.${propertyName}" has multiple declarations, it's not expected.`,
                'Please report it if it happens'
            ].join(' '));
        }
        return parseFunctionArguments(typeChecker, typeDeclarations[0]);
    }
    return parseFunctionArguments(typeChecker, propertySignature.type);
}
