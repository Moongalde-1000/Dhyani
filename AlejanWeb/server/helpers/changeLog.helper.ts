import { $Enums, UserRole } from "@prisma/client";
import { db } from "../db";
import { objectDifferences } from "../utils/objectDifferences";

interface AddChangeLog {
  userId: string;
  role: UserRole;
  description: string;
  module: string;
  newValues: Record<string, any>;
  oldValues: Record<string, any>;
}
const convertToReadableFormat = (str: string) => {
  // Replace camelCase or snake_case with a more readable format
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Add space before capital letters
    .replace(/^./, (match) => match.toUpperCase()); // Capitalize the first letter
};
const formatObjectToCommaSeparatedString = (obj: any) => {
  if (Object.keys(obj).length > 0) {
    return Object.entries(obj)
      .filter(([value]) => value !== null)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key} = ${value.join(", ")}`
        }
        return `${key} = ${value}`
      })
      .join(", ");
  }
  return "N/A";
};

export const addChangeLog = async (data: AddChangeLog) => {
  const _excludeKeys = ["id", "createdAt", "updatedAt", "userId", "UserId", "password"];
  const { newChanges, oldChanges } = objectDifferences(
    data.oldValues,
    data.newValues,
    _excludeKeys
  );

  // Object.entries(oldChanges).forEach(async([key, oldValue]) => {
  //   const newValue = newChanges[key]; // Get the corresponding new value
  //   await db.changeLog.create({
  //     data: {
  //       description: data.description+" "+convertToReadableFormat(key),
  //       module: data.module,
  //       role: data.role,
  //       userId: data.userId,
  //       oldValues: oldValue as any,
  //       newValues: newValue,
  //     },
  //   });
  // });
  const newObjectToString = formatObjectToCommaSeparatedString(newChanges);
  const oldObjectToString = formatObjectToCommaSeparatedString(oldChanges);
  const newValue = convertToReadableFormat(newObjectToString);
  const oldValue = convertToReadableFormat(oldObjectToString);

  await db.changeLog.create({
    data: {
      description: data.description,
      module: data.module,
      role: data.role,
      userId: data.userId,
      oldValues: oldChanges,
      newValues: newChanges,
      newValue: newValue,
      oldValue: oldValue,
    },
  });
};
