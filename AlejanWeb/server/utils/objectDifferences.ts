import deepDiff from "deep-diff";

// Function to normalize values (treat null, undefined, and empty strings as the same)
const normalizeValue = (value: any) => {
  if (value === null || value === undefined || value === "") return null;
  return value;
};

// Function to format date strings (adjust format as needed)
const formatDate = (dateString: any) => {
  if (isNaN(Date.parse(dateString))) return dateString; // Not a valid date string
  const date = new Date(dateString);
  return date.toISOString(); // Format as ISO string (or customize the format)
};

export const objectDifferences = (
  oldObj: Record<string, any> | any,
  newObj: Record<string, any> | any,
  excludeKeys: string[] = []
) => {
  // Normalize and format objects before comparison
  const normalizeAndFormat = (obj: any) => {
    const newObj = {};
    for (const key in obj) {
      if (excludeKeys.includes(key)) continue; // Skip excluded keys
      if (typeof obj[key] === "string" && !isNaN(Date.parse(obj[key]))) {
        // @ts-ignore
        newObj[key] = formatDate(obj[key]); // Format date strings
      } else {
        // @ts-ignore
        newObj[key] = normalizeValue(obj[key]);
      }
    }
    return newObj;
  };

  const normalizedOldObj = normalizeAndFormat(oldObj);
  const normalizedNewObj = normalizeAndFormat(newObj);

  const differences = deepDiff(normalizedOldObj, normalizedNewObj);

  const oldChanges: any = {};
  const newChanges: any = {};

  if (!differences) return { oldChanges, newChanges };

  differences.forEach((difference) => {
    const path = difference?.path?.join(".") as string;
    switch (difference.kind) {
      case "E": // Edit
        oldChanges[path] = difference.lhs;
        newChanges[path] = difference.rhs;
        break;
      case "N": // New
        newChanges[path] = difference.rhs;
        break;
      case "D": // Deleted
        oldChanges[path] = difference.lhs;
        break;
      case "A": // Array
        // For array differences, recursively call findDifferences if necessary
        if (difference.item) {
          const arrayChanges = objectDifferences(
            // @ts-ignore
            difference.item.lhs,
            // @ts-ignore
            difference.item.rhs,
            excludeKeys
          );
          oldChanges[path] = arrayChanges.oldChanges;
          newChanges[path] = arrayChanges.newChanges;
        }
        break;
    }
  });

  return { oldChanges, newChanges };
};
