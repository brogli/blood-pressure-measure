import { describe, expect, it } from 'vitest'
import { limitLineAnnotations } from '@/functions/chartLimits'

describe('limitLineAnnotations', () => {
  it('draws one horizontal line per limit at the limit value', () => {
    const annotations = limitLineAnnotations((key) => key, '#f00')

    expect(Object.values(annotations)).toEqual([
      expect.objectContaining({ type: 'line', yMin: 130, yMax: 130, borderColor: '#f00' }),
      expect.objectContaining({ type: 'line', yMin: 85, yMax: 85, borderColor: '#f00' }),
    ])
  })

  it('labels each line with the translated metric and the limit', () => {
    const annotations = limitLineAnnotations((key) => `[${key}]`, '#f00')

    expect(Object.values(annotations).map((a) => a.label?.content)).toEqual([
      '[measurement.systolic] 130',
      '[measurement.diastolic] 85',
    ])
  })
})
