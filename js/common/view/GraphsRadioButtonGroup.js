// Copyright 2019, University of Colorado Boulder

/**
 * GraphsRadioButtonGroup is the radio button group for selecting which of the graphs is visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import Graphs from './Graphs.js';

const populationString = naturalSelectionStrings.population;
const proportionsString = naturalSelectionStrings.proportions;
const pedigreeString = naturalSelectionStrings.pedigree;

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
        node: new Text( populationString, TEXT_OPTIONS ),
        tandemName: 'populationRadioButton'
      },

      // Proportions
      {
        value: Graphs.PROPORTIONS,
        node: new Text( proportionsString, TEXT_OPTIONS ),
        tandemName: 'proportionsRadioButton'
      },

      // Pedigree
      {
        value: Graphs.PEDIGREE,
        node: new Text( pedigreeString, TEXT_OPTIONS ),
        tandemName: 'pedigreeRadioButton'
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