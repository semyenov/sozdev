import type { SourceSpecification } from 'maplibre-gl'
import type { TLayerOptions, TLayerTemplate, TSourceTemplate } from '../types'

export function getLayerTemplate(type: TLayerTemplate): Partial<TLayerOptions> {
  switch (type) {
    case 'object':
      return {
        paint: {
          'icon-opacity': ['case', ['boolean', ['feature-state', 'hidden'], false], 0, 1],
          'text-opacity': ['case', ['boolean', ['feature-state', 'hidden'], false], 0, 0.7],
          'text-color': '#404040',
        },
        layout: {
          'symbol-placement': 'point',
          'symbol-avoid-edges': true,
          'icon-image': 'custom:{icon}',
          'icon-anchor': 'bottom',
          'icon-size': 0.5,
          'icon-allow-overlap': true,
          'icon-pitch-alignment': 'viewport',
          'icon-rotation-alignment': 'viewport',
          'icon-ignore-placement': true,
          'icon-overlap': 'always',
          'text-field': ['get', 'label'],
          'text-padding': 4,
          'text-optional': true,
          'text-font': ['Noto Sans Bold'],
          'text-transform': 'uppercase',
          'text-pitch-alignment': 'viewport',
          'text-ignore-placement': false,
          'text-size': 10,
          'text-offset': [0, 1],
          'text-anchor': 'top',
          'text-overlap': 'never',
        },
      }
    case 'cluster':
      return {
        paint: {
          'circle-blur': 0.1,
          'circle-opacity': 0.7,
          'circle-pitch-scale': 'viewport',
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1',
          ],
          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
        },
      }

    default:
      return {}
  }
}
export function getSourceTemplate(type: TSourceTemplate): Partial<SourceSpecification> {
  switch (type) {
    case 'cluster':
      return {
        promoteId: 'id',
        cluster: true,
        clusterMaxZoom: 18,
        clusterRadius: 30,
        clusterMinPoints: 2,
        clusterProperties: {
          icons: [
            ['let', 'find', ['index-of', ['get', 'icon'], ['accumulated']],
              ['case',
                ['==', ['index-of', ':', ['accumulated']], -1],
                ['case',
                  ['==', ['accumulated'], ['get', 'icon']],
                  ['concat', ['accumulated'], ['concat', ['literal', ':'], ['get', 'icon']]],
                  ['accumulated'],
                ],
                ['==', ['var', 'find'], -1],
                ['concat', ['accumulated'], ['concat', ['literal', ':'], ['get', 'icon']]],
                ['get', 'icon'],
              ],
            ],
            ['get', 'icon'],
          ],
        },
      }

    case 'object':
      return {
        promoteId: 'id',
      }

    default:
      return {}
  }
}
