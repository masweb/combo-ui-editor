export interface ColorPair {
  light: string
  dark: string
}

const STORAGE_KEY = 'combo-ui-color-pairs'

const DEFAULT_PAIRS: ColorPair[] = [
  { light: '#58cbde', dark: '#293754' },
  { light: '#d08fb3', dark: '#642e3e' },
  { light: '#a9d799', dark: '#314b43' }
]

export const useColorPairEditor = () => {
  const pairs = ref<ColorPair[]>([])

  const load = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        pairs.value = JSON.parse(stored)
      } else {
        pairs.value = [...DEFAULT_PAIRS]
        save()
      }
    } catch {
      pairs.value = [...DEFAULT_PAIRS]
      save()
    }
  }

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs.value))
  }

  const addPair = (light: string = '#0d6efd', dark: string = '#1a1a2e') => {
    pairs.value.push({ light, dark })
    save()
  }

  const removePair = (index: number) => {
    pairs.value.splice(index, 1)
    save()
  }

  const updatePair = (index: number, field: keyof ColorPair, value: string) => {
    if (pairs.value[index]) {
      pairs.value[index][field] = value
      save()
    }
  }

  const clearAll = () => {
    pairs.value = []
    save()
  }

  load()

  return {
    pairs,
    addPair,
    removePair,
    updatePair,
    clearAll
  }
}
