// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentalFactorsPanel is the panel that contains controls for environmental factors that affect
 * the fertility and mortality of bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
import AssertUtils from '../AssertUtils.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import LimitedFoodCheckbox from './LimitedFoodCheckbox.js';
import NaturalSelectionPanel from './NaturalSelectionPanel.js';
import ToughFoodCheckbox from './ToughFoodCheckbox.js';
import WolvesCheckbox from './WolvesCheckbox.js';

class EnvironmentalFactorsPanel extends NaturalSelectionPanel {

  /**
   * @param {Property.<boolean>} wolvesEnabledProperty
   * @param {Property.<boolean>} foodIsToughProperty
   * @param {Property.<boolean>} foodIsLimitedProperty
   * @param {Object} [options]
   */
  constructor( wolvesEnabledProperty, foodIsToughProperty, foodIsLimitedProperty, options ) {

    assert && AssertUtils.assertPropertyTypeof( wolvesEnabledProperty, 'boolean' );
    assert && AssertUtils.assertPropertyTypeof( foodIsToughProperty, 'boolean' );
    assert && AssertUtils.assertPropertyTypeof( foodIsLimitedProperty, 'boolean' );

    options = merge( {
      toughFoodCheckboxVisible: true,

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.PANEL_OPTIONS, options );

    const titleNode = new Text( naturalSelectionStrings.environmentalFactors, {
      font: NaturalSelectionConstants.TITLE_FONT,
      maxWidth: 175, // determined empirically,
      tandem: options.tandem.createTandem( 'titleNode' )
    } );

    // To make all checkbox labels have the same effective size
    const checkboxLabelAlignGroup = new AlignGroup();

    const wolvesCheckbox = new WolvesCheckbox( wolvesEnabledProperty, checkboxLabelAlignGroup, {
      tandem: options.tandem.createTandem( 'wolvesCheckbox' )
    } );

    const toughFoodCheckbox = new ToughFoodCheckbox( foodIsToughProperty, checkboxLabelAlignGroup, {
      visible: options.toughFoodCheckboxVisible,
      tandem: options.tandem.createTandem( 'toughFoodCheckbox' )
    } );

    const limitedFoodCheckbox = new LimitedFoodCheckbox( foodIsLimitedProperty, checkboxLabelAlignGroup, {
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