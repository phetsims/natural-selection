// Copyright 2020, University of Colorado Boulder

/**
 * GenesVisibilityManager manages the visibility of UI components that are related to specific genes.
 * Via a set of Properties, all UI components related to a gene can be shown/hidden, allowing the
 * PhET-iO client to quickly configure the sim. See https://github.com/phetsims/natural-selection/issues/70
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import AddMutationsPanel from './AddMutationsPanel.js';
import PedigreeNode from './pedigree/PedigreeNode.js';
import PopulationNode from './population/PopulationNode.js';
import ProportionsNode from './proportions/ProportionsNode.js';

class GenesVisibilityManager {

  /**
   * @param {AddMutationsPanel} addMutationsPanel
   * @param {PopulationNode} populationNode
   * @param {ProportionsNode} proportionsNode
   * @param {PedigreeNode} pedigreeNode
   * @param {Object} [options]
   */
  constructor( addMutationsPanel, populationNode, proportionsNode, pedigreeNode, options ) {

    assert && assert( addMutationsPanel instanceof AddMutationsPanel, 'invalid addMutationsPanel' );
    assert && assert( populationNode instanceof PopulationNode, 'invalid populationNode' );
    assert && assert( proportionsNode instanceof ProportionsNode, 'invalid proportionsNode' );
    assert && assert( pedigreeNode instanceof PedigreeNode, 'invalid pedigreeNode' );

    options = merge( {

      // whether the user-interface for these features is visible
      furVisible: true,
      earsVisible: true,
      teethVisible: true,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Determines whether Fur is visible in the UI.
    const furVisibleProperty = new BooleanProperty( options.furVisible, {
      tandem: options.tandem.createTandem( 'furVisibleProperty' ),
      phetioDocumentation: 'sets the visibility of all user-interface components related to Fur for this screen'
    } );

    // Set visibility of all UI components related to Fur
    furVisibleProperty.link( visible => {
      addMutationsPanel.furRow.visibleProperty.value = visible;
      populationNode.populationPanel.whiteFurCheckbox.visibleProperty.value = visible;
      populationNode.populationPanel.brownFurCheckbox.visibleProperty.value = visible;
      proportionsNode.proportionsPanel.legendNode.furLegendNode.visibleProperty.value = visible;
      proportionsNode.proportionsGraphNode.furColumn.visibleProperty.value = visible;
      pedigreeNode.allelesPanel.furRow.visibleProperty.value = visible;
    } );

    // Determines whether Ears is visible in the UI.
    const earsVisibleProperty = new BooleanProperty( options.earsVisible, {
      tandem: options.tandem.createTandem( 'earsVisibleProperty' ),
      phetioDocumentation: 'sets the visibility of all user-interface components related to Ears for this screen'
    } );

    // Set visibility of all UI components related to Ears
    earsVisibleProperty.link( visible => {
      addMutationsPanel.earsRow.visibleProperty.value = visible;
      populationNode.populationPanel.straightEarsCheckbox.visibleProperty.value = visible;
      populationNode.populationPanel.floppyEarsCheckbox.visibleProperty.value = visible;
      proportionsNode.proportionsPanel.legendNode.earsLegendNode.visibleProperty.value = visible;
      proportionsNode.proportionsGraphNode.earsColumn.visibleProperty.value = visible;
      pedigreeNode.allelesPanel.earsRow.visibleProperty.value = visible;
    } );

    // Determines whether Teeth is visible in the UI.
    const teethVisibleProperty = new BooleanProperty( options.teethVisible, {
      tandem: options.tandem.createTandem( 'teethVisibleProperty' ),
      phetioDocumentation: 'sets the visibility of all user-interface components related to Teeth for this screen'
    } );

    // Set visibility of all UI components related to Teeth
    teethVisibleProperty.link( visible => {
      addMutationsPanel.teethRow.visibleProperty.value = visible;
      populationNode.populationPanel.shortTeethCheckbox.visibleProperty.value = visible;
      populationNode.populationPanel.longTeethCheckbox.visibleProperty.value = visible;
      proportionsNode.proportionsPanel.legendNode.teethLegendNode.visibleProperty.value = visible;
      proportionsNode.proportionsGraphNode.teethColumn.visibleProperty.value = visible;
      pedigreeNode.allelesPanel.teethRow.visibleProperty.value = visible;
    } );
  }
}

naturalSelection.register( 'GenesVisibilityManager', GenesVisibilityManager );
export default GenesVisibilityManager;