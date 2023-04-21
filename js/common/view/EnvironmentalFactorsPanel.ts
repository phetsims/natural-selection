// Copyright 2019-2023, University of Colorado Boulder

/**
 * EnvironmentalFactorsPanel is the panel that contains controls for environmental factors that affect
 * the mortality of bunnies.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { AlignGroup, Text, TextOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import LimitedFoodCheckbox from './LimitedFoodCheckbox.js';
import NaturalSelectionPanel, { NaturalSelectionPanelOptions } from './NaturalSelectionPanel.js';
import ToughFoodCheckbox from './ToughFoodCheckbox.js';
import WolvesCheckbox from './WolvesCheckbox.js';

type SelfOptions = {
  toughFoodCheckboxVisible?: boolean;
};

type EnvironmentalFactorsPanelOptions = SelfOptions & NaturalSelectionPanelOptions;

export default class EnvironmentalFactorsPanel extends NaturalSelectionPanel {

  public constructor( wolvesEnabledProperty: Property<boolean>, foodIsToughProperty: Property<boolean>,
                      foodIsLimitedProperty: Property<boolean>, providedOptions: EnvironmentalFactorsPanelOptions ) {

    const options = optionize4<EnvironmentalFactorsPanelOptions, SelfOptions, StrictOmit<NaturalSelectionPanelOptions, 'tandem'>>()(
      {}, NaturalSelectionConstants.PANEL_OPTIONS, {

        // SelfOptions
        toughFoodCheckboxVisible: true
      }, providedOptions );

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
    const ySpacing = NaturalSelectionConstants.VBOX_OPTIONS.spacing!;
    assert && assert( ySpacing !== undefined );
    const yDilation = ySpacing / 2;
    checkboxes.forEach( checkbox => {
      checkbox.touchArea = checkbox.localBounds.dilatedXY( xDilation, yDilation );
      checkbox.mouseArea = checkbox.localBounds.dilatedXY( xDilation, yDilation );
    } );

    const numberOfCheckboxesVisibleProperty = DerivedProperty.deriveAny(
      checkboxes.map( checkbox => checkbox.visibleProperty ),
      () => _.filter( checkboxes, checkbox => checkbox.visible ).length, {
        tandem: options.tandem.createTandem( 'numberOfCheckboxesVisibleProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'the number of checkboxes that are visible affects whether the panel title is singular or plural'
      } );

    // title
    const titleText = new TitleText( numberOfCheckboxesVisibleProperty, {
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    const content = new VBox( combineOptions<VBoxOptions>( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [ titleText, ...checkboxes ]
    } ) );

    super( content, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

type TitleTextSelfOptions = EmptySelfOptions;
type TitleTextOptions = TitleTextSelfOptions & PickRequired<Text, 'tandem'>;

/**
 * TitleText supports dynamic locale, and changes between singular/plural based on how many checkboxes are visible.
 */
class TitleText extends Text {

  public constructor( numberOfCheckboxesVisibleProperty: TReadOnlyProperty<number>, providedOptions: TitleTextOptions ) {

    const options = optionize<TitleTextOptions, TitleTextSelfOptions, TextOptions>()( {

      // TextOptions
      font: NaturalSelectionConstants.TITLE_FONT,
      maxWidth: 175, // determined empirically,
      phetioVisiblePropertyInstrumented: true
    }, providedOptions );

    const stringProperty = new DerivedProperty( [
      numberOfCheckboxesVisibleProperty,
      NaturalSelectionStrings.environmentalFactorStringProperty,
      NaturalSelectionStrings.environmentalFactorsStringProperty
    ], ( numberOfCheckboxesVisible, environmentalFactor, environmentalFactors ) =>
      ( numberOfCheckboxesVisible === 1 ) ? environmentalFactor : environmentalFactors, {
      tandem: options.tandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME ),
      phetioValueType: StringIO
    } );

    super( stringProperty, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'EnvironmentalFactorsPanel', EnvironmentalFactorsPanel );