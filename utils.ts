import fs from 'node:fs/promises'

export function shuffle(array: unknown[]) {
  let currentIndex = array.length;

  while (currentIndex != 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}


export const formatTime = (time: number) => {
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((time / (1000 * 60)) % 60)
  const seconds = Math.floor((time / 1000) % 60)

  return `${hours} ч. ${minutes} мин. ${seconds} сек.`
}

export const formatTimeWeek = (time: number) => {
  const day = Math.floor((time / (1000 * 60 * 60 * 24)) % 7)
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((time / (1000 * 60)) % 60)
  const seconds = Math.floor((time / 1000) % 60)

  return `${day} дн. ${hours} ч. ${minutes} мин. ${seconds} сек.`
}

export const formatMoney = (money: number) => {
  if (Math.abs(money) < 1000) {
    return money
  }
  const int = BigInt(Math.floor(money)).toString()

  const float = (money - Math.floor(money)).toFixed(2)

  const formattedArray = []

  for (let i = 0; i < Math.ceil(int.length / 3); i++) {
    const sliced = int.slice(Math.max(int.length - 3*(i+1), 0), int.length - i*3)
    formattedArray.push(sliced)
  }
  if (Number.isInteger(money)) {
    return formattedArray.reverse().join('.')
  } else {
    return formattedArray.reverse().join('.') + ',' + float.slice(2)
  }
}

export const readJson = async (path: string, defaultValue: unknown | undefined = undefined) => {
  try {
      const data = await fs.readFile(path, {encoding: 'utf8'})
      if (data.length === 0) {
          return defaultValue
      }

      return JSON.parse(data)
  } catch (e) {
      const error = e as NodeJS.ErrnoException
      if (error.code === 'ENOENT') {
          if (defaultValue !== undefined) {
            await fs.writeFile(path, JSON.stringify(defaultValue))
          }
          
          return defaultValue
      } else {
          throw error
      }
  }
}
