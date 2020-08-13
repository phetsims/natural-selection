// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentalFactorsPanel is the panel that contains controls for environmental factors that affect
 * the mortality of bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import naturalSelectionStrings from '../../naturalSelectionStrings.js';
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

    assert && AssertUtils.assertPropertyOf( wolvesEnabledProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( foodIsToughProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( foodIsLimitedProperty, 'boolean' );

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

    // Checkbox currently has a limitation with adjusting its content size after instantiation, which is the case with
    // these checkboxes that use AlignGroup. So this forces the pointer areas to be recomputed, and also dilates the
    // pointer areas to fill vertical space between the checkboxes.
    // See https://github.com/phetsims/natural-selection/issues/145 and https://github.com/phetsims/natural-selection/issues/173
    const xDilation = 4;
    const yDilation = NaturalSelectionConstants.VBOX_OPTIONS.spacing / 2;
    checkboxes.children.forEach( checkbox => {
      checkbox.touchArea = checkbox.localBounds.dilatedXY( xDilation, yDilation );
      checkbox.mouseArea = checkbox.localBounds.dilatedXY( xDilation, yDilation );
    } );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [ titleNode, checkboxes ]
    } ) );

    super( content, options );

    // Set the panel's title to singular or plural, depending on how many checkboxes are visible.
    // unlink is not necessary.
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
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'EnvironmentalFactorsPanel', EnvironmentalFactorsPanel );
export default EnvironmentalFactorsPanel;