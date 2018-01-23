import Rx from 'rxjs/Rx'
import {nav} from '@cycle/dom'

import {makeMetisDriver} from './metis_driver'

import {WFApp} from './wright-fisher'
import {SimpleApp} from './simple'
import {SimpleFreqApp} from './simple-freq'
import {StochasticityApp} from './stochasticity'
import {DeclineApp} from './decline'
import {SelectionAppFactory} from './selection'
import {IslandApp} from './island'
import {SexRatioApp} from './sex-ratio'
import {SelectionDriftApp} from './selection-drift'

const uikit_template =
  nav({attrs:{className:"uk-navbar-container", "uk-navbar": 1}},
      <div className="uk-navbar-left">

        <ul className="uk-navbar-nav">
          <li className="uk-active"><a href="index.html">Metis</a></li>
          <li><a href="#">Simple</a>
            <div className="uk-navbar-dropdown">
              <ul className="uk-nav uk-navbar-dropdown-nav">
                <li><a href="#" id="menu-wf">Wright-Fisher</a></li>
                <li><a href="#" id="menu-single">Wright-Fisher with sex</a></li>
                <li><a href="#" id="menu-freq">Initial Frequency</a></li>
                <li><a href="#" id="menu-stoch">Stochasticity</a></li>
              </ul>
            </div>
          </li>
          <li><a href="#">Fluctuations</a>
            <div className="uk-navbar-dropdown">
              <ul className="uk-nav uk-navbar-dropdown-nav">
                <li><a href="#" id="menu-decline">Decline</a></li>
              </ul>
            </div>
          </li>
          <li><a href="#">Selection</a>
            <div className="uk-navbar-dropdown">
              <ul className="uk-nav uk-navbar-dropdown-nav">
                <li><a href="#" id="menu-dominant">Dominant</a></li>
                <li><a href="#" id="menu-recessive">Recessive</a></li>
                <li><a href="#" id="menu-hz">Hz advantage</a></li>
              </ul>
            </div>
          </li>
          <li><a href="#">Structure</a>
            <div className="uk-navbar-dropdown">
              <ul className="uk-nav uk-navbar-dropdown-nav">
                <li><a href="#" id="menu-island">Island</a></li>
                <li><a href="#">Stepping-stone 1D</a></li>
                <li><a href="#">Stepping-stone 2D</a></li>
              </ul>
            </div>
          </li>
          <li><a href="#">Mating</a>
            <div className="uk-navbar-dropdown">
              <ul className="uk-nav uk-navbar-dropdown-nav">
                <li><a href="#" id="menu-sex-ratio">Sex-Ratio</a></li>
                <li><a href="#" id="menu-alpha">Alpha male</a></li>
              </ul>
            </div>
          </li>
          <li><a href="#">Comparisons</a>
            <div className="uk-navbar-dropdown">
              <ul className="uk-nav uk-navbar-dropdown-nav">
                <li><a href="#" id="menu-sel-drift">Selection and Drift</a></li>
              </ul>
            </div>
          </li>

        </ul>

      </div>
  )


export const App = (sources) => {
  const single_menu$ = sources.DOM.select('#menu-single').events('click')
                              .startWith({timeStamp: -1,
                                          srcElement: {id: 'menu-single'}})

  const wf_menu$ = sources.DOM.select('#menu-wf').events('click')
                          .startWith({timeStamp: -1,
                                      srcElement: {id: 'menu-wf'}})

  
  const freq_menu$ = sources.DOM.select('#menu-freq').events('click')
                            .startWith({timeStamp: -1,
                                        srcElement: {id: 'menu-freq'}})

  const stoch_menu$ = sources.DOM.select('#menu-stoch').events('click')
                             .startWith({timeStamp: -1,
                                        srcElement: {id: 'menu-stoch'}})

  const decline_menu$ = sources.DOM.select('#menu-decline').events('click')
                               .startWith({timeStamp: -1,
                                           srcElement: {id: 'menu-decline'}})
  
  const dominant_menu$ = sources.DOM.select('#menu-dominant').events('click')
                                .startWith({timeStamp: -1,
                                            srcElement: {id: 'menu-dominant'}})

  const recessive_menu$ = sources.DOM.select('#menu-recessive').events('click')
                                 .startWith({timeStamp: -1,
                                             srcElement: {id: 'menu-recessive'}})

  const hz_menu$ = sources.DOM.select('#menu-hz').events('click')
                          .startWith({timeStamp: -1,
                                      srcElement: {id: 'menu-hz'}})

  const island_menu$ = sources.DOM.select('#menu-island').events('click')
                              .startWith({timeStamp: -1,
                                             srcElement: {id: 'menu-island'}})
  
  const sex_ratio_menu$ = sources.DOM.select('#menu-sex-ratio').events('click')
                                 .startWith({timeStamp: -1,
                                             srcElement: {id: 'menu-sex-ratio'}})

  const sel_drift_menu$ = sources.DOM.select('#menu-sel-drift').events('click')
                                 .startWith({timeStamp: -1,
                                             srcElement: {id: 'menu-sel-drift'}})
  
  
  const recent_event$ = Rx.Observable.combineLatest(
    single_menu$, wf_menu$, freq_menu$, stoch_menu$,
    decline_menu$,
    dominant_menu$, recessive_menu$, hz_menu$,
    island_menu$,
    sex_ratio_menu$,
    sel_drift_menu$)
                          .map(entries => {
                            var ts = -10
                            var id = ""
                            for (var entry of entries) {
                              if (entry.timeStamp > ts) {
                                ts = entry.timeStamp
                                id = entry.srcElement.id
                              }
                            }
                            console.log(id)
                            return id
                          })

  const single_pop = SimpleApp({DOM: sources.DOM, metis: sources.metis})
  const sp_dom$ = single_pop.DOM
  const wf_pop = WFApp({DOM: sources.DOM, metis: sources.metis})
  const wf_dom$ = wf_pop.DOM
  const freq_pop = SimpleFreqApp({DOM: sources.DOM, metis: sources.metis})
  const fq_dom$ = freq_pop.DOM
  const stoch_pop = StochasticityApp({DOM: sources.DOM, metis: sources.metis})
  const sch_dom$ = stoch_pop.DOM
  const decline_pop = DeclineApp({DOM: sources.DOM, metis: sources.metis})
  const dc_dom$ = decline_pop.DOM

  const dominant_pop = SelectionAppFactory('dominant')({
    DOM: sources.DOM, metis: sources.metis})
  const dom_dom$ = dominant_pop.DOM
  const recessive_pop = SelectionAppFactory('recessive')({
    DOM: sources.DOM, metis: sources.metis})
  const rec_dom$ = recessive_pop.DOM
  const hz_pop = SelectionAppFactory('hz')({
    DOM: sources.DOM, metis: sources.metis})
  const hz_dom$ = hz_pop.DOM

  const island_pop = IslandApp({DOM: sources.DOM, metis: sources.metis})
  const il_dom$ = island_pop.DOM
  
  const sex_ratio_pop = SexRatioApp({DOM: sources.DOM, metis: sources.metis})
  const sr_dom$ = sex_ratio_pop.DOM

  const sel_drift_pop = SelectionDriftApp({DOM: sources.DOM, metis: sources.metis})
  const sd_dom$ = sel_drift_pop.DOM

  
  const vdom$ = Rx
    .Observable.combineLatest(recent_event$,
			      sp_dom$, wf_dom$, fq_dom$, sch_dom$,
                              dc_dom$,
                              dom_dom$, rec_dom$, hz_dom$,
			      il_dom$,
                              sr_dom$,
                              sd_dom$)
    .map(arr =>
      <div>
        {uikit_template}
        <div style={arr[0] === 'menu-single' ? 'display: block' : 'display: none'}>
          {arr[1]}
        </div>
        <div style={arr[0] === 'menu-wf' ? 'display: block' : 'display: none'}>
          {arr[2]}
        </div>
        <div style={arr[0] === 'menu-freq' ? 'display: block' : 'display: none'}>
          {arr[3]}
        </div>
        <div style={arr[0] === 'menu-stoch' ? 'display: block' : 'display: none'}>
          {arr[4]}
        </div>
        <div style={arr[0] === 'menu-decline' ? 'display: block' : 'display: none'}>
          {arr[5]}
        </div>
        <div style={arr[0] === 'menu-dominant' ? 'display: block' : 'display: none'}>
          {arr[6]}
        </div>
        <div style={arr[0] === 'menu-recessive' ? 'display: block' : 'display: none'}>
          {arr[7]}
        </div>
        <div style={arr[0] === 'menu-hz' ? 'display: block' : 'display: none'}>
          {arr[8]}
        </div>
        <div style={arr[0] === 'menu-island' ? 'display: block' : 'display: none'}>
          {arr[9]}
        </div>
        <div style={arr[0] === 'menu-sex-ratio' ? 'display: block' : 'display: none'}>
          {arr[10]}
        </div>
        <div style={arr[0] === 'menu-sel-drift' ? 'display: block' : 'display: none'}>
          {arr[11]}
        </div>
      </div>
    )

  const sinks = {
    DOM: vdom$,
    metis: Rx.Observable.merge(
      wf_pop.metis, single_pop.metis, freq_pop.metis, stoch_pop.metis,
      decline_pop.metis, 
      dominant_pop.metis, recessive_pop.metis, hz_pop.metis,
      island_pop.metis,
      sex_ratio_pop.metis,
      sel_drift_pop.metis)
    
  }
  
  return sinks
}
