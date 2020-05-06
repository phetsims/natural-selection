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
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import FoodSupply from '../model/FoodSupply.js';
import Wolves from '../model/Wolves.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import LimitedFoodCheckbox from './LimitedFoodCheckbox.js';
import NaturalSelectionPanel from './NaturalSelectionPanel.js';
import ToughFoodCheckbox from './ToughFoodCheckbox.js';
import WolvesCheckbox from './WolvesCheckbox.js';

class EnvironmentalFactorsPanel extends NaturalSelectionPanel {

  /**
   * @param {Wolves} wolves
   * @param {FoodSupply} foodSupply
   * @param {Object} [options]
   */
  constructor( wolves, foodSupply, options ) {

    assert && assert( wolves instanceof Wolves, 'invalid wolves' );
    assert && assert( foodSupply instanceof FoodSupply, 'invalid foodSupply' );

    options = merge( {
      limitedFoodCheckVisible: true,

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.PANEL_OPTIONS, options );

    const titleNode = new Text( naturalSelectionStrings.environmentalFactors, {
      font: NaturalSelectionConstants.TITLE_FONT,
      maxWidth: 175, // determined empirically,
      tandem: options.tandem.createTandem( 'titleNode' )
    } );

    const wolvesCheckbox = new WolvesCheckbox( wolves.enabledProperty, {
      tandem: options.tandem.createTandem( 'wolvesCheckbox' )
    } );

    const toughFoodCheckbox = new ToughFoodCheckbox( foodSupply.isToughProperty, {
      tandem: options.tandem.createTandem( 'toughFoodCheckbox' )
    } );

    const limitedFoodCheckbox = new LimitedFoodCheckbox( foodSupply.isLimitedProperty, {
      visible: options.limitedFoodCheckVisible,
      tandem: options.tandem.createTandem( 'limitedFoodCheckbox' )
    } );

    const checkboxes = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [ wolvesCheckbox, toughFoodCheckbox, limitedFoodCheckbox ]
    } ) );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [ titleNode, checkboxes ]
    } ) );

    super( content, options );

    // Set the panel's title to singular or plural, depending on how many checkboxes are visible.
    checkboxes.boundsProperty.link( () => {
      const visibleCount = _.filter( checkboxes.children, child => child.visible ).length;
      titleNode.text = ( visibleCount === 1 ) ?
                       naturalSelectionStrings.environmentalFactor :
                       naturalSelectionStrings.environmentalFactors;
    } );
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