import ENV from '../../public/env.json'
import {SETTINGS} from 'src/classes/Settings'

export default function () {
    return {
      ENV,
      SETTINGS,
      connected: false
    }
  }