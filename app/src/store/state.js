import ENV from '../../public/env.json'
import {SETTINGS} from 'src/classes/Settings'

SETTINGS.init()

export default function () {
    return {
      ENV,
      SETTINGS,
      connected: false
    }
  }