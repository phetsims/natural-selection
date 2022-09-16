// Copyright 2019-2022, University of Colorado Boulder

/**
 * EnvironmentalFactorsPanel is the panel that contains controls for environmental factors that affect
 * the mortality of bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { AlignGroup, Text, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
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

    const numberOfCheckboxesVisibleProperty = new DerivedProperty( _.map( checkboxes, checkbox => checkbox.visibleProperty ),
      () => _.filter( checkboxes, checkbox => checkbox.visible ).length, {
        tandem: options.tandem.createTandem( 'numberOfCheckboxesVisibleProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'the number of checkboxes that are visible affects whether the panel title is singular or plural'
      } );

    // title
    const titleText = new TitleNode( numberOfCheckboxesVisibleProperty, {
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [ titleText, ...checkboxes ]
    } ) );

    super( content, options );
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

/**
 * TitleNode supports dynamic locale, and changes between singular/plural based on how many checkboxes are visible.
 */
class TitleNode extends Text {

  constructor( numberOfCheckboxesVisibleProperty, options ) {

    options = merge( {
      font: NaturalSelectionConstants.TITLE_FONT,
      maxWidth: 175, // determined empirically,
      tandem: Tandem.REQUIRED
    }, options );

    const stringProperty = new DerivedProperty( [
      numberOfCheckboxesVisibleProperty,
      NaturalSelectionStrings.environmentalFactorStringProperty,
      NaturalSelectionStrings.environmentalFactorsStringProperty
    ], ( numberOfCheckboxesVisible, environmentalFactor, environmentalFactors ) =>
      ( numberOfCheckboxesVisible === 1 ) ? environmentalFactor : environmentalFactors, {
      tandem: options.tandem.createTandem( 'stringProperty' ),
      phetioValueType: StringIO
    } );

    super( stringProperty, options );
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