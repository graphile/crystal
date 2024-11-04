import type { GraphQLNamedType, GraphQLType } from "graphql";
import {
  getNamedType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
  isUnionType,
} from "graphql";

/*
Copy of https://github.com/graphql/graphql-js/blob/45e28a5b74cfa811857e7a4694b095da284d14eb/src/type/schema.ts#L406-L437

Used as permitted by the license:

MIT License

Copyright (c) GraphQL Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

export function collectReferencedTypes(
  type: GraphQLType,
  typeSet: Set<GraphQLNamedType>,
): Set<GraphQLNamedType> {
  const namedType = getNamedType(type);

  if (!typeSet.has(namedType)) {
    typeSet.add(namedType);
    if (isUnionType(namedType)) {
      for (const memberType of namedType.getTypes()) {
        collectReferencedTypes(memberType, typeSet);
      }
    } else if (isObjectType(namedType) || isInterfaceType(namedType)) {
      for (const interfaceType of namedType.getInterfaces()) {
        collectReferencedTypes(interfaceType, typeSet);
      }

      for (const field of Object.values(namedType.getFields())) {
        collectReferencedTypes(field.type, typeSet);
        for (const arg of field.args) {
          collectReferencedTypes(arg.type, typeSet);
        }
      }
    } else if (isInputObjectType(namedType)) {
      for (const field of Object.values(namedType.getFields())) {
        collectReferencedTypes(field.type, typeSet);
      }
    }
  }

  return typeSet;
}
