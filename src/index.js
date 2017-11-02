import {run} from '@cycle/rxjs-run'
import {makeDOMDriver} from '@cycle/dom'
import {App} from './app'
import {makeMetisDriver} from './driver'

const main = App

const drivers = {
  DOM: makeDOMDriver('#root')
}

makeMetisDriver()

run(main, drivers)
