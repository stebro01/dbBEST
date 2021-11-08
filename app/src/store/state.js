import ENV from '../../public/env.json'
console.log('state.js', ENV)

export default function () {
    return {
      ENV
    }
  }