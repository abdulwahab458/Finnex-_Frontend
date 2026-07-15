export function hasPermissions(
  userPermissions: string[] | undefined,
  requiredPermissions: string[] | undefined,
): boolean {
  if (!requiredPermissions?.length) {
    return true
  }

  if (!userPermissions?.length) {
    return false
  }

  return requiredPermissions.every((permission) => userPermissions.includes(permission))
}

export function filterByPermissions<T extends { permissions?: string[]; children?: T[] }>(
  items: T[],
  userPermissions: string[] | undefined,
): T[] {
  return items.reduce<T[]>((acc, item) => {
    if (!hasPermissions(userPermissions, item.permissions)) {
      return acc
    }

    const children = item.children ? filterByPermissions(item.children, userPermissions) : undefined

    if (item.children?.length && !children?.length) {
      return acc
    }

    acc.push(children ? { ...item, children } : item)
    return acc
  }, [])
}
