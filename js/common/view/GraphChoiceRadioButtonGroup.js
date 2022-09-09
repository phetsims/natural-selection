// Copyright 2019-2022, University of Colorado Boulder

/**
 * GraphsRadioButtonGroup is the radio button group for selecting which of the graphs is visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { Text } from '../../../../scenery/js/imports.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import GraphChoice from './GraphChoice.js';

// constants
const TEXT_OPTIONS = {
  font: NaturalSelectionConstants.RADIO_BUTTON_FONT,
  maxWidth: 175 // determined empirically
};

class GraphChoiceRadioButtonGroup extends VerticalAquaRadioButtonGroup {

  /**
   * @param {EnumerationDeprecatedProperty.<GraphChoice>} graphChoiceProperty
   * @param {Object} [options]
   */
  constructor( graphChoiceProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( graphChoiceProperty, GraphChoice );

    options = merge( {
      radius: 8,
      xSpacing: 10,
      spacing: 12,
      touchAreaXDilation: 8,
      mouseAreaXDilation: 8,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Create the description of the buttons
    const items = [

      // Population
      {
        value: GraphChoice.POPULATION,
        createNode: tandem => new Text( NaturalSelectionStrings.populationStringProperty, merge( {
          tandem: tandem.createTandem( 'labelText' )
        }, TEXT_OPTIONS ) ),
        tandemName: 'populationRadioButton'
      },

      // Proportions
      {
        value: GraphChoice.PROPORTIONS,
        createNode: tandem => new Text( NaturalSelectionStrings.proportionsStringProperty, merge( {
          tandem: tandem.createTandem( 'labelText' )
        }, TEXT_OPTIONS ) ),
        tandemName: 'proportionsRadioButton'
      },

      // Pedigree
      {
        value: GraphChoice.PEDIGREE,
        createNode: tandem => new Text( NaturalSelectionStrings.pedigreeStringProperty, merge( {
          tandem: tandem.createTandem( 'labelText' )
        }, TEXT_OPTIONS ) ),
        tandemName: 'pedigreeRadioButton'
      },

      // None
      {
        value: GraphChoice.NONE,
        createNode: tandem => new Text( NaturalSelectionStrings.noneStringProperty, merge( {
          tandem: tandem.createTandem( 'labelText' )
        }, TEXT_OPTIONS ) ),
        tandemName: 'noneRadioButton'
      }
    ];

    super( graphChoiceProperty, items, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'GraphChoiceRadioButtonGroup', GraphChoiceRadioButtonGroup );
export default GraphChoiceRadioButtonGroup;