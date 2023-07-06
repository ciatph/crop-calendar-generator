const CROP_STAGES = [
  { stage: 'Newly Planted', code: 'plant/trans' },
  { stage: 'Vegetative/Reproductive', code: 'veg/repro' },
  { stage: 'Maturing', code: 'mat' },
  { stage: 'Preparation Stage', code: 'lprep' }
]

const SUFFIX_1 = '_1'

const SUFFIX_2 = '_2'

const STAGES = CROP_STAGES.map(item => item.stage)

const CODES = CROP_STAGES.map(item => item.code)

module.exports = {
  CROP_STAGES,
  SUFFIX_1,
  SUFFIX_2,
  STAGES,
  CODES
}
