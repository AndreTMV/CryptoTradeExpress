interface Classes {
  [key: string]: boolean;
}

export function classNames(classes: Classes): string {
  return Object.entries(classes)
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(" ");
}