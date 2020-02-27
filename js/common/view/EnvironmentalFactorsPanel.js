// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentalFactorsPanel is the panel that contains controls for environmental factors that affect
 * the fertility and mortality of bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelectionStrings from '../../natural-selection-strings.js';
import naturalSelection from '../../naturalSelection.js';
import EnvironmentModel from '../model/EnvironmentModel.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import LimitedFoodCheckbox from './LimitedFoodCheckbox.js';
import NaturalSelectionPanel from './NaturalSelectionPanel.js';
import ToughFoodCheckbox from './ToughFoodCheckbox.js';
import WolvesCheckbox from './WolvesCheckbox.js';

const environmentalFactorsString = naturalSelectionStrings.environmentalFactors;

class EnvironmentalFactorsPanel extends NaturalSelectionPanel {

  /**
   * @param {EnvironmentModel} environmentModel
   * @param {Object} [options]
   */
  constructor( environmentModel, options ) {

    assert && assert( environmentModel instanceof EnvironmentModel, 'invalid environmentModel' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.PANEL_OPTIONS, options );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [

        // title
        new Text( environmentalFactorsString, {
          font: NaturalSelectionConstants.TITLE_FONT,
          maxWidth: 175, // determined empirically,
          tandem: options.tandem.createTandem( 'environmentalFactorsText' )
        } ),

        // Wolves
        new WolvesCheckbox( environmentModel.wolves.enabledProperty, {
          tandem: options.tandem.createTandem( 'wolvesCheckbox' )
        } ),

        // Tough Food
        new ToughFoodCheckbox( environmentModel.foodSupply.isToughProperty, {
          tandem: options.tandem.createTandem( 'toughFoodCheckbox' )
        } ),

        // Limited Food
        new LimitedFoodCheckbox( environmentModel.foodSupply.isLimitedProperty, {
          tandem: options.tandem.createTandem( 'limitedFoodCheckbox' )
        } )
      ]
    } ) );

    super( content, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'EnvironmentalFactorsPanel does not support dispose' );
  }
}

naturalSelection.register( 'EnvironmentalFactorsPanel', EnvironmentalFactorsPanel );
export default EnvironmentalFactorsPanel;