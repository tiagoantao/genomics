import Rx from 'rxjs/Rx'

import {
  create_sex_population,
  create_unlinked_species
} from './sim.js'

import {Plot} from './plot.js'
import {Selector} from './selector.js'
import {Slider} from './slider.js'
import {Table} from './table.js'

import {
  ops_culling_KillOlderGenerations,
  ops_p_MigrationIslandFixed,
  ops_rep_StructuredSexualReproduction,
  ops_stats_demo_SexStatistics,
  ops_stats_hz_ExpHe,
  ops_stats_hz_ExpHeDeme,
  ops_stats_NumAl,
  ops_wrap_list,
  p_assign_fixed_size_population
} from '@tiagoantao/metis-sim'


const prepare_sim_state = (
  tag, num_demes, deme_size, num_migs,
  num_markers, marker_type) => {
    const species = create_unlinked_species(num_markers, marker_type)
    const operators = ops_wrap_list([
      new ops_rep_StructuredSexualReproduction(species, deme_size, num_demes),
      new ops_culling_KillOlderGenerations(),
      new ops_p_MigrationIslandFixed(num_migs),
      new ops_stats_demo_SexStatistics(),
      new ops_stats_hz_ExpHe(),
      new ops_stats_hz_ExpHeDeme()
    ])
    const individuals = create_sex_population(species, deme_size*num_demes)
    p_assign_fixed_size_population(individuals, num_demes)
    const state = {
      global_parameters: {tag, stop: false},
      individuals, operators, cycle: 1}
    return state
  }


export const IslandApp = (sources) => {

  const tag = 'island'

  const my_metis$ = sources.metis.filter(
    state => state.global_parameters.tag === tag)

  const exphe$ = my_metis$.map(state => {
    var cnt = 1
    return state.global_parameters.ExpHe.unlinked.map(exphe => {
      return {
        x: state.cycle - 1, y: exphe, marker: 'M' + cnt++}})
  })

  const dexphe$ = my_metis$.map(state => {
    var cnt = 1
    return state.global_parameters.DemeExpHe[0].unlinked.map(exphe => {
      return {
        x: state.cycle - 1, y: exphe, marker: 'M' + cnt++}})
  })
    
  const marker_type_c = Selector(
    {DOM: sources.DOM},
    {className: '.' + tag + '-marker_type', label: 'Marker type'})
  let marker_type
  marker_type_c.value.subscribe(v => marker_type = v)
  
  const deme_size_c = Slider(
    {DOM: sources.DOM},
    {className: '.' + tag + '-deme_size', label: 'Deme size',
     step: 10, min: 10, value: 50, max: 100})
  let deme_size
  deme_size_c.value.subscribe(v => deme_size = v)


  const num_demes_c = Slider(
    {DOM: sources.DOM},
    {className: '.' + tag + '-num_demes', label: 'Number of demes',
     step: 1, min: 2, value: 2, max: 10})
  let num_demes
  num_demes_c.value.subscribe(v => num_demes = v)

  const num_migs_c = Slider(
    {DOM: sources.DOM},
    {className: '.' + tag + '-num_migs', label: 'Number of migrants',
     step: 1, min: 0, value: 1, max: 9})
  let num_migs
  num_migs_c.value.subscribe(v => num_migs = v)
  
  
  const num_cycles_c = Slider(
    {DOM: sources.DOM},
    {className: '.' + tag + '-num_cycles', label: 'Cycles',
     step: 10, min: 10, value: 20, max: 500})
  let num_cycles
  num_cycles_c.value.subscribe(v => num_cycles = v)

  const num_markers_c = Slider(
    {DOM: sources.DOM},
    {className: '.' + tag + '-num_markers', label: 'Number of markers',
     step: 1, min: 1, value: 4, max: 20})
  let num_markers
  num_markers_c.value.subscribe(v => num_markers = v)

  
  const ht_table = Table(
    {DOM: sources.DOM,
     data: exphe$.startWith([])},
    {fields: ['y', 'marker'],
     headers: ['Expected Hz', 'Marker']}
  )

  const hs_table = Table(
    {DOM: sources.DOM,
     data: dexphe$.startWith([])},
    {fields: ['y', 'marker'],
     headers: ['Expected Hz', 'Marker']}
  )

  

  const exphe_plot = Plot(
    {id: tag + '-exphe', y_label: 'Expected Hz - Meta population'},
    {DOM: sources.DOM, vals: exphe$})

  const dexphe_plot = Plot(
    {id: tag + '-dexphe', y_label: 'Expected Hz - A Deme'},
    {DOM: sources.DOM, vals: dexphe$})

  const simulate$ = sources.DOM.select('#' + tag)
                           .events('click')
                           .map(ev => parseInt(ev.target.value))
  
  const metis$ = simulate$.map(_ => {
    const init = {
      num_cycles,
      state: prepare_sim_state(tag, num_demes, deme_size, num_migs,
                               num_markers, marker_type)
    }
    return init
  })

  const vdom$ = Rx.Observable.combineLatest(
    marker_type_c.DOM,
    deme_size_c.DOM, num_demes_c.DOM, num_migs_c.DOM,
    num_cycles_c.DOM, num_markers_c.DOM,
    hs_table.DOM, ht_table.DOM,
    exphe_plot.DOM, dexphe_plot.DOM).map(
      ([marker_type,
        num_demes, deme_size, num_migs,
        num_cycles, num_markers,
        hs_html, ht_html,
        exphe, dexphe]) =>
          <div>
            <div>
              {marker_type}
              {num_demes}
              {num_migs}
              {deme_size}
              {num_cycles}
              {num_markers}
              <br/>
              <div style="text-align: center">
                <button id={tag} value="1">Simulate</button>
              </div>
            </div>
              <table align="center">
                <tr>
                  <td>First deme</td>
                  <td>Total population</td>
                </tr>
                <tr>
                  <td>{hs_html}</td>
                  <td>{ht_html}</td>
                </tr>
              </table>
              {exphe}
              {dexphe}
            </div>
    )

  const sinks = {
    DOM: vdom$,
    metis: metis$
  }
  
  return sinks
}
