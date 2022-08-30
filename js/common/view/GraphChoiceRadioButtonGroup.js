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
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import GraphChoice from './GraphChoice.js';

// constants
const TEXT_OPTIONS = {
  font: NaturalSelectionConstants.RADIO_BUTTON_FONT,
  maxWidth: 175, // determined empirically
  phetioVisiblePropertyInstrumented: false
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

    // Workaround for making the Text nodes appear to be children of the radio buttons
    const populationRadioButtonTandemName = 'populationRadioButton';
    const proportionsRadioButtonTandemName = 'proportionsRadioButton';
    const pedigreeRadioButtonTandemName = 'pedigreeRadioButton';
    const noneRadioButtonTandemName = 'noneRadioButton';

    // Create the description of the buttons
    const items = [

      // Population
      {
        value: GraphChoice.POPULATION,
        node: new Text( naturalSelectionStrings.populationStringProperty, merge( {
          tandem: options.tandem.createTandem( populationRadioButtonTandemName ).createTandem( 'textNode' )
        }, TEXT_OPTIONS ) ),
        tandemName: populationRadioButtonTandemName
      },

      // Proportions
      {
        value: GraphChoice.PROPORTIONS,
        node: new Text( naturalSelectionStrings.proportionsStringProperty, merge( {
          tandem: options.tandem.createTandem( proportionsRadioButtonTandemName ).createTandem( 'textNode' )
        }, TEXT_OPTIONS ) ),
        tandemName: proportionsRadioButtonTandemName
      },

      // Pedigree
      {
        value: GraphChoice.PEDIGREE,
        node: new Text( naturalSelectionStrings.pedigreeStringProperty, merge( {
          tandem: options.tandem.createTandem( pedigreeRadioButtonTandemName ).createTandem( 'textNode' )
        }, TEXT_OPTIONS ) ),
        tandemName: pedigreeRadioButtonTandemName
      },

      // None
      {
        value: GraphChoice.NONE,
        node: new Text( naturalSelectionStrings.noneStringProperty, merge( {
          tandem: options.tandem.createTandem( noneRadioButtonTandemName ).createTandem( 'textNode' )
        }, TEXT_OPTIONS ) ),
        tandemName: noneRadioButtonTandemName
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