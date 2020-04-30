// Copyright 2019-2020, University of Colorado Boulder

/**
 * GraphsRadioButtonGroup is the radio button group for selecting which of the graphs is visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import Graphs from './Graphs.js';

// constants
const TEXT_OPTIONS = {
  font: NaturalSelectionConstants.RADIO_BUTTON_FONT,
  maxWidth: 175 // determined empirically
};

class GraphsRadioButtonGroup extends VerticalAquaRadioButtonGroup {

  /**
   * @param {EnumerationProperty.<Graphs>} graphProperty
   * @param {Object} [options]
   */
  constructor( graphProperty, options ) {

    assert && assert( graphProperty instanceof EnumerationProperty, 'invalid graphProperty' );

    options = merge( {
      radius: 8,
      xSpacing: 10,
      spacing: 12,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Create the description of the buttons
    const items = [

      // Population
      {
        value: Graphs.POPULATION,
        node: new Text( naturalSelectionStrings.population, TEXT_OPTIONS ),
        tandemName: 'populationRadioButton'
      },

      // Proportions
      {
        value: Graphs.PROPORTIONS,
        node: new Text( naturalSelectionStrings.proportions, TEXT_OPTIONS ),
        tandemName: 'proportionsRadioButton'
      },

      // Pedigree
      {
        value: Graphs.PEDIGREE,
        node: new Text( naturalSelectionStrings.pedigree, TEXT_OPTIONS ),
        tandemName: 'pedigreeRadioButton'
      },

      // None
      {
        value: Graphs.NONE,
        node: new Text( naturalSelectionStrings.none, TEXT_OPTIONS ),
        tandemName: 'noneRadioButton'
      }
    ];

    super( graphProperty, items, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'GraphsRadioButtonGroup does not support dispose' );
  }
}

naturalSelection.register( 'GraphsRadioButtonGroup', GraphsRadioButtonGroup );
export default GraphsRadioButtonGroup;