/**
 * Сокращает ID для отображения в таблице
 * @param id - Полный ID (строка или число)
 * @param length - Длина сокращенного ID (по умолчанию 8)
 * @returns Сокращенный ID с многоточием
 */
export const shortenId = (id: string | number, length: number = 8): string => {
  const idStr = String(id)
  if (idStr.length <= length) {
    return idStr
  }
  return `${idStr.substring(0, length)}...`
}

