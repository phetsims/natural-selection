// Copyright 2019-2022, University of Colorado Boulder

/**
 * EnvironmentalFactorsPanel is the panel that contains controls for environmental factors that affect
 * the mortality of bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { AlignGroup, Text, VBox } from '../../../../scenery/js/imports.js';
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

    const titleNode = new Text( naturalSelectionStrings.environmentalFactorsProperty, {
      font: NaturalSelectionConstants.TITLE_FONT,
      maxWidth: 175, // determined empirically,
      tandem: options.tandem.createTandem( 'titleNode' )
    } );

    // To make all checkbox labels have the same effective size
    const checkboxLabelAlignGroup = new AlignGroup();

    // A checkbox for each environmental factor
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
    const checkboxes = [ wolvesCheckbox, toughFoodCheckbox, limitedFoodCheckbox ];

    // Checkbox currently has a limitation with adjusting its content size after instantiation, which is the case with
    // these checkboxes that use AlignGroup. So this forces the pointer areas to be recomputed, and also dilates the
    // pointer areas to fill vertical space between the checkboxes.
    // See https://github.com/phetsims/natural-selection/issues/145 and https://github.com/phetsims/natural-selection/issues/173
    const xDilation = 8;
    const yDilation = NaturalSelectionConstants.VBOX_OPTIONS.spacing / 2;
    checkboxes.forEach( checkbox => {
      checkbox.touchArea = checkbox.localBounds.dilatedXY( xDilation, yDilation );
      checkbox.mouseArea = checkbox.localBounds.dilatedXY( xDilation, yDilation );
    } );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [ titleNode, ...checkboxes ]
    } ) );

    super( content, options );

    // Set the panel's title to singular or plural, depending on how many checkboxes are visible.
    // unlink is not necessary.
    Multilink.multilink( _.map( checkboxes, checkbox => checkbox.visibleProperty ), () => {

      // If the title hasn't been changed to something entirely different via PhET-iO...
      if ( [ naturalSelectionStrings.environmentalFactor, naturalSelectionStrings.environmentalFactors ].includes( titleNode.text ) ) {
        const numberOfVisibleCheckboxes = _.filter( checkboxes, checkbox => checkbox.visible ).length;
        titleNode.text = ( numberOfVisibleCheckboxes === 1 ) ?
                         naturalSelectionStrings.environmentalFactor :
                         naturalSelectionStrings.environmentalFactors;
      }
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